---
sidebar_position: 2
---

# Troubleshooting Guide

Step-by-step solutions for common issues when using UrStake's liquid staking protocol.

## Transaction Issues

### Transaction Failed with "Insufficient Funds"

**Problem**: Your transaction failed with an insufficient funds error.

**Solution Steps**:

1. **Check APT Balance for Gas**:

   ```
   Minimum Required: 0.02 APT for gas fees
   Recommended: Keep 0.1 APT in wallet for multiple transactions
   ```

2. **Verify Staking Amount**:

   - Ensure you're not trying to stake more than your available balance
   - Account for gas fees when calculating maximum stake amount
   - For APT: Keep at least 0.1 APT for gas
   - For USDC: Ensure you have exact USDC amount plus APT for gas

3. **Check Token Approvals**:
   ```typescript
   // If using USDC, ensure token is approved for staking
   // This is usually handled automatically by the UI
   ```

**Prevention**:

- Always keep extra APT for gas fees
- Use the "Max" button in UI which automatically accounts for gas
- Monitor your balances before large transactions

### Transaction Stuck in "Pending" Status

**Problem**: Your transaction has been pending for more than 10 minutes.

**Diagnosis**:

1. **Check Transaction Status**:

   - Copy transaction hash from wallet
   - Visit [Aptos Explorer](https://explorer.aptoslabs.com)
   - Search for your transaction hash

2. **Network Congestion Check**:
   - High gas prices indicate network congestion
   - Normal gas: 0.001-0.01 APT
   - Congested network: 0.02+ APT

**Solutions**:

**If Transaction is Confirmed**:

- Refresh your wallet interface
- Clear browser cache and reload page
- Disconnect and reconnect wallet

**If Transaction Failed**:

- Check failure reason on explorer
- Retry transaction with higher gas limit
- Ensure sufficient balance for gas + amount

**If Transaction Still Pending**:

- Wait for network congestion to clear (usually less than 30 minutes)
- Try submitting a new transaction with higher gas
- Cancel transaction in wallet if supported

### "Slippage Tolerance Exceeded" Error

**Problem**: DEX trades failing due to slippage when trading liquid tokens.

**Understanding Slippage**:

```
Slippage = (Executed Price - Expected Price) / Expected Price

Example:
Expected: 1 stAPT = 1.050 APT
Executed: 1 stAPT = 1.045 APT
Slippage: (1.045 - 1.050) / 1.050 = -0.48%
```

**Solutions**:

1. **Increase Slippage Tolerance**:

   ```
   Small trades (<$1,000): 0.1-0.3%
   Medium trades ($1,000-$10,000): 0.3-0.5%
   Large trades (>$10,000): 0.5-1.0%
   ```

2. **Check Pool Liquidity**:

   - Visit DEX to check available liquidity
   - stAPT/APT pool TVL should be >$1M for large trades
   - Consider splitting large trades into smaller chunks

3. **Try Different DEX**:

   - **PancakeSwap**: Usually deepest liquidity
   - **Thala**: Good for stablecoin pairs
   - **Alternative pools**: Check multiple DEXs

4. **Use Direct Unstaking**:
   - For large amounts, consider protocol unstaking
   - No slippage but may have time delays
   - Better rates for very large amounts

## Wallet Connection Issues

### Wallet Won't Connect

**Problem**: UrStake interface won't connect to your wallet.

**Solutions by Wallet Type**:

**Petra Wallet**:

1. Ensure Petra extension is installed and updated
2. Unlock wallet if locked
3. Switch to Aptos Mainnet in wallet settings
4. Clear browser cache and try again
5. Disable other wallet extensions temporarily

**Martian Wallet**:

1. Update to latest Martian version
2. Check network selection (should be Aptos Mainnet)
3. Refresh page and retry connection
4. Try connecting in incognito/private browsing mode

**Hardware Wallets (Ledger)**:

1. Ensure Ledger is connected and Aptos app is open
2. Enable "Blind Signing" in Ledger Aptos app settings
3. Use latest firmware on Ledger device
4. Try different USB port/cable

**General Solutions**:

```typescript
// Clear wallet connection cache
localStorage.removeItem("wallet-adapter");
sessionStorage.clear();

// Disable browser extensions
// Temporarily disable ad blockers and privacy extensions
```

### Wallet Shows Wrong Network

**Problem**: Your wallet is connected to testnet instead of mainnet.

**Solution**:

1. **Open Wallet Settings**
2. **Select Network**: Choose "Aptos Mainnet"
3. **Refresh Page**: Reload UrStake interface
4. **Reconnect**: Click connect wallet again

**Network Details**:

```
Mainnet:
- Network Name: Aptos Mainnet
- RPC URL: https://fullnode.mainnet.aptoslabs.com
- Chain ID: 1

Testnet (for testing only):
- Network Name: Aptos Testnet
- RPC URL: https://fullnode.testnet.aptoslabs.com
- Chain ID: 2
```

### Wallet Balance Shows Zero

**Problem**: Wallet shows zero balance but you know you have tokens.

**Diagnosis Steps**:

1. **Check on Explorer**:

   - Copy your wallet address
   - Visit [Aptos Explorer](https://explorer.aptoslabs.com)
   - Search for your address
   - Verify actual balance

2. **Network Verification**:

   - Ensure wallet is on Aptos Mainnet
   - Check if you're looking at testnet balances

3. **Token Visibility**:
   - Some wallets don't auto-detect all tokens
   - Manually add token addresses if needed

**Solutions**:

**If Explorer Shows Balance**:

- Refresh wallet interface
- Switch networks and switch back
- Logout and login to wallet again

**If Explorer Shows Zero**:

- Verify you're checking correct address
- Check if funds are on different network
- Contact wallet support if funds are missing

**Add Tokens Manually**:

```
stAPT Contract: 0x... (check docs for current address)
stUSDC Contract: 0x... (check docs for current address)
```

## Liquid Token Issues

### Liquid Tokens Not Showing in Wallet

**Problem**: After staking, you don't see stAPT or stUSDC tokens in your wallet.

**Solutions**:

1. **Add Tokens Manually**:

   **For Petra Wallet**:

   - Click "Manage Coins"
   - Click "Add Custom Coin"
   - Enter contract address
   - stAPT: `0x...` (check docs)
   - stUSDC: `0x...` (check docs)

   **For Martian Wallet**:

   - Go to Assets tab
   - Click "Add Token"
   - Enter contract address and details

2. **Verify Transaction Success**:

   - Check transaction hash on explorer
   - Ensure transaction status is "Success"
   - Look for mint events in transaction details

3. **Refresh Wallet**:

   ```typescript
   // Manual refresh methods
   1. Close and reopen wallet
   2. Switch networks and switch back
   3. Clear wallet cache if available
   ```

4. **Wait for Indexing**:
   - Sometimes takes 1-2 minutes for tokens to appear
   - Especially during network congestion

### Exchange Rate Seems Incorrect

**Problem**: The exchange rate for liquid tokens doesn't match your expectations.

**Understanding Exchange Rates**:

```javascript
// Exchange rates increase over time as rewards compound
Example APT Staking:
Day 1: 1 stAPT = 1.000 APT (initial)
Day 30: 1 stAPT = 1.020 APT (2% rewards)
Day 365: 1 stAPT = 1.080 APT (8% annual rewards)
```

**Verification Steps**:

1. **Check Official Rate**:

   - Visit [urstake.vercel.app](https://urstake.vercel.app)
   - Compare with rate shown in your interface
   - Official rate is the source of truth

2. **API Verification**:

   ```bash
   curl https://api.urstake.com/v1/exchange-rates
   ```

3. **DEX Rate Comparison**:
   - Check trading rates on PancakeSwap/Thala
   - DEX rates may differ slightly due to supply/demand
   - Premium/discount of ±0.5% is normal

**Rate Update Frequency**:

- **APT**: Updates every epoch (~2 hours)
- **USDC**: Updates daily
- **UI**: May cache rates for up to 5 minutes

### Cannot Trade Liquid Tokens on DEX

**Problem**: DEX interface won't let you trade stAPT or stUSDC.

**Solutions**:

1. **Check Token Recognition**:

   - Ensure DEX recognizes liquid tokens
   - Try importing token manually using contract address
   - Verify you're on supported DEX

2. **Supported DEXs**:

   ```
   ✅ PancakeSwap: Full stAPT/stUSDC support
   ✅ Thala Finance: Integrated stablecoin pairs
   ✅ Tsunami Finance: Cross-chain support
   ❌ Other DEXs: May not have liquidity pools
   ```

3. **Liquidity Check**:

   - Ensure trading pair has sufficient liquidity
   - Minimum $100K TVL recommended for smooth trading
   - Check 24h volume for pair activity

4. **Slippage Settings**:
   - Set appropriate slippage tolerance
   - Start with 0.5% and increase if needed
   - Large trades may require higher slippage

## Interface Issues

### Page Won't Load or Shows Error

**Problem**: UrStake interface won't load or shows constant errors.

**Browser-Specific Solutions**:

**Chrome/Brave**:

```
1. Clear cache: Ctrl+Shift+Delete
2. Disable ad blockers temporarily
3. Check if extensions are blocking requests
4. Try incognito mode
5. Hard refresh: Ctrl+Shift+R
```

**Firefox**:

```
1. Clear cache and cookies
2. Disable tracking protection for site
3. Check if privacy extensions are blocking
4. Try private browsing mode
```

**Safari**:

```
1. Clear website data
2. Disable content blockers
3. Check privacy settings
4. Try with different user profile
```

**General Solutions**:

1. **Check Internet Connection**:

   - Verify stable internet connection
   - Try accessing other websites
   - Check if VPN is causing issues

2. **Browser Updates**:

   - Ensure browser is updated to latest version
   - Clear all browsing data
   - Restart browser completely

3. **Alternative Access**:
   - Try different browser
   - Use mobile device
   - Check if issue is device-specific

### UI Shows Outdated Information

**Problem**: Interface shows old balances, rates, or transaction history.

**Refresh Solutions**:

1. **Force Refresh**:

   ```
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (Mac)
   - Or Ctrl+F5
   ```

2. **Clear Cache**:

   ```typescript
   // In browser console:
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```

3. **Disconnect/Reconnect Wallet**:

   - Click disconnect in UrStake interface
   - Refresh page
   - Reconnect wallet

4. **Check Network Status**:
   - Visit [status.urstake.com](https://status.urstake.com)
   - Check for ongoing maintenance
   - Verify API service status

### Mobile Interface Issues

**Problem**: UrStake doesn't work properly on mobile devices.

**Mobile-Specific Solutions**:

1. **Supported Mobile Wallets**:

   ```
   ✅ Petra Mobile: Full support
   ✅ Martian Mobile: Full support
   ✅ Pontem Mobile: Full support
   ❌ Desktop-only wallets won't work
   ```

2. **Mobile Browser Settings**:

   - Enable JavaScript
   - Allow pop-ups for urstake.vercel.app
   - Disable data saver mode
   - Use latest browser version

3. **Connection Issues**:

   - Use wallet's built-in browser
   - Or connect via WalletConnect if supported
   - Ensure stable WiFi/cellular connection

4. **Screen Size Issues**:
   - Rotate to landscape for better view
   - Zoom out if interface is cut off
   - Use native app when available (coming Q3 2024)

## Performance Issues

### Slow Loading Times

**Problem**: UrStake interface loads very slowly.

**Optimization Steps**:

1. **Connection Speed**:

   - Test internet speed at [speedtest.net](https://speedtest.net)
   - Minimum recommended: 10 Mbps download
   - Switch to faster connection if available

2. **Browser Optimization**:

   ```
   - Close unused tabs
   - Disable unnecessary extensions
   - Clear browser cache
   - Restart browser
   - Update to latest version
   ```

3. **Network Issues**:

   - Try different DNS servers (8.8.8.8, 1.1.1.1)
   - Disable VPN temporarily
   - Check firewall settings
   - Try mobile hotspot as alternative

4. **Regional Issues**:
   - Use CDN-optimized regions
   - Try accessing during off-peak hours
   - Contact support if persistent regional issues

### High Gas Fees

**Problem**: Transaction gas fees seem unusually high.

**Understanding Gas Costs**:

```
Normal Gas Costs:
- Simple stake/unstake: 0.001-0.005 APT
- Complex operations: 0.005-0.02 APT
- Network congestion: 0.02-0.05 APT

When to worry:
- Gas >0.1 APT for simple operations
- Consistently high gas across all transactions
```

**Gas Optimization**:

1. **Timing Strategies**:

   - Avoid peak usage hours (US/Asia daytime)
   - Weekends typically have lower gas
   - Early morning UTC often cheapest

2. **Transaction Batching**:

   - Combine multiple operations when possible
   - Stake larger amounts less frequently
   - Use efficient transaction types

3. **Network Monitoring**:
   - Check [Aptos Status](https://status.aptoslabs.com)
   - Monitor gas prices before transactions
   - Wait for congestion to clear if not urgent

## Error Messages

### "Protocol Paused" Error

**Problem**: Getting "Protocol is currently paused" error.

**What This Means**:

- UrStake has temporarily paused operations
- Usually for emergency maintenance or security
- User funds remain safe during pause

**Actions to Take**:

1. **Check Official Channels**:

   - Twitter: [@UrStake](https://twitter.com/UrStake)
   - Discord: [discord.gg/urstake](https://discord.gg/urstake)
   - Status page: [status.urstake.com](https://status.urstake.com)

2. **What's Still Available**:

   - ✅ View portfolio balances
   - ✅ Trade liquid tokens on DEXs
   - ✅ Transfer liquid tokens
   - ❌ New staking operations
   - ❌ Direct unstaking through protocol

3. **During Pause Period**:
   - Your assets continue earning rewards
   - Exchange rates continue updating
   - You can still access your funds via DEX trading

### "Invalid Amount" Error

**Problem**: Getting errors when trying to stake specific amounts.

**Common Causes & Solutions**:

1. **Below Minimum**:

   ```
   Error: Amount below minimum stake
   Solution:
   - APT: Stake at least 1 APT
   - USDC: Stake at least 10 USDC
   ```

2. **Decimal Places**:

   ```
   Error: Too many decimal places
   Solution:
   - APT: Max 8 decimal places
   - USDC: Max 6 decimal places
   ```

3. **Insufficient Balance**:

   ```
   Error: Amount exceeds balance
   Solution:
   - Check available balance
   - Account for gas fees (keep 0.1 APT)
   - Use "Max" button for automatic calculation
   ```

4. **Invalid Characters**:
   ```
   Error: Invalid number format
   Solution:
   - Use only numbers and decimal point
   - No commas, spaces, or other characters
   - Example: "100.5" not "100,500"
   ```

### "Network Error" Messages

**Problem**: Frequent network or connection errors.

**Diagnosis**:

1. **Check Network Status**:

   - Aptos network: [status.aptoslabs.com](https://status.aptoslabs.com)
   - UrStake status: [status.urstake.com](https://status.urstake.com)

2. **RPC Issues**:

   ```typescript
   // Try different RPC endpoints
   Mainnet alternatives:
   - https://fullnode.mainnet.aptoslabs.com
   - https://aptos-mainnet.pontem.network
   - https://rpc.ankr.com/http/aptos/v1
   ```

3. **Local Network**:
   - Test internet connectivity
   - Try different network (mobile hotspot)
   - Disable VPN/proxy temporarily

**Solutions**:

1. **Wallet RPC Settings**:

   - Update wallet to latest version
   - Try changing RPC endpoint in wallet settings
   - Clear wallet cache if available

2. **Browser Solutions**:

   - Try different browser
   - Disable browser extensions
   - Clear DNS cache

3. **Persistent Issues**:
   - Contact support with specific error messages
   - Provide network diagnostics information
   - Include transaction hashes if available

## Getting Additional Help

### When to Contact Support

**Contact Support If**:

- ✅ Funds appear to be missing after confirmed transaction
- ✅ Persistent technical issues not covered in this guide
- ✅ Interface completely broken or inaccessible
- ✅ Suspected security issues
- ✅ Questions about specific transactions

**Try Self-Help First For**:

- ❌ General questions answered in FAQ
- ❌ Market-related questions (exchange rates, yields)
- ❌ Basic wallet connection issues
- ❌ Common error messages covered above

### Support Information to Provide

**Essential Information**:

```
1. Wallet address (never share private keys)
2. Transaction hash (if applicable)
3. Browser and version
4. Wallet type and version
5. Exact error message
6. Steps to reproduce the issue
7. Screenshots of the problem
```

**Support Channels**:

- 📧 **Email**: [support@urstake.com](mailto:support@urstake.com)
- 💬 **Discord**: [discord.gg/urstake](https://discord.gg/urstake) #support channel
- 🐦 **Twitter**: [@UrStakeSupport](https://twitter.com/UrStakeSupport)

### Emergency Situations

**If You Suspect**:

- Wallet compromise
- Unauthorized transactions
- Security breaches
- Smart contract issues

**Immediate Actions**:

1. **Secure Your Wallet**:

   - Disconnect from all dApps
   - Transfer funds to secure wallet if possible
   - Change wallet passwords

2. **Contact Emergency Support**:

   - Email: [emergency@urstake.com](mailto:emergency@urstake.com)
   - Discord: Mention @security-team
   - Include all relevant transaction details

3. **Documentation**:
   - Screenshot all evidence
   - Record transaction hashes
   - Note exact timestamps
   - Preserve error messages

---

**Still experiencing issues?** Our support team is here to help! Join our [Discord community](https://discord.gg/urstake) or email [support@urstake.com](mailto:support@urstake.com) for personalized assistance.
