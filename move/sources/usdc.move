module urstake_addr::usdc {
    use std::string;
    use std::signer;
    use aptos_framework::coin::{Self, BurnCapability, FreezeCapability, MintCapability};

    /// Error codes
    const E_NOT_ADMIN: u64 = 1;
    const E_ALREADY_INITIALIZED: u64 = 2;

    /// USDC coin struct
    struct USDC {}

    /// Store for the mint, burn, and freeze capabilities
    struct Capabilities has key {
        burn_cap: BurnCapability<USDC>,
        freeze_cap: FreezeCapability<USDC>,
        mint_cap: MintCapability<USDC>,
    }

    /// Initialize the USDC coin
    public entry fun initialize(account: &signer) {
        let account_addr = signer::address_of(account);
        
        // Ensure the account is the module publisher
        assert!(account_addr == @urstake_addr, E_NOT_ADMIN);
        
        // Ensure not already initialized
        assert!(!exists<Capabilities>(account_addr), E_ALREADY_INITIALIZED);

        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<USDC>(
            account,
            string::utf8(b"USD Coin"),
            string::utf8(b"USDC"),
            6, // 6 decimals for USDC
            true, // monitor_supply
        );

        move_to(account, Capabilities {
            burn_cap,
            freeze_cap,
            mint_cap,
        });
    }

    /// Register an account to hold USDC
    public entry fun register(account: &signer) {
        coin::register<USDC>(account);
    }

    /// Mint USDC (only for admin/testing purposes)
    public entry fun mint(
        admin: &signer,
        to: address,
        amount: u64,
    ) acquires Capabilities {
        let admin_addr = signer::address_of(admin);
        assert!(admin_addr == @urstake_addr, E_NOT_ADMIN);
        
        let caps = borrow_global<Capabilities>(@urstake_addr);
        let coins = coin::mint<USDC>(amount, &caps.mint_cap);
        coin::deposit<USDC>(to, coins);
    }

    /// Transfer USDC between accounts
    public entry fun transfer(
        from: &signer,
        to: address,
        amount: u64,
    ) {
        coin::transfer<USDC>(from, to, amount);
    }

    /// Get USDC balance
    public fun balance(addr: address): u64 {
        coin::balance<USDC>(addr)
    }

    /// Check if account is registered for USDC
    public fun is_registered(addr: address): bool {
        coin::is_account_registered<USDC>(addr)
    }

    /// Get USDC decimals
    public fun decimals(): u8 {
        coin::decimals<USDC>()
    }

    /// Get USDC name
    public fun name(): string::String {
        coin::name<USDC>()
    }

    /// Get USDC symbol
    public fun symbol(): string::String {
        coin::symbol<USDC>()
    }
}
