import { useState } from "react";
import { useWallet as useAptosWallet } from "@aptos-labs/wallet-adapter-react";
import { useWallet } from "@/hooks/useWallet";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Wallet,
  LogOut,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  ChevronDown,
  User,
} from "lucide-react";

const WalletConnection = () => {
  const { connected, walletAddress, disconnect } = useWallet();
  const { connect, wallets } = useAptosWallet();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Protected routes that require wallet connection
  const protectedRoutes = ["/dashboard", "/stake"];
  const isProtectedRoute = protectedRoutes.includes(location.pathname);

  const handleConnect = async (walletName: string) => {
    setIsConnecting(true);
    try {
      await connect(walletName);
      setIsDialogOpen(false);
    } catch (error) {
      // console.error("Failed to connect wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast.success("Wallet disconnected successfully");
      // If we're on a protected route, navigate to home after disconnect
      if (isProtectedRoute) {
        navigate("/");
      }
    } catch (error) {
      // console.error("Failed to disconnect wallet:", error);
      toast.error("Failed to disconnect wallet");
    }
  };

  const copyAddressToClipboard = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast.success("Address copied to clipboard!");
    }
  };

  if (connected && walletAddress) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 hover:bg-green-100 text-green-800"
          >
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-fit">
          <DropdownMenuItem onClick={copyAddressToClipboard}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDisconnect}
            className="text-red-600 focus:text-red-600"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          data-wallet-connect-trigger
        >
          <Wallet className="h-4 w-4 mr-2" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-center text-xl">
            Welcome to UrStake
          </DialogTitle>
          <DialogDescription>
            Choose a wallet to connect to UrStake. Make sure you have the wallet
            extension installed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {wallets?.map((wallet) => {
            const isInstalled = wallet.readyState === "Installed";

            return (
              <Card
                key={wallet.name}
                className={`cursor-pointer transition-all duration-200 ${
                  isInstalled
                    ? "hover:shadow-md hover:border-blue-300"
                    : "opacity-60"
                }`}
                onClick={() =>
                  isInstalled && !isConnecting && handleConnect(wallet.name)
                }
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                        {wallet.icon ? (
                          <img
                            src={wallet.icon}
                            alt={wallet.name}
                            className="w-8 h-8 rounded"
                          />
                        ) : (
                          wallet.name.slice(0, 2)
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{wallet.name}</h3>
                        <p className="text-sm text-gray-500">
                          {isInstalled ? "Ready to connect" : "Not installed"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {isInstalled ? (
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Installed
                        </Badge>
                      ) : (
                        <div className="flex space-x-2">
                          <Badge variant="secondary">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Not Found
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (wallet.url) {
                                window.open(wallet.url, "_blank");
                              } else if (wallet.name === "Petra") {
                                window.open("https://petra.app/", "_blank");
                              }
                            }}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Install
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <ExternalLink className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900">New to Aptos wallets?</p>
              <p className="text-blue-700">
                We recommend Petra wallet for the best experience. It's secure,
                easy to use, and has great Aptos ecosystem support.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnection;
