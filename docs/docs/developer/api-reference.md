---
sidebar_position: 2
---

# API Reference

Complete API documentation for integrating with UrStake's liquid staking protocol.

## Base URL

**Mainnet**: `https://api.urstake.com/v1`
**Testnet**: `https://api-testnet.urstake.com/v1`

## Authentication

All API endpoints are public and do not require authentication. Rate limiting applies to prevent abuse.

**Rate Limits**:
- **Standard**: 100 requests per minute
- **Burst**: 1000 requests per hour
- **WebSocket**: 50 connections per IP

## Core Endpoints

### 1. Protocol Information

#### Get Protocol Status
```http
GET /protocol/status
```

**Response**:
```json
{
  "status": "operational",
  "version": "1.2.0",
  "network": "mainnet",
  "lastUpdated": "2024-01-15T10:30:00Z",
  "contracts": {
    "core": "0x...",
    "stAPT": "0x...",
    "stUSDC": "0x..."
  }
}
```

#### Get Exchange Rates
```http
GET /protocol/exchange-rates
```

**Response**:
```json
{
  "stAPT": {
    "rate": "1.052341",
    "lastUpdate": "2024-01-15T10:30:00Z",
    "apy": "8.12"
  },
  "stUSDC": {
    "rate": "1.019847",
    "lastUpdate": "2024-01-15T10:30:00Z",
    "apy": "12.05"
  }
}
```

### 2. Staking Operations

#### Get Staking Info
```http
GET /staking/info/{asset}
```

**Parameters**:
- `asset`: `APT` or `USDC`

**Response**:
```json
{
  "asset": "APT",
  "totalStaked": "2456789.123",
  "totalShares": "2341234.567",
  "currentAPY": "8.12",
  "minStakeAmount": "1.0",
  "stakingEnabled": true,
  "unstakingEnabled": true
}
```

#### Estimate Staking Output
```http
POST /staking/estimate
```

**Request Body**:
```json
{
  "asset": "APT",
  "amount": "100.0",
  "operation": "stake"
}
```

**Response**:
```json
{
  "inputAmount": "100.0",
  "outputAmount": "95.238095",
  "exchangeRate": "1.052341",
  "estimatedGas": "0.01",
  "slippage": "0.1",
  "priceImpact": "0.05"
}
```

### 3. User Portfolio

#### Get User Positions
```http
GET /users/{address}/positions
```

**Response**:
```json
{
  "address": "0x1234...",
  "positions": [
    {
      "asset": "stAPT",
      "balance": "95.238095",
      "underlyingValue": "100.0",
      "stakedAt": "2024-01-01T00:00:00Z",
      "currentAPY": "8.12",
      "unrealizedGains": "4.762"
    },
    {
      "asset": "stUSDC", 
      "balance": "2000.0",
      "underlyingValue": "2040.0",
      "stakedAt": "2024-01-10T00:00:00Z",
      "currentAPY": "12.05",
      "unrealizedGains": "40.0"
    }
  ],
  "totalValue": "2140.0"
}
```

#### Get Transaction History
```http
GET /users/{address}/transactions?limit=50&offset=0
```

**Response**:
```json
{
  "transactions": [
    {
      "hash": "0xabc123...",
      "type": "stake",
      "asset": "APT",
      "amount": "100.0",
      "sharesReceived": "95.238095",
      "timestamp": "2024-01-15T10:30:00Z",
      "status": "confirmed"
    }
  ],
  "pagination": {
    "total": 127,
    "limit": 50,
    "offset": 0
  }
}
```

### 4. Market Data

#### Get Historical Rates
```http
GET /market/rates/history?asset=stAPT&period=30d
```

**Response**:
```json
{
  "asset": "stAPT",
  "period": "30d",
  "data": [
    {
      "timestamp": "2024-01-15T00:00:00Z",
      "exchangeRate": "1.052341",
      "apy": "8.12"
    }
  ]
}
```

#### Get Liquidity Pools
```http
GET /market/pools
```

**Response**:
```json
{
  "pools": [
    {
      "pair": "stAPT/APT",
      "dex": "PancakeSwap",
      "tvl": "2800000.0",
      "volume24h": "450000.0",
      "apy": "12.5"
    }
  ]
}
```

## WebSocket API

### Connection
```javascript
const ws = new WebSocket('wss://api.urstake.com/v1/ws');
```

### Subscribe to Exchange Rates
```javascript
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'exchangeRates'
}));
```

**Message Format**:
```json
{
  "type": "exchangeRates",
  "data": {
    "stAPT": {
      "rate": "1.052341",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Subscribe to User Updates
```javascript
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'user',
  address: '0x1234...'
}));
```

## SDK Integration

### JavaScript/TypeScript SDK

#### Installation
```bash
npm install @urstake/sdk
```

#### Basic Usage
```typescript
import { UrStakeSDK } from '@urstake/sdk';

const sdk = new UrStakeSDK({
  network: 'mainnet',
  rpcUrl: 'https://fullnode.mainnet.aptoslabs.com'
});

// Get exchange rates
const rates = await sdk.getExchangeRates();
console.log(rates.stAPT.rate); // "1.052341"

// Estimate staking
const estimate = await sdk.estimateStake('APT', '100');
console.log(estimate.outputAmount); // "95.238095"
```

#### Staking Operations
```typescript
import { AptosAccount } from 'aptos';

const account = new AptosAccount();

// Stake APT
const stakeResult = await sdk.stakeAPT(account, '100');
console.log(stakeResult.hash); // Transaction hash

// Unstake APT
const unstakeResult = await sdk.unstakeAPT(account, '95.238095');
console.log(unstakeResult.hash); // Transaction hash
```

### Python SDK

#### Installation
```bash
pip install urstake-python
```

#### Basic Usage
```python
from urstake import UrStakeClient

client = UrStakeClient(network='mainnet')

# Get exchange rates
rates = client.get_exchange_rates()
print(rates['stAPT']['rate'])  # 1.052341

# Get user positions
positions = client.get_user_positions('0x1234...')
print(positions['totalValue'])  # 2140.0
```

## Smart Contract Integration

### Direct Contract Calls

#### Stake APT
```rust
public entry fun stake_apt(account: &signer, amount: u64) {
    // Implementation
}
```

**Parameters**:
- `account`: Signer account
- `amount`: Amount in APT (with 8 decimals)

#### Get Exchange Rate
```rust
public fun get_apt_exchange_rate(): (u64, u64) {
    // Returns (total_apt, total_stapt)
}
```

### Contract Addresses

**Mainnet**:
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

## Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request |
| 404 | Not Found |
| 429 | Rate Limited |
| 500 | Server Error |

### Error Response Format
```json
{
  "error": {
    "code": "INVALID_AMOUNT",
    "message": "Amount must be greater than minimum stake",
    "details": {
      "minAmount": "1.0",
      "providedAmount": "0.5"
    }
  }
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `INVALID_AMOUNT` | Invalid stake/unstake amount |
| `INSUFFICIENT_BALANCE` | Not enough tokens |
| `STAKING_PAUSED` | Staking temporarily disabled |
| `NETWORK_ERROR` | Blockchain network issue |
| `RATE_LIMITED` | Too many requests |

## Rate Limiting

### Limits
- **Public endpoints**: 100 requests/minute
- **User endpoints**: 50 requests/minute  
- **WebSocket**: 50 connections/IP
- **Burst allowance**: 1000 requests/hour

### Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 85
X-RateLimit-Reset: 1642676400
```

## Examples

### Complete Staking Flow
```typescript
import { UrStakeSDK, AptosAccount } from '@urstake/sdk';

async function stakeExample() {
  const sdk = new UrStakeSDK({ network: 'mainnet' });
  const account = new AptosAccount();
  
  // 1. Check balance
  const balance = await sdk.getAPTBalance(account.address());
  console.log(`APT Balance: ${balance}`);
  
  // 2. Estimate staking
  const estimate = await sdk.estimateStake('APT', '100');
  console.log(`Will receive: ${estimate.outputAmount} stAPT`);
  
  // 3. Execute stake
  const result = await sdk.stakeAPT(account, '100');
  console.log(`Transaction: ${result.hash}`);
  
  // 4. Wait for confirmation
  await sdk.waitForTransaction(result.hash);
  console.log('Staking confirmed!');
  
  // 5. Check new position
  const positions = await sdk.getUserPositions(account.address());
  console.log(`Total staked value: ${positions.totalValue}`);
}
```

### Real-time Price Monitoring
```typescript
import { UrStakeSDK } from '@urstake/sdk';

const sdk = new UrStakeSDK({ network: 'mainnet' });

// WebSocket connection
const ws = sdk.createWebSocket();

ws.on('connect', () => {
  console.log('Connected to UrStake API');
  
  // Subscribe to exchange rate updates
  ws.subscribe('exchangeRates');
});

ws.on('exchangeRates', (data) => {
  console.log(`stAPT rate: ${data.stAPT.rate}`);
  console.log(`stUSDC rate: ${data.stUSDC.rate}`);
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});

ws.connect();
```

## Support

### Technical Support
- **Documentation**: [docs.urstake.com](https://docs.urstake.com)
- **Discord**: [discord.gg/urstake-dev](https://discord.gg/urstake-dev)
- **Email**: [api-support@urstake.com](mailto:api-support@urstake.com)

### Bug Reports
- **GitHub Issues**: [github.com/urstake/api-issues](https://github.com/urstake/api-issues)
- **Bug Bounty**: [bugbounty.urstake.com](https://bugbounty.urstake.com)

### Feature Requests
- **Governance Forum**: [forum.urstake.com](https://forum.urstake.com)
- **Developer Discord**: Technical discussions
- **Feature Request Form**: [features.urstake.com](https://features.urstake.com)

---

**Need help integrating?** Join our [developer Discord](https://discord.gg/urstake-dev) for real-time support from our team and community.
