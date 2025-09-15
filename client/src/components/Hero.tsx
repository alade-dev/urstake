import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useWallet } from "@/hooks/useWallet";
import UrStakeLogo from "./UrStakeLogo";
import logo from "../assets/logo/aptos.png";

const Hero = () => {
  const { connected } = useWallet();
  const navigate = useNavigate();

  const handleLaunchApp = () => {
    // Simply navigate to dashboard - the WalletModal will handle wallet connection if needed
    navigate("/dashboard");
  };

  return (
    <section className="min-h-screen relative overflow-hidden bg-transparent">
      {/* Enhanced Background Curves */}
      <div className="absolute inset-0 opacity-40">
        <svg
          className="absolute top-1/4 left-0 w-full h-full"
          viewBox="0 0 1200 800"
          fill="none"
        >
          <path
            d="M-100 400C200 300 400 500 600 400C800 300 1000 500 1300 400"
            stroke="url(#heroGradient1)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M-100 200C300 100 500 300 700 200C900 100 1100 300 1400 200"
            stroke="url(#heroGradient2)"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M-100 600C250 500 450 700 650 600C850 500 1050 700 1350 600"
            stroke="url(#heroGradient3)"
            strokeWidth="1"
            fill="none"
          />
          <defs>
            <linearGradient
              id="heroGradient1"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient
              id="heroGradient2"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient
              id="heroGradient3"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#EC4899" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container mx-auto px-4 lg:px-8 pt-32 pb-5 relative z-10">
        <div className="flex flex-col items-center text-center space-y-12">
          {/* Logo Section */}
          <div className="flex flex-col items-center space-y-8">
            {/* Logo Icon */}
            <UrStakeLogo size="lg" />

            {/* Main Title */}
            <h1 className="text-6xl lg:text-8xl font-light text-white tracking-wide">
              UrStake
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-2xl lg:text-3xl text-gray-200 font-light max-w-3xl">
            The Ultimate Liquid Staking Platform on Aptos
          </p>

          {/* Powered By Badge */}
          <div className="inline-flex items-center space-x-3 bg-blue-600/20 border border-blue-500/30 rounded-full px-6 py-3">
            <img src={logo} alt="Aptos Blockchain Logo" className="h-6 w-6" />
            <span className="text-blue-200 font-medium">
              Powered by Aptos Blockchain
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <Button
              variant="hero"
              size="lg"
              className="hidden md:inline-flex"
              onClick={handleLaunchApp}
            >
              {connected ? "Go to Dashboard" : "Launch App"}
            </Button>

            <Button
              variant="default"
              size="lg"
              className="bg-muted text-foreground hover:bg-muted/80 px-8 py-3 rounded-lg font-medium"
            >
              Join Community
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
