# UrStake - Multi-Asset Liquid Staking Protocol

A comprehensive liquid staking platform on Aptos blockchain that enables users to stake APT and USDC tokens while maintaining liquidity through derivative tokens (stAPT and stUSDC).

<div align="center">

![UrStake Logo](client/public/urstake.png)

[![Aptos](https://img.shields.io/badge/Built%20on-Aptos-FF6B6B?style=for-the-badge&logo=aptos)](https://aptoslabs.com/)
[![Move](https://img.shields.io/badge/Smart%20Contracts-Move-4FC3F7?style=for-the-badge)](https://move-language.github.io/move/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

[Live Demo](https://urstake.vercel.app) • [Documentation](./docs) • [Smart Contracts](./move) • [Frontend](./client)

</div>

## 🌟 Overview

UrStake revolutionizes staking on Aptos by providing a liquid staking solution that allows users to:

- **Stake Assets**: Stake APT and USDC tokens to earn rewards
- **Maintain Liquidity**: Receive liquid staking tokens (stAPT, stUSDC) that can be used in DeFi
- **Flexible Unstaking**: Choose between instant (with fees) or delayed (7-day) unstaking
- **Earn Rewards**: Automatically accumulate staking rewards through exchange rate appreciation
- **Portfolio Management**: Track all positions and transactions in a comprehensive dashboard

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│  Frontend App   │◄──►│  Aptos Network  │◄──►│ Smart Contracts │
│   (React)       │    │                 │    │     (Move)      │
│                 │    │                 │    │                 │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • Dashboard     │    │ • Wallet        │    │ • UrStake       │
│ • Staking UI    │    │   Integration   │    │ • USDC Token    │
│ • Portfolio     │    │ • Transaction   │    │ • USDC Staking  │
│ • History       │    │   Processing    │    │ • Governance    │
│ • Faucet        │    │ • State Sync    │    │ • Admin         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
aptos-yield-flow/
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Application pages
│   │   ├── hooks/             # Custom React hooks
│   │   ├── config/            # Configuration files
│   │   └── utils/             # Utility functions
│   ├── public/                # Static assets
│   └── package.json           # Dependencies and scripts
├── move/                       # Smart contracts
│   ├── sources/               # Move source files
│   │   ├── urstake.move       # APT staking contract
│   │   ├── usdc.move          # USDC token contract
│   │   ├── usdc_staking.move  # USDC staking contract
│   │   └── native_usdc_staking.move # Future native USDC
│   ├── build/                 # Compiled artifacts
│   └── Move.toml              # Move project configuration
├── docs/                       # Documentation (optional)
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Aptos CLI** installed
- **Aptos Wallet** (Petra, Martian, etc.)
- **APT tokens** for testnet (use built-in faucet)

### 1. Clone the Repository

```bash
git clone https://github.com/alade-dev/aptos-yield-flow.git
cd aptos-yield-flow
```

### 2. Deploy Smart Contracts (Optional)

The contracts are already deployed on testnet, but you can deploy your own:

```bash
cd move
aptos move compile
aptos move publish --assume-yes
```

### 3. Start the Frontend

```bash
cd client
npm install
npm run dev
```

### 4. Access the Application

Open [http://localhost:8080](http://localhost:8080) and connect your Aptos wallet.

### 5. Get Test Tokens

Visit the built-in faucet at `/faucet` to get test APT and USDC tokens.

## 🎯 Features

### For Users

| Feature                 | Description                            | Status         |
| ----------------------- | -------------------------------------- | -------------- |
| **APT Staking**         | Stake APT tokens and receive stAPT     | ✅ Implemented |
| **USDC Staking**        | Stake USDC tokens and receive stUSDC   | ✅ Implemented |
| **Flexible Unstaking**  | Instant (with fees) or delayed (7-day) | ✅ Implemented |
| **Portfolio Dashboard** | View all positions and performance     | ✅ Implemented |
| **Transaction History** | Complete transaction log               | ✅ Implemented |
| **Token Faucet**        | Get test tokens for development        | ✅ Implemented |
| **USDC Transfers**      | Send USDC to other addresses           | ✅ Implemented |

### For Developers

| Feature            | Description                        | Status         |
| ------------------ | ---------------------------------- | -------------- |
| **Move Contracts** | Comprehensive smart contract suite | ✅ Implemented |
| **TypeScript SDK** | Type-safe contract interactions    | ✅ Implemented |
| **React Hooks**    | Reusable state management          | ✅ Implemented |
| **Testing Suite**  | Contract and frontend tests        | 🔄 In Progress |
| **Documentation**  | Complete API documentation         | ✅ Implemented |

## 🔧 Technology Stack

### Frontend

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Build Tool**: Vite
- **State Management**: React Context + Custom Hooks
- **Wallet Integration**: @aptos-labs/wallet-adapter-react

### Smart Contracts

- **Language**: Move
- **Network**: Aptos Testnet
- **Features**: Liquid staking, rewards, governance
- **Security**: Comprehensive validation and access control

### Development Tools

- **Package Manager**: npm
- **Type Checking**: TypeScript
- **Linting**: ESLint
- **Formatting**: Prettier

## 📊 Protocol Economics

### Staking Mechanics

#### APT Staking

```
Exchange Rate = Total APT Staked / Total stAPT Supply
User receives: APT Amount / Current Exchange Rate = stAPT Amount
```

#### USDC Staking

```
Exchange Rate = Total USDC Staked / Total stUSDC Supply
User receives: USDC Amount / Current Exchange Rate = stUSDC Amount
```

### Fee Structure

| Operation             | Asset    | Fee   | Duration |
| --------------------- | -------- | ----- | -------- |
| **Staking**           | APT/USDC | 0%    | Instant  |
| **Instant Unstaking** | APT/USDC | 0-10% | Instant  |
| **Delayed Unstaking** | APT/USDC | 0%    | 7 days   |

### Reward Distribution

- **Automatic**: Rewards are reflected in exchange rate appreciation
- **Compound Effect**: No need for manual claiming
- **Fair Distribution**: Pro-rata based on stake size and duration

## 🛡️ Security Features

### Smart Contract Security

- **Access Control**: Admin functions protected
- **Emergency Pause**: Stop protocol in emergencies
- **Input Validation**: Comprehensive parameter checking
- **Overflow Protection**: Safe math operations
- **Time Locks**: Prevent flash loan attacks

### Frontend Security

- **Input Sanitization**: All user inputs validated
- **Transaction Safety**: Explicit user approval required
- **Error Handling**: Graceful failure modes
- **State Management**: Consistent data flow

## 🧪 Testing

### Smart Contracts

```bash
cd move
aptos move test
```

### Frontend

```bash
cd client
npm run type-check
npm run lint
npm run build
```

### Integration Testing

1. Deploy contracts to testnet
2. Connect wallet to frontend
3. Execute complete staking workflow
4. Verify all features work end-to-end

## 📈 Roadmap

### Phase 1: Core Platform ✅

- [x] APT liquid staking
- [x] USDC token implementation
- [x] USDC liquid staking
- [x] Frontend dashboard
- [x] Portfolio management
- [x] Transaction history

### Phase 2: Advanced Features 🔄

- [ ] Multi-validator APT staking
- [ ] Governance token
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] API documentation

### Phase 3: Ecosystem Growth 📋

- [ ] Partner integrations
- [ ] Cross-chain bridges
- [ ] Institutional features
- [ ] Mainnet deployment

## 🤝 Contributing

We welcome contributions from the community! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Areas for Contribution

- 🐛 **Bug Fixes**: Report and fix issues
- ✨ **Features**: Implement new functionality
- 📚 **Documentation**: Improve guides and references
- 🧪 **Testing**: Add test coverage
- 🎨 **UI/UX**: Enhance user experience

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation

- **Smart Contracts**: See [move/README.md](./move/README.md)
- **Frontend**: See [client/README.md](./client/README.md)
- **API Reference**: Check inline code documentation

### Community

- **GitHub Issues**: Bug reports and feature requests
- **Discord**: Join our community discussions
- **Twitter**: Follow [@UrStakeProtocol](https://twitter.com/urstakeprotocol)

### Security

- **Security Issues**: Please report privately to security@urstake.com
- **Bug Bounty**: Coming soon for mainnet deployment

## ⚠️ Disclaimer

**This is a testnet deployment for development and testing purposes only.**

- 🚫 Do not use real funds
- 🧪 Contracts are not audited
- 🔄 Features may change
- 📝 Not financial advice

---

<div align="center">

**Built with ❤️ for the Aptos ecosystem**

[Website](https://urstake.com) • [Twitter](https://twitter.com/urstakeprotocol) • [Discord](https://discord.gg/urstake) • [GitHub](https://github.com/alade-dev/aptos-yield-flow)

</div>
