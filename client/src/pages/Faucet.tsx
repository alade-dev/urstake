import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useUSDC } from "@/hooks/useUSDC";
import { useToast } from "@/hooks/use-toast";
import { useUSDCCoin } from "@/hooks/useUSDCCoin";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navigation from "@/components/Navigation";
import {
  Coins,
  ArrowLeft,
  ExternalLink,
  Copy,
  CheckCircle,
  AlertCircle,
  Info,
  DollarSign,
  Wallet,
  Globe,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import aptosLogo from "@/assets/logo/aptos.png";
import usdcLogo from "@/assets/logo/usdc.png";
import { useNavigate } from "react-router-dom";

interface FaucetOption {
  name: string;
  symbol: string;
  description: string;
  amount: string;
  logo: string;
  faucetUrl: string;
  instructions: string[];
  network: string;
  status: "available" | "maintenance" | "limited";
}

const Faucet = () => {
  const { walletAddress } = useWallet();
  const { mintUSDC, registerForUSDC, refreshUSDCBalance } = useUSDC();
  const { usdcCoinBalance } = useUSDCCoin();
  const { toast } = useToast();
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [loadingFaucets, setLoadingFaucets] = useState<string[]>([]);
  const [mintingUSDC, setMintingUSDC] = useState(false);
  const [mintAmount, setMintAmount] = useState("1");

  const faucetOptions: FaucetOption[] = [
    {
      name: "Aptos",
      symbol: "APT",
      description: "Native Aptos token for gas fees and staking",
      amount: "1.0 APT",
      logo: aptosLogo,
      faucetUrl: "https://aptos.dev/network/faucet",
      network: "Aptos Testnet",
      status: "available",
      instructions: [
        "Visit the official Aptos faucet",
        "Connect your wallet or paste your address",
        "Click 'Fund Account' to receive test APT",
        "Wait for the transaction to complete",
        "Check your wallet for the received tokens",
      ],
    },
    {
      name: "USDC",
      symbol: "USDC",
      description: "Official USDC from Circle ",
      amount: "10 USDC",
      logo: usdcLogo,
      faucetUrl: "https://faucet.circle.com/",
      network: "Aptos Testnet",
      status: "available",
      instructions: [
        "Visit the Circle USDC faucet",
        "Select 'Aptos Testnet' from the network dropdown",
        "Paste your wallet address",
        "Complete any verification if required",
        "Click 'Get USDC' to receive test tokens",
        "Wait for the transaction to complete",
      ],
    },
  ];

  const navigate = useNavigate();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const openFaucet = (faucet: FaucetOption) => {
    setLoadingFaucets([...loadingFaucets, faucet.symbol]);
    window.open(faucet.faucetUrl, "_blank", "noopener,noreferrer");
    setTimeout(() => {
      setLoadingFaucets(loadingFaucets.filter((f) => f !== faucet.symbol));
    }, 3000);
  };

  const handleMintUSDC = async () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to mint USDC",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(mintAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (amount > 10) {
      toast({
        title: "Amount Too Large",
        description: "Maximum mint amount is 10 USDC",
        variant: "destructive",
      });
      return;
    }

    setMintingUSDC(true);
    try {
      // First register for USDC if needed
      try {
        await registerForUSDC();
      } catch (registrationError) {
        // Registration might fail if already registered, that's okay
        console.log("Registration result:", registrationError);
      }

      // Then mint USDC
      const result = await mintUSDC(amount);

      if (result.success) {
        toast({
          title: "USDC Minted Successfully!",
          description: `${amount} USDC has been minted to your wallet`,
        });
        setMintAmount("");
        // Refresh balance after successful mint
        setTimeout(() => {
          refreshUSDCBalance();
        }, 2000);
      } else {
        toast({
          title: "Minting Failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Minting error:", error);
      toast({
        title: "Minting Failed",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setMintingUSDC(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-900 text-green-300";
      case "maintenance":
        return "bg-red-900 text-red-300";
      case "limited":
        return "bg-yellow-900 text-yellow-300";
      default:
        return "bg-gray-900 text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-4 w-4" />;
      case "maintenance":
        return <AlertCircle className="h-4 w-4" />;
      case "limited":
        return <Info className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background */}
      <div className="absolute inset-0 opacity-25">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1200 800"
          fill="none"
        >
          <path
            d="M-100 150C350 50 550 250 750 150C950 50 1150 250 1450 150"
            stroke="url(#faucetGradient1)"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M-100 450C250 350 450 550 650 450C850 350 1050 550 1350 450"
            stroke="url(#faucetGradient2)"
            strokeWidth="2"
            fill="none"
          />
          <defs>
            <linearGradient
              id="faucetGradient1"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient
              id="faucetGradient2"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10">
        <Navigation />

        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="text-gray-400 hover:text-white mb-4"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                    <Coins className="h-10 w-10 mr-3 text-blue-400" />
                    Testnet Faucet
                  </h1>
                  <p className="text-gray-400">
                    Get test tokens to explore UrStake features on Aptos testnet
                  </p>
                </div>
              </div>
            </div>
            {/* Network Warning */}
            {!walletAddress && (
              <Card className="bg-yellow-900/20 border-yellow-600/30 backdrop-blur-sm mb-8">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                    <div>
                      <h3 className="text-yellow-300 font-medium">
                        Wallet Not Connected
                      </h3>
                      <p className="text-yellow-200 text-sm mt-1">
                        Connect your wallet to see your address and easily copy
                        it for the faucets.
                        <span className="text-yellow-200 block mt-3">
                          Easy mint of USDC token for staking purposes
                        </span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Important Notice */}
            <Card className="bg-blue-900/20 border-blue-600/30 backdrop-blur-sm mb-8">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-blue-300 font-medium mb-2">
                      Important Information
                    </h3>
                    <ul className="text-blue-200 text-sm space-y-1">
                      <li>• These are test tokens with no real value</li>
                      <li>
                        • Use only on Aptos testnet for development and testing
                      </li>
                      <li>
                        • Faucets may have rate limits and daily restrictions
                      </li>
                      <li>
                        • Make sure your wallet is connected to Aptos testnet
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wallet Address Display */}
            {walletAddress && (
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm mb-8">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Wallet className="h-5 w-5 mr-2" />
                    Your Wallet Address
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Copy this address to use with the faucets below
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <span className="font-mono text-white text-sm break-all">
                      {walletAddress}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(walletAddress)}
                      className="ml-2 text-gray-400 hover:text-white"
                    >
                      {copiedAddress ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Faucet Options */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                External Faucets
              </h2>
              <p className="text-gray-400">
                Official faucets from Aptos and Circle for getting standard test
                tokens
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faucetOptions.map((faucet) => (
                <Card
                  key={faucet.symbol}
                  className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:border-gray-600 transition-all duration-200"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center p-2">
                          <img
                            src={faucet.logo}
                            alt={faucet.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <CardTitle className="text-white">
                            {faucet.name} Faucet
                          </CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge
                              variant="secondary"
                              className="bg-blue-900 text-blue-300"
                            >
                              {faucet.symbol}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className={getStatusColor(faucet.status)}
                            >
                              {getStatusIcon(faucet.status)}
                              <span className="ml-1 capitalize">
                                {faucet.status}
                              </span>
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-gray-400">
                      {faucet.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Amount and Network */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400 text-sm">
                            Amount
                          </Label>
                          <p className="text-white font-semibold">
                            {faucet.amount}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400 text-sm">
                            Network
                          </Label>
                          <p className="text-white font-semibold flex items-center">
                            <Globe className="h-4 w-4 mr-1" />
                            {faucet.network}
                          </p>
                        </div>
                      </div>

                      {/* Instructions */}
                      <div>
                        <Label className="text-gray-400 text-sm mb-2 block">
                          Instructions
                        </Label>
                        <ol className="text-sm text-gray-300 space-y-1">
                          {faucet.instructions.map((instruction, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-blue-400 mr-2 font-medium">
                                {index + 1}.
                              </span>
                              <span>{instruction}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Action Button */}
                      <Button
                        className="w-full  bg-blue-600 hover:bg-blue-700"
                        onClick={() => openFaucet(faucet)}
                        disabled={
                          faucet.status === "maintenance" ||
                          loadingFaucets.includes(faucet.symbol)
                        }
                      >
                        {loadingFaucets.includes(faucet.symbol) ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Opening Faucet...
                          </>
                        ) : (
                          <>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open {faucet.name} Faucet
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* USDC Minting Section */}
            {walletAddress && (
              <Card className="bg-green-900/20 border-green-600/30 backdrop-blur-sm mt-8">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Coins className="h-5 w-5 mr-2 text-green-400" />
                    Mint Test USD Coin
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Mint USDC directly to your wallet for testing staking
                    features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <span className="text-gray-300">
                        Current USDC Balance:
                      </span>
                      <span className="font-mono text-green-400 font-semibold">
                        {usdcCoinBalance.toFixed(2)} USDC
                      </span>
                    </div>

                    <div className="flex space-x-3">
                      <div className="flex-1">
                        <Label
                          htmlFor="mintAmount"
                          className="text-gray-300 text-sm"
                        >
                          Amount to Mint
                        </Label>
                        <Input
                          id="mintAmount"
                          type="number"
                          value={mintAmount}
                          onChange={(e) => setMintAmount(e.target.value)}
                          placeholder="1"
                          min="1"
                          max="10"
                          className="bg-gray-700 border-gray-600 text-white mt-1"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          onClick={handleMintUSDC}
                          disabled={mintingUSDC || !walletAddress}
                          className="bg-green-600 hover:bg-green-700 px-6"
                        >
                          {mintingUSDC ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Minting...
                            </>
                          ) : (
                            <>
                              <Zap className="h-4 w-4 mr-2" />
                              Mint USDC
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="text-sm text-gray-400 space-y-1">
                      <p>• Maximum: 10 USDC per transaction</p>
                      <p>• No rate limits for testing purposes</p>
                      <p>• Tokens will appear in your wallet within seconds</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Resources */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm mt-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  What's Next?
                </CardTitle>
                <CardDescription className="text-gray-400">
                  After getting your test tokens, try these features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link to="/stake">
                    <div className="p-4 h-40 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer">
                      <DollarSign className="h-6 w-6 text-green-400 mb-2" />
                      <h3 className="text-white font-medium mb-1">
                        Stake Your Tokens
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Start earning rewards by staking APT or USDC
                      </p>
                    </div>
                  </Link>
                  <Link to="/dashboard">
                    <div className="p-4 h-40 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer">
                      <Wallet className="h-6 w-6 text-blue-400 mb-2" />
                      <h3 className="text-white font-medium mb-1">
                        View Dashboard
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Monitor your portfolio and staking positions
                      </p>
                    </div>
                  </Link>
                  <Link to="/send">
                    <div className="p-4 h-40 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer">
                      <Coins className="h-6 w-6 text-purple-400 mb-2" />
                      <h3 className="text-white font-medium mb-1">Send USDC</h3>
                      <p className="text-gray-400 text-sm">
                        Test the USDC transfer functionality
                      </p>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faucet;
