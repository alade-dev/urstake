import { useState, useEffect } from "react";
import { useWallet } from "@/hooks/useWallet";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X, Wallet, AlertTriangle } from "lucide-react";
import { useLocation } from "react-router-dom";

interface WalletNotificationProps {
  onConnectClick?: () => void;
}

const WalletNotification = ({ onConnectClick }: WalletNotificationProps) => {
  const { connected } = useWallet();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const location = useLocation();

  // Only show on protected routes (dashboard and stake pages)
  const protectedRoutes = ["/dashboard", "/stake"];
  const isProtectedRoute = protectedRoutes.includes(location.pathname);

  // Reset dismissal when location changes or wallet connection status changes
  useEffect(() => {
    setIsDismissed(false);
  }, [location.pathname, connected]);

  // Show notification immediately when wallet is not connected on protected routes
  useEffect(() => {
    if (!connected && !isDismissed && isProtectedRoute) {
      setShowNotification(true);
    } else {
      setShowNotification(false);
    }
  }, [connected, isDismissed, isProtectedRoute]);

  if (connected || isDismissed || !showNotification) {
    return null;
  }

  const handleConnectClick = () => {
    // Scroll to top to show the navigation with connect button
    window.scrollTo({ top: 0, behavior: "smooth" });

    // If a custom connect handler is provided, use it
    if (onConnectClick) {
      onConnectClick();
    } else {
      // Focus on the connect wallet button in navigation after scroll
      setTimeout(() => {
        const connectButton = document.querySelector(
          "[data-wallet-connect-trigger]"
        );
        if (connectButton) {
          (connectButton as HTMLElement).click();
        }
      }, 500);
    }
  };

  return (
    <div className="fixed top-20 left-4 right-4 z-40 max-w-lg mx-auto">
      <Alert className="bg-amber-50 border-amber-200 shadow-xl border-2 animate-in slide-in-from-top-2 duration-300">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <AlertDescription className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-amber-800 font-semibold">
              Please connect your wallet to access this page
            </span>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Button
              size="sm"
              className="h-8 px-4 text-xs bg-blue-600 hover:bg-blue-700 text-white border-0"
              onClick={handleConnectClick}
            >
              <Wallet className="h-3 w-3 mr-1" />
              Connect Wallet
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-amber-600 hover:bg-amber-100"
              onClick={() => setIsDismissed(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default WalletNotification;
