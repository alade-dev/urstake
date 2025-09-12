/// UrStake USDC Staking - Liquid Staking Protocol for USDC
/// 
/// This module provides USDC staking functionality with:
/// - Liquid staking with stUSDC tokens
/// - Reward distribution 
/// - Unstaking mechanism
/// - Fee collection
module urstake_addr::usdc_staking {
    use std::error;
    use std::signer;
    use std::vector;
    use std::string;

    use aptos_framework::coin::{Self, Coin, MintCapability, BurnCapability};
    use aptos_framework::event;
    use aptos_framework::timestamp;
    use urstake_addr::usdc::USDC;

    // Error codes
    const E_NOT_INITIALIZED: u64 = 1;
    const E_ALREADY_INITIALIZED: u64 = 2;
    const E_NOT_ADMIN: u64 = 3;
    const E_INSUFFICIENT_BALANCE: u64 = 4;
    const E_INVALID_AMOUNT: u64 = 5;
    const E_INVALID_FEE_RATE: u64 = 8;
    const E_PAUSED: u64 = 9;
    const E_MINIMUM_STAKE_NOT_MET: u64 = 12;

    // Constants
    const BASIS_POINTS: u64 = 10000;
    const MAX_FEE_RATE: u64 = 1000; // 10% max fee
    const MIN_STAKE_AMOUNT: u64 = 1000000; // 1 USDC minimum (6 decimals)
    const UNSTAKING_DELAY_SECONDS: u64 = 7 * 24 * 60 * 60; // 7 days

    // Liquid staking token (stUSDC)
    struct StakedUSDC {}

    // Capabilities for managing stUSDC tokens
    struct StakedUSDCCapabilities has key {
        /// Mint capability for stUSDC tokens
        mint_cap: MintCapability<StakedUSDC>,
        /// Burn capability for stUSDC tokens  
        burn_cap: BurnCapability<StakedUSDC>,
    }

    // USDC staking protocol configuration and state
    struct USDCProtocolConfig has key {
        /// Protocol administrator
        admin: address,
        /// Emergency pause flag
        paused: bool,
        /// Fee rate in basis points (e.g., 500 = 5%)
        fee_rate: u64,
        /// Fee collector address
        fee_collector: address,
        /// Total USDC staked in the protocol
        total_staked: u64,
        /// Total stUSDC tokens minted
        total_stusdc_supply: u64,
        /// Minimum stake amount
        min_stake: u64,
        /// USDC coin pool for managing stakes
        usdc_pool: Coin<USDC>,
        /// Annual percentage yield (in basis points)
        apy: u64,
        /// Last reward calculation timestamp
        last_reward_time: u64,
    }

    // User USDC staking information
    struct UserUSDCStake has key {
        /// User's stUSDC balance (tracked separately from coin balance)
        stusdc_balance: u64,
        /// Pending unstaking requests
        unstaking_requests: vector<USDCUnstakingRequest>,
        /// Last reward claim timestamp
        last_claim_time: u64,
    }

    // USDC Unstaking request
    struct USDCUnstakingRequest has store, drop {
        /// Amount being unstaked
        amount: u64,
        /// Timestamp when unstaking was requested
        request_time: u64,
        /// Whether instant unstaking (with fee) was used
        instant: bool,
    }

    // Events
    #[event]
    struct USDCStakeEvent has drop, store {
        user: address,
        amount: u64,
        stusdc_minted: u64,
        timestamp: u64,
    }

    #[event]
    struct USDCUnstakeRequestEvent has drop, store {
        user: address,
        amount: u64,
        instant: bool,
        estimated_completion: u64,
        timestamp: u64,
    }

    #[event]
    struct USDCUnstakeCompleteEvent has drop, store {
        user: address,
        amount: u64,
        stusdc_burned: u64,
        timestamp: u64,
    }

    #[event]
    struct USDCRewardClaimEvent has drop, store {
        user: address,
        rewards: u64,
        timestamp: u64,
    }

    /// Initialize the USDC staking protocol
    public entry fun initialize(
        admin: &signer,
        fee_rate: u64,
        fee_collector: address,
        initial_apy: u64, // APY in basis points (e.g., 500 = 5%)
    ) {
        let admin_addr = signer::address_of(admin);
        
        // Ensure not already initialized
        assert!(!exists<USDCProtocolConfig>(admin_addr), error::already_exists(E_ALREADY_INITIALIZED));
        assert!(fee_rate <= MAX_FEE_RATE, error::invalid_argument(E_INVALID_FEE_RATE));

        // Initialize stUSDC token
        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<StakedUSDC>(
            admin,
            string::utf8(b"Staked USD Coin"),
            string::utf8(b"stUSDC"),
            6, // decimals (same as USDC)
            true, // monitor_supply
        );

        // Store capabilities
        move_to(admin, StakedUSDCCapabilities {
            mint_cap,
            burn_cap,
        });

        // Destroy freeze capability (we don't need it)
        coin::destroy_freeze_cap(freeze_cap);

        // Initialize protocol config with empty USDC pool
        move_to(admin, USDCProtocolConfig {
            admin: admin_addr,
            paused: false,
            fee_rate,
            fee_collector,
            total_staked: 0,
            total_stusdc_supply: 0,
            min_stake: MIN_STAKE_AMOUNT,
            usdc_pool: coin::zero<USDC>(),
            apy: initial_apy,
            last_reward_time: timestamp::now_seconds(),
        });
    }

     /// Get USDC balance
    public fun balance( user: &signer,): u64 {
        let user_addr = signer::address_of(user);
        coin::balance<USDC>(user_addr)
    }

    /// Stake USDC tokens and receive stUSDC
    public entry fun stake_usdc(
        user: &signer,
        amount: u64,
    ) acquires USDCProtocolConfig, StakedUSDCCapabilities, UserUSDCStake {
        let user_addr = signer::address_of(user);
        let config = borrow_global_mut<USDCProtocolConfig>(@urstake_addr);
        
        // Basic validations
        assert!(!config.paused, error::invalid_state(E_PAUSED));
        assert!(amount >= config.min_stake, error::invalid_argument(E_MINIMUM_STAKE_NOT_MET));
        assert!(coin::balance<USDC>(user_addr) >= amount, error::invalid_argument(E_INSUFFICIENT_BALANCE));

        // Calculate stUSDC to mint based on current exchange rate
        let stusdc_amount = if (config.total_staked == 0) {
            amount // 1:1 ratio for first stake
        } else {
            (amount * config.total_stusdc_supply) / config.total_staked
        };

        // Transfer USDC from user to protocol pool
        let usdc_coins = coin::withdraw<USDC>(user, amount);
        coin::merge(&mut config.usdc_pool, usdc_coins);

        // Mint stUSDC tokens
        let stusdc_cap = &borrow_global<StakedUSDCCapabilities>(@urstake_addr).mint_cap;
        let stusdc_coins = coin::mint(stusdc_amount, stusdc_cap);
        
        // Initialize or update user stake
        if (!exists<UserUSDCStake>(user_addr)) {
            move_to(user, UserUSDCStake {
                stusdc_balance: 0,
                unstaking_requests: vector::empty(),
                last_claim_time: timestamp::now_seconds(),
            });
        };

        let user_stake = borrow_global_mut<UserUSDCStake>(user_addr);
        user_stake.stusdc_balance = user_stake.stusdc_balance + stusdc_amount;

        // Update global state
        config.total_staked = config.total_staked + amount;
        config.total_stusdc_supply = config.total_stusdc_supply + stusdc_amount;

        // Deposit stUSDC to user
        coin::deposit(user_addr, stusdc_coins);

        // Emit event
        event::emit(USDCStakeEvent {
            user: user_addr,
            amount,
            stusdc_minted: stusdc_amount,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// Request unstaking of stUSDC tokens
    public entry fun request_unstake_usdc(
        user: &signer,
        stusdc_amount: u64,
        instant: bool,
    ) acquires USDCProtocolConfig, UserUSDCStake {
        let user_addr = signer::address_of(user);
        let config = borrow_global<USDCProtocolConfig>(@urstake_addr);
        
        assert!(!config.paused, error::invalid_state(E_PAUSED));
        assert!(exists<UserUSDCStake>(user_addr), error::not_found(E_INSUFFICIENT_BALANCE));
        
        let user_stake = borrow_global_mut<UserUSDCStake>(user_addr);
        assert!(user_stake.stusdc_balance >= stusdc_amount, error::invalid_argument(E_INSUFFICIENT_BALANCE));
        assert!(coin::balance<StakedUSDC>(user_addr) >= stusdc_amount, error::invalid_argument(E_INSUFFICIENT_BALANCE));

        let completion_time = if (instant) {
            timestamp::now_seconds() // Instant unstaking
        } else {
            timestamp::now_seconds() + UNSTAKING_DELAY_SECONDS // Delayed unstaking
        };

        // Add unstaking request
        vector::push_back(&mut user_stake.unstaking_requests, USDCUnstakingRequest {
            amount: stusdc_amount,
            request_time: timestamp::now_seconds(),
            instant,
        });

        // Emit event
        event::emit(USDCUnstakeRequestEvent {
            user: user_addr,
            amount: stusdc_amount,
            instant,
            estimated_completion: completion_time,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// Complete USDC unstaking and return USDC tokens
    public entry fun complete_unstaking_usdc(
        user: &signer,
        request_index: u64,
    ) acquires USDCProtocolConfig, StakedUSDCCapabilities, UserUSDCStake {
        let user_addr = signer::address_of(user);
        let config = borrow_global_mut<USDCProtocolConfig>(@urstake_addr);
        
        assert!(!config.paused, error::invalid_state(E_PAUSED));
        assert!(exists<UserUSDCStake>(user_addr), error::not_found(E_INSUFFICIENT_BALANCE));
        
        let user_stake = borrow_global_mut<UserUSDCStake>(user_addr);
        assert!(request_index < vector::length(&user_stake.unstaking_requests), error::invalid_argument(E_INVALID_AMOUNT));

        let request = vector::borrow(&user_stake.unstaking_requests, request_index);
        let current_time = timestamp::now_seconds();

        // Check if unstaking is ready (skip check for instant unstaking)
        if (!request.instant) {
            assert!(
                current_time >= request.request_time + UNSTAKING_DELAY_SECONDS,
                error::invalid_state(7) // E_UNSTAKING_NOT_READY
            );
        };

        let stusdc_amount = request.amount;
        let is_instant = request.instant;

        // Calculate USDC amount to return (considering current exchange rate)
        let usdc_amount = (stusdc_amount * config.total_staked) / config.total_stusdc_supply;

        // Apply instant unstaking fee if applicable
        let final_usdc_amount = if (is_instant) {
            let fee = (usdc_amount * config.fee_rate) / BASIS_POINTS;
            usdc_amount - fee
        } else {
            usdc_amount
        };

        // Burn stUSDC tokens
        let stusdc_coins = coin::withdraw<StakedUSDC>(user, stusdc_amount);
        let burn_cap = &borrow_global<StakedUSDCCapabilities>(@urstake_addr).burn_cap;
        coin::burn(stusdc_coins, burn_cap);

        // Update user state
        user_stake.stusdc_balance = user_stake.stusdc_balance - stusdc_amount;
        vector::remove(&mut user_stake.unstaking_requests, request_index);

        // Update global state  
        config.total_staked = config.total_staked - usdc_amount;
        config.total_stusdc_supply = config.total_stusdc_supply - stusdc_amount;

        // Transfer USDC from protocol pool to user
        let usdc_coins = coin::extract(&mut config.usdc_pool, final_usdc_amount);
        coin::deposit(user_addr, usdc_coins);

        // Emit event
        event::emit(USDCUnstakeCompleteEvent {
            user: user_addr,
            amount: final_usdc_amount,
            stusdc_burned: stusdc_amount,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// Claim accumulated rewards
    public entry fun claim_rewards(
        user: &signer,
    ) acquires USDCProtocolConfig, StakedUSDCCapabilities, UserUSDCStake {
        let user_addr = signer::address_of(user);
        let config = borrow_global_mut<USDCProtocolConfig>(@urstake_addr);
        
        assert!(!config.paused, error::invalid_state(E_PAUSED));
        assert!(exists<UserUSDCStake>(user_addr), error::not_found(E_INSUFFICIENT_BALANCE));
        
        let user_stake = borrow_global_mut<UserUSDCStake>(user_addr);
        let current_time = timestamp::now_seconds();
        
        // Calculate rewards based on staking duration and APY
        let time_diff = current_time - user_stake.last_claim_time;
        let annual_seconds = 365 * 24 * 60 * 60; // seconds in a year
        let rewards = (user_stake.stusdc_balance * config.apy * time_diff) / (BASIS_POINTS * annual_seconds);
        
        if (rewards > 0) {
            // Mint reward tokens
            let stusdc_cap = &borrow_global<StakedUSDCCapabilities>(@urstake_addr).mint_cap;
            let reward_coins = coin::mint(rewards, stusdc_cap);
            
            // Update user balance
            user_stake.stusdc_balance = user_stake.stusdc_balance + rewards;
            user_stake.last_claim_time = current_time;
            
            // Update global supply
            config.total_stusdc_supply = config.total_stusdc_supply + rewards;
            
            // Deposit rewards to user
            coin::deposit(user_addr, reward_coins);
            
            // Emit event
            event::emit(USDCRewardClaimEvent {
                user: user_addr,
                rewards,
                timestamp: current_time,
            });
        };
    }

    /// Set emergency pause
    public entry fun set_pause(
        admin: &signer,
        paused: bool,
    ) acquires USDCProtocolConfig {
        let admin_addr = signer::address_of(admin);
        let config = borrow_global_mut<USDCProtocolConfig>(@urstake_addr);
        
        assert!(admin_addr == config.admin, error::permission_denied(E_NOT_ADMIN));
        config.paused = paused;
    }

    /// Update APY
    public entry fun update_apy(
        admin: &signer,
        new_apy: u64,
    ) acquires USDCProtocolConfig {
        let admin_addr = signer::address_of(admin);
        let config = borrow_global_mut<USDCProtocolConfig>(@urstake_addr);
        
        assert!(admin_addr == config.admin, error::permission_denied(E_NOT_ADMIN));
        config.apy = new_apy;
    }

    // ========== VIEW FUNCTIONS ==========

    #[view]
    public fun get_usdc_exchange_rate(): (u64, u64) acquires USDCProtocolConfig {
        let config = borrow_global<USDCProtocolConfig>(@urstake_addr);
        if (config.total_stusdc_supply == 0) {
            (1, 1) // 1:1 ratio initially
        } else {
            (config.total_staked, config.total_stusdc_supply)
        }
    }

    #[view] 
    public fun get_user_usdc_stake_info(user_addr: address): (u64, u64) acquires UserUSDCStake {
        if (!exists<UserUSDCStake>(user_addr)) {
            return (0, 0)
        };
        
        let user_stake = borrow_global<UserUSDCStake>(user_addr);
        (
            user_stake.stusdc_balance,
            vector::length(&user_stake.unstaking_requests)
        )
    }

    #[view]
    public fun get_usdc_protocol_stats(): (u64, u64, u64, u64) acquires USDCProtocolConfig {
        let config = borrow_global<USDCProtocolConfig>(@urstake_addr);
        (
            config.total_staked,
            config.total_stusdc_supply,
            coin::value(&config.usdc_pool),
            config.apy
        )
    }

    #[view]
    public fun calculate_pending_rewards(user_addr: address): u64 acquires USDCProtocolConfig, UserUSDCStake {
        if (!exists<UserUSDCStake>(user_addr)) {
            return 0
        };
        
        let config = borrow_global<USDCProtocolConfig>(@urstake_addr);
        let user_stake = borrow_global<UserUSDCStake>(user_addr);
        let current_time = timestamp::now_seconds();
        
        let time_diff = current_time - user_stake.last_claim_time;
        let annual_seconds = 365 * 24 * 60 * 60;
        
        (user_stake.stusdc_balance * config.apy * time_diff) / (BASIS_POINTS * annual_seconds)
    }

    // Test-only functions
    #[test_only]
    public fun init_for_test(admin: &signer, fee_rate: u64, apy: u64) {
        initialize(admin, fee_rate, signer::address_of(admin), apy);
    }
}
