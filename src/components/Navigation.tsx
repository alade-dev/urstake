import { Button } from "@/components/ui/button";
import { TrendingUp, Menu, X, ArrowRight } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center">
              <TrendingUp size={14} className="text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              APTOS<span className="text-primary">STAKE</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Features
            </a>
            <a href="#docs" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Docs
            </a>
            <a href="#community" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Contribute
            </a>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-foreground/20 text-foreground hover:bg-foreground hover:text-background group"
            >
              Stake
              <ArrowRight size={14} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/10">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Features
              </a>
              <a href="#docs" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Docs
              </a>
              <a href="#community" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Contribute
              </a>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-foreground/20 text-foreground hover:bg-foreground hover:text-background w-fit group"
              >
                Stake
                <ArrowRight size={14} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;