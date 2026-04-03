/**
 * ATHM Pricing Utility
 * 
 * NOTE TO FUTURE DEVELOPERS:
 * Currently, PayFast transaction fees and VAT are "baked in" to the final customer price.
 * Formula used: (Base_Cost + Markup + VAT + Fixed_Fee) / (1 - Variable_Fee_Rate)
 * 
 * If the business decides to switch to a "Show Fee at Checkout" model:
 * 1. Update calculateFinalPrice to return ONLY the VAT-inclusive base.
 * 2. Add the result of calculatePayFastFee in the Checkout.tsx component total.
 * 
 * Current Constants (South Africa):
 * - VAT: 15%
 * - PayFast Card Fee: 3.2% (ex VAT) -> 3.68% (inc VAT)
 * - PayFast Fixed Fee: R2.00 (ex VAT) -> R2.30 (inc VAT)
 */

export const PRICING_CONFIG = {
    vatRate: 0.15,
    payfastVariableFee: 0.032,
    payfastFixedFee: 2.0,
    // Default smart tiers for the SA market
    markupTiers: [
        { minCost: 0, maxCost: 1000, markup: 30 },      // Tier 1: Budget/Accessories
        { minCost: 1000, maxCost: 10000, markup: 18 },  // Tier 2: Consumer/Mid-Range
        { minCost: 10000, maxCost: 20000, markup: 12 }, // Tier 3: Premium (GPUs, Laptops)
        { minCost: 20000, maxCost: 999999, markup: 8 }  // Tier 4: Enthusiast/Enterprise
    ]
};

export interface PriceBreakdown {
    supplierCost: number;     // Original Syntech Price (Excl. VAT)
    markupPercentage: number; // The tier-based markup applied
    markedUpExcl: number;    // After Markup, Before VAT
    vatAmount: number;       // VAT on the marked up price
    feeAmount: number;       // The baked-in PayFast fee recovery
    finalPrice: number;      // What the customer sees (Incl. VAT + Fees)
    netProfit: number;       // Your actual gain after all taxes and fees
}

/**
 * ATHM Pricing Engine
 * Implements a smart Tiered Markup System with full margin protection.
 */
export class PricingEngine {
    /**
     * Finds the correct markup percentage for a given cost.
     */
    static getTierMarkup(cost: number): number {
        const tier = PRICING_CONFIG.markupTiers.find(t => cost >= t.minCost && cost < t.maxCost);
        return tier ? tier.markup : 15; // Fallback to 15%
    }

    /**
     * Calculates the all-inclusive price to be displayed on the storefront.
     */
    static calculateFinalPrice(cost: number, manualMarkup?: number): number {
        // Use tiered markup unless a manual global override is provided
        const markupRate = (manualMarkup !== undefined ? manualMarkup : this.getTierMarkup(cost)) / 100;
        
        const markedUpBase = cost * (1 + markupRate);
        const vatPrice = markedUpBase * (1 + PRICING_CONFIG.vatRate);
        
        // Card Fee Recovery: (Price + Fixed) / (1 - Variable)
        const feeVariable = PRICING_CONFIG.payfastVariableFee * (1 + PRICING_CONFIG.vatRate);
        const feeFixed = PRICING_CONFIG.payfastFixedFee * (1 + PRICING_CONFIG.vatRate);
        
        const final = (vatPrice + feeFixed) / (1 - feeVariable);
        return Math.ceil(final * 100) / 100;
    }

    /**
     * Provides a detailed audit of a potential price to prevent undercharging.
     */
    static getPriceAudit(cost: number, manualMarkup?: number): PriceBreakdown {
        const markupPercentage = manualMarkup !== undefined ? manualMarkup : this.getTierMarkup(cost);
        const finalPrice = this.calculateFinalPrice(cost, manualMarkup);
        const markedUpExcl = cost * (1 + (markupPercentage / 100));
        const vatOnBase = markedUpExcl * PRICING_CONFIG.vatRate;
        
        const payfastDeduction = (finalPrice * PRICING_CONFIG.payfastVariableFee + PRICING_CONFIG.payfastFixedFee) * (1 + PRICING_CONFIG.vatRate);
        const netAfterFees = finalPrice - payfastDeduction;
        const netAfterVAT = netAfterFees / (1 + PRICING_CONFIG.vatRate); 
        
        return {
            supplierCost: cost,
            markupPercentage,
            markedUpExcl,
            vatAmount: vatOnBase,
            feeAmount: payfastDeduction,
            finalPrice,
            netProfit: netAfterVAT - cost
        };
    }
}
