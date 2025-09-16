---
sidebar_position: 3
---

# Liquid Tokens

Understand how stAPT and stUSDC liquid staking tokens work and how to use them across the DeFi ecosystem.

## What are Liquid Tokens?

Liquid staking tokens represent your staked assets while maintaining full transferability and composability. When you stake with UrStake:

- **APT** → **stAPT** (liquid staked APT)
- **USDC** → **stUSDC** (liquid staked USDC)

These tokens accrue value over time as your underlying assets earn rewards.

## Key Benefits

### 🔄 **Full Liquidity**

- Trade anytime without unstaking delays
- No lock-up periods or waiting times
- Instant access to your value

### 💰 **Continuous Yield**

- Earn rewards while staying liquid
- Auto-compounding mechanisms
- No manual claiming required

### 🧩 **DeFi Composability**

- Use as collateral for lending
- Provide liquidity in DEX pools
- Integrate with any DeFi protocol

## stAPT: Liquid Staked APT

### How stAPT Works

**Value Accrual**:

```
stAPT Value = (Total APT Staked + Rewards) / Total stAPT Supply
Exchange Rate = stAPT → APT increases over time
```

**Current Metrics**:

- Exchange Rate: 1 stAPT = 1.05 APT
- APY: 8.00%+
- Total Supply: 2.4M stAPT
- Market Cap: 2.52M APT equivalent

### Using stAPT

#### 1. **DEX Trading**

Trade stAPT directly on supported exchanges:

- **PancakeSwap**: stAPT/APT pair
- **Thala**: stAPT/USDC pair
- **Tsunami**: Multi-asset pools

#### 2. **Lending & Borrowing**

Use stAPT as collateral:

- **Argo Protocol**: 80% LTV on stAPT
- **Echo Protocol**: stAPT lending markets
- **Thala Finance**: Collateral for synthetic assets

#### 3. **Yield Farming**

Earn additional rewards:

- **stAPT/APT LP**: Earn trading fees + rewards
- **stAPT/USDC LP**: Balanced exposure farming
- **Single-sided stAPT**: Lending yield strategies

### stAPT Price Dynamics

**Premium/Discount Analysis**:

```
Theoretical Value: Exchange rate × APT price
Market Price: DEX trading price
Premium = (Market Price - Theoretical Value) / Theoretical Value

Current Premium: -0.2% (slight discount)
30-Day Average: +0.1% (slight premium)
```

**Arbitrage Mechanisms**:

- Direct mint/redeem through protocol
- DEX arbitrage opportunities
- Automated market makers

## stUSDC: Liquid Staked USDC

### How stUSDC Works

**Yield Generation**:

```
stUSDC Value = (Total USDC + Yield Earned) / Total stUSDC Supply
Exchange Rate = stUSDC → USDC grows with yield
```

**Current Metrics**:

- Exchange Rate: 1 stUSDC = 1.02 USDC
- APY: 12.0%
- Total Supply: 5.1M stUSDC
- Backing Ratio: 105% (over-collateralized)

### Using stUSDC

#### 1. **Stable Trading Pairs**

- **stUSDC/USDC**: Primary liquidity pair
- **stUSDC/APT**: Cross-asset exposure
- **stUSDC/BTC**: Bitcoin exposure with yield

#### 2. **Money Market Integration**

- **Prime Lending**: stUSDC as premium collateral
- **Thala vaults**: Multi-strategy yield optimization
- **Cross-chain bridges**: Use on other chains

#### 3. **Payment & Commerce**

- **DeFi Payments**: Pay with yield-earning stablecoin
- **Merchant Integration**: Accept stUSDC payments
- **Treasury Management**: Corporate treasury yields

### stUSDC Stability Mechanisms

**Peg Maintenance**:

- **Arbitrage**: Direct redemption at fair value
- **Liquidity Incentives**: Deep DEX pools
- **Reserve Buffer**: 5% USDC reserves for stability

**Risk Management**:

- **Conservative Strategies**: Battle-tested protocols only
- **Diversification**: Max 30% per protocol
- **Real-time Monitoring**: Automated risk assessment

## Cross-Protocol Usage

### Supported Integrations

| Protocol        | stAPT Support | stUSDC Support | Use Cases                 |
| --------------- | ------------- | -------------- | ------------------------- |
| PancakeSwap     | ✅            | ✅             | LP tokens, trading        |
| Thala Finance   | ✅            | ✅             | Lending, synthetic assets |
| Argo Protocol   | ✅            | ✅             | Money markets             |
| Tsunami Finance | ✅            | ✅             | Cross-chain DeFi          |
| Echo Protocol   | ⏳ Coming     | ✅             | Lending markets           |

### Integration Examples

#### Collateral Usage

```javascript
// Use stAPT as collateral for borrowing
const collateralValue = stAPTBalance * exchangeRate * 0.8; // 80% LTV
const borrowCapacity = collateralValue;

// Borrow USDC against stAPT
const borrowAmount = borrowCapacity * 0.5; // Conservative 50% utilization
```

#### Liquidity Provision

```javascript
// Create stAPT/APT LP position
const aptAmount = 100;
const stAPTAmount = aptAmount / exchangeRate;
const lpTokens = addLiquidity(aptAmount, stAPTAmount);
```

#### Yield Stacking

```javascript
// Stack yields across protocols
const baseYield = 8.0; // stAPT base yield
const lpYield = 12.0; // LP farming yield
const lendingYield = 6.0; // Lending yield
const totalYield = baseYield + lpYield + lendingYield; // 26% total
```

## Advanced Strategies

### 📈 **Leveraged Staking**

1. Stake APT → Receive stAPT
2. Use stAPT as collateral → Borrow APT
3. Stake borrowed APT → Receive more stAPT
4. Repeat for leveraged exposure

**Risk Considerations**:

- Liquidation risk if exchange rate drops
- Interest costs on borrowed APT
- Optimal leverage ratio: 1.5-2x

### 🔄 **Arbitrage Trading**

Monitor and exploit price differences:

- **CEX vs DEX**: Exchange rate differences
- **Cross-chain**: Bridge arbitrage opportunities
- **Time-based**: Exploit temporary mispricings

### 💱 **Pairs Trading**

- **Long stAPT / Short APT**: Bet on exchange rate appreciation
- **stUSDC / USDC spread**: Capture yield differential
- **Cross-asset**: stAPT vs stUSDC relative performance

## Risk Management

### Smart Contract Risks

- **Audit Coverage**: Multiple security audits
- **Insurance**: Smart contract insurance available
- **Bug Bounty**: $500K+ reward program

### Market Risks

- **Liquidity Risk**: DEX pool depth monitoring
- **Depeg Risk**: Exchange rate volatility
- **Yield Risk**: Strategy performance variation

### Mitigation Strategies

- **Diversification**: Don't put all funds in one strategy
- **Position Sizing**: Start small, scale gradually
- **Regular Monitoring**: Track performance and risks
- **Exit Planning**: Have clear exit strategies

## Monitoring Tools

### Portfolio Tracking

- **UrStake Dashboard**: Real-time position tracking
- **DeBank**: Multi-protocol portfolio view
- **Aptos Explorer**: On-chain transaction history

### Price Feeds

- **CoinGecko**: Market price tracking
- **CoinMarketCap**: Liquidity and volume data
- **DeFiLlama**: Protocol TVL and yields

### Analytics

- **Exchange Rate History**: Track value accrual
- **Yield Performance**: Compare strategy returns
- **Risk Metrics**: Monitor portfolio health

## Tax Considerations

### Staking Events

- **Staking**: Generally not taxable (no gain realized)
- **Yield Accrual**: May be taxable as earned
- **Trading**: Capital gains on liquid token trades
- **Unstaking**: Capital gains on appreciation

### Record Keeping

- **Transaction History**: Keep detailed records
- **Exchange Rates**: Track historical rates
- **Yield Attribution**: Document yield sources
- **Professional Advice**: Consult tax professionals

## Getting Started

### Beginner Strategy

1. **Start Small**: Stake 10-20% of holdings
2. **Learn Mechanics**: Understand exchange rates
3. **Try DEX Trading**: Practice with small amounts
4. **Monitor Performance**: Track yields and risks

### Intermediate Strategy

1. **Increase Allocation**: 30-50% liquid staking
2. **LP Provision**: Earn additional trading fees
3. **Cross-Protocol**: Use in lending markets
4. **Yield Optimization**: Compare strategies

### Advanced Strategy

1. **Leverage**: Careful leveraged positions
2. **Arbitrage**: Exploit price differences
3. **Complex Strategies**: Multi-protocol yield stacking
4. **Risk Management**: Sophisticated hedging

---

**Ready to use liquid tokens?** Visit [urstake.vercel.app](https://urstake.vercel.app) and start exploring the possibilities of liquid staking tokens!
