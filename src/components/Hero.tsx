import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, Shield, Zap, Users } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-screen relative overflow-hidden bg-gradient-hero">
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-primary/20 rounded-full"></div>
        <div className="absolute top-3/4 right-1/4 w-32 h-32 border border-primary/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-primary/10 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 pt-24 pb-16 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">
          
          {/* Logo Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 bg-gradient-card rounded-2xl shadow-card border border-border/50 flex items-center justify-center backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <TrendingUp size={24} className="text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-foreground tracking-tight">
              AptosStake Pro
            </h1>
          </div>

          {/* Tagline */}
          <div className="max-w-4xl space-y-4">
            <p className="text-2xl lg:text-3xl text-muted-foreground font-medium">
              The Ultimate Liquid Staking Platform on Aptos
            </p>
            <p className="text-lg lg:text-xl text-muted-foreground/80 max-w-2xl mx-auto">
              Stake, earn, trade, and optimize your yield through intelligent protocol integration and automated strategies
            </p>
          </div>

          {/* Powered By Badge */}
          <div className="flex items-center space-x-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-full px-6 py-3">
            <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
              <Shield size={12} className="text-primary-foreground" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Powered by Aptos Blockchain</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button variant="hero" size="lg" className="shadow-glow">
              Launch Staking Platform
            </Button>
            <Button variant="secondary" size="lg">
              Join Community
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 w-full max-w-4xl">
            <Card className="bg-gradient-card border-border/50 shadow-card backdrop-blur-sm p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <TrendingUp size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">12.5%</p>
                  <p className="text-sm text-muted-foreground">Average APY</p>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-card border-border/50 shadow-card backdrop-blur-sm p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Zap size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">$2.5M+</p>
                  <p className="text-sm text-muted-foreground">Total Value Locked</p>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-card border-border/50 shadow-card backdrop-blur-sm p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Users size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">1,250+</p>
                  <p className="text-sm text-muted-foreground">Active Stakers</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;