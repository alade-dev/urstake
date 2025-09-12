import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import WalletProvider from "@/context/WalletContext";
import WalletModal from "@/components/WalletModal";
import { useWallet } from "@/hooks/useWallet";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import StakingInterface from "./pages/StakingInterface";
import TransactionHistory from "./pages/TransactionHistory";
import StakingPositions from "./pages/StakingPositions";
import SendUsdc from "./pages/SendUsdc";
import Faucet from "./pages/Faucet";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <>
    <WalletModal
      isOpen={false}
      onClose={function (): void {
        throw new Error("Function not implemented.");
      }}
    />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/stake" element={<StakingInterface />} />
      <Route path="/send" element={<SendUsdc />} />
      <Route path="/faucet" element={<Faucet />} />
      <Route path="/transaction-history" element={<TransactionHistory />} />
      <Route path="/staking-positions" element={<StakingPositions />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <WalletProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </WalletProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
