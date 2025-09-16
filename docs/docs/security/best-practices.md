---
sidebar_position: 2
---

# Security Best Practices

Essential security guidelines for users, developers, and integrators working with UrStake's liquid staking protocol.

## User Security Guidelines

### Wallet Security

#### Hardware Wallet Usage

**Recommended for amounts >$10,000**:

- ✅ **Ledger**: Full Aptos support with UrStake integration
- ✅ **SafePal**: Hardware wallet with Aptos compatibility
- ✅ **KeyPal**: Dedicated Aptos hardware wallet

**Best Practices**:

```
✅ Store hardware wallet in secure location
✅ Keep backup seed phrase in separate location
✅ Use PIN/passphrase protection
✅ Verify all transaction details on device screen
✅ Update firmware regularly

❌ Never enter seed phrase on computer
❌ Don't use damaged or suspicious devices
❌ Avoid public WiFi for sensitive operations
```

#### Software Wallet Security

**For smaller amounts and daily use**:

**Recommended Wallets**:

- **Petra**: Official Aptos wallet with strong security
- **Martian**: Feature-rich with security focus
- **Pontem**: Well-audited Aptos wallet

**Security Checklist**:

```
✅ Download only from official sources
✅ Verify app signatures and checksums
✅ Use strong, unique passwords
✅ Enable biometric authentication when available
✅ Keep wallet software updated
✅ Backup seed phrase securely

❌ Don't use browser extensions on shared computers
❌ Never screenshot or email seed phrases
❌ Avoid storing large amounts in hot wallets
```

### Transaction Security

#### Pre-Transaction Verification

Before every UrStake transaction:

1. **Verify Contract Address**:

   ```
   UrStake Core: 0x... (verify on docs.urstake.com)
   stAPT Token: 0x...
   stUSDC Token: 0x...
   ```

2. **Check Transaction Details**:

   - Recipient address matches UrStake contracts
   - Amount is exactly what you intended
   - Gas fee is reasonable (usually less than 0.01 APT)
   - No suspicious additional operations

3. **Verify Interface**:

   ```
   ✅ Official URL: urstake.vercel.app
   ✅ SSL certificate valid
   ✅ No browser security warnings
   ✅ Familiar interface design

   ❌ Suspicious URLs (e.g., app-urstake.com)
   ❌ Phishing attempts with similar designs
   ❌ Unexpected interface changes
   ```

#### Safe Staking Practices

**Amount Management**:

```javascript
// Good: Gradual staking approach
const stakingStrategy = {
  week1: stake(portfolio * 0.1), // Start with 10%
  week2: stake(portfolio * 0.2), // Increase to 30% total
  week3: stake(portfolio * 0.3), // Up to 60% total
  // Monitor and adjust based on comfort level
};

// Bad: All-in approach
const riskyStrategy = {
  day1: stake(portfolio * 1.0), // Too risky
};
```

**Gas Management**:

- Keep 1-2 APT for gas fees
- Use appropriate gas prices (check network status)
- Avoid transactions during network congestion
- Monitor gas usage for large operations

### Account Security

#### Multi-Account Strategy

**Recommended Setup**:

```
Cold Storage (Hardware): 70% of funds
├── Long-term APT holdings
└── Emergency reserves

Hot Wallet (Software): 25% of funds
├── Active staking positions
└── DeFi operations

Daily Wallet (Mobile): 5% of funds
├── Small transactions
└── Testing new features
```

#### Access Management

```
✅ Use unique passwords for each account
✅ Enable 2FA where available
✅ Regular security audits of connected apps
✅ Monitor account activity daily
✅ Set up transaction alerts

❌ Share account access with others
❌ Use accounts on public computers
❌ Keep accounts logged in unnecessarily
```

## Developer Security Guidelines

### Smart Contract Integration

#### Input Validation

```rust
// Good: Comprehensive validation
public entry fun safe_stake_integration(
    user: &signer,
    amount: u64
) {
    // Validate user
    assert!(signer::address_of(user) != @0x0, EINVALID_USER);

    // Validate amount
    assert!(amount >= MIN_STAKE_AMOUNT, EAMOUNT_TOO_SMALL);
    assert!(amount <= MAX_STAKE_AMOUNT, EAMOUNT_TOO_LARGE);

    // Check user balance
    let user_balance = coin::balance<APT>(signer::address_of(user));
    assert!(user_balance >= amount, EINSUFFICIENT_BALANCE);

    // Verify protocol state
    assert!(!urstake::is_paused(), EPROTOCOL_PAUSED);

    // Proceed with staking
    urstake::stake_apt(user, amount);
}

// Bad: No validation
public entry fun unsafe_stake_integration(
    user: &signer,
    amount: u64
) {
    urstake::stake_apt(user, amount); // Could fail unpredictably
}
```

#### Error Handling

```rust
// Good: Graceful error handling
public fun safe_exchange_rate(): (u64, u64) {
    if (urstake::is_paused()) {
        // Return cached rate during pause
        return get_cached_exchange_rate()
    };

    let (total_apt, total_stapt) = urstake::get_exchange_rate();

    // Sanity check rates
    assert!(total_apt > 0, EINVALID_RATE);
    assert!(total_stapt > 0, EINVALID_RATE);

    // Check for reasonable bounds
    let rate = (total_apt * PRECISION) / total_stapt;
    assert!(rate >= MIN_RATE && rate <= MAX_RATE, ERATE_OUT_OF_BOUNDS);

    (total_apt, total_stapt)
}
```

#### Access Control

```rust
// Implement proper role-based access
struct AdminCap has key, store {
    id: UID,
}

public entry fun admin_function(
    admin: &signer,
    _cap: &AdminCap,  // Proof of admin rights
    new_parameter: u64
) {
    // Only addresses with AdminCap can call this
    update_protocol_parameter(new_parameter);
}

// Use capabilities instead of address checks
public entry fun bad_admin_function(
    admin: &signer,
    new_parameter: u64
) {
    // Bad: Hard-coded address check
    assert!(signer::address_of(admin) == @admin_address, EUNAUTHORIZED);
    update_protocol_parameter(new_parameter);
}
```

### API Integration Security

#### Authentication

```typescript
// Good: Secure API client
class SecureUrStakeAPI {
  private apiKey: string;
  private baseURL: string;
  private rateLimiter: RateLimiter;

  constructor(config: APIConfig) {
    this.apiKey = this.validateAPIKey(config.apiKey);
    this.baseURL = this.validateURL(config.baseURL);
    this.rateLimiter = new RateLimiter(100, 60000); // 100 req/min
  }

  private validateAPIKey(key: string): string {
    if (!key || key.length < 32) {
      throw new Error("Invalid API key format");
    }
    return key;
  }

  private validateURL(url: string): string {
    const allowedHosts = ["api.urstake.com", "api-testnet.urstake.com"];
    const parsedURL = new URL(url);

    if (!allowedHosts.includes(parsedURL.hostname)) {
      throw new Error("Invalid API endpoint");
    }

    if (parsedURL.protocol !== "https:") {
      throw new Error("HTTPS required for API calls");
    }

    return url;
  }

  async makeRequest(endpoint: string, data?: any): Promise<any> {
    // Rate limiting
    await this.rateLimiter.wait();

    // Request signing
    const signature = this.signRequest(endpoint, data);

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: data ? "POST" : "GET",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        "X-Signature": signature,
        "User-Agent": "UrStake-SDK/1.0.0",
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new APIError(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}
```

#### Data Validation

```typescript
// Validate all API responses
interface ExchangeRateResponse {
  stAPT: {
    rate: string;
    apy: string;
    lastUpdate: string;
  };
  stUSDC: {
    rate: string;
    apy: string;
    lastUpdate: string;
  };
}

function validateExchangeRates(data: any): ExchangeRateResponse {
  // Schema validation
  if (!data.stAPT || !data.stUSDC) {
    throw new Error("Invalid response structure");
  }

  // Rate validation
  const stAPTRate = parseFloat(data.stAPT.rate);
  if (stAPTRate < 1.0 || stAPTRate > 2.0) {
    throw new Error("stAPT rate out of reasonable bounds");
  }

  const stUSDCRate = parseFloat(data.stUSDC.rate);
  if (stUSDCRate < 1.0 || stUSDCRate > 1.5) {
    throw new Error("stUSDC rate out of reasonable bounds");
  }

  // Timestamp validation
  const lastUpdate = new Date(data.stAPT.lastUpdate);
  const now = new Date();
  const hoursSinceUpdate =
    (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

  if (hoursSinceUpdate > 24) {
    throw new Error("Exchange rate data too stale");
  }

  return data as ExchangeRateResponse;
}
```

### Frontend Security

#### XSS Prevention

```typescript
// Good: Proper sanitization
import DOMPurify from "dompurify";

function DisplayUserData({ userAddress }: { userAddress: string }) {
  // Validate address format
  const isValidAddress = /^0x[a-fA-F0-9]{64}$/.test(userAddress);

  if (!isValidAddress) {
    return <div>Invalid address format</div>;
  }

  // Sanitize before display
  const sanitizedAddress = DOMPurify.sanitize(userAddress);

  return <div>Address: {sanitizedAddress}</div>;
}

// Bad: Direct display without validation
function UnsafeDisplayUserData({ userAddress }: { userAddress: string }) {
  return <div dangerouslySetInnerHTML={{ __html: userAddress }} />;
}
```

#### Secure State Management

```typescript
// Good: Secure state management
class SecureAppState {
  private sensitiveData: Map<string, any> = new Map();

  setSensitiveData(key: string, value: any) {
    // Encrypt sensitive data
    const encrypted = this.encrypt(JSON.stringify(value));
    this.sensitiveData.set(key, encrypted);
  }

  getSensitiveData(key: string): any {
    const encrypted = this.sensitiveData.get(key);
    if (!encrypted) return null;

    try {
      const decrypted = this.decrypt(encrypted);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error("Failed to decrypt data:", error);
      return null;
    }
  }

  private encrypt(data: string): string {
    // Use WebCrypto API for encryption
    // Implementation depends on your security requirements
    return btoa(data); // Simplified for example
  }

  private decrypt(data: string): string {
    return atob(data); // Simplified for example
  }

  clearSensitiveData() {
    this.sensitiveData.clear();
  }
}
```

## Infrastructure Security

### API Security

#### Rate Limiting

```typescript
// Implement proper rate limiting
import { RateLimiterMemory } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterMemory({
  keyspace: "urstake_api",
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
  blockDuration: 60, // Block for 60 seconds if limit exceeded
});

export async function rateLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const clientIP = req.ip || req.connection.remoteAddress;
    await rateLimiter.consume(clientIP);
    next();
  } catch (rejRes) {
    const remainingTime = Math.round(rejRes.msBeforeNext / 1000);
    res.status(429).json({
      error: "Too Many Requests",
      retryAfter: remainingTime,
    });
  }
}
```

#### Input Sanitization

```typescript
// Validate and sanitize all inputs
import Joi from "joi";

const stakeRequestSchema = Joi.object({
  amount: Joi.string()
    .pattern(/^\d+(\.\d{1,8})?$/)
    .required(),
  asset: Joi.string().valid("APT", "USDC").required(),
  userAddress: Joi.string()
    .pattern(/^0x[a-fA-F0-9]{64}$/)
    .required(),
});

export function validateStakeRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { error, value } = stakeRequestSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: "Invalid request format",
      details: error.details,
    });
  }

  req.body = value; // Use validated data
  next();
}
```

### Database Security

#### Query Protection

```sql
-- Good: Parameterized queries
SELECT position_value, created_at
FROM user_positions
WHERE user_address = $1
  AND asset = $2
  AND created_at > $3
ORDER BY created_at DESC
LIMIT $4;

-- Bad: String concatenation (SQL injection risk)
-- SELECT * FROM user_positions WHERE user_address = '" + userAddress + "'
```

#### Access Control

```typescript
// Database access with proper permissions
interface DatabaseConfig {
  readOnlyUser: string;
  readWriteUser: string;
  adminUser: string;
  ssl: boolean;
  connectionTimeout: number;
}

class SecureDatabase {
  private readPool: Pool;
  private writePool: Pool;

  constructor(config: DatabaseConfig) {
    this.readPool = this.createPool(config.readOnlyUser, ["SELECT"]);
    this.writePool = this.createPool(config.readWriteUser, [
      "SELECT",
      "INSERT",
      "UPDATE",
    ]);
  }

  async getUserPositions(userAddress: string): Promise<Position[]> {
    // Use read-only connection for queries
    const result = await this.readPool.query(
      "SELECT * FROM positions WHERE user_address = $1",
      [userAddress]
    );
    return result.rows;
  }

  async updatePosition(userAddress: string, position: Position): Promise<void> {
    // Use read-write connection for updates
    await this.writePool.query(
      "UPDATE positions SET value = $1 WHERE user_address = $2 AND id = $3",
      [position.value, userAddress, position.id]
    );
  }
}
```

## Operational Security

### Key Management

#### Development Environment

```bash
# Good: Environment-based configuration
export URSTAKE_PRIVATE_KEY="$(cat /secure/path/private.key)"
export URSTAKE_API_KEY="$(cat /secure/path/api.key)"
export DATABASE_URL="postgresql://user:pass@localhost/db"

# Use secrets management
kubectl create secret generic urstake-secrets \
  --from-file=private-key=/secure/path/private.key \
  --from-file=api-key=/secure/path/api.key

# Bad: Hard-coded secrets
# const PRIVATE_KEY = "0x123abc..." // Never do this
```

#### Production Deployment

```yaml
# Good: Kubernetes secrets
apiVersion: v1
kind: Secret
metadata:
  name: urstake-secrets
type: Opaque
data:
  private-key: <base64-encoded-key>
  api-key: <base64-encoded-key>

---
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      containers:
        - name: urstake-api
          env:
            - name: PRIVATE_KEY
              valueFrom:
                secretKeyRef:
                  name: urstake-secrets
                  key: private-key
```

### Monitoring and Alerting

#### Security Monitoring

```typescript
// Security event monitoring
interface SecurityEvent {
  type: "suspicious_activity" | "failed_auth" | "rate_limit" | "invalid_input";
  severity: "low" | "medium" | "high" | "critical";
  details: any;
  timestamp: Date;
  source: string;
}

class SecurityMonitor {
  private alertThresholds = {
    failed_auth: 5, // 5 failed attempts in 5 minutes
    rate_limit: 100, // 100 rate limit hits in 10 minutes
    invalid_input: 20, // 20 invalid inputs in 5 minutes
  };

  logSecurityEvent(event: SecurityEvent) {
    // Log to security system
    this.logToSIEM(event);

    // Check for alert conditions
    if (this.shouldAlert(event)) {
      this.sendAlert(event);
    }

    // Update metrics
    this.updateMetrics(event);
  }

  private shouldAlert(event: SecurityEvent): boolean {
    if (event.severity === "critical") {
      return true;
    }

    // Check rate-based alerts
    const recentEvents = this.getRecentEvents(event.type, 5 * 60 * 1000); // 5 minutes
    const threshold = this.alertThresholds[event.type];

    return recentEvents.length >= threshold;
  }

  private sendAlert(event: SecurityEvent) {
    // Send to security team
    this.notifySecurityTeam(event);

    // Auto-response for critical events
    if (event.severity === "critical") {
      this.triggerAutoResponse(event);
    }
  }
}
```

### Incident Response

#### Automated Response

```typescript
// Automated incident response
class IncidentResponse {
  async handleCriticalEvent(event: SecurityEvent) {
    // Immediate containment
    await this.enableRateLimiting();
    await this.blockSuspiciousIPs();

    // Notification
    await this.alertSecurityTeam();
    await this.notifyUsers();

    // Escalation
    if (event.type === "smart_contract_exploit") {
      await this.emergencyPause();
      await this.alertMultisigSigners();
    }

    // Documentation
    await this.createIncidentReport(event);
  }

  private async emergencyPause() {
    // Trigger emergency pause if available
    const pauseContract = new EmergencyPauseContract();
    await pauseContract.emergencyPause();
  }
}
```

## Security Checklist

### Pre-Deployment Checklist

**Smart Contracts**:

- [ ] All functions have proper access controls
- [ ] Input validation on all parameters
- [ ] Reentrancy protection where needed
- [ ] Integer overflow/underflow protection
- [ ] Emergency pause mechanisms
- [ ] Comprehensive test coverage (>95%)
- [ ] Multiple security audits completed
- [ ] Formal verification for critical functions

**API/Backend**:

- [ ] Rate limiting implemented
- [ ] Input validation and sanitization
- [ ] Authentication and authorization
- [ ] SQL injection protection
- [ ] XSS prevention measures
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Logging and monitoring setup

**Frontend**:

- [ ] Content Security Policy configured
- [ ] XSS protection implemented
- [ ] Secure state management
- [ ] Input validation on client side
- [ ] HTTPS enforced
- [ ] Dependency security scan passed
- [ ] No secrets in client code

**Infrastructure**:

- [ ] Secrets management configured
- [ ] Network security rules applied
- [ ] Database access controls set
- [ ] Backup and recovery tested
- [ ] Monitoring and alerting active
- [ ] Incident response procedures documented

### Regular Security Maintenance

**Monthly**:

- [ ] Dependency security updates
- [ ] Access control review
- [ ] Log analysis and review
- [ ] Performance and availability monitoring
- [ ] Backup integrity verification

**Quarterly**:

- [ ] Full security assessment
- [ ] Penetration testing
- [ ] Code security review
- [ ] Incident response drill
- [ ] Security training for team

**Annually**:

- [ ] Comprehensive security audit
- [ ] Risk assessment update
- [ ] Security policy review
- [ ] Compliance verification
- [ ] Insurance coverage review

---

**Security is everyone's responsibility.** Follow these best practices and stay vigilant to keep UrStake and your assets secure. Report any security concerns to [security@urstake.com](mailto:security@urstake.com).
