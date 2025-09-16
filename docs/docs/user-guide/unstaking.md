---
sidebar_position: 4
---

# Unstaking Guide

Learn how to unstake your assets and convert liquid tokens back to the underlying assets when needed.

## Unstaking Overview

UrStake provides flexible unstaking options to meet different liquidity needs:

- **Instant Unstaking**: Trade liquid tokens on DEXs immediately
- **Direct Unstaking**: Exchange through the protocol with potential delays
- **Partial Unstaking**: Unstake any amount, no minimums

## Unstaking Options

### 🚀 **Instant Unstaking (Recommended)**

Trade your liquid tokens on decentralized exchanges for immediate liquidity.

**Advantages**:

- ⚡ Immediate execution (seconds)
- 💰 No protocol fees
- 📈 Market-based pricing
- 🔄 24/7 availability

**Process**:

1. Connect wallet to supported DEX
2. Select stAPT→APT or stUSDC→USDC pair
3. Enter amount to trade
4. Confirm transaction
5. Receive underlying tokens instantly

**Supported DEXs**:

- **PancakeSwap**: Deepest liquidity pools
- **Thala**: Integrated stablecoin pools
- **Tsunami**: Multi-asset trading

### 🏦 **Direct Protocol Unstaking**

Exchange liquid tokens directly through UrStake smart contracts.

**Advantages**:

- 📊 Guaranteed exchange rate
- 🎯 Exact protocol rate
- 🔒 No slippage risk
- ✅ Official protocol method

**Considerations**:

- ⏰ Potential processing delays during high volume
- 🚫 May be temporarily unavailable during rebalancing
- ⛽ Higher gas costs for large amounts

## stAPT Unstaking

### Instant Trading

**Current Market Conditions**:

```
stAPT → APT Exchange Rate: 1 stAPT = 1.05 APT
DEX Rate: 1 stAPT = 1.049 APT (0.1% discount)
Liquidity: $2.8M in stAPT/APT pools
Slippage (10K trade): 0.05%
```

**Step-by-Step**:

1. **Choose DEX**: Visit PancakeSwap or Thala
2. **Connect Wallet**: Ensure stAPT tokens visible
3. **Set Amount**: Enter stAPT amount to trade
4. **Check Rate**: Verify exchange rate and slippage
5. **Execute Trade**: Confirm transaction
6. **Receive APT**: Get APT tokens in wallet

### Direct Unstaking

**Protocol Unstaking Process**:

1. **Visit UrStake**: Go to [urstake.vercel.app](https://urstake.vercel.app)
2. **Access Unstaking**: Click "Unstake" → "APT"
3. **Enter Amount**: Specify stAPT amount
4. **Review Terms**: Check exchange rate and timing
5. **Confirm**: Submit unstaking request
6. **Wait Processing**: 7-day unbonding period
7. **Claim APT**: Claim your APT after processing

**Unbonding Schedule**:

```
Day 1-7: Unbonding period (earning reduced rewards)
Day 7: APT available for withdrawal
Claiming: Manual claim transaction required
```

## stUSDC Unstaking

### Instant Trading

**Current Market Conditions**:

```
stUSDC → USDC Exchange Rate: 1 stUSDC = 1.02 USDC
DEX Rate: 1 stUSDC = 1.019 USDC (0.1% discount)
Liquidity: $1.2M in stUSDC/USDC pools
Slippage (5K trade): 0.03%
```

**Trading Process**:

1. **Select DEX**: PancakeSwap recommended for liquidity
2. **Swap Interface**: Find stUSDC → USDC pair
3. **Input Amount**: Enter stUSDC to exchange
4. **Price Check**: Verify current rate vs protocol rate
5. **Execute**: Complete swap transaction
6. **Receive USDC**: Get USDC in wallet immediately

### Direct Unstaking

**Protocol Redemption**:

1. **Access Platform**: Visit UrStake unstaking interface
2. **Select USDC**: Choose "Unstake USDC" option
3. **Amount Entry**: Specify stUSDC amount
4. **Rate Display**: Current exchange rate shown
5. **Processing Time**: Usually instant, may take up to 24h during high volume
6. **Complete**: Receive USDC at exact protocol rate

## Unstaking Strategies

### 🎯 **Timing Optimization**

**Market-Based Timing**:

- **Premium Trading**: Trade when stTokens trade at premium
- **Discount Buying**: Buy stTokens when at discount
- **Volume Analysis**: Trade during high-liquidity periods

**Protocol-Based Timing**:

- **Epoch Timing**: APT unstaking optimal at epoch end
- **Rebalancing**: Avoid during strategy rebalancing
- **High Volume**: Expect delays during market stress

### 📊 **Partial Unstaking**

**Graduated Approach**:

```javascript
// Example: Unstake 25% every month
const totalPosition = 1000; // stAPT
const monthlyUnstake = totalPosition * 0.25;

Month 1: Unstake 250 stAPT (750 remaining)
Month 2: Unstake 250 stAPT (500 remaining)
Month 3: Unstake 250 stAPT (250 remaining)
Month 4: Unstake 250 stAPT (0 remaining)
```

**Benefits**:

- **Risk Management**: Reduce timing risk
- **Flexibility**: Maintain some earning position
- **Market Adaptation**: Respond to changing conditions

### 💰 **Tax-Optimized Unstaking**

**FIFO Method** (First In, First Out):

- Unstake oldest positions first
- May optimize for long-term capital gains
- Track acquisition dates carefully

**Tax-Loss Harvesting**:

- Realize losses in down markets
- Offset gains with strategic timing
- Consult tax professionals

## Cost Analysis

### Instant Trading Costs

**DEX Trading Fees**:

```
PancakeSwap: 0.25% trading fee
Thala: 0.30% trading fee
Slippage: 0.01-0.10% typical
Gas: ~0.01 APT per transaction

Total Cost: 0.26-0.41% for instant liquidity
```

### Direct Unstaking Costs

**Protocol Costs**:

```
Unstaking Fee: 0% (no protocol fee)
Gas Costs: ~0.02 APT per transaction
Opportunity Cost: Lost rewards during unbonding
Time Cost: 7-day wait for APT

Total Cost: Mostly opportunity cost
```

### Cost Comparison

| Amount   | Instant Trading | Direct Unstaking    | Recommendation    |
| -------- | --------------- | ------------------- | ----------------- |
| < $1,000 | ~$3-4 fees      | $0 fees, 7-day wait | Instant if needed |
| $1K-$10K | ~$30-40 fees    | $0 fees, 7-day wait | Consider timing   |
| > $10K   | ~$300+ fees     | $0 fees, 7-day wait | Direct unstaking  |

## Risk Management

### 🔍 **Pre-Unstaking Checklist**

**Market Analysis**:

- [ ] Check current exchange rates
- [ ] Compare DEX vs protocol rates
- [ ] Assess market liquidity depth
- [ ] Review slippage estimates

**Technical Verification**:

- [ ] Confirm wallet connection
- [ ] Verify sufficient gas balance
- [ ] Check token approvals
- [ ] Test with small amount first

**Strategic Considerations**:

- [ ] Review unstaking reasoning
- [ ] Consider partial vs full unstaking
- [ ] Plan for tax implications
- [ ] Evaluate alternative strategies

### ⚠️ **Common Pitfalls**

**High Slippage**:

- **Cause**: Large trades in shallow pools
- **Solution**: Split large trades or use direct unstaking
- **Prevention**: Check liquidity before trading

**MEV Attacks**:

- **Risk**: Front-running of large unstaking trades
- **Mitigation**: Use private mempools or split transactions
- **Tools**: Use MEV-protected trading interfaces

**Timing Errors**:

- **Risk**: Unstaking during unfavorable market conditions
- **Prevention**: Set limit orders or wait for better rates
- **Strategy**: Dollar-cost average out of positions

## Emergency Unstaking

### 🚨 **Emergency Situations**

**Protocol Issues**:

- Emergency pause activated
- Smart contract vulnerabilities discovered
- Governance attacks or exploits

**Market Stress**:

- Extreme market volatility
- Liquidity pool attacks
- Cross-chain bridge issues

**Personal Emergencies**:

- Urgent liquidity needs
- Portfolio rebalancing requirements
- Risk tolerance changes

### Emergency Procedures

**Immediate Actions**:

1. **Assess Situation**: Understand the emergency type
2. **Check Protocols**: Verify contract status
3. **Evaluate Options**: Compare all available exit methods
4. **Execute**: Choose fastest safe exit route
5. **Document**: Keep records for insurance/tax purposes

**Emergency Contacts**:

- **Discord**: Real-time community support
- **Telegram**: Rapid response channel
- **Twitter**: Official announcements
- **Email**: [emergency@urstake.com](mailto:emergency@urstake.com)

## Monitoring & Analytics

### 📈 **Unstaking Analytics**

**Track Key Metrics**:

```javascript
// Example tracking
const trackingMetrics = {
  exchangeRate: 1.05, // Current stAPT → APT rate
  dexRate: 1.049, // DEX trading rate
  premium: -0.1, // Discount/premium %
  liquidity: 2800000, // Pool liquidity in USD
  volume24h: 450000, // 24h trading volume
  slippage: 0.05, // Expected slippage %
};
```

**Historical Analysis**:

- Track exchange rate trends
- Monitor premium/discount patterns
- Analyze optimal unstaking windows
- Compare costs across methods

### 🎯 **Performance Optimization**

**Unstaking Efficiency**:

- **Batch Operations**: Combine multiple unstakes
- **Gas Optimization**: Trade during low-usage periods
- **Route Optimization**: Find best DEX routes
- **Timing Analysis**: Identify optimal unstaking windows

## Troubleshooting

### Common Issues

**"Insufficient Liquidity" Error**:

- **Cause**: Large trade exceeds pool depth
- **Solution**: Reduce trade size or use direct unstaking
- **Prevention**: Check pool TVL before trading

**"Transaction Failed" Errors**:

- **Gas Issues**: Increase gas limit/price
- **Slippage**: Increase slippage tolerance
- **Network**: Wait for network congestion to clear

**Unexpected Exchange Rate**:

- **DEX Premium/Discount**: Normal market dynamics
- **Old Data**: Refresh interface for current rates
- **Oracle Issues**: Check if price feeds are stale

### Support Resources

**Self-Help**:

- **FAQ**: Common questions and answers
- **Video Tutorials**: Step-by-step unstaking guides
- **Documentation**: Technical implementation details

**Community Support**:

- **Discord**: Real-time help from community
- **Forum**: Detailed discussions and solutions
- **Telegram**: Quick questions and updates

**Professional Support**:

- **Email**: [support@urstake.com](mailto:support@urstake.com)
- **Priority Support**: Available for large holders
- **Technical Support**: Integration and API help

---

**Need help unstaking?** Join our [Discord community](https://discord.gg/urstake) or contact [support@urstake.com](mailto:support@urstake.com) for assistance.
