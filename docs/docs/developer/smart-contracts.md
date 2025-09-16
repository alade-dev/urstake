---
sidebar_position: 1
---

# Smart Contract Architecture

UrStake's smart contract system is built on Aptos Move, providing secure, efficient, and composable liquid staking infrastructure.

## Core Contracts Overview

### Contract Hierarchy

```
┌─────────────────┐
│   UrStake Core  │  ← Main staking logic
└─────────────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌─────────┐ ┌──────────┐
│ APT     │ │ USDC     │  ← Asset-specific modules
│ Module  │ │ Module   │
└─────────┘ └──────────┘
    │           │
    ▼           ▼
┌─────────┐ ┌──────────┐
│ stAPT   │ │ stUSDC   │  ← Liquid token contracts
│ Token   │ │ Token    │
└─────────┘ └──────────┘
```

## Core Components

### 1. UrStake Core Contract

**Address**: `0x...` (to be deployed)

**Responsibilities**:

- User deposit/withdrawal management
- Liquid token minting/burning
- Yield distribution logic
- Administrative functions

**Key Functions**:

```rust
public entry fun stake_apt(user: &signer, amount: u64)
public entry fun stake_usdc(user: &signer, amount: u64)
public entry fun unstake_apt(user: &signer, amount: u64)
public entry fun unstake_usdc(user: &signer, amount: u64)
public fun get_exchange_rate(): (u64, u64)
```

### 2. APT Staking Module

**Purpose**: Manages APT staking operations and validator delegation

**Core Logic**:

- Validator selection and delegation
- Reward collection and compounding
- Exchange rate calculation
- Emergency unstaking

**State Management**:

```rust
struct AptStakingPool has key {
    total_staked: u64,
    total_shares: u64,
    validator_pools: vector<ValidatorPool>,
    pending_rewards: u64,
    last_update_epoch: u64,
}
```

### 3. USDC Staking Module

**Purpose**: Manages USDC yield generation strategies

**Yield Sources**:

- Lending protocol integration
- Arbitrage opportunities
- Treasury management
- Cross-protocol optimization

**State Management**:

```rust
struct UsdcYieldPool has key {
    total_deposited: u64,
    total_shares: u64,
    strategy_allocations: vector<StrategyAllocation>,
    yield_buffer: u64,
    last_rebalance: u64,
}
```

## Liquid Token Implementation

### stAPT Token Contract

**Features**:

- **Rebasing Mechanism**: Token supply adjusts with rewards
- **Exchange Rate**: Dynamic rate calculation
- **Transfer Functions**: Standard token operations
- **Integration Hooks**: DeFi protocol compatibility

**Core Functions**:

```rust
public fun mint_stapt(to: address, amount: u64)
public fun burn_stapt(from: address, amount: u64)
public fun transfer_stapt(from: &signer, to: address, amount: u64)
public fun get_stapt_value(amount: u64): u64
```

### stUSDC Token Contract

**Features**:

- **Yield Accrual**: Value appreciation over time
- **Stable Peg**: Maintains close to 1:1 USDC ratio
- **Composability**: Full DeFi ecosystem integration
- **Instant Liquidity**: DEX trading support

## Security Architecture

### Access Control

**Admin Roles**:

```rust
struct AdminCap has key, store {
    admin: address,
}

struct EmergencyCap has key, store {
    emergency_admin: address,
}
```

**Role Permissions**:

- **Admin**: Protocol upgrades, parameter changes
- **Emergency Admin**: Pause functions, emergency withdrawals
- **Users**: Stake, unstake, transfer operations

### Safety Mechanisms

#### 1. Reentrancy Protection

```rust
struct ReentrancyGuard has key {
    locked: bool,
}

public fun acquire_lock(guard: &mut ReentrancyGuard) {
    assert!(!guard.locked, EREENTRANT_CALL);
    guard.locked = true;
}
```

#### 2. Pause Functionality

```rust
struct PauseState has key {
    staking_paused: bool,
    unstaking_paused: bool,
    emergency_mode: bool,
}
```

#### 3. Slippage Protection

```rust
public fun stake_with_min_shares(
    user: &signer,
    amount: u64,
    min_shares: u64
) {
    let shares = calculate_shares(amount);
    assert!(shares >= min_shares, ESLIPPAGE_TOO_HIGH);
    // ... rest of staking logic
}
```

## Upgrade Mechanisms

### Contract Upgradeability

**Upgrade Process**:

1. **Proposal**: Admin proposes upgrade
2. **Timelock**: 48-hour minimum delay
3. **Execution**: Upgrade applied after timelock
4. **Verification**: Post-upgrade validation

**Implementation**:

```rust
struct UpgradeProposal has key {
    new_code_hash: vector<u8>,
    proposed_at: u64,
    timelock_duration: u64,
    executed: bool,
}
```

### Emergency Procedures

**Emergency Stop**:

- Pause all user operations
- Allow only admin functions
- Enable emergency withdrawals
- Protect user funds during incidents

## Economic Model

### Exchange Rate Calculation

#### APT Exchange Rate

```rust
public fun calculate_apt_exchange_rate(): (u64, u64) {
    let total_apt = get_total_staked_apt() + get_pending_rewards();
    let total_stapt = get_total_stapt_supply();
    (total_apt, total_stapt)
}
```

#### USDC Exchange Rate

```rust
public fun calculate_usdc_exchange_rate(): (u64, u64) {
    let total_usdc = get_total_deposited_usdc() + get_accrued_yield();
    let total_stusdc = get_total_stusdc_supply();
    (total_usdc, total_stusdc)
}
```

### Fee Distribution

**Fee Collection**:

```rust
struct FeeConfig has key {
    performance_fee_bps: u64,  // 1000 = 10%
    management_fee_bps: u64,   // 0 = 0%
    treasury_address: address,
}
```

**Fee Application**:

- Performance fees deducted from rewards
- Fees accumulated in treasury
- Transparent fee tracking

## Integration Interfaces

### DEX Integration

**Price Oracle Interface**:

```rust
public fun get_token_price(token: address): u64
public fun update_price_feed(oracle: &signer, token: address, price: u64)
```

**Liquidity Pool Interface**:

```rust
public fun add_liquidity(
    user: &signer,
    token_a_amount: u64,
    token_b_amount: u64
): u64

public fun remove_liquidity(
    user: &signer,
    lp_amount: u64
): (u64, u64)
```

### Lending Protocol Integration

**Lending Interface**:

```rust
public fun supply_collateral(user: &signer, amount: u64)
public fun borrow_against_collateral(user: &signer, amount: u64)
public fun repay_loan(user: &signer, amount: u64)
```

## Monitoring & Analytics

### Event Emission

**Staking Events**:

```rust
struct StakeEvent has drop, store {
    user: address,
    asset: String,
    amount: u64,
    shares_minted: u64,
    timestamp: u64,
}
```

**Yield Events**:

```rust
struct YieldEvent has drop, store {
    asset: String,
    yield_earned: u64,
    new_exchange_rate: u64,
    timestamp: u64,
}
```

### Performance Metrics

**On-Chain Tracking**:

```rust
struct PerformanceMetrics has key {
    total_value_locked: u64,
    cumulative_yield: u64,
    user_count: u64,
    average_apy: u64,
    last_updated: u64,
}
```

## Testing Framework

### Unit Tests

**Test Structure**:

```rust
#[test]
public fun test_stake_apt() {
    let user = account::create_account_for_test(@0x1);
    stake_apt(&user, 1000000000); // 1 APT

    let shares = get_user_shares(@0x1);
    assert!(shares > 0, 0);
}
```

### Integration Tests

**Multi-Contract Testing**:

```rust
#[test]
public fun test_end_to_end_staking() {
    // Setup contracts
    setup_test_environment();

    // Test user journey
    let user = create_test_user();
    stake_apt(&user, 1000000000);
    advance_epochs(10);
    unstake_apt(&user, get_user_shares(user));

    // Verify final state
    assert_user_balance_increased();
}
```

## Deployment Strategy

### Mainnet Deployment

**Phase 1**: Core contracts deployment

- Deploy UrStake core contract
- Deploy liquid token contracts
- Initialize with conservative parameters

**Phase 2**: Integration enablement

- Deploy DEX pool contracts
- Enable cross-protocol integrations
- Open public staking

**Phase 3**: Advanced features

- Enable advanced yield strategies
- Deploy governance contracts
- Full decentralization

### Contract Addresses

**Mainnet** (when deployed):

```
UrStake Core: 0x...
stAPT Token: 0x...
stUSDC Token: 0x...
```

**Testnet**:

```
UrStake Core: 0x...
stAPT Token: 0x...
stUSDC Token: 0x...
```

## Security Considerations

### Audit Requirements

**Security Audits**:

- **Trail of Bits**: Core contract security
- **Consensys Diligence**: Economic model review
- **Halborn**: Integration security
- **Internal Review**: Ongoing security assessment

### Bug Bounty Program

**Reward Structure**:

- **Critical**: $100,000+
- **High**: $25,000 - $100,000
- **Medium**: $5,000 - $25,000
- **Low**: $1,000 - $5,000

### Best Practices

**Development Standards**:

- Comprehensive unit testing (>95% coverage)
- Integration testing across protocols
- Formal verification for critical functions
- Regular security reviews

---

**For technical questions or integration support**, join our [developer Discord](https://discord.gg/urstake-dev)
