/// UrStake - Liquid Staking Protocol for Aptos
/// 
/// This module provides a simplified staking platform with:
/// - Liquid staking with stAPT tokens
/// - Basic reward distribution 
/// - Unstaking mechanism
/// - Fee collection
module urstake_addr::urstake {
    use std::error;
    use std::signer;
    use std::vector;
    use std::string;

    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::coin::{Self, Coin, MintCapability, BurnCapability};
    use aptos_framework::event;
    use aptos_framework::timestamp;

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
    const MIN_STAKE_AMOUNT: u64 = 1000000; // 0.01 APT minimum
    const UNSTAKING_DELAY_SECONDS: u64 = 7 * 24 * 60 * 60; // 7 days

    // Liquid staking token (stAPT)
    struct StakedAptos {}

    // Capabilities for managing stAPT tokens
    struct StakedAptosCapabilities has key {
        /// Mint capability for stAPT tokens
        mint_cap: MintCapability<StakedAptos>,
        /// Burn capability for stAPT tokens  
        burn_cap: BurnCapability<StakedAptos>,
    }

    // Main protocol configuration and state
    struct ProtocolConfig has key {
        /// Protocol administrator
        admin: address,
        /// Emergency pause flag
        paused: bool,
        /// Fee rate in basis points (e.g., 500 = 5%)
        fee_rate: u64,
        /// Fee collector address
        fee_collector: address,
        /// Total APT staked in the protocol
        total_staked: u64,
        /// Total stAPT tokens minted
        total_stapt_supply: u64,
        /// Minimum stake amount
        min_stake: u64,
        /// APT coin pool for managing stakes
        apt_pool: Coin<AptosCoin>,
    }

    // User staking information
    struct UserStake has key {
        /// User's stAPT balance (tracked separately from coin balance)
        stapt_balance: u64,
        /// Pending unstaking requests
        unstaking_requests: vector<UnstakingRequest>,
    }

    // Unstaking request
    struct UnstakingRequest has store, drop {
        /// Amount being unstaked
        amount: u64,
        /// Timestamp when unstaking was requested
        request_time: u64,
        /// Whether instant unstaking (with fee) was used
        instant: bool,
    }

    // Events
    #[event]
    struct StakeEvent has drop, store {
        user: address,
        amount: u64,
        stapt_minted: u64,
        timestamp: u64,
    }

    #[event]
    struct UnstakeRequestEvent has drop, store {
        user: address,
        amount: u64,
        instant: bool,
        estimated_completion: u64,
        timestamp: u64,
    }

    #[event]
    struct UnstakeCompleteEvent has drop, store {
        user: address,
        amount: u64,
        stapt_burned: u64,
        timestamp: u64,
    }

    /// Initialize the staking protocol
    public entry fun initialize(
        admin: &signer,
        fee_rate: u64,
        fee_collector: address,
    ) {
        let admin_addr = signer::address_of(admin);
        
        // Ensure not already initialized
        assert!(!exists<ProtocolConfig>(admin_addr), error::already_exists(E_ALREADY_INITIALIZED));
        assert!(fee_rate <= MAX_FEE_RATE, error::invalid_argument(E_INVALID_FEE_RATE));

        // Initialize stAPT token
        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<StakedAptos>(
            admin,
            string::utf8(b"Staked Aptos"),
            string::utf8(b"stAPT"),
            8, // decimals
            true, // monitor_supply
        );

        // Store capabilities
        move_to(admin, StakedAptosCapabilities {
            mint_cap,
            burn_cap,
        });

        // Destroy freeze capability (we don't need it)
        coin::destroy_freeze_cap(freeze_cap);

        // Initialize protocol config with empty APT pool
        move_to(admin, ProtocolConfig {
            admin: admin_addr,
            paused: false,
            fee_rate,
            fee_collector,
            total_staked: 0,
            total_stapt_supply: 0,
            min_stake: MIN_STAKE_AMOUNT,
            apt_pool: coin::zero<AptosCoin>(),
        });
    }

    /// Stake APT tokens and receive stAPT
    public entry fun stake(
        user: &signer,
        amount: u64,
    ) acquires ProtocolConfig, StakedAptosCapabilities, UserStake {
        let user_addr = signer::address_of(user);
        let config = borrow_global_mut<ProtocolConfig>(@urstake_addr);
        
        // Basic validations
        assert!(!config.paused, error::invalid_state(E_PAUSED));
        assert!(amount >= config.min_stake, error::invalid_argument(E_MINIMUM_STAKE_NOT_MET));
        assert!(coin::balance<AptosCoin>(user_addr) >= amount, error::invalid_argument(E_INSUFFICIENT_BALANCE));

        // Calculate stAPT to mint based on current exchange rate
        let stapt_amount = if (config.total_staked == 0) {
            amount // 1:1 ratio for first stake
        } else {
            (amount * config.total_stapt_supply) / config.total_staked
        };

        // Transfer APT from user to protocol pool
        let apt_coins = coin::withdraw<AptosCoin>(user, amount);
        coin::merge(&mut config.apt_pool, apt_coins);

        // Mint stAPT tokens
        let stapt_cap = &borrow_global<StakedAptosCapabilities>(@urstake_addr).mint_cap;
        let stapt_coins = coin::mint(stapt_amount, stapt_cap);
        
        // Initialize or update user stake
        if (!exists<UserStake>(user_addr)) {
            move_to(user, UserStake {
                stapt_balance: 0,
                unstaking_requests: vector::empty(),
            });
        };

        let user_stake = borrow_global_mut<UserStake>(user_addr);
        user_stake.stapt_balance = user_stake.stapt_balance + stapt_amount;

        // Update global state
        config.total_staked = config.total_staked + amount;
        config.total_stapt_supply = config.total_stapt_supply + stapt_amount;

        // Deposit stAPT to user
        coin::deposit(user_addr, stapt_coins);

        // Emit event
        event::emit(StakeEvent {
            user: user_addr,
            amount,
            stapt_minted: stapt_amount,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// Request unstaking of stAPT tokens
    public entry fun request_unstake(
        user: &signer,
        stapt_amount: u64,
        instant: bool,
    ) acquires ProtocolConfig, UserStake {
        let user_addr = signer::address_of(user);
        let config = borrow_global<ProtocolConfig>(@urstake_addr);
        
        assert!(!config.paused, error::invalid_state(E_PAUSED));
        assert!(exists<UserStake>(user_addr), error::not_found(E_INSUFFICIENT_BALANCE));
        
        let user_stake = borrow_global_mut<UserStake>(user_addr);
        assert!(user_stake.stapt_balance >= stapt_amount, error::invalid_argument(E_INSUFFICIENT_BALANCE));
        assert!(coin::balance<StakedAptos>(user_addr) >= stapt_amount, error::invalid_argument(E_INSUFFICIENT_BALANCE));

        let completion_time = if (instant) {
            timestamp::now_seconds() // Instant unstaking
        } else {
            timestamp::now_seconds() + UNSTAKING_DELAY_SECONDS // Delayed unstaking
        };

        // Add unstaking request
        vector::push_back(&mut user_stake.unstaking_requests, UnstakingRequest {
            amount: stapt_amount,
            request_time: timestamp::now_seconds(),
            instant,
        });

        // Emit event
        event::emit(UnstakeRequestEvent {
            user: user_addr,
            amount: stapt_amount,
            instant,
            estimated_completion: completion_time,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// Complete unstaking and return APT tokens
    public entry fun complete_unstaking(
        user: &signer,
        request_index: u64,
    ) acquires ProtocolConfig, StakedAptosCapabilities, UserStake {
        let user_addr = signer::address_of(user);
        let config = borrow_global_mut<ProtocolConfig>(@urstake_addr);
        
        assert!(!config.paused, error::invalid_state(E_PAUSED));
        assert!(exists<UserStake>(user_addr), error::not_found(E_INSUFFICIENT_BALANCE));
        
        let user_stake = borrow_global_mut<UserStake>(user_addr);
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

        let stapt_amount = request.amount;
        let is_instant = request.instant;

        // Calculate APT amount to return (considering current exchange rate)
        let apt_amount = (stapt_amount * config.total_staked) / config.total_stapt_supply;

        // Apply instant unstaking fee if applicable
        let final_apt_amount = if (is_instant) {
            let fee = (apt_amount * config.fee_rate) / BASIS_POINTS;
            apt_amount - fee
        } else {
            apt_amount
        };

        // Burn stAPT tokens
        let stapt_coins = coin::withdraw<StakedAptos>(user, stapt_amount);
        let burn_cap = &borrow_global<StakedAptosCapabilities>(@urstake_addr).burn_cap;
        coin::burn(stapt_coins, burn_cap);

        // Update user state
        user_stake.stapt_balance = user_stake.stapt_balance - stapt_amount;
        vector::remove(&mut user_stake.unstaking_requests, request_index);

        // Update global state  
        config.total_staked = config.total_staked - apt_amount;
        config.total_stapt_supply = config.total_stapt_supply - stapt_amount;

        // Transfer APT from protocol pool to user
        let apt_coins = coin::extract(&mut config.apt_pool, final_apt_amount);
        coin::deposit(user_addr, apt_coins);

        // Emit event
        event::emit(UnstakeCompleteEvent {
            user: user_addr,
            amount: final_apt_amount,
            stapt_burned: stapt_amount,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// Set emergency pause
    public entry fun set_pause(
        admin: &signer,
        paused: bool,
    ) acquires ProtocolConfig {
        let admin_addr = signer::address_of(admin);
        let config = borrow_global_mut<ProtocolConfig>(@urstake_addr);
        
        assert!(admin_addr == config.admin, error::permission_denied(E_NOT_ADMIN));
        config.paused = paused;
    }

    /// Update fee rate
    public entry fun update_fee_rate(
        admin: &signer,
        new_fee_rate: u64,
    ) acquires ProtocolConfig {
        let admin_addr = signer::address_of(admin);
        let config = borrow_global_mut<ProtocolConfig>(@urstake_addr);
        
        assert!(admin_addr == config.admin, error::permission_denied(E_NOT_ADMIN));
        assert!(new_fee_rate <= MAX_FEE_RATE, error::invalid_argument(E_INVALID_FEE_RATE));
        
        config.fee_rate = new_fee_rate;
    }

    // ========== VIEW FUNCTIONS ==========

    #[view]
    public fun get_exchange_rate(): (u64, u64) acquires ProtocolConfig {
        let config = borrow_global<ProtocolConfig>(@urstake_addr);
        if (config.total_stapt_supply == 0) {
            (1, 1) // 1:1 ratio initially
        } else {
            (config.total_staked, config.total_stapt_supply)
        }
    }

    #[view] 
    public fun get_user_stake_info(user_addr: address): (u64, u64) acquires UserStake {
        if (!exists<UserStake>(user_addr)) {
            return (0, 0)
        };
        
        let user_stake = borrow_global<UserStake>(user_addr);
        (
            user_stake.stapt_balance,
            vector::length(&user_stake.unstaking_requests)
        )
    }

    #[view]
    public fun get_protocol_stats(): (u64, u64, u64) acquires ProtocolConfig {
        let config = borrow_global<ProtocolConfig>(@urstake_addr);
        (
            config.total_staked,
            config.total_stapt_supply,
            coin::value(&config.apt_pool)
        )
    }

    // Test-only functions
    #[test_only]
    public fun init_for_test(admin: &signer, fee_rate: u64) {
        initialize(admin, fee_rate, signer::address_of(admin));
    }
}