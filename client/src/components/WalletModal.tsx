import { useState } from "react";
import { useWallet as useAptosWallet } from "@aptos-labs/wallet-adapter-react";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Download, CheckCircle, AlertCircle } from "lucide-react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletModal = ({ isOpen, onClose }: WalletModalProps) => {
  const { connected } = useWallet();
  const { connect, wallets } = useAptosWallet();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async (walletName: string) => {
    setIsConnecting(true);
    try {
      await connect(walletName);
      onClose();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogContent className="sm:max-w-md z-50">
          <DialogHeader>
            <DialogTitle className="flex justify-center text-xl">
              Welcome to UrStake
            </DialogTitle>
            <DialogDescription>
              Please connect your wallet to perform blockchain transactions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {wallets.map((wallet) => {
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
                            <span>{wallet.name.slice(0, 2)}</span>
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
                                if (wallet.name === "Petra") {
                                  window.open("https://petra.app/", "_blank");
                                }
                              }}
                            >
                              <Download className="h-3 w-3 mr-1" />
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
                <p className="font-medium text-blue-900">
                  New to Aptos wallets?
                </p>
                <p className="text-blue-700">
                  We recommend Petra wallet for the best experience. It's
                  secure, easy to use, and has great Aptos ecosystem support.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button variant="hero" className="w-full" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default WalletModal;
