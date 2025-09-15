import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import UrStakeLogo from "@/components/UrStakeLogo";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // console.error(
    //   "404 Error: User attempted to access non-existent route:",
    //   location.pathname
    // );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />

      {/* Main 404 Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="text-center max-w-md mx-auto">
          {/* Animated 404 with gradient text */}
          <div className="mb-8">
            <h1 className="text-8xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent animate-pulse">
              404
            </h1>
            <div className="flex items-center justify-center mt-4 mb-6">
              <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
            </div>
          </div>

          {/* Error message */}
          <div className="mb-8 space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              Oops! Page not found
            </h2>
            <p className="text-gray-400 leading-relaxed">
              The page you're looking for doesn't exist or has been moved. Let's
              get you back on track with UrStake.
            </p>
            <div className="text-sm text-gray-500 font-mono bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700">
              Path: <span className="text-red-400">{location.pathname}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="w-full sm:w-auto border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Helpful links */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <p className="text-sm text-gray-400 mb-4">
              Looking for something specific?
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                to="/dashboard"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/stake"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Staking
              </Link>
              <Link
                to="/positions"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Positions
              </Link>
              <Link
                to="/history"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                History
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements for visual appeal */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800/50 border-t border-gray-700 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <UrStakeLogo size="sm" />
            <span className="text-xl font-bold text-white">UrStake</span>
          </div>
          <p className="text-gray-400 text-sm">
            The ultimate liquid staking platform on Aptos blockchain.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;
