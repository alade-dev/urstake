# UrStake Smart Contracts - Liquid Staking Protocol for Aptos

A comprehensive liquid staking protocol implementation on Aptos blockchain, supporting both APT and USDC staking with advanced features including flexible unstaking, reward distribution, and protocol governance.

## 🎯 Overview

UrStake is a multi-asset liquid staking protocol that enables users to stake APT and USDC tokens while maintaining liquidity through liquid staking tokens (stAPT and stUSDC). The protocol provides a robust, secure, and user-friendly staking experience with features like instant unstaking, automated reward distribution, and comprehensive position management.

## 📦 Contract Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    UrStake Protocol                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   UrStake   │  │    USDC     │  │USDC Staking │         │
│  │   Module    │  │   Module    │  │   Module    │         │
│  │             │  │             │  │             │         │
│  │ • APT       │  │ • Mint      │  │ • USDC      │         │
│  │   Staking   │  │ • Transfer  │  │   Staking   │         │
│  │ • stAPT     │  │ • Balance   │  │ • stUSDC    │         │
│  │   Tokens    │  │ • Register  │  │   Tokens    │         │
│  │ • Rewards   │  │             │  │ • Rewards   │         │
│  │ • Unstaking │  │             │  │ • Unstaking │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## 🗂️ Directory Structure

```
move/
├── sources/                    # Smart contract source files
│   ├── urstake.move           # Main APT staking protocol
│   ├── usdc.move              # Custom USDC token implementation
│   ├── usdc_staking.move      # USDC staking protocol
│   └── native_usdc_staking.move # Native USDC integration (future)
├── build/                      # Compiled contract artifacts
│   └── defi_urstake/
│       ├── BuildInfo.yaml
│       ├── bytecode_modules/   # Compiled bytecode
│       ├── source_maps/        # Source mapping files
│       └── sources/            # Processed source files
├── Move.toml                   # Project configuration
└── README.md                   # This documentation
```

## 📋 Contract Specifications

### Deployed Addresses (Testnet)

| Contract         | Address                                                                            | Purpose             |
| ---------------- | ---------------------------------------------------------------------------------- | ------------------- |
| **UrStake**      | `0x6e61dc7e5a207d5470d195312bf7fd99124dd8593bbb11094a0a145a89c29923::urstake`      | APT liquid staking  |
| **USDC**         | `0x6e61dc7e5a207d5470d195312bf7fd99124dd8593bbb11094a0a145a89c29923::usdc`         | Test USDC token     |
| **USDC Staking** | `0x6e61dc7e5a207d5470d195312bf7fd99124dd8593bbb11094a0a145a89c29923::usdc_staking` | USDC liquid staking |

## 🔧 Core Features

### 1. APT Staking (urstake.move)

#### **Liquid Staking**

- Stake APT tokens and receive stAPT (Staked Aptos) tokens
- Dynamic exchange rate based on accumulated rewards
- Minimum stake: 0.01 APT (1,000,000 octas)
- Immediate stAPT token minting

#### **Flexible Unstaking**

- **Instant Unstaking**: Immediate with configurable fees (max 10%)
- **Delayed Unstaking**: 7-day waiting period, no fees
- Queue-based request system
- Batch processing capability

#### **Key Structs**

```move
struct StakedAptos {}  // Liquid staking token

struct ProtocolConfig has key {
    admin: address,
    paused: bool,
    fee_rate: u64,           // Basis points (max 1000 = 10%)
    fee_collector: address,
    total_staked: u64,
    stapt_supply: u64,
    apt_pool: Coin<AptosCoin>
}

struct UserStake has key {
    stapt_balance: u64,
    unstaking_requests: vector<UnstakingRequest>
}

struct UnstakingRequest has store {
    amount: u64,
    timestamp: u64,
    instant: bool
}
```

#### **Core Functions**

```move
// Initialize the protocol
public entry fun initialize(
    admin: &signer,
    fee_rate: u64,
    fee_collector: address
)

// Stake APT tokens
public entry fun stake(user: &signer, amount: u64)

// Request unstaking (instant or delayed)
public entry fun request_unstake(
    user: &signer,
    stapt_amount: u64,
    instant: bool
)

// Complete unstaking request
public entry fun complete_unstaking(
    user: &signer,
    request_index: u64
)
```

### 2. USDC Token (usdc.move)

#### **Test Token Implementation**

- Standard Coin framework implementation
- 6 decimal precision (matching real USDC)
- Minting capability for testing
- Standard transfer and balance functions

#### **Key Functions**

```move
// Initialize USDC token
public entry fun initialize(account: &signer)

// Register account for USDC
public entry fun register(account: &signer)

// Mint USDC (testing only)
public entry fun mint(
    admin: &signer,
    to: address,
    amount: u64
)

// Transfer USDC
public entry fun transfer(
    from: &signer,
    to: address,
    amount: u64
)
```

### 3. USDC Staking (usdc_staking.move)

#### **USDC Liquid Staking**

- Stake USDC tokens and receive stUSDC tokens
- Configurable APY rewards system
- Minimum stake: 1 USDC (1,000,000 micro USDC)
- Reward accumulation and claiming

#### **Advanced Features**

- **Reward Distribution**: Automatic reward calculation
- **Compound Staking**: Reinvest rewards automatically
- **Flexible Withdrawal**: Similar to APT staking model
- **Rate Limiting**: Protection against manipulation

#### **Key Functions**

```move
// Stake USDC tokens
public entry fun stake_usdc(user: &signer, amount: u64)

// Request USDC unstaking
public entry fun request_unstake_usdc(
    user: &signer,
    amount: u64,
    instant: bool
)

// Complete USDC unstaking
public entry fun complete_unstaking_usdc(
    user: &signer,
    request_index: u64
)

// Claim accumulated rewards
public entry fun claim_rewards(user: &signer)
```

## 📊 Protocol Economics

### Exchange Rate Calculation

#### APT Staking

```
Exchange Rate = Total APT Staked / Total stAPT Supply
stAPT Amount = APT Amount / Exchange Rate
APT Amount = stAPT Amount × Exchange Rate
```

#### USDC Staking

```
Exchange Rate = Total USDC Staked / Total stUSDC Supply
stUSDC Amount = USDC Amount / Exchange Rate
USDC Amount = stUSDC Amount × Exchange Rate
```

### Fee Structure

| Operation                    | Fee Type   | Rate                 | Destination       |
| ---------------------------- | ---------- | -------------------- | ----------------- |
| **Instant Unstaking (APT)**  | Percentage | 0-10% (configurable) | Fee Collector     |
| **Instant Unstaking (USDC)** | Percentage | 0-10% (configurable) | Protocol Treasury |
| **Regular Unstaking**        | None       | 0%                   | N/A               |
| **Staking**                  | None       | 0%                   | N/A               |

### Reward Mechanism

- **APT Rewards**: Accumulated through validator rewards (simulated)
- **USDC Rewards**: Configurable APY-based reward system
- **Compound Growth**: Exchange rate appreciation over time
- **Claim Flexibility**: Users can claim or compound rewards

## 🔒 Security Features

### Access Control

- **Admin Functions**: Protocol initialization and configuration
- **Emergency Pause**: Stop all operations in critical situations
- **Fee Caps**: Maximum fee rates to prevent abuse
- **Time Locks**: Delayed unstaking for flash loan protection

### Validation & Safety

```move
// Amount validation
assert!(amount >= MIN_STAKE_AMOUNT, E_MINIMUM_STAKE_NOT_MET);

// Balance checks
assert!(user_balance >= required_amount, E_INSUFFICIENT_BALANCE);

// Fee rate limits
assert!(fee_rate <= MAX_FEE_RATE, E_INVALID_FEE_RATE);

// Pause state checks
assert!(!is_paused(), E_PAUSED);
```

### Anti-Manipulation

- **Request Queue System**: Prevents immediate unstaking manipulation
- **Time Delays**: 7-day waiting period for delayed unstaking
- **Rate Limiting**: Circuit breakers for unusual activity
- **Balance Tracking**: Comprehensive balance validation

## 🛠️ Development Setup

### Prerequisites

- Aptos CLI installed
- Move language support
- Testnet account with APT tokens

### Compilation

```bash
# Navigate to move directory
cd move/

# Compile all contracts
aptos move compile

# Check for compilation errors
aptos move compile --check
```

### Testing

```bash
# Run all tests
aptos move test

# Run specific test module
aptos move test --filter urstake

# Run with coverage
aptos move test --coverage
```

### Deployment

```bash
# Deploy to testnet
aptos move publish --assume-yes

# Deploy with specific account
aptos move publish --profile testnet --assume-yes

# Verify deployment
aptos account list --query resources
```

## 📈 Usage Examples

### APT Staking Workflow

```move
// 1. Initialize protocol (admin only)
urstake::initialize(&admin, 500, fee_collector_addr); // 5% fee

// 2. User stakes 100 APT
urstake::stake(&user, 100_00000000); // 100 APT in octas

// 3. Request instant unstaking of 50 stAPT
urstake::request_unstake(&user, 50_00000000, true);

// 4. Complete the unstaking
urstake::complete_unstaking(&user, 0); // First request
```

### USDC Staking Workflow

```move
// 1. Register for USDC
usdc::register(&user);

// 2. Mint test USDC
usdc::mint(&admin, user_addr, 1000_000000); // 1000 USDC

// 3. Stake 500 USDC
usdc_staking::stake_usdc(&user, 500_000000);

// 4. Claim accumulated rewards
usdc_staking::claim_rewards(&user);

// 5. Request delayed unstaking
usdc_staking::request_unstake_usdc(&user, 250_000000, false);
```

## 🔍 View Functions & Queries

### Protocol Statistics

```move
// Get APT exchange rate
let (total_staked, supply) = urstake::get_exchange_rate();

// Get protocol stats
let (staked, supply, pool) = urstake::get_protocol_stats();

// Get user stake info
let (balance, requests) = urstake::get_user_stake_info(user_addr);
```

### USDC Information

```move
// Get USDC protocol stats
let stats = usdc_staking::get_usdc_protocol_stats();

// Get user USDC stake info
let info = usdc_staking::get_user_usdc_stake_info(user_addr);

// Calculate pending rewards
let rewards = usdc_staking::calculate_pending_rewards(user_addr);
```

## ⚠️ Error Codes

### Common Errors

| Code | Constant                  | Description                        |
| ---- | ------------------------- | ---------------------------------- |
| `1`  | `E_NOT_INITIALIZED`       | Protocol not initialized           |
| `2`  | `E_ALREADY_INITIALIZED`   | Protocol already initialized       |
| `3`  | `E_NOT_ADMIN`             | Caller is not admin                |
| `4`  | `E_INSUFFICIENT_BALANCE`  | Insufficient balance for operation |
| `5`  | `E_INVALID_AMOUNT`        | Invalid amount provided            |
| `6`  | `E_INVALID_FEE_RATE`      | Fee rate exceeds maximum           |
| `7`  | `E_PAUSED`                | Protocol is paused                 |
| `8`  | `E_MINIMUM_STAKE_NOT_MET` | Stake amount below minimum         |

## 🚀 Future Enhancements

### Phase 1 (Current)

- ✅ Basic APT staking with stAPT tokens
- ✅ USDC token implementation
- ✅ USDC staking with stUSDC tokens
- ✅ Flexible unstaking options
- ✅ Reward mechanisms

### Phase 2 (Planned)

- 🔄 Multi-validator APT staking
- 🔄 Advanced reward distribution
- 🔄 Governance token integration
- 🔄 Cross-protocol yield farming

### Phase 3 (Future)

- 📋 Native USDC integration
- 📋 Multi-asset support
- 📋 Advanced DeFi primitives
- 📋 Mainnet deployment

## 🧪 Testing & Verification

### Unit Tests

```bash
# Test APT staking functionality
aptos move test --filter test_stake_apt

# Test USDC operations
aptos move test --filter test_usdc_mint

# Test unstaking workflows
aptos move test --filter test_unstaking
```

### Integration Testing

1. Deploy contracts to testnet
2. Initialize with test parameters
3. Execute full staking/unstaking cycles
4. Verify exchange rate calculations
5. Test emergency functions

### Security Auditing

- Mathematical formula verification
- Overflow/underflow protection
- Access control validation
- Economic attack vector analysis

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write comprehensive tests
4. Update documentation
5. Submit a pull request

### Development Guidelines

- Follow Move best practices
- Write clear, documented code
- Include comprehensive test coverage
- Update README for new features

## 📞 Support & Community

- **Documentation**: Complete API reference in code comments
- **Issues**: Report bugs and request features on GitHub
- **Discussions**: Join our community Discord
- **Security**: Report security issues privately

---

**Built with 🔥 on Aptos blockchain**

> ⚠️ **Testnet Warning**: These contracts are deployed on Aptos testnet for development and testing purposes. Do not use real funds. Always verify contract addresses and functionality before any mainnet deployment.
