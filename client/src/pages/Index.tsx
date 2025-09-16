import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Integrations from "@/components/Integrations";
import Features from "@/components/Features";
import UrStakeLogo from "@/components/UrStakeLogo";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />
      <main>
        <Hero />
        {/* <Integrations /> */}
        <Features />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800/50 border-t border-gray-700 py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <UrStakeLogo size="sm" />
                <span className="text-xl font-bold text-white">UrStake</span>
              </div>
              <p className="text-gray-400">
                The ultimate liquid staking platform on Aptos blockchain.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-white">Platform</h4>
              <div className="space-y-2">
                <Link
                  to="/stake"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Staking Pools
                </Link>
                <Link
                  to="/staking-positions"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  My Positions
                </Link>
                <Link
                  to="/transaction-history"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Transaction History
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-white">Resources</h4>
              <div className="space-y-2">
                <Link
                  to="/faucet"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Testnet Faucet
                </Link>
                <a
                  href="https://urstake-docs.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Documentation
                </a>
                <a
                  href="https://urstake-docs.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  API Reference
                </a>
                <a
                  href="https://github.com/alade-dev/urstake"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Github
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-white">Community</h4>
              <div className="space-y-2">
                <a
                  href="https://discord.gg/alade_dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Discord
                </a>
                <a
                  href="https://twitter.com/urstake_defi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Twitter
                </a>
                <a
                  href="https://t.me/creativi8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Telegram
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} UrStake. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
