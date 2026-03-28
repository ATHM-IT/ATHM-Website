import type { Product } from '../types';
import Papa from 'papaparse';
import { supabase } from '../supabaseClient';export interface SupplierProduct {
    supplierId: string;
    sku: string;
    name: string;
    description: string;
    category: string;
    brand: string;
    costPrice: number;
    stockLevel: number;
    imageUrl?: string;
    specs?: Record<string, string>;
}

const MOCK_PRODUCTS: Product[] = [
    {
        id: 'prod_lap_001',
        name: 'ZenBook Pro 15',
        description: 'Professional creative laptop with 4K OLED touchscreen, Intel Core i9, and NVIDIA RTX 3060. Perfect for designers and video editors.',
        basePrice: 28999,
        imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&q=80&w=800', // Actual laptop image
        category: 'Laptops',
        categoryType: 'Hardware',
        subCategory: 'Ultrabook',
        brand: 'Asus',
        stock: 12,
        supplierId: 'rectron_01'
    },
    {
        id: 'prod_lap_002',
        name: 'ThinkPad X1 Carbon Gen 10',
        description: 'The ultimate business ultrabook. Lightweight, durable, and packed with security features. Core i7, 16GB RAM, 1TB SSD.',
        basePrice: 32499,
        imageUrl: 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?auto=format&fit=crop&q=80&w=800', // Business laptop
        category: 'Laptops',
        categoryType: 'Hardware',
        subCategory: 'Business',
        brand: 'Lenovo',
        stock: 8,
        supplierId: 'axiz_05'
    },
    {
        id: 'prod_comp_001',
        name: 'RTX 4070 Ti Super',
        description: 'Next-gen gaming graphics card. 12GB GDDR6X memory, DLSS 3.0 support. Crushes 1440p gaming.',
        basePrice: 18499,
        imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800', // Graphics card placeholder
        category: 'Components',
        categoryType: 'Hardware',
        subCategory: 'GPU',
        brand: 'MSI',
        stock: 5,
        supplierId: 'pinnacle_88'
    },
    {
        id: 'prod_comp_002',
        name: 'Ryzen 9 7950X',
        description: '16-Core, 32-Thread productivity beast. The worlds best CPU for gamers and creators.',
        basePrice: 11999,
        imageUrl: 'https://images.unsplash.com/photo-1555618568-9844a42b0833?auto=format&fit=crop&q=80&w=800', // CPU/chip image
        category: 'Components',
        categoryType: 'Hardware',
        subCategory: 'CPU',
        brand: 'AMD',
        stock: 20,
        supplierId: 'pinnacle_89'
    },
    {
        id: 'prod_net_001',
        name: 'Ubiquiti UniFi Dream Machine',
        description: 'All-in-one enterprise network appliance. Gateway, Switch, Access Point, and Controller.',
        basePrice: 6499,
        imageUrl: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=800', // Router/Network
        category: 'Networking',
        categoryType: 'Hardware',
        subCategory: 'Enterprise',
        brand: 'Ubiquiti',
        stock: 15,
        supplierId: 'miro_01'
    },
    {
        id: 'prod_soft_001',
        name: 'Microsoft 365 Business Standard',
        description: '12-Month subscription. Get desktop versions of Office apps: Outlook, Word, Excel, PowerPoint, OneNote.',
        basePrice: 2490,
        imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800', // Software/Office
        category: 'Software',
        categoryType: 'Software',
        subCategory: 'Productivity',
        brand: 'Microsoft',
        stock: 999,
        supplierId: 'rectron_soft'
    }
];

class ProductService {
    // Parse the supplier CSV file and bulk upload to Supabase
    async uploadSupplierFile(file: File, supplierId: string): Promise<{ success: boolean; message: string; count: number }> {
        return new Promise((resolve, reject) => {
            console.log(`Starting parse for file: ${file.name}`);
            
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                worker: true,
                complete: async (results) => {
                    if (results.errors.length > 0) {
                        console.error('Errors while parsing CSV:', results.errors);
                    }
                    
                    const rawRows = results.data as any[];
                    console.log(`Parsed ${rawRows.length} rows. Starting mapping...`);
                    
                    const productsToUpsert = rawRows
                        .map(rawRow => {
                            // Normalize all object keys to lowercase to avoid case-sensitivity issues
                            // (We do this here because we cannot pass a transformHeader function to a Web Worker)
                            const row: any = {};
                            for (const key in rawRow) {
                                if (key) row[key.toLowerCase().trim()] = rawRow[key];
                            }
                            return row;
                        })
                        .filter(row => row.sku && row.name && row.price) // Only process valid rows
                        .map(row => {
                            // Calculate stock
                            const cptStock = parseInt(row.cptstock) || 0;
                            const jhbStock = parseInt(row.jhbstock) || 0;
                            const dbnStock = parseInt(row.dbnstock) || 0;
                            const totalStock = cptStock + jhbStock + dbnStock;

                            // Handle categories
                            let category = 'Uncategorized';
                            if (row.categories) {
                                // Categories might be comma separated, take the first one or whole string
                                category = row.categories.split(',')[0].trim();
                            }

                            // Keep descriptions clean if they contain HTML, or just use shortdesc
                            const description = row.shortdesc || row.description || '';

                            return {
                                id: `prod_${supplierId}_${row.sku.replace(/[^a-zA-Z0-9_\-]/g, '_')}`, // Unique per supplier
                                name: row.name,
                                description: description,
                                price: parseFloat(row.price) || 0,
                                category: category,
                                brand: row.brand || 'Unknown',
                                stock: totalStock,
                                supplier_id: supplierId,
                                image_url: row['featured image'] || 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=400'
                            };
                        });

                    console.log(`Mapped ${productsToUpsert.length} products. Zeroing out old stock for ${supplierId}...`);
                    
                    try {
                        // 1. Zero out existing stock for this supplier to "remove" old prices/stock that aren't in the new list
                        const { error: clearError } = await supabase
                            .from('products')
                            .update({ stock: 0 })
                            .eq('supplier_id', supplierId);

                        if (clearError) {
                            console.error("Failed to clear old stock:", clearError);
                            // We can choose to proceed anyway, but it might leave ghosts. Let's proceed.
                        }

                        // 2. Batch insert to avoid overloading Supabase API
                        const batchSize = 1000;
                        let successCount = 0;
                        
                        for (let i = 0; i < productsToUpsert.length; i += batchSize) {
                            const batch = productsToUpsert.slice(i, i + batchSize);
                            
                            const { error } = await supabase
                                .from('products')
                                .upsert(batch, { onConflict: 'id' });
                                
                            if (error) {
                                console.error('Error upserting batch:', error);
                                throw new Error(`Supabase Upsert Failed: ${error.message} (Details: ${error.details})`);
                            } else {
                                successCount += batch.length;
                            }
                        }
                        
                        console.log(`Successfully uploaded ${successCount} products.`);
                        resolve({ 
                            success: true, 
                            message: `Successfully uploaded ${successCount} products`, 
                            count: successCount 
                        });
                        
                    } catch (error: any) {
                        console.error('Fatal error during upsert:', error);
                        reject({ success: false, message: error.message, count: 0 });
                    }
                },
                error: (error) => {
                    console.error('PapaParse error:', error);
                    reject({ success: false, message: error.message, count: 0 });
                }
            });
        });
    }

    // Get all products (merged from local storage and default/supplier data)
    getProducts(): Product[] {
        const storedProducts = localStorage.getItem('athm_products');
        if (storedProducts) {
            const parsed = JSON.parse(storedProducts);
            if (parsed.length > 0) return parsed;
        }
        // Fallback to mock data if nothing stored
        return MOCK_PRODUCTS;
    }

    // Save product (Add or Update)
    saveProduct(product: Product): void {
        const currentProducts = this.getProducts();
        const existingIndex = currentProducts.findIndex(p => p.id === product.id);

        if (existingIndex >= 0) {
            currentProducts[existingIndex] = product;
        } else {
            currentProducts.push(product);
        }

        localStorage.setItem('athm_products', JSON.stringify(currentProducts));

        localStorage.setItem('athm_products', JSON.stringify(currentProducts));
    }

    deleteProduct(productId: string): void {
        const currentProducts = this.getProducts();
        const updatedProducts = currentProducts.filter(p => p.id !== productId);
        localStorage.setItem('athm_products', JSON.stringify(updatedProducts));
    }

    // Normalize supplier data to our internal Product format
    normalizeProduct(supplierData: SupplierProduct): Product {
        return {
            id: `prod_${supplierData.sku}`,
            name: supplierData.name,
            description: supplierData.description,
            basePrice: supplierData.costPrice, // We store base cost, retail calc happens elsewhere
            imageUrl: supplierData.imageUrl || 'https://via.placeholder.com/300',
            category: supplierData.category,
            categoryType: 'Hardware', // Default, should ideally be in supplier data
            subCategory: 'General',   // Default
            brand: supplierData.brand,
            stock: supplierData.stockLevel,
            supplierId: supplierData.supplierId
        };
    }

    // Get all unique categories
    getCategories(products: Product[]): string[] {
        const uniqueCategories = new Set(products.map(p => p.category));
        return Array.from(uniqueCategories);
    }

    // Get all unique brands (assuming brand will be added to Product type later or extracted from desc)
    getBrands(products: Product[]): string[] {
        const uniqueBrands = new Set(products.map(p => p.brand).filter(Boolean));
        if (uniqueBrands.size === 0) {
            return ['Premium Tech', 'SpeedMaster', 'SecureSoft', 'CreativeSuite', 'ServicePro'];
        }
        return Array.from(uniqueBrands);
    }
}

export const productService = new ProductService();
