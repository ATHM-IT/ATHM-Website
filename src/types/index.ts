export interface Product {
    id: string;
    name: string;
    description: string;
    supplierId: string;
    basePrice: number; // The price from the supplier
    imageUrl: string;
    category: string; // Display name
    categoryType: 'Hardware' | 'Software'; // Level 1
    subCategory: string; // Level 2: "Processors", "Memory", "Screens"
    brand: string; // Level 3
    stock: number;
    isSpecial?: boolean;
    price?: number; // Retail price (optional/calculated)
}

export interface Supplier {
    id: string;
    name: string;
    markupPercentage: number; // e.g., 0.20 for 20%
}

export interface PriceUpdate {
    productId: string;
    newPrice: number;
    timestamp: number;
}

export interface StoreSettings {
    id: number;
    global_markup_percentage: number;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    price_at_purchase: number;
    created_at?: string;
    product?: Product; // Relational
}

export interface Order {
    id: string;
    user_id: string;
    status: string;
    total_amount: number;
    shipping_address: any;
    created_at: string;
    order_items?: OrderItem[]; // Relational
}
