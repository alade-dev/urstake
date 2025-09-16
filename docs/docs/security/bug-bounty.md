---
sidebar_position: 3
---

# Bug Bounty Program

UrStake's comprehensive bug bounty program rewards security researchers for finding and responsibly disclosing vulnerabilities.

## Program Overview

**Status**: 🟢 **Active**  
**Launch Date**: Q1 2024  
**Total Rewards Paid**: $125,000+  
**Platform**: [bugbounty.urstake.com](https://bugbounty.urstake.com)

## Reward Structure

### Severity Classifications

We follow the **CVSS 3.1** (Common Vulnerability Scoring System) for vulnerability assessment:

| Severity     | CVSS Score | Reward Range        | Examples                                    |
| ------------ | ---------- | ------------------- | ------------------------------------------- |
| **Critical** | 9.0 - 10.0 | $100,000 - $500,000 | Fund theft, total protocol takeover         |
| **High**     | 7.0 - 8.9  | $25,000 - $100,000  | Unauthorized fund access, governance bypass |
| **Medium**   | 4.0 - 6.9  | $5,000 - $25,000    | DoS attacks, information disclosure         |
| **Low**      | 0.1 - 3.9  | $1,000 - $5,000     | UI issues, minor logic errors               |

### Bonus Multipliers

**Quality Bonus** (up to 2x):

- Detailed reproduction steps: +25%
- Suggested fixes: +25%
- Working proof of concept: +50%
- Exceptional research quality: +100%

**Impact Bonus**:

- Mainnet vulnerabilities: Base reward
- Testnet vulnerabilities: 50% of base reward
- Documentation/website: 25% of base reward

## Scope

### In-Scope Assets

#### Smart Contracts

```
✅ Core Protocol Contracts
├── UrStake Core: 0x... (mainnet)
├── stAPT Token: 0x... (mainnet)
├── stUSDC Token: 0x... (mainnet)
├── Governance: 0x... (mainnet)
└── All related modules and resources

✅ Testnet Contracts
├── All mainnet equivalents on testnet
└── Beta/experimental contracts
```

#### Web Applications

```
✅ Primary Applications
├── urstake.vercel.app (main application)
├── gov.urstake.com (governance portal)
├── docs.urstake.com (documentation)
└── api.urstake.com (API endpoints)

✅ Supporting Infrastructure
├── All *.urstake.com subdomains
├── Mobile applications (iOS/Android)
└── Browser extensions
```

#### API & Infrastructure

```
✅ API Endpoints
├── REST API (api.urstake.com/v1/*)
├── WebSocket connections
├── GraphQL endpoints
└── Webhook handlers

✅ Infrastructure Components
├── Load balancers
├── CDN configurations
├── Database interfaces (read-only)
└── Monitoring endpoints
```

### Out-of-Scope

```
❌ Explicitly Excluded
├── Social engineering attacks
├── Physical security issues
├── Attacks requiring physical access
├── Third-party integrations (unless UrStake-specific)
├── Known issues already reported
├── Spam or low-quality reports
├── Issues in dependencies (report to maintainers)
└── Attacks requiring unrealistic user interaction
```

## Vulnerability Categories

### Smart Contract Vulnerabilities

#### Critical Issues

- **Fund Theft**: Direct extraction of user funds
- **Protocol Takeover**: Gaining admin privileges
- **Exchange Rate Manipulation**: Artificially inflating token values
- **Infinite Mint**: Creating tokens without backing assets

#### High Issues

- **Access Control Bypass**: Unauthorized function execution
- **Reentrancy Attacks**: State manipulation through recursive calls
- **Oracle Manipulation**: Exploiting price feed vulnerabilities
- **Governance Attacks**: Malicious proposal execution

#### Example Report Template

````markdown
## Vulnerability Summary

Brief description of the vulnerability

## Impact

Detailed impact assessment including potential fund loss

## Proof of Concept

```rust
// Vulnerable code
public fun vulnerable_function() {
    // Demonstrate the issue
}
```
````

## Steps to Reproduce

1. Deploy contract with vulnerable code
2. Call function with malicious parameters
3. Observe unexpected behavior

## Suggested Fix

```rust
// Proposed solution
public fun secure_function() {
    // Show the fix
}
```

## Additional Notes

Any other relevant information

````

### Web Application Vulnerabilities

#### High Priority Issues
- **Authentication Bypass**: Accessing restricted areas
- **Authorization Flaws**: Performing unauthorized actions
- **Sensitive Data Exposure**: Accessing private user data
- **Injection Attacks**: SQL, NoSQL, or command injection

#### Medium Priority Issues
- **Cross-Site Scripting (XSS)**: Stored, reflected, or DOM-based
- **Cross-Site Request Forgery (CSRF)**: State-changing operations
- **Insecure Direct Object References**: Accessing other users' data
- **Security Misconfiguration**: Exposed debug info or credentials

### API Vulnerabilities

#### Critical API Issues
- **Authentication Bypass**: API access without proper credentials
- **Mass Assignment**: Modifying restricted fields
- **Rate Limiting Bypass**: Overwhelming API resources
- **Injection Vulnerabilities**: SQL, NoSQL, LDAP injection

#### Example API Vulnerability Report
```markdown
## API Vulnerability: Unauthorized Data Access

### Endpoint
GET /api/v1/users/{userId}/positions

### Issue
The endpoint doesn't validate user ownership, allowing access to any user's positions.

### Proof of Concept
```bash
# Get positions for user A using user B's token
curl -H "Authorization: Bearer <user_b_token>" \
     https://api.urstake.com/v1/users/<user_a_id>/positions
````

### Response

```json
{
  "positions": [
    {
      "asset": "stAPT",
      "balance": "1000.0",
      "value": "$50000"
    }
  ]
}
```

### Impact

Any authenticated user can view other users' portfolio information.

### Suggested Fix

Add authorization check to verify token ownership matches requested user ID.

````

## Submission Process

### 1. Initial Submission

**Submit via**: [bugbounty.urstake.com](https://bugbounty.urstake.com)

**Required Information**:
- Clear vulnerability description
- Affected components/versions
- Steps to reproduce
- Proof of concept (if applicable)
- Potential impact assessment

**Optional but Helpful**:
- Suggested remediation
- Supporting screenshots/videos
- Additional research context

### 2. Initial Response

**Timeline**: Within 24 hours

**Response includes**:
- Acknowledgment of receipt
- Initial severity assessment
- Assigned ticket number
- Next steps and timeline

### 3. Triage and Investigation

**Timeline**: 3-7 business days

**Process**:
- Technical team reproduces the issue
- Impact assessment and CVSS scoring
- Preliminary reward calculation
- Communication with researcher

### 4. Resolution

**Timeline**:
- Critical: 24-48 hours
- High: 1-2 weeks
- Medium: 2-4 weeks
- Low: 4-8 weeks

**Process**:
- Develop and test fix
- Deploy to testnet for validation
- Deploy to mainnet (with timelock if needed)
- Verify fix with researcher

### 5. Reward Payment

**Timeline**: Within 7 days of fix deployment

**Payment Methods**:
- **Cryptocurrency**: APT, USDC, ETH, BTC
- **Stablecoin**: USDT, USDC (preferred for large amounts)
- **Fiat**: Bank transfer (limited regions)

## Submission Guidelines

### Quality Standards

#### Required Elements
```markdown
✅ Clear title and summary
✅ Detailed reproduction steps
✅ Proof of concept or evidence
✅ Impact assessment
✅ Affected components listed
✅ Professional communication
````

#### Bonus Elements

```markdown
🎯 Working exploit code
🎯 Comprehensive impact analysis
🎯 Multiple attack vectors
🎯 Suggested remediation
🎯 Additional security research
```

### Report Template

````markdown
# Vulnerability Report

## Summary

Brief description of the vulnerability

## Severity Assessment

Your assessment: Critical/High/Medium/Low
Reasoning: Why you assigned this severity

## Affected Components

- Component 1: Version X.Y.Z
- Component 2: Version A.B.C

## Vulnerability Details

Detailed technical description

## Impact

What can an attacker achieve?

## Proof of Concept

```javascript
// Your PoC code here
```
````

## Steps to Reproduce

1. Step 1
2. Step 2
3. Step 3

## Supporting Evidence

Screenshots, logs, or other evidence

## Suggested Remediation

Your recommendations for fixing the issue

## References

Any relevant security advisories or research

```

## Communication Guidelines

### Researcher Responsibilities

```

✅ Follow responsible disclosure
✅ Provide clear, detailed reports
✅ Respond promptly to clarification requests
✅ Avoid testing on mainnet with real funds
✅ Keep vulnerability details confidential
✅ Allow reasonable time for fixes

❌ Don't perform destructive testing
❌ Don't access or modify user data
❌ Don't disclose publicly before resolution
❌ Don't demand immediate payment
❌ Don't threaten or harass team members

```

### UrStake Commitments

```

✅ Acknowledge receipt within 24 hours
✅ Provide regular updates on progress
✅ Fair and prompt reward payments
✅ Credit researchers (with permission)
✅ Maintain confidentiality as requested
✅ No legal action for good faith research

📝 We reserve the right to:

- Adjust rewards based on duplicate reports
- Modify program terms with advance notice
- Exclude low-quality or spam reports
- Request additional information as needed

```

## Hall of Fame

### Top Contributors

| Researcher | Reports | Total Rewards | Specialization |
|------------|---------|---------------|----------------|
| @whitehat_alice | 5 | $75,000 | Smart contracts |
| @security_bob | 3 | $35,000 | Web application |
| @crypto_charlie | 4 | $28,000 | Protocol analysis |
| @defi_diana | 2 | $22,000 | Economic attacks |

### Notable Discoveries

#### Q1 2024 Highlights

**Critical Finding - Exchange Rate Manipulation**
- **Researcher**: @whitehat_alice
- **Reward**: $150,000
- **Description**: Integer overflow in exchange rate calculation
- **Status**: Fixed in v1.2.1

**High Finding - Governance Bypass**
- **Researcher**: @security_bob
- **Reward**: $45,000
- **Description**: Timelock bypass through batch transactions
- **Status**: Fixed in v1.2.0

**Medium Finding - API Rate Limiting**
- **Researcher**: @crypto_charlie
- **Reward**: $12,000
- **Description**: Rate limiting bypass using different headers
- **Status**: Fixed in API v1.1.5

## Program Statistics

### Overall Metrics
```

Total Reports Received: 234
Valid Reports: 18 (7.7%)
Duplicates: 23 (9.8%)
Out of Scope: 89 (38.0%)
Invalid/Spam: 104 (44.4%)

Average Response Time: 8.2 hours
Average Resolution Time: 12.4 days
Average Reward: $15,680

```

### Monthly Breakdown (Last 6 Months)
```

Month Reports Valid Rewards Paid
January 42 3 $87,000
February 38 2 $34,000
March 45 4 $67,000
April 41 3 $45,000
May 36 3 $23,000
June 32 3 $56,000

```

## Contact Information

### Bug Bounty Team

**Primary Contact**: [bugbounty@urstake.com](mailto:bugbounty@urstake.com)
**Emergency Contact**: [security@urstake.com](mailto:security@urstake.com)
**PGP Key**: [Download Public Key](https://keybase.io/urstake/pgp_keys.asc)

### Platform Support

**Technical Issues**: [support@bugbounty.urstake.com](mailto:support@bugbounty.urstake.com)
**Payment Issues**: [payments@bugbounty.urstake.com](mailto:payments@bugbounty.urstake.com)

### Community

**Discord**: [#bug-bounty channel](https://discord.gg/urstake-security)
**Telegram**: [@UrStakeBugBounty](https://t.me/UrStakeBugBounty)
**Twitter**: [@UrStakeSecurity](https://twitter.com/UrStakeSecurity)

## Legal Terms

### Scope of Authorization

By participating in this bug bounty program, you are authorized to:
- Test the in-scope systems and applications
- Report vulnerabilities through proper channels
- Perform security research in good faith

You are **NOT** authorized to:
- Access, modify, or delete user data
- Perform denial of service attacks
- Test on production systems with real funds
- Violate any applicable laws or regulations

### Safe Harbor

UrStake provides legal safe harbor for security research conducted under this program, provided that:
- Research is performed in good faith
- Vulnerabilities are reported responsibly
- No user data is accessed or exfiltrated
- No damage is caused to our systems

### Rewards and Payments

- Rewards are paid at UrStake's sole discretion
- Multiple reports of the same issue will share the reward
- Rewards may be adjusted based on quality and impact
- Payment processing may take up to 30 days for large amounts

## Program Updates

### Recent Changes

**v2.1 (June 2024)**:
- Increased maximum reward to $500,000
- Added mobile application to scope
- Introduced quality bonus multipliers
- Expanded API scope coverage

**v2.0 (March 2024)**:
- Complete program restructure
- New CVSS-based severity classification
- Enhanced reward structure
- Improved submission process

### Upcoming Changes

**Q3 2024**:
- Cross-chain scope expansion
- Automated vulnerability scanning integration
- Enhanced researcher dashboard
- Community voting on bounty awards

---

**Ready to contribute to UrStake's security?** Visit [bugbounty.urstake.com](https://bugbounty.urstake.com) to get started and help us build the most secure liquid staking protocol on Aptos!
```
