import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-screen relative overflow-hidden bg-background">
      {/* Subtle Background Curves */}
      <div className="absolute inset-0 opacity-20">
        <svg className="absolute top-1/4 left-0 w-full h-full" viewBox="0 0 1200 800" fill="none">
          <path 
            d="M-100 400C200 300 400 500 600 400C800 300 1000 500 1300 400" 
            stroke="url(#gradient1)" 
            strokeWidth="1" 
            fill="none"
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
              <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container mx-auto px-4 lg:px-8 pt-32 pb-16 relative z-10">
        <div className="flex flex-col items-center text-center space-y-12">
          
          {/* Logo Section */}
          <div className="flex flex-col items-center space-y-8">
            {/* Logo Icon */}
            <div className="w-32 h-20 bg-foreground rounded-lg flex items-center justify-center relative">
              <div className="absolute top-2 left-2 w-3 h-3 bg-background rounded-full"></div>
              <div className="absolute top-2 left-7 w-2 h-2 bg-background rounded-full"></div>
              <div className="absolute top-6 left-4 w-2 h-2 bg-background rounded-full"></div>
              <TrendingUp size={28} className="text-background" />
            </div>
            
            {/* Main Title */}
            <h1 className="text-6xl lg:text-8xl font-light text-foreground tracking-wide">
              APTOSSTAKE PRO
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-2xl lg:text-3xl text-foreground font-light max-w-3xl">
            The Ultimate Liquid Staking Platform on Aptos
          </p>

          {/* Powered By Badge */}
          <div className="inline-flex items-center space-x-3 bg-primary/20 border border-primary/30 rounded-full px-6 py-3">
            <div className="w-5 h-5 bg-primary rounded-sm flex items-center justify-center">
              <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
            </div>
            <span className="text-primary font-medium">Powered by Aptos Blockchain</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <Button 
              variant="outline" 
              size="lg" 
              className="border-foreground text-foreground hover:bg-foreground hover:text-background px-8 py-3 rounded-lg font-medium"
            >
              Launch App
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