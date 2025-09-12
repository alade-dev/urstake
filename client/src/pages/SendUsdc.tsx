import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowUpRight,
  Loader2,
  Info,
  RefreshCw,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import { useUSDC } from "@/hooks/useUSDC";
import { useWallet } from "@/hooks/useWallet";
import { useWalletPrompt } from "@/hooks/useWalletPrompt";
import { useUrStakeContract } from "@/hooks/useUrStakeContract";
import Navigation from "@/components/Navigation";
import WalletModal from "@/components/WalletModal";

const SendUsdc = () => {
  const {
    usdcBalance,
    formattedUsdcBalance,
    transferUSDC,
    refreshUSDCBalance,
  } = useUSDC();
  const { getTxUrl } = useUrStakeContract();
  const { connected } = useWallet();
  const { promptConnection, isModalOpen, closeModal } = useWalletPrompt();

  const [usdcAmount, setUsdcAmount] = useState("");
  const [usdcRecipient, setUsdcRecipient] = useState("");
  const [isSendingUsdc, setIsSendingUsdc] = useState(false);

  // Input validation helper functions
  const validateNumericInput = (value: string) => {
    // Limit input length to prevent extremely large numbers
    if (value.length > 12) {
      return value.substring(0, 12);
    }

    // Remove any non-numeric characters except decimal point
    const cleaned = value.replace(/[^0-9.]/g, "");

    // Ensure only one decimal point
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      return parts[0] + "." + parts.slice(1).join("");
    }

    // Prevent leading zeros except for decimal numbers
    if (cleaned.length > 1 && cleaned[0] === "0" && cleaned[1] !== ".") {
      return cleaned.substring(1);
    }

    return cleaned;
  };

  const handleUsdcAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validatedValue = validateNumericInput(e.target.value);
    setUsdcAmount(validatedValue);
  };

  const handleMaxUsdc = () => {
    setUsdcAmount(usdcBalance.toString());
  };

  const handleSendUsdc = async () => {
    const usdcAmountNum = parseFloat(usdcAmount) || 0;

    if (usdcAmountNum <= 0 || !usdcRecipient.trim()) {
      toast.error("Invalid input", {
        description: "Please enter a valid amount and recipient address",
      });
      return;
    }

    // Prompt wallet connection if not connected
    if (!connected) {
      const connectionSuccess = await promptConnection();
      if (!connectionSuccess) {
        toast.error("Wallet connection required", {
          description: "Please connect your wallet to send USDC",
        });
        return;
      }
    }

    setIsSendingUsdc(true);
    try {
      const result = await transferUSDC(usdcRecipient.trim(), usdcAmountNum);

      if (result.success) {
        toast.success("USDC transfer successful!", {
          description: `Sent ${usdcAmountNum} USDC to ${usdcRecipient.slice(
            0,
            6
          )}...${usdcRecipient.slice(-4)}`,
          action: result.txHash
            ? {
                label: "View Transaction",
                onClick: () => window.open(getTxUrl(result.txHash!), "_blank"),
              }
            : undefined,
        });

        // Clear form
        setUsdcAmount("");
        setUsdcRecipient("");

        // Refresh USDC balance
        setTimeout(async () => {
          await refreshUSDCBalance();
        }, 2000);
      } else {
        toast.error("USDC transfer failed", {
          description: result.error,
        });
      }
    } catch (error) {
      toast.error("USDC transfer failed", {
        description: "An unexpected error occurred",
      });
    } finally {
      setIsSendingUsdc(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Aesthetic Background Curves */}
      <div className="absolute inset-0 opacity-30">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1200 800"
          fill="none"
        >
          <path
            d="M-100 200C300 100 500 300 700 200C900 100 1100 300 1400 200"
            stroke="url(#gradient1)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M-100 600C200 500 400 700 600 600C800 500 1000 700 1300 600"
            stroke="url(#gradient2)"
            strokeWidth="1.5"
            fill="none"
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10">
        <Navigation />
        <WalletModal isOpen={isModalOpen} onClose={closeModal} />

        <main className="container mx-auto pt-24 pb-16 px-4">
          <div className="max-w-xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 text-center">Send USDC</h1>
            <p className="text-gray-400 mb-8 text-center">
              Transfer USDC tokens to other wallets
            </p>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">
                    Your USDC Balance
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                    onClick={refreshUSDCBalance}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-3xl font-bold text-white flex items-center">
                  <DollarSign className="h-6 w-6 mr-1 text-green-400" />
                  {formattedUsdcBalance} USDC
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Send USDC</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="recipient" className="text-gray-300">
                    Recipient Address
                  </Label>
                  <Input
                    id="recipient"
                    placeholder="0x..."
                    value={usdcRecipient}
                    onChange={(e) => setUsdcRecipient(e.target.value)}
                    disabled={isSendingUsdc}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="amount" className="text-gray-300">
                      Amount to Send
                    </Label>
                    <span className="text-sm text-gray-400">
                      Available: {usdcBalance.toFixed(2)} USDC
                    </span>
                  </div>
                  <div className="relative">
                    <Input
                      id="amount"
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={usdcAmount}
                      onChange={handleUsdcAmountChange}
                      disabled={isSendingUsdc}
                      onKeyDown={(e) => {
                        // Prevent minus sign and other invalid characters
                        if (
                          e.key === "-" ||
                          e.key === "e" ||
                          e.key === "E" ||
                          e.key === "+"
                        ) {
                          e.preventDefault();
                        }
                      }}
                      className="bg-gray-700 border-gray-600 text-white pr-20"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleMaxUsdc}
                        disabled={isSendingUsdc || usdcBalance <= 0}
                        className="h-6 px-2 text-xs text-gray-400 hover:text-white"
                      >
                        MAX
                      </Button>
                    </div>
                  </div>
                </div>

                {parseFloat(usdcAmount) > usdcBalance && (
                  <Alert className="bg-red-900/50 border-red-700">
                    <Info className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-300">
                      Insufficient balance. You don't have enough USDC.
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={
                    !connected ||
                    parseFloat(usdcAmount) <= 0 ||
                    parseFloat(usdcAmount) > usdcBalance ||
                    !usdcRecipient.trim() ||
                    isSendingUsdc
                  }
                  onClick={handleSendUsdc}
                >
                  {isSendingUsdc ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      Send USDC
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-400 mt-4">
                    Send USDC directly to any Aptos wallet address.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SendUsdc;
