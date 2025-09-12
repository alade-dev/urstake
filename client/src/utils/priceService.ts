import { AptosAccount, AptosClient } from "aptos";

export interface PriceData {
  price: number;
  decimals: number;
  timestamp: number;
}

class PriceService {
  private static instance: PriceService;
  private cachedPrice: PriceData | null = null;
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 30000; // 30 seconds cache

  // Pyth Hermes API endpoint for real-time price updates
  private readonly HERMES_API = "https://hermes.pyth.network";

  // APT/USD price feed ID (with 0x prefix for API calls)
  private readonly APT_USD_FEED_ID =
    "0x03ae4db29ed4ae33d323568895aa00337e658e348b37509f5372ae51f0af00d5";

  private constructor() {}

  public static getInstance(): PriceService {
    if (!PriceService.instance) {
      PriceService.instance = new PriceService();
    }
    return PriceService.instance;
  }

  /**
   * Get APT/USD price from cache or fetch new data
   */
  async getAptPrice(): Promise<number> {
    const now = Date.now();

    // Return cached price if it's still fresh
    if (this.cachedPrice && now - this.lastFetch < this.CACHE_DURATION) {
      return this.cachedPrice.price;
    }

    try {
      // Fetch from Pyth Hermes API
      const price = await this.fetchPriceFromHermes();

      this.cachedPrice = {
        price,
        decimals: 8, // Pyth standard
        timestamp: now,
      };
      this.lastFetch = now;

      return price;
    } catch (error) {
      console.error("Failed to fetch APT price:", error);

      // Fall back to cached price if available
      if (this.cachedPrice) {
        return this.cachedPrice.price;
      }

      // Ultimate fallback - return a reasonable default
      return 0; // Conservative fallback price
    }
  }

  /**
   * Fetch price from Pyth Hermes API
   */
  private async fetchPriceFromHermes(): Promise<number> {
    try {
      const response = await fetch(
        `${this.HERMES_API}/api/latest_price_feeds?ids[]=${this.APT_USD_FEED_ID}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error("Invalid response format");
      }

      const priceData = data[0];
      if (!priceData || !priceData.price) {
        throw new Error("Price data not found");
      }

      // Pyth returns price as string with exponent
      const price = parseFloat(priceData.price.price);
      const expo = priceData.price.expo;

      // Convert to actual price (price * 10^expo)
      const actualPrice = price * Math.pow(10, expo);

      return actualPrice;
    } catch (error) {
      console.error("Hermes API error:", error);
      throw error;
    }
  }

  /**
   * Get price updates for on-chain transactions
   * This is needed when calling contract functions that require price updates
   */
  async getPriceUpdateData(): Promise<string[]> {
    try {
      const response = await fetch(
        `${this.HERMES_API}/api/latest_vaas?ids[]=${this.APT_USD_FEED_ID}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("No price update data available");
      }

      // Return the VAA (Verifiable Action Approval) data for on-chain updates
      return data.map((item: { vaa: string }) => item.vaa);
    } catch (error) {
      console.error("Failed to get price update data:", error);
      throw error;
    }
  }

  /**
   * Format price for display with proper decimals
   */
  formatPrice(price: number, decimals: number = 2): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(price);
  }

  /**
   * Convert APT amount to USD value
   */
  async convertAptToUsd(aptAmount: number): Promise<number> {
    const aptPrice = await this.getAptPrice();
    return aptAmount * aptPrice;
  }

  /**
   * Get formatted USD value for APT amount
   */
  async getFormattedUsdValue(aptAmount: number): Promise<string> {
    const usdValue = await this.convertAptToUsd(aptAmount);
    return this.formatPrice(usdValue);
  }

  /**
   * Clear cached price data
   */
  clearCache(): void {
    this.cachedPrice = null;
    this.lastFetch = 0;
  }
}

// Export singleton instance
export const priceService = PriceService.getInstance();

// Export utility functions for easy use
export const getAptPrice = () => priceService.getAptPrice();
export const convertAptToUsd = (aptAmount: number) =>
  priceService.convertAptToUsd(aptAmount);
export const formatPrice = (price: number, decimals?: number) =>
  priceService.formatPrice(price, decimals);
export const getFormattedUsdValue = (aptAmount: number) =>
  priceService.getFormattedUsdValue(aptAmount);
