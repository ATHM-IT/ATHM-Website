import type { Product } from '../types';

// Mock markup percentage (e.g., 15%)
const DEFAULT_MARKUP = 0.15;

// Simulate initial product data
const MOCK_PRODUCTS: Product[] = [
    // HARDWARE - Servers
    {
        id: 'h1',
        name: 'Dell PowerEdge R750',
        description: 'Rack server with 3rd Gen Intel Xeon Scalable processors.',
        supplierId: 'sup_dell',
        basePrice: 45000.00,
        imageUrl: 'https://via.placeholder.com/300/000000/D4AF37?text=Dell+PowerEdge',
        category: 'Servers',
        categoryType: 'Hardware',
        subCategory: 'Servers',
        brand: 'Dell',
        stock: 10,
        isSpecial: true
    },
    {
        id: 'h3',
        name: 'HP ProLiant DL380',
        description: 'Adaptable chassis, including new HPE modular drive bay configuration options.',
        supplierId: 'sup_hp',
        basePrice: 42000.00,
        imageUrl: 'https://via.placeholder.com/300/000000/D4AF37?text=HP+ProLiant',
        category: 'Servers',
        categoryType: 'Hardware',
        subCategory: 'Servers',
        brand: 'HP',
        stock: 8
    },
    // HARDWARE - Laptops
    {
        id: 'h2',
        name: 'Dell Latitude 7420',
        description: 'Premium business laptop with AI-based optimization.',
        supplierId: 'sup_dell',
        basePrice: 25000.00,
        imageUrl: 'https://via.placeholder.com/300/000000/D4AF37?text=Dell+Latitude',
        category: 'Laptops',
        categoryType: 'Hardware',
        subCategory: 'Laptops',
        brand: 'Dell',
        stock: 25
    },
    // HARDWARE - CPUs
    {
        id: 'cpu1',
        name: 'Intel Core i9-13900K',
        description: '24 cores, 32 threads, up to 5.8 GHz.',
        supplierId: 'sup_intel',
        basePrice: 12000.00,
        imageUrl: 'https://via.placeholder.com/300/000000/D4AF37?text=Intel+i9',
        category: 'Processors',
        categoryType: 'Hardware',
        subCategory: 'CPU',
        brand: 'Intel',
        stock: 50
    },
    {
        id: 'cpu2',
        name: 'AMD Ryzen 9 7950X',
        description: '16 cores, 32 threads, up to 5.7 GHz.',
        supplierId: 'sup_amd',
        basePrice: 11500.00,
        imageUrl: 'https://via.placeholder.com/300/000000/D4AF37?text=Ryzen+9',
        category: 'Processors',
        categoryType: 'Hardware',
        subCategory: 'CPU',
        brand: 'AMD',
        stock: 45
    },
    // HARDWARE - RAM
    {
        id: 'ram1',
        name: 'Corsair Vengeance 32GB',
        description: 'DDR5 5600MHz C36 Memory Kit.',
        supplierId: 'sup_corsair',
        basePrice: 3500.00,
        imageUrl: 'https://via.placeholder.com/300/000000/D4AF37?text=Corsair+RAM',
        category: 'Memory',
        categoryType: 'Hardware',
        subCategory: 'RAM',
        brand: 'Corsair',
        stock: 100
    },
    {
        id: 'ram2',
        name: 'Kingston Fury 16GB',
        description: 'DDR4 3200MHz CL16 Desktop Memory.',
        supplierId: 'sup_kingston',
        basePrice: 1200.00,
        imageUrl: 'https://via.placeholder.com/300/000000/D4AF37?text=Kingston+RAM',
        category: 'Memory',
        categoryType: 'Hardware',
        subCategory: 'RAM',
        brand: 'Kingston',
        stock: 150
    },
    // HARDWARE - Screens
    {
        id: 'lcd1',
        name: 'Dell UltraSharp 27',
        description: '4K USB-C Monitor with IPS Black technology.',
        supplierId: 'sup_dell',
        basePrice: 9000.00,
        imageUrl: 'https://via.placeholder.com/300/000000/D4AF37?text=Dell+Screen',
        category: 'Monitors',
        categoryType: 'Hardware',
        subCategory: 'Screens',
        brand: 'Dell',
        stock: 30,
        isSpecial: true
    },
    {
        id: 'lcd2',
        name: 'Samsung Odyssey G9',
        description: '49-inch curved gaming monitor.',
        supplierId: 'sup_samsung',
        basePrice: 22000.00,
        imageUrl: 'https://via.placeholder.com/300/000000/D4AF37?text=Samsung+G9',
        category: 'Monitors',
        categoryType: 'Hardware',
        subCategory: 'Screens',
        brand: 'Samsung',
        stock: 10
    },
    // SOFTWARE
    {
        id: 's1',
        name: 'Windows Server 2022',
        description: 'OS that bridges on-premises environments with Azure.',
        supplierId: 'sup_ms',
        basePrice: 15000.00,
        imageUrl: 'https://via.placeholder.com/300/000000/D4AF37?text=Win+Server+2022',
        category: 'Operating Systems',
        categoryType: 'Software',
        subCategory: 'OS',
        brand: 'Microsoft',
        stock: 999
    },
    {
        id: 's2',
        name: 'Microsoft 365 Business',
        description: '1-year subscription for business productivity apps.',
        supplierId: 'sup_ms',
        basePrice: 2500.00,
        imageUrl: 'https://via.placeholder.com/300/000000/D4AF37?text=M365+Business',
        category: 'Office',
        categoryType: 'Software',
        subCategory: 'Productivity',
        brand: 'Microsoft',
        stock: 999
    },
    {
        id: 's3',
        name: 'Adobe Creative Cloud',
        description: 'All Apps plan for creative professionals.',
        supplierId: 'sup_adobe',
        basePrice: 12000.00,
        imageUrl: 'https://via.placeholder.com/300/000000/D4AF37?text=Adobe+CC',
        category: 'Creative',
        categoryType: 'Software',
        subCategory: 'Creative',
        brand: 'Adobe',
        stock: 999
    }
];

class SupplierPriceService {
    private products: Product[] = MOCK_PRODUCTS;
    private subscribers: Map<string, Set<(price: number) => void>> = new Map();
    private intervals: Map<string, ReturnType<typeof setInterval>> = new Map();

    constructor() {
        // Start simulating price changes for all products
        this.products.forEach(p => this.startSimulatingPrice(p.id, p.basePrice));
    }

    getProducts(): Product[] {
        return this.products;
    }

    getProductById(id: string): Product | undefined {
        return this.products.find(p => p.id === id);
    }

    // Calculate final price with markup
    calculateRetailPrice(basePrice: number): number {
        return basePrice * (1 + DEFAULT_MARKUP);
    }

    // Subscribe to real-time price updates for a specific product
    subscribeToPrice(productId: string, callback: (price: number) => void): () => void {
        if (!this.subscribers.has(productId)) {
            this.subscribers.set(productId, new Set());
        }
        this.subscribers.get(productId)?.add(callback);

        // Initial callback with current base price
        const product = this.getProductById(productId);
        if (product) {
            callback(this.calculateRetailPrice(product.basePrice));
        }

        // Return unsubscribe function
        return () => {
            this.subscribers.get(productId)?.delete(callback);
        };
    }

    private startSimulatingPrice(productId: string, initialBasePrice: number) {
        if (this.intervals.has(productId)) return;

        let currentBasePrice = initialBasePrice;

        const interval = setInterval(() => {
            // Simulate fluctuation +/- 2%
            const fluctuation = (Math.random() - 0.5) * 0.04;
            currentBasePrice = currentBasePrice * (1 + fluctuation);

            const retailPrice = this.calculateRetailPrice(currentBasePrice);

            // Notify subscribers
            if (this.subscribers.has(productId)) {
                this.subscribers.get(productId)?.forEach(cb => cb(retailPrice));
            }
        }, 12 * 60 * 60 * 1000); // Update every 12 hours

        this.intervals.set(productId, interval);
    }

    // Toggle special status
    toggleSpecial(productId: string) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            product.isSpecial = !product.isSpecial;
            this.notifyInventoryChange();
        }
    }

    // Inventory change listeners (for UI updates when metadata changes)
    private inventoryListeners: Set<() => void> = new Set();

    subscribeToInventory(callback: () => void): () => void {
        this.inventoryListeners.add(callback);
        return () => this.inventoryListeners.delete(callback);
    }

    private notifyInventoryChange() {
        this.inventoryListeners.forEach(cb => cb());
    }
}

export const supplierService = new SupplierPriceService();
