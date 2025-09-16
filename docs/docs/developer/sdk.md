---
sidebar_position: 4
---

# SDK Documentation

Comprehensive documentation for UrStake's software development kits (SDKs) across multiple programming languages.

## Overview

UrStake provides SDKs for popular programming languages to simplify integration with our liquid staking protocol:

- **TypeScript/JavaScript**: For web and Node.js applications
- **Python**: For data analysis and backend services
- **Rust**: For high-performance applications
- **Go**: For backend services and CLI tools

## TypeScript/JavaScript SDK

### Installation

```bash
# npm
npm install @urstake/sdk

# yarn
yarn add @urstake/sdk

# pnpm
pnpm add @urstake/sdk
```

### Basic Setup

```typescript
import { UrStakeSDK, Network } from '@urstake/sdk';

const sdk = new UrStakeSDK({
  network: Network.MAINNET,
  rpcUrl: 'https://fullnode.mainnet.aptoslabs.com',
  apiUrl: 'https://api.urstake.com/v1'
});
```

### Configuration Options

```typescript
interface SDKConfig {
  network: Network.MAINNET | Network.TESTNET;
  rpcUrl?: string;
  apiUrl?: string;
  timeout?: number;
  retries?: number;
  walletAdapter?: WalletAdapter;
}
```

### Core Methods

#### Exchange Rates
```typescript
// Get current exchange rates
const rates = await sdk.getExchangeRates();
console.log(rates);
/*
{
  stAPT: {
    rate: "1.052341",
    apy: "8.12",
    lastUpdate: "2024-01-15T10:30:00Z"
  },
  stUSDC: {
    rate: "1.019847", 
    apy: "12.05",
    lastUpdate: "2024-01-15T10:30:00Z"
  }
}
*/

// Get historical rates
const history = await sdk.getHistoricalRates('stAPT', '30d');
```

#### User Operations
```typescript
// Get user positions
const positions = await sdk.getUserPositions('0x1234...');

// Get transaction history
const transactions = await sdk.getTransactionHistory('0x1234...', {
  limit: 50,
  offset: 0
});

// Get user balances
const balances = await sdk.getBalances('0x1234...');
```

#### Staking Operations
```typescript
import { AptosAccount } from 'aptos';

const account = new AptosAccount();

// Estimate staking output
const estimate = await sdk.estimateStake('APT', '100');
console.log(`Will receive: ${estimate.outputAmount} stAPT`);

// Stake APT
const stakeResult = await sdk.stakeAPT(account, '100');
console.log(`Transaction hash: ${stakeResult.hash}`);

// Stake USDC
const stakeUSDCResult = await sdk.stakeUSDC(account, '1000');

// Unstake
const unstakeResult = await sdk.unstakeAPT(account, '95.238');
```

#### Market Data
```typescript
// Get liquidity pools
const pools = await sdk.getLiquidityPools();

// Get protocol statistics
const stats = await sdk.getProtocolStats();

// Get yield analytics
const analytics = await sdk.getYieldAnalytics('stAPT', '7d');
```

### Advanced Features

#### Event Listening
```typescript
// Listen to staking events
sdk.on('stake', (event) => {
  console.log(`User ${event.user} staked ${event.amount} ${event.asset}`);
});

// Listen to unstaking events
sdk.on('unstake', (event) => {
  console.log(`User ${event.user} unstaked ${event.amount} ${event.asset}`);
});

// Listen to exchange rate updates
sdk.on('exchangeRateUpdate', (rates) => {
  console.log('New rates:', rates);
});
```

#### WebSocket Integration
```typescript
// Create WebSocket connection
const ws = sdk.createWebSocket();

// Subscribe to real-time data
ws.subscribe('exchangeRates');
ws.subscribe('userUpdates', '0x1234...');

ws.on('exchangeRates', (data) => {
  console.log('Rate update:', data);
});

ws.on('userUpdates', (data) => {
  console.log('User position update:', data);
});
```

#### Transaction Building
```typescript
// Build custom transactions
const transaction = await sdk.buildStakeTransaction('0x1234...', 'APT', '100');

// Add additional operations
transaction.addOperation({
  type: 'approve',
  token: 'APT',
  spender: sdk.getContractAddress('core'),
  amount: '100'
});

// Submit transaction
const result = await sdk.submitTransaction(account, transaction);
```

## Python SDK

### Installation

```bash
pip install urstake-python
```

### Basic Usage

```python
from urstake import UrStakeClient, Network
import asyncio

# Initialize client
client = UrStakeClient(
    network=Network.MAINNET,
    api_url='https://api.urstake.com/v1'
)

# Async example
async def main():
    # Get exchange rates
    rates = await client.get_exchange_rates()
    print(f"stAPT rate: {rates['stAPT']['rate']}")
    
    # Get user positions
    positions = await client.get_user_positions('0x1234...')
    print(f"Total value: {positions['totalValue']}")

asyncio.run(main())
```

### Data Analysis Features

```python
import pandas as pd
import numpy as np

class UrStakeAnalyzer:
    def __init__(self):
        self.client = UrStakeClient(network=Network.MAINNET)
    
    async def get_yield_dataframe(self, asset='stAPT', days=90):
        """Get historical yield data as pandas DataFrame"""
        history = await self.client.get_historical_rates(asset, f'{days}d')
        
        df = pd.DataFrame(history['data'])
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df['apy'] = df['apy'].astype(float)
        df['rate'] = df['rate'].astype(float)
        
        return df.set_index('timestamp')
    
    async def calculate_sharpe_ratio(self, asset='stAPT'):
        """Calculate Sharpe ratio for yield strategy"""
        df = await self.get_yield_dataframe(asset)
        
        daily_returns = df['apy'].pct_change().dropna()
        excess_returns = daily_returns - 0.05  # Risk-free rate
        
        return excess_returns.mean() / excess_returns.std() * np.sqrt(365)
    
    async def portfolio_optimization(self, assets=['stAPT', 'stUSDC']):
        """Optimize portfolio allocation"""
        data = {}
        for asset in assets:
            df = await self.get_yield_dataframe(asset)
            data[asset] = df['apy']
        
        returns_df = pd.DataFrame(data)
        
        # Calculate efficient frontier
        mean_returns = returns_df.mean()
        cov_matrix = returns_df.cov()
        
        # Simple equal-weight portfolio
        weights = np.array([1/len(assets)] * len(assets))
        
        return {
            'weights': dict(zip(assets, weights)),
            'expected_return': np.dot(weights, mean_returns),
            'volatility': np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
        }
```

### Automated Trading

```python
from urstake import UrStakeClient
from aptos_sdk.account import Account

class AutoStaker:
    def __init__(self, private_key: str):
        self.client = UrStakeClient(network=Network.MAINNET)
        self.account = Account.load_key(private_key)
    
    async def auto_stake_threshold(self, threshold_amount: float = 10.0):
        """Automatically stake when balance exceeds threshold"""
        balances = await self.client.get_balances(str(self.account.address()))
        
        if balances.get('APT', 0) > threshold_amount:
            stake_amount = balances['APT'] - 1.0  # Keep 1 APT for gas
            
            result = await self.client.stake_apt(
                self.account, 
                str(stake_amount)
            )
            
            print(f"Auto-staked {stake_amount} APT: {result['hash']}")
            return result
    
    async def rebalance_portfolio(self, target_allocation: dict):
        """Rebalance portfolio to target allocation"""
        positions = await self.client.get_user_positions(str(self.account.address()))
        current_value = positions['totalValue']
        
        for asset, target_pct in target_allocation.items():
            target_value = current_value * target_pct
            current_position = next(
                (p for p in positions['positions'] if p['asset'] == f'st{asset}'), 
                None
            )
            
            if current_position:
                current_value = float(current_position['underlyingValue'])
                
                if target_value > current_value * 1.05:  # 5% threshold
                    # Need to stake more
                    stake_amount = target_value - current_value
                    await self.client.stake(self.account, asset, str(stake_amount))
                
                elif target_value < current_value * 0.95:  # 5% threshold
                    # Need to unstake some
                    unstake_amount = current_value - target_value
                    await self.client.unstake(self.account, asset, str(unstake_amount))
```

## Rust SDK

### Installation

```toml
[dependencies]
urstake-sdk = "0.1.0"
tokio = { version = "1", features = ["full"] }
```

### Basic Usage

```rust
use urstake_sdk::{UrStakeClient, Network};
use std::error::Error;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let client = UrStakeClient::new(Network::Mainnet)?;
    
    // Get exchange rates
    let rates = client.get_exchange_rates().await?;
    println!("stAPT rate: {}", rates.st_apt.rate);
    
    // Get user positions
    let positions = client.get_user_positions("0x1234...").await?;
    println!("Total value: {}", positions.total_value);
    
    Ok(())
}
```

### High-Performance Features

```rust
use urstake_sdk::{UrStakeClient, StreamingClient};
use futures::StreamExt;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let client = UrStakeClient::new(Network::Mainnet)?;
    
    // Real-time streaming
    let mut stream = client.stream_exchange_rates().await?;
    
    while let Some(rates) = stream.next().await {
        match rates {
            Ok(rate_update) => {
                println!("Rate update: {:?}", rate_update);
                
                // High-frequency trading logic
                if rate_update.st_apt.rate > 1.06 {
                    // Arbitrage opportunity
                    execute_arbitrage(&client, &rate_update).await?;
                }
            }
            Err(e) => eprintln!("Stream error: {}", e),
        }
    }
    
    Ok(())
}

async fn execute_arbitrage(
    client: &UrStakeClient, 
    rates: &ExchangeRates
) -> Result<(), Box<dyn Error>> {
    // High-performance arbitrage execution
    let pools = client.get_liquidity_pools().await?;
    
    for pool in pools {
        if pool.pair == "stAPT/APT" {
            let market_rate = pool.price;
            let protocol_rate = rates.st_apt.rate;
            
            if (market_rate - protocol_rate) / protocol_rate > 0.001 {
                // >0.1% arbitrage opportunity
                println!("Arbitrage opportunity: {} vs {}", market_rate, protocol_rate);
                // Execute arbitrage...
            }
        }
    }
    
    Ok(())
}
```

## Go SDK

### Installation

```bash
go get github.com/urstake/go-sdk
```

### Basic Usage

```go
package main

import (
    "context"
    "fmt"
    "log"
    
    "github.com/urstake/go-sdk/urstake"
)

func main() {
    client, err := urstake.NewClient(urstake.Config{
        Network: urstake.Mainnet,
        APIUrl:  "https://api.urstake.com/v1",
    })
    if err != nil {
        log.Fatal(err)
    }
    
    ctx := context.Background()
    
    // Get exchange rates
    rates, err := client.GetExchangeRates(ctx)
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("stAPT rate: %s\n", rates.StAPT.Rate)
    
    // Get user positions
    positions, err := client.GetUserPositions(ctx, "0x1234...")
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("Total value: %s\n", positions.TotalValue)
}
```

### CLI Tool Example

```go
package main

import (
    "context"
    "flag"
    "fmt"
    "os"
    
    "github.com/urstake/go-sdk/urstake"
)

func main() {
    var (
        address = flag.String("address", "", "User address")
        asset   = flag.String("asset", "APT", "Asset to stake")
        amount  = flag.String("amount", "", "Amount to stake")
    )
    flag.Parse()
    
    client, err := urstake.NewClient(urstake.Config{
        Network: urstake.Mainnet,
    })
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error creating client: %v\n", err)
        os.Exit(1)
    }
    
    ctx := context.Background()
    
    switch flag.Arg(0) {
    case "positions":
        positions, err := client.GetUserPositions(ctx, *address)
        if err != nil {
            fmt.Fprintf(os.Stderr, "Error getting positions: %v\n", err)
            os.Exit(1)
        }
        
        for _, pos := range positions.Positions {
            fmt.Printf("%s: %s (value: %s)\n", 
                pos.Asset, pos.Balance, pos.UnderlyingValue)
        }
        
    case "stake":
        estimate, err := client.EstimateStake(ctx, *asset, *amount)
        if err != nil {
            fmt.Fprintf(os.Stderr, "Error estimating stake: %v\n", err)
            os.Exit(1)
        }
        
        fmt.Printf("Will receive: %s st%s\n", estimate.OutputAmount, *asset)
        
    default:
        fmt.Fprintf(os.Stderr, "Unknown command: %s\n", flag.Arg(0))
        os.Exit(1)
    }
}
```

## React Components SDK

### Installation

```bash
npm install @urstake/react-components
```

### Provider Setup

```typescript
import { UrStakeProvider } from '@urstake/react-components';
import { UrStakeSDK } from '@urstake/sdk';

const sdk = new UrStakeSDK({ network: 'mainnet' });

function App() {
  return (
    <UrStakeProvider sdk={sdk}>
      <YourApp />
    </UrStakeProvider>
  );
}
```

### Available Components

#### Staking Widget
```typescript
import { StakingWidget } from '@urstake/react-components';

function StakingPage() {
  return (
    <StakingWidget
      asset="APT"
      theme="dark"
      showAnalytics={true}
      onStakeComplete={(result) => {
        console.log('Stake completed:', result);
      }}
    />
  );
}
```

#### Portfolio Dashboard
```typescript
import { PortfolioDashboard } from '@urstake/react-components';

function DashboardPage() {
  return (
    <PortfolioDashboard
      userAddress="0x1234..."
      showTransactionHistory={true}
      showYieldAnalytics={true}
      refreshInterval={30000} // 30 seconds
    />
  );
}
```

#### Exchange Rate Display
```typescript
import { ExchangeRateDisplay } from '@urstake/react-components';

function Header() {
  return (
    <div className="header">
      <ExchangeRateDisplay
        assets={['APT', 'USDC']}
        format="compact"
        showTrend={true}
      />
    </div>
  );
}
```

### Custom Hooks

```typescript
import { 
  useUrStake, 
  useExchangeRates, 
  useUserPositions,
  useStaking 
} from '@urstake/react-components';

function MyComponent() {
  const { sdk, isConnected } = useUrStake();
  const { rates, loading } = useExchangeRates();
  const { positions, totalValue } = useUserPositions('0x1234...');
  const { stake, unstake, isStaking } = useStaking();
  
  const handleStake = async () => {
    if (!isConnected) return;
    
    const result = await stake('APT', '100');
    console.log('Staked:', result);
  };
  
  return (
    <div>
      <h2>Total Portfolio Value: ${totalValue}</h2>
      <button onClick={handleStake} disabled={isStaking}>
        {isStaking ? 'Staking...' : 'Stake APT'}
      </button>
    </div>
  );
}
```

## Error Handling

### TypeScript/JavaScript
```typescript
import { UrStakeError, ErrorCode } from '@urstake/sdk';

try {
  const result = await sdk.stakeAPT(account, '100');
} catch (error) {
  if (error instanceof UrStakeError) {
    switch (error.code) {
      case ErrorCode.INSUFFICIENT_BALANCE:
        console.log('Not enough balance to stake');
        break;
      case ErrorCode.STAKING_PAUSED:
        console.log('Staking is temporarily paused');
        break;
      case ErrorCode.INVALID_AMOUNT:
        console.log('Invalid stake amount');
        break;
      default:
        console.log('Unknown error:', error.message);
    }
  }
}
```

### Python
```python
from urstake import UrStakeError, ErrorCode

try:
    result = await client.stake_apt(account, '100')
except UrStakeError as e:
    if e.code == ErrorCode.INSUFFICIENT_BALANCE:
        print('Not enough balance to stake')
    elif e.code == ErrorCode.STAKING_PAUSED:
        print('Staking is temporarily paused')
    else:
        print(f'Error: {e.message}')
```

## Testing

### Unit Testing
```typescript
import { UrStakeSDK } from '@urstake/sdk';
import { jest } from '@jest/globals';

// Mock the SDK for testing
jest.mock('@urstake/sdk');

describe('UrStake Integration', () => {
  let sdk: jest.Mocked<UrStakeSDK>;
  
  beforeEach(() => {
    sdk = new UrStakeSDK({ network: 'testnet' }) as jest.Mocked<UrStakeSDK>;
  });
  
  test('should handle staking correctly', async () => {
    sdk.stakeAPT.mockResolvedValue({ hash: '0xabc123' });
    
    const result = await sdk.stakeAPT(mockAccount, '100');
    
    expect(result.hash).toBe('0xabc123');
    expect(sdk.stakeAPT).toHaveBeenCalledWith(mockAccount, '100');
  });
});
```

### Integration Testing
```typescript
describe('SDK Integration Tests', () => {
  let sdk: UrStakeSDK;
  
  beforeAll(() => {
    sdk = new UrStakeSDK({ network: 'testnet' });
  });
  
  test('should get real exchange rates', async () => {
    const rates = await sdk.getExchangeRates();
    
    expect(rates.stAPT).toBeDefined();
    expect(parseFloat(rates.stAPT.rate)).toBeGreaterThan(1);
  });
});
```

## Best Practices

### Performance
- **Caching**: Cache frequently accessed data like exchange rates
- **Connection Pooling**: Reuse RPC connections
- **Batch Operations**: Combine multiple operations when possible
- **Error Retry**: Implement exponential backoff for failed requests

### Security
- **Private Key Management**: Never log or expose private keys
- **Input Validation**: Validate all user inputs
- **Rate Limiting**: Implement client-side rate limiting
- **Secure Storage**: Use secure storage for sensitive data

### Code Organization
```typescript
// Good: Organize by feature
src/
  staking/
    hooks/
    components/
    services/
  portfolio/
    hooks/
    components/
    services/
  shared/
    types/
    utils/
    constants/
```

---

**Need help with SDK integration?** Join our [developer Discord](https://discord.gg/urstake-dev) for real-time support and examples.
