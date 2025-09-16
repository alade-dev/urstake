---
sidebar_position: 1
---

# Frequently Asked Questions

Get answers to the most common questions about UrStake's liquid staking protocol.

## General Questions

### What is UrStake?

UrStake is a liquid staking protocol on Aptos that allows you to stake your APT and USDC tokens while maintaining liquidity through liquid staking tokens (stAPT and stUSDC). You can earn yield on your staked assets while still being able to trade, lend, or use them in other DeFi protocols.

### How does liquid staking work?

When you stake assets with UrStake:

1. You deposit APT or USDC into our smart contracts
2. You receive liquid staking tokens (stAPT or stUSDC) in return
3. Your assets earn rewards through optimized staking strategies
4. The value of your liquid tokens increases over time as rewards compound
5. You can trade, lend, or use your liquid tokens anytime without unstaking

### What are the current yields?

**Current APY** (as of latest update):

- **APT Staking**: 8.00%+ APY
- **USDC Staking**: 12.00%+ APY

Yields fluctuate based on network conditions, validator performance, and yield optimization strategies. Check our dashboard for real-time rates.

### Is UrStake safe?

Yes, UrStake prioritizes security through:

- ✅ Multiple security audits by top firms (Trail of Bits, Consensys Diligence, Halborn)
- ✅ Bug bounty program with up to $500K rewards
- ✅ Multi-signature controls for critical operations
- ✅ Insurance coverage for smart contract risks
- ✅ Open-source, auditable smart contracts

## Staking Questions

### What is the minimum amount I can stake?

**Minimum Staking Amounts**:

- **APT**: 1 APT minimum
- **USDC**: 10 USDC minimum

There are no maximum limits for staking.

### How long does it take to start earning rewards?

Rewards start accruing immediately after your staking transaction is confirmed. For APT staking, rewards begin with the next epoch (typically within 2 hours). For USDC staking, rewards start compounding daily.

### Can I stake fractional amounts?

Yes! You can stake fractional amounts:

- **APT**: Up to 8 decimal places (0.00000001 APT minimum)
- **USDC**: Up to 6 decimal places (0.000001 USDC minimum)

### What happens to my staked tokens?

When you stake:

- **APT**: Delegated to high-performing validators chosen by our algorithm
- **USDC**: Deployed across optimized yield strategies including lending, arbitrage, and treasury management
- Your assets remain in your control through liquid staking tokens
- All strategies are transparent and auditable

### How often are rewards distributed?

**Reward Distribution**:

- **APT Staking**: Rewards compound automatically each epoch (~2 hours)
- **USDC Staking**: Rewards compound daily
- No manual claiming required - rewards are built into token value appreciation

## Liquid Tokens

### What are stAPT and stUSDC?

**stAPT** and **stUSDC** are liquid staking tokens that represent your staked assets:

- **1:1 Backing**: Each token is backed by the underlying asset plus earned rewards
- **Appreciating Value**: Token value increases as rewards compound
- **Full Liquidity**: Trade, lend, or use in DeFi protocols anytime
- **Composability**: Compatible with all major Aptos DeFi protocols

### How do I check my liquid token value?

**Current Exchange Rates**:

- Visit [urstake.vercel.app](https://urstake.vercel.app) for real-time rates
- Use our API endpoint: `GET /api/v1/exchange-rates`
- Check your wallet - many wallets show USD values automatically

**Calculation Example**:

```
If you have 100 stAPT and the exchange rate is 1.05:
Your underlying APT value = 100 × 1.05 = 105 APT
```

### Can I trade liquid tokens on exchanges?

Yes! stAPT and stUSDC are tradeable on:

- **PancakeSwap**: Main liquidity pairs
- **Thala Finance**: Integrated stablecoin pools
- **Tsunami Finance**: Cross-chain trading
- **Other DEXs**: As integrations expand

Trading liquid tokens gives you instant liquidity without the unstaking waiting period.

### Do liquid tokens have any special properties?

**Key Properties**:

- ✅ **Standard Token**: Full compatibility with wallets and dApps
- ✅ **Appreciating Value**: Exchange rate increases with earned rewards
- ✅ **No Lock-up**: Use anytime without restrictions
- ✅ **Composable**: Integrate with any DeFi protocol
- ✅ **Gas Efficient**: Optimized for low transaction costs

## Unstaking Questions

### How do I unstake my tokens?

**Two Options**:

1. **Instant Unstaking** (Recommended):

   - Trade stAPT/stUSDC on DEXs for immediate liquidity
   - Usually 0.1-0.5% trading cost
   - Available 24/7

2. **Direct Unstaking**:
   - Exchange through UrStake protocol
   - APT: 7-day unbonding period
   - USDC: Usually instant, up to 24h during high volume
   - No trading fees

### Why is there an unbonding period for APT?

The 7-day unbonding period for APT is a network requirement, not a UrStake limitation. This is how Aptos staking works - when you unstake APT from validators, there's always a 7-day waiting period before you can access your tokens.

**Avoid the wait**: Trade stAPT on DEXs for instant liquidity!

### What are the fees for unstaking?

**Fee Structure**:

- **Unstaking Fee**: 0% (no protocol fee for unstaking)
- **Trading Fees**: 0.25-0.30% on DEXs for instant unstaking
- **Gas Costs**: ~0.01-0.02 APT per transaction

### Can I unstake partial amounts?

Yes! You can unstake any amount:

- **No minimum**: Unstake as little as 0.000001 tokens
- **No maximum**: Unstake your entire position if desired
- **Flexible**: Multiple partial unstaking transactions allowed

## Fees and Economics

### What fees does UrStake charge?

**Fee Structure**:

- **Staking Fee**: 0% (free to stake)
- **Performance Fee**: 10% of rewards earned (APT), 15% of yield earned (USDC)
- **Unstaking Fee**: 0% (free to unstake)
- **Management Fee**: 0% (no annual management fee)

**Example**:

```
Stake 1000 USDC earning 12% APY:
Gross yield: 120 USDC
Performance fee: 18 USDC (15%)
Net yield: 102 USDC (10.2% net APY)
```

### How do fees get collected?

Fees are automatically deducted from earned rewards before they're distributed to users. You'll never see a separate fee transaction - the performance fee is simply reflected in the net yield you receive.

### Are there any hidden fees?

No hidden fees! All fees are:

- ✅ Clearly disclosed in documentation
- ✅ Shown in the UI before staking
- ✅ Automatically calculated and deducted
- ✅ Transparently tracked on-chain

The only additional costs are standard Aptos network gas fees (~0.01-0.02 APT per transaction).

## Technical Questions

### Which wallets are supported?

**Fully Supported Wallets**:

- ✅ **Petra**: Official Aptos wallet with full UrStake integration
- ✅ **Martian**: Popular Aptos wallet with staking support
- ✅ **Pontem**: Feature-rich wallet with DeFi focus
- ✅ **Fewcha**: Mobile-first Aptos wallet
- ✅ **SafePal**: Hardware wallet support
- ✅ **Ledger**: Hardware wallet integration

### What networks does UrStake support?

**Current Networks**:

- ✅ **Aptos Mainnet**: Full production deployment
- ✅ **Aptos Testnet**: Testing and development

**Coming Soon**:

- 🔄 **Ethereum**: Cross-chain expansion (Q3 2024)
- 🔄 **Polygon**: Multi-chain support (Q4 2024)
- 🔄 **Arbitrum**: Layer 2 integration (Q4 2024)

### How can I integrate UrStake into my dApp?

**Integration Options**:

- 📚 **Smart Contracts**: Direct Move contract integration
- 🛠️ **SDK**: TypeScript/JavaScript, Python, Rust, Go SDKs
- 🔌 **API**: RESTful API for off-chain applications
- 🎨 **UI Components**: Pre-built React components

Check our [Developer Documentation](/docs/developer) for detailed integration guides.

### Is there an API available?

Yes! UrStake provides a comprehensive REST API:

**Base URL**: `https://api.urstake.com/v1`

**Key Endpoints**:

- `GET /exchange-rates` - Current staking rates
- `GET /users/{address}/positions` - User portfolio
- `GET /protocol/stats` - Protocol statistics
- `GET /market/pools` - Liquidity pool data

Full API documentation available at [docs.urstake.com/api](/docs/developer/api-reference).

## Troubleshooting

### My transaction failed. What should I do?

**Common Solutions**:

1. **Check Gas Balance**: Ensure you have enough APT for gas fees (~0.02 APT)
2. **Verify Amounts**: Make sure you're not trying to stake more than your balance
3. **Network Issues**: Wait a few minutes and try again during network congestion
4. **Refresh Interface**: Clear cache or refresh the page
5. **Try Different Gas**: Increase gas limit if transaction keeps failing

### I don't see my liquid tokens in my wallet

**Solutions**:

1. **Add Token Manually**:

   - stAPT Contract: `0x...` (check docs for current address)
   - stUSDC Contract: `0x...` (check docs for current address)

2. **Refresh Wallet**: Close and reopen your wallet application
3. **Check Network**: Ensure you're connected to Aptos Mainnet
4. **Transaction Status**: Verify your staking transaction was confirmed

### The exchange rate seems wrong

**Verification Steps**:

1. **Check Official Sources**: Visit [urstake.vercel.app](https://urstake.vercel.app) for current rates
2. **Compare Multiple Sources**: Check DEX prices vs protocol rates
3. **Time Delay**: Exchange rates update every epoch (~2 hours for APT)
4. **Market Conditions**: Premium/discount vs protocol rate is normal

### I'm getting slippage errors on DEX trades

**Solutions**:

1. **Increase Slippage**: Set slippage tolerance to 0.5-1.0%
2. **Reduce Trade Size**: Large trades may exceed pool liquidity
3. **Check Pool Depth**: Verify sufficient liquidity in trading pools
4. **Try Different DEX**: Some DEXs have deeper liquidity
5. **Use Direct Unstaking**: For large amounts, consider protocol unstaking

## Governance

### How does UrStake governance work?

UrStake uses a **token-based governance system**:

- **Governance Token**: UR tokens for voting
- **Proposal Process**: Community-driven proposals
- **Voting Power**: Based on UR token holdings
- **Execution**: Automatic execution of passed proposals

### How do I participate in governance?

**Steps to Participate**:

1. **Earn UR Tokens**: Stake APT/USDC to earn UR rewards
2. **Access Governance**: Visit [gov.urstake.com](https://gov.urstake.com)
3. **Review Proposals**: Read active proposals and discussions
4. **Vote**: Cast your votes on proposals
5. **Delegate**: Or delegate voting power to trusted community members

### What can governance control?

**Governance Powers**:

- ✅ Protocol parameter changes (fees, limits)
- ✅ Yield strategy modifications
- ✅ Treasury fund allocation
- ✅ New feature proposals
- ✅ Emergency response procedures
- ❌ Individual user fund access (never possible)

## Support

### How can I get help?

**Support Channels**:

- 💬 **Discord**: [discord.gg/urstake](https://discord.gg/urstake) - Real-time community support
- 📧 **Email**: [support@urstake.com](mailto:support@urstake.com) - Direct support team
- 📚 **Documentation**: [docs.urstake.com](https://docs.urstake.com) - Comprehensive guides
- 🐦 **Twitter**: [@UrStake](https://twitter.com/UrStake) - Updates and announcements

### What information should I include when asking for help?

**Helpful Information**:

- 🔍 **Transaction Hash**: If related to a specific transaction
- 📱 **Wallet Type**: Which wallet you're using
- 🌐 **Browser/OS**: Technical environment details
- 📸 **Screenshots**: Visual representation of the issue
- 📝 **Error Messages**: Exact text of any error messages
- 🎯 **Expected vs Actual**: What you expected vs what happened

### Is there a mobile app?

**Mobile Access**:

- 📱 **Web App**: Mobile-optimized web interface works on all devices
- 📲 **Native App**: iOS and Android apps coming Q3 2024
- 💼 **Wallet Integration**: Use through supported mobile wallets
- 🔗 **DeFi Browsers**: Access through wallet-integrated browsers

## Legal and Compliance

### Is UrStake regulated?

UrStake operates as a **decentralized protocol**:

- 🏛️ **Decentralized**: No central authority controls the protocol
- 🌍 **Global**: Available to users worldwide (subject to local laws)
- ⚖️ **Compliance**: Users responsible for local regulatory compliance
- 🔒 **Non-Custodial**: You maintain control of your assets

### What are the tax implications?

**General Guidance** (consult tax professionals):

- 📊 **Staking Rewards**: May be taxable as income when earned
- 💱 **Token Trading**: Trading liquid tokens may trigger capital gains
- 📈 **Yield Recognition**: Timing of tax recognition varies by jurisdiction
- 📚 **Record Keeping**: Keep detailed records of all transactions

**Important**: Tax laws vary by jurisdiction. Consult with qualified tax professionals for advice specific to your situation.

### Are there geographic restrictions?

UrStake is a **permissionless protocol** available globally, but:

- 🌐 **Protocol Access**: Smart contracts are accessible worldwide
- 🖥️ **UI Restrictions**: Web interface may be restricted in some jurisdictions
- ⚖️ **Local Laws**: Users must comply with local regulations
- 🚫 **Sanctions**: Sanctioned addresses are blocked

---

**Still have questions?** Join our [Discord community](https://discord.gg/urstake) for real-time support or email us at [support@urstake.com](mailto:support@urstake.com)!
