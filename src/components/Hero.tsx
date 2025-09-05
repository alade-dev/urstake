import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="min-h-screen relative overflow-hidden bg-background flex items-center justify-center">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5"></div>
      
      <div className="container mx-auto px-4 lg:px-8 pt-16 pb-32 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          
          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-normal text-foreground leading-tight">
              Unleash the power of
            </h1>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-normal">
              <span className="text-foreground">APTOS </span>
              <span className="text-primary font-semibold">STAKE</span>
            </h2>
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <Button 
              variant="default" 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-medium rounded-full transition-all duration-300 hover:scale-105"
            >
              Maximize Your Yield
            </Button>
          </div>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto pt-4">
            The ultimate liquid staking platform on Aptos blockchain. Stake, earn, and optimize your yield through intelligent protocol integration.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;