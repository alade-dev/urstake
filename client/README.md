# UrStake Client - Liquid Staking Frontend

A modern React-based frontend for the UrStake liquid staking protocol on Aptos blockchain. This application provides a comprehensive interface for staking APT and USDC tokens, managing positions, tracking rewards, and handling transactions.

![UrStake Logo](public/placeholder.svg)

## 🚀 Features

### Core Functionality

- **Dual Asset Staking**: Stake both APT and USDC tokens
- **Liquid Staking Tokens**: Receive stAPT and stUSDC tokens representing your stakes
- **Dynamic Exchange Rates**: Real-time exchange rate calculation based on rewards
- **Flexible Unstaking**: Instant (with fees) or delayed (7-day) unstaking options
- **Comprehensive Dashboard**: Portfolio overview with performance metrics

### User Interface

- **Modern Design**: Clean, responsive UI with dark theme
- **Real-time Data**: Live balance updates and transaction tracking
- **Transaction History**: Complete history of all staking activities
- **Position Management**: Detailed view of all staking positions
- **Testnet Faucet**: Built-in token faucet for testing

### Wallet Integration

- **Multiple Wallets**: Support for Petra, Martian, and other Aptos wallets
- **Seamless Connection**: One-click wallet connection and management
- **Transaction Signing**: Secure transaction signing with user confirmation

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Aptos Network  │    │ Smart Contracts │
│                 │    │                 │    │                 │
│  ┌─────────────┐│    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│  │    Pages    ││◄──►│ │   Wallet    │ │◄──►│ │   UrStake   │ │
│  │             ││    │ │  Adapter    │ │    │ │   Module    │ │
│  ├─────────────┤│    │ └─────────────┘ │    │ ├─────────────┤ │
│  │ Components  ││    │ ┌─────────────┐ │    │ │USDC Staking │ │
│  │             ││    │ │  Aptos SDK  │ │    │ │   Module    │ │
│  ├─────────────┤│    │ │             │ │    │ ├─────────────┤ │
│  │   Hooks     ││    │ └─────────────┘ │    │ │    USDC     │ │
│  │             ││    │                 │    │ │   Module    │ │
│  └─────────────┘│    │                 │    │ └─────────────┘ │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Directory Structure

```
client/
├── public/                     # Static assets
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── assets/                 # Images and static resources
│   │   └── logo/
│   │       ├── aptos.png
│   │       ├── stAptos.png
│   │       └── usdc.png
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # Base UI components (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   ├── Features.tsx        # Landing page features
│   │   ├── Hero.tsx           # Landing page hero section
│   │   ├── Navigation.tsx      # Main navigation component
│   │   ├── TransactionCard.tsx # Transaction display component
│   │   ├── UsdcValue.tsx      # USDC value display components
│   │   ├── UsdValue.tsx       # USD value display components
│   │   ├── UrStakeLogo.tsx    # Logo component
│   │   └── WalletConnection.tsx # Wallet connection UI
│   ├── config/                 # Configuration files
│   │   ├── aptos.ts           # Aptos network configuration
│   │   └── contract.ts        # Smart contract addresses and configs
│   ├── context/                # React context providers
│   │   ├── AppStateContext.tsx # Global app state
│   │   ├── types.ts           # TypeScript type definitions
│   │   └── WalletContext.tsx  # Wallet connection context
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-mobile.tsx     # Mobile detection hook
│   │   ├── use-toast.ts       # Toast notification hook
│   │   ├── useAppState.ts     # App state management hook
│   │   ├── useUrStakeContract.ts # APT staking contract hook
│   │   ├── useUSDC.ts         # USDC token operations hook
│   │   ├── useUSDCStaking.ts  # USDC staking contract hook
│   │   ├── useWallet.ts       # Wallet connection hook
│   │   └── useWalletPrompt.ts # Wallet connection prompts
│   ├── pages/                  # Application pages
│   │   ├── Dashboard.tsx      # Main dashboard with portfolio overview
│   │   ├── Faucet.tsx         # Testnet token faucet
│   │   ├── Index.tsx          # Landing page
│   │   ├── NotFound.tsx       # 404 page
│   │   ├── SendUsdc.tsx       # USDC transfer functionality
│   │   ├── StakingInterface.tsx # Main staking interface
│   │   ├── StakingPositions.tsx # Detailed position management
│   │   └── TransactionHistory.tsx # Transaction history viewer
│   ├── utils/                  # Utility functions
│   │   ├── contractTest.ts    # Contract testing utilities
│   │   └── priceService.ts    # Price fetching services
│   ├── App.tsx                # Main application component
│   ├── main.tsx              # Application entry point
│   └── index.css             # Global styles
├── package.json              # Dependencies and scripts
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
└── README.md               # This file
```

## 🛠️ Technology Stack

### Frontend Framework

- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server

### UI Framework

- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality component library
- **Lucide React**: Beautiful icons

### Blockchain Integration

- **@aptos-labs/wallet-adapter-react**: Wallet connection
- **@aptos-labs/ts-sdk**: Aptos TypeScript SDK
- **React Query**: Data fetching and caching

### State Management

- **React Context**: Global state management
- **Custom Hooks**: Encapsulated business logic

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Aptos wallet (Petra, Martian, etc.)
- APT tokens for testnet (use built-in faucet)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/alade-dev/aptos-yield-flow.git
   cd aptos-yield-flow/client
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**:

   ```bash
   npm run dev
   ```

5. **Access the application**:
   Open [http://localhost:8080](http://localhost:8080) in your browser

### Useful Variables

```bash
# Aptos Network Configuration
APTOS_NETWORK=testnet
APTOS_NODE_URL=https://fullnode.testnet.aptoslabs.com/v1
APTOS_FAUCET_URL=https://faucet.testnet.aptoslabs.com

# Contract Addresses (automatically configured)
URSTAKE_ADDRESS=0x6e61dc7e5a207d5470d195312bf7fd99124dd8593bbb11094a0a145a89c29923
```

## 📱 Application Pages

### 🏠 Landing Page (`/`)

- Hero section with branding
- Feature highlights
- Call-to-action buttons
- Navigation to main app

### 📊 Dashboard (`/dashboard`)

- Portfolio overview with total value
- Active staking positions
- Recent transaction history
- Quick action buttons
- Performance metrics

### 💰 Staking Interface (`/stake`)

- APT and USDC staking tabs
- Amount input with validation
- Exchange rate display
- Staking confirmation
- Transaction status

### 📈 Staking Positions (`/staking-positions`)

- Detailed view of all positions
- Individual position cards
- Rewards calculations
- Management actions
- Performance analytics

### 📜 Transaction History (`/transaction-history`)

- Complete transaction log
- Filterable by type and status
- Transaction details
- Progress tracking for pending operations

### 🚰 Faucet (`/faucet`)

- APT token faucet (external)
- USDC token minting (internal)
- Balance display
- One-click token acquisition

### 📤 Send USDC (`/send`)

- USDC transfer interface
- Address validation
- Amount confirmation
- Transaction tracking

## 🔧 Key Components

### Wallet Integration

```typescript
// Example wallet connection
const { connected, account, signAndSubmitTransaction } = useWallet();

if (connected) {
  // User is connected, show app interface
}
```

### Smart Contract Interaction

```typescript
// Staking APT tokens
const { stakeApt, getUserStakeInfo } = useUrStakeContract();

const handleStake = async (amount: number) => {
  const result = await stakeApt(amount);
  if (result.success) {
    // Handle success
  }
};
```

### Real-time Data

```typescript
// Fetching user positions
const { userStakeInfo, protocolStats } = useUrStakeContract();
const { userUSDCStakeInfo, usdcProtocolStats } = useUSDCStaking();
```

## 🎨 UI/UX Features

### Design System

- **Consistent Theming**: Dark theme with blue/purple accents
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Keyboard navigation and screen reader support
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages

### Interactive Elements

- **Toast Notifications**: Success/error feedback
- **Loading Spinners**: Transaction progress indicators
- **Modal Dialogs**: Wallet connection and confirmations
- **Progressive Disclosure**: Advanced features when needed

## 🧪 Testing

### Development Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build
```

### User Testing

1. Connect your Aptos wallet
2. Visit `/faucet` to get test tokens
3. Try staking APT and USDC
4. Monitor positions in dashboard
5. Test unstaking operations

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel/Netlify

1. Connect your repository
2. Set environment variables
3. Deploy from main branch
4. Configure custom domain (optional)

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "preview"]
```

## 🔒 Security Considerations

- **Input Validation**: All user inputs are validated client and server-side
- **Transaction Signing**: All transactions require explicit user approval
- **Error Handling**: Graceful error handling prevents crashes
- **Rate Limiting**: Built-in protection against spam transactions
- **Audit Trail**: Complete transaction history for transparency

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Update documentation for new features
- Test thoroughly before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline comments
- **Issues**: Open a GitHub issue for bugs or feature requests
- **Community**: Join our Discord for discussions

## 🔮 Roadmap

### Phase 1 (Current)

- ✅ Basic APT staking
- ✅ USDC staking integration
- ✅ Dashboard and portfolio tracking
- ✅ Transaction history
- ✅ Testnet faucet

### Phase 2 (Planned)

- 🔄 Governance integration
- 🔄 Advanced analytics
- 🔄 Mobile app
- 🔄 Multi-language support

### Phase 3 (Future)

- 📋 Cross-chain integration
- 📋 Advanced DeFi features
- 📋 Institutional features
- 📋 Mainnet deployment

---

Built with ❤️ for the Aptos ecosystem
