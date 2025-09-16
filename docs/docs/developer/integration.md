---
sidebar_position: 3
---

# Integration Guide

Learn how to integrate UrStake's liquid staking protocol into your DeFi application, wallet, or platform.

## Integration Overview

UrStake provides multiple integration methods to suit different use cases:

- **Smart Contract Integration**: Direct on-chain integration with Move contracts
- **SDK Integration**: Use our TypeScript/JavaScript or Python SDKs
- **API Integration**: REST API for off-chain applications
- **Widget Integration**: Drop-in UI components for web applications

## Quick Start Integration

### 1. Web Application (React/TypeScript)

#### Installation
```bash
npm install @urstake/sdk @urstake/react-components
```

#### Basic Setup
```typescript
import { UrStakeProvider } from '@urstake/react-components';
import { UrStakeSDK } from '@urstake/sdk';

const sdk = new UrStakeSDK({
  network: 'mainnet',
  rpcUrl: 'https://fullnode.mainnet.aptoslabs.com'
});

function App() {
  return (
    <UrStakeProvider sdk={sdk}>
      <YourApp />
    </UrStakeProvider>
  );
}
```

#### Staking Component
```typescript
import { StakingWidget } from '@urstake/react-components';

function StakingPage() {
  const handleStakeComplete = (result) => {
    console.log('Stake completed:', result);
  };

  return (
    <StakingWidget
      asset="APT"
      onStakeComplete={handleStakeComplete}
      theme="dark"
    />
  );
}
```

### 2. Mobile Application (React Native)

#### Installation
```bash
npm install @urstake/react-native-sdk
```

#### Setup
```typescript
import { UrStakeSDK } from '@urstake/react-native-sdk';

const sdk = new UrStakeSDK({
  network: 'mainnet',
  walletAdapter: 'petra' // or 'martian', 'pontem'
});

// Initialize wallet connection
await sdk.connectWallet();

// Stake tokens
const result = await sdk.stakeAPT('100');
```

## Smart Contract Integration

### Direct Contract Calls

#### Setup Contract Interface
```rust
module integration_example::urstake_integration {
    use urstake::core;
    use urstake::stapt_token;
    
    public entry fun stake_for_user(
        user: &signer,
        amount: u64
    ) {
        // Stake APT and receive stAPT
        core::stake_apt(user, amount);
    }
    
    public fun get_user_stapt_balance(user_addr: address): u64 {
        stapt_token::balance(user_addr)
    }
}
```

#### Integration Patterns

**Collateral Integration**:
```rust
module lending_protocol::collateral {
    use urstake::stapt_token;
    use urstake::core;
    
    public fun accept_stapt_collateral(
        user: &signer,
        amount: u64
    ): u64 {
        // Get current exchange rate
        let (total_apt, total_stapt) = core::get_exchange_rate();
        let apt_value = (amount * total_apt) / total_stapt;
        
        // Apply LTV ratio (e.g., 80%)
        let collateral_value = (apt_value * 80) / 100;
        
        // Transfer stAPT to protocol
        stapt_token::transfer(user, @lending_protocol, amount);
        
        collateral_value
    }
}
```

**Yield Farming Integration**:
```rust
module yield_farm::stapt_farm {
    use urstake::stapt_token;
    
    struct FarmPosition has key {
        stapt_amount: u64,
        reward_debt: u64,
        last_update: u64,
    }
    
    public entry fun deposit_stapt(
        user: &signer,
        amount: u64
    ) acquires FarmPosition {
        // Accept stAPT deposits for yield farming
        stapt_token::transfer(user, @yield_farm, amount);
        
        // Update user position
        let user_addr = signer::address_of(user);
        if (exists<FarmPosition>(user_addr)) {
            let position = borrow_global_mut<FarmPosition>(user_addr);
            position.stapt_amount = position.stapt_amount + amount;
        } else {
            move_to(user, FarmPosition {
                stapt_amount: amount,
                reward_debt: 0,
                last_update: timestamp::now_seconds(),
            });
        }
    }
}
```

## SDK Integration Examples

### TypeScript/JavaScript SDK

#### Portfolio Tracking
```typescript
import { UrStakeSDK } from '@urstake/sdk';

class PortfolioTracker {
  private sdk: UrStakeSDK;
  
  constructor() {
    this.sdk = new UrStakeSDK({ network: 'mainnet' });
  }
  
  async getUserPortfolio(address: string) {
    const positions = await this.sdk.getUserPositions(address);
    const exchangeRates = await this.sdk.getExchangeRates();
    
    return {
      totalValue: positions.totalValue,
      assets: positions.positions.map(pos => ({
        token: pos.asset,
        balance: pos.balance,
        value: pos.underlyingValue,
        apy: pos.currentAPY,
        pnl: pos.unrealizedGains
      }))
    };
  }
  
  async trackYieldPerformance(address: string, days: number = 30) {
    const history = await this.sdk.getTransactionHistory(address);
    const currentRates = await this.sdk.getExchangeRates();
    
    // Calculate yield performance over time
    let totalYield = 0;
    let initialValue = 0;
    
    for (const tx of history) {
      if (tx.type === 'stake') {
        initialValue += parseFloat(tx.amount);
      } else if (tx.type === 'unstake') {
        totalYield += parseFloat(tx.amount) - parseFloat(tx.sharesReceived);
      }
    }
    
    return {
      totalYield,
      yieldPercentage: (totalYield / initialValue) * 100,
      period: days
    };
  }
}
```

#### Automated Yield Optimization
```typescript
class YieldOptimizer {
  private sdk: UrStakeSDK;
  
  constructor() {
    this.sdk = new UrStakeSDK({ network: 'mainnet' });
  }
  
  async optimizeYield(account: AptosAccount) {
    const balances = await this.sdk.getBalances(account.address());
    const rates = await this.sdk.getExchangeRates();
    const pools = await this.sdk.getLiquidityPools();
    
    // Find best yield opportunities
    const opportunities = [
      {
        strategy: 'stake_apt',
        apy: parseFloat(rates.stAPT.apy),
        risk: 'low'
      },
      {
        strategy: 'stake_usdc',
        apy: parseFloat(rates.stUSDC.apy),
        risk: 'low'
      },
      ...pools.map(pool => ({
        strategy: `lp_${pool.pair}`,
        apy: parseFloat(pool.apy),
        risk: 'medium'
      }))
    ];
    
    // Sort by APY and execute best strategy
    opportunities.sort((a, b) => b.apy - a.apy);
    const bestStrategy = opportunities[0];
    
    if (bestStrategy.strategy === 'stake_apt' && balances.APT > 1) {
      return await this.sdk.stakeAPT(account, balances.APT.toString());
    }
    
    // Additional optimization logic...
  }
}
```

### Python Integration

#### Data Analytics
```python
import asyncio
from urstake import UrStakeClient
import pandas as pd
import numpy as np

class UrStakeAnalytics:
    def __init__(self):
        self.client = UrStakeClient(network='mainnet')
    
    async def analyze_yield_trends(self, days=90):
        """Analyze historical yield trends"""
        rates_history = await self.client.get_historical_rates(
            asset='stAPT', 
            period=f'{days}d'
        )
        
        df = pd.DataFrame(rates_history['data'])
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df['apy'] = df['apy'].astype(float)
        
        return {
            'mean_apy': df['apy'].mean(),
            'volatility': df['apy'].std(),
            'trend': np.polyfit(range(len(df)), df['apy'], 1)[0],
            'sharpe_ratio': df['apy'].mean() / df['apy'].std()
        }
    
    async def optimize_portfolio_allocation(self, total_value: float):
        """Suggest optimal allocation across assets"""
        rates = await self.client.get_exchange_rates()
        pools = await self.client.get_liquidity_pools()
        
        # Simple mean-variance optimization
        assets = [
            {
                'name': 'stAPT',
                'expected_return': float(rates['stAPT']['apy']) / 100,
                'risk': 0.15  # Estimated volatility
            },
            {
                'name': 'stUSDC',
                'expected_return': float(rates['stUSDC']['apy']) / 100,
                'risk': 0.05  # Lower volatility for stablecoin
            }
        ]
        
        # Add LP opportunities
        for pool in pools:
            assets.append({
                'name': pool['pair'],
                'expected_return': float(pool['apy']) / 100,
                'risk': 0.25  # Higher risk for LP positions
            })
        
        # Calculate optimal weights (simplified)
        weights = self._calculate_optimal_weights(assets)
        
        return {
            asset['name']: {
                'allocation': weight * total_value,
                'percentage': weight * 100
            }
            for asset, weight in zip(assets, weights)
        }
    
    def _calculate_optimal_weights(self, assets):
        """Simplified portfolio optimization"""
        returns = np.array([asset['expected_return'] for asset in assets])
        risks = np.array([asset['risk'] for asset in assets])
        
        # Simple inverse volatility weighting
        inv_vol = 1 / risks
        weights = inv_vol / inv_vol.sum()
        
        return weights
```

## Widget Integration

### Drop-in Staking Widget

#### HTML/JavaScript
```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.urstake.com/widget/v1/urstake-widget.js"></script>
</head>
<body>
    <div id="urstake-widget"></div>
    
    <script>
        UrStakeWidget.init({
            container: '#urstake-widget',
            network: 'mainnet',
            theme: 'dark',
            assets: ['APT', 'USDC'],
            onConnect: (wallet) => {
                console.log('Wallet connected:', wallet);
            },
            onStake: (result) => {
                console.log('Stake completed:', result);
            }
        });
    </script>
</body>
</html>
```

#### React Component
```typescript
import { UrStakeWidget } from '@urstake/react-components';

function MyDeFiApp() {
  return (
    <div className="app">
      <h1>My DeFi Platform</h1>
      
      <UrStakeWidget
        config={{
          theme: 'light',
          defaultAsset: 'APT',
          showAnalytics: true,
          customColors: {
            primary: '#4F46E5',
            secondary: '#6B7280'
          }
        }}
        onStakeComplete={(result) => {
          // Handle successful stake
          updateUserBalance(result);
        }}
        onError={(error) => {
          // Handle errors
          showErrorMessage(error.message);
        }}
      />
    </div>
  );
}
```

## API Integration

### RESTful Integration

#### Node.js Express Example
```javascript
const express = require('express');
const axios = require('axios');

const app = express();
const URSTAKE_API = 'https://api.urstake.com/v1';

// Proxy endpoint for getting user positions
app.get('/api/user/:address/positions', async (req, res) => {
  try {
    const { address } = req.params;
    const response = await axios.get(
      `${URSTAKE_API}/users/${address}/positions`
    );
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook for stake notifications
app.post('/webhooks/stake-completed', (req, res) => {
  const { userAddress, asset, amount, txHash } = req.body;
  
  // Process stake completion
  console.log(`User ${userAddress} staked ${amount} ${asset}`);
  
  // Update your database
  updateUserStakeRecord(userAddress, asset, amount, txHash);
  
  res.status(200).json({ received: true });
});

app.listen(3000);
```

#### Python FastAPI Example
```python
from fastapi import FastAPI, HTTPException
import httpx
from typing import Optional

app = FastAPI()
URSTAKE_API = "https://api.urstake.com/v1"

@app.get("/portfolio/{address}")
async def get_portfolio(address: str):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{URSTAKE_API}/users/{address}/positions"
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.get("/yield-comparison")
async def compare_yields():
    async with httpx.AsyncClient() as client:
        # Get UrStake rates
        urstake_response = await client.get(
            f"{URSTAKE_API}/protocol/exchange-rates"
        )
        
        # Compare with other protocols
        comparison = {
            "urstake": {
                "apt_apy": urstake_response.json()["stAPT"]["apy"],
                "usdc_apy": urstake_response.json()["stUSDC"]["apy"]
            },
            # Add other protocol comparisons
        }
        
        return comparison
```

## Wallet Integration

### Wallet Adapter
```typescript
interface WalletAdapter {
  connect(): Promise<string>; // Returns wallet address
  disconnect(): Promise<void>;
  signAndSubmitTransaction(transaction: any): Promise<string>; // Returns tx hash
}

class UrStakeWalletIntegration {
  private wallet: WalletAdapter;
  private sdk: UrStakeSDK;
  
  constructor(wallet: WalletAdapter) {
    this.wallet = wallet;
    this.sdk = new UrStakeSDK({ network: 'mainnet' });
  }
  
  async stakeWithWallet(asset: 'APT' | 'USDC', amount: string) {
    const address = await this.wallet.connect();
    
    // Build transaction
    const transaction = await this.sdk.buildStakeTransaction(
      address,
      asset,
      amount
    );
    
    // Sign and submit via wallet
    const txHash = await this.wallet.signAndSubmitTransaction(transaction);
    
    // Wait for confirmation
    await this.sdk.waitForTransaction(txHash);
    
    return txHash;
  }
}
```

### Multi-Wallet Support
```typescript
import { PetraWallet, MartianWallet, PontemWallet } from '@aptos-labs/wallet-adapter';

class MultiWalletUrStake {
  private supportedWallets = [
    new PetraWallet(),
    new MartianWallet(),
    new PontemWallet()
  ];
  
  async connectBestWallet(): Promise<WalletAdapter> {
    for (const wallet of this.supportedWallets) {
      try {
        if (await wallet.isAvailable()) {
          await wallet.connect();
          return wallet;
        }
      } catch (error) {
        console.log(`Failed to connect ${wallet.name}:`, error);
      }
    }
    
    throw new Error('No compatible wallet found');
  }
}
```

## Testing Integration

### Unit Tests
```typescript
import { UrStakeSDK } from '@urstake/sdk';
import { jest } from '@jest/globals';

describe('UrStake Integration', () => {
  let sdk: UrStakeSDK;
  
  beforeEach(() => {
    sdk = new UrStakeSDK({ network: 'testnet' });
  });
  
  test('should get exchange rates', async () => {
    const rates = await sdk.getExchangeRates();
    
    expect(rates.stAPT).toBeDefined();
    expect(rates.stUSDC).toBeDefined();
    expect(parseFloat(rates.stAPT.rate)).toBeGreaterThan(1);
  });
  
  test('should estimate staking correctly', async () => {
    const estimate = await sdk.estimateStake('APT', '100');
    
    expect(estimate.outputAmount).toBeDefined();
    expect(parseFloat(estimate.outputAmount)).toBeGreaterThan(0);
    expect(parseFloat(estimate.outputAmount)).toBeLessThan(100);
  });
});
```

### Integration Tests
```typescript
describe('End-to-End Staking', () => {
  test('complete staking flow', async () => {
    const testAccount = new AptosAccount();
    
    // Fund test account (testnet)
    await fundTestAccount(testAccount.address());
    
    // Execute stake
    const result = await sdk.stakeAPT(testAccount, '1');
    expect(result.hash).toBeDefined();
    
    // Verify position
    const positions = await sdk.getUserPositions(testAccount.address());
    expect(positions.positions.length).toBeGreaterThan(0);
  });
});
```

## Production Considerations

### Security Best Practices
- **Private Key Management**: Never store private keys in client-side code
- **Input Validation**: Validate all user inputs before processing
- **Rate Limiting**: Implement rate limiting for API calls
- **Error Handling**: Graceful error handling and user feedback

### Performance Optimization
- **Caching**: Cache exchange rates and protocol data
- **Batch Operations**: Combine multiple operations when possible
- **Connection Pooling**: Reuse RPC connections
- **Lazy Loading**: Load data only when needed

### Monitoring and Analytics
```typescript
class IntegrationMonitoring {
  private analytics: AnalyticsClient;
  
  async trackStakeEvent(userAddress: string, asset: string, amount: string) {
    await this.analytics.track('stake_completed', {
      user: userAddress,
      asset,
      amount: parseFloat(amount),
      timestamp: Date.now()
    });
  }
  
  async trackError(error: Error, context: any) {
    await this.analytics.track('integration_error', {
      error: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now()
    });
  }
}
```

## Support and Resources

### Developer Support
- **Discord**: [discord.gg/urstake-dev](https://discord.gg/urstake-dev)
- **Email**: [integrations@urstake.com](mailto:integrations@urstake.com)
- **Office Hours**: Weekly developer office hours

### Documentation
- **API Docs**: Complete API reference
- **SDK Docs**: Detailed SDK documentation
- **Smart Contract Docs**: Move contract documentation
- **Examples Repository**: [github.com/urstake/integration-examples](https://github.com/urstake/integration-examples)

### Integration Assistance
- **Technical Review**: Free technical review of your integration
- **Custom Development**: Paid custom development services
- **Priority Support**: Dedicated support for large integrations

---

**Ready to integrate?** Join our [developer Discord](https://discord.gg/urstake-dev) and let us help you build the next generation of DeFi applications with UrStake!
