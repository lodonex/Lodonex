import { Language } from "../types";

/**
 * Formats a price value based on the current language selection.
 * In English mode, shows in USD ($) using a conversion rate of 1 USD = 120 BDT.
 * In Bengali mode, shows in BDT (৳).
 */
export function formatPrice(price: number, lang: Language): string {
  if (lang === "en") {
    const usdPrice = Math.round(price / 120);
    return `$${usdPrice}`;
  }
  return `৳${price.toLocaleString("en-IN")}`;
}
