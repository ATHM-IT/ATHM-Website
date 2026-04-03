import type { Product } from '../types';
import Papa from 'papaparse';
import { supabase } from '../supabaseClient';

export interface SupplierProduct {
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

class ProductService {
    // Parse the supplier CSV file and bulk upload to Supabase
    async uploadSupplierFile(file: File, supplierId: string): Promise<{ success: boolean; message: string; count: number }> {
        return new Promise((resolve, reject) => {
            console.log(`Starting parse for file: ${file.name}`);
            
            Papa.parse(file, {
                header: false, // Start with false to detect our own headers
                skipEmptyLines: true,
                worker: true,
                complete: async (results) => {
                    const rows = results.data as string[][];
                    
                    // 1. Smart Header Detection
                    // Skip the Syntech disclaimer and find the row containing "Item Code" or "SKU"
                    let headerIndex = rows.findIndex(row => 
                        row.some(cell => cell?.toLowerCase().includes('item code') || cell?.toLowerCase().includes('sku'))
                    );
                    
                    if (headerIndex === -1) headerIndex = 0; // Fallback to first row
                    
                    const headers = rows[headerIndex].map(h => h.toLowerCase().trim());
                    const dataRows = rows.slice(headerIndex + 1);
                    
                    // Find Column Mappings
                    const colMap = {
                        sku: headers.findIndex(h => h.includes('item code') || h === 'sku'),
                        name: headers.findIndex(h => h === 'description' || h === 'name'),
                        price: headers.findIndex(h => h.includes('price (excl vat)') || h === 'price'),
                        category: headers.findIndex(h => h.includes('category') || h === 'categories'),
                        brand: headers.findIndex(h => h === 'brand'),
                        image: headers.findIndex(h => h.includes('image') || h.includes('featured image')),
                        stock: headers.findIndex(h => h.includes('cptstock') || h.includes('stock'))
                    };

                    console.log('Detected Column Mappings:', colMap);

                    const productsToUpsert = dataRows
                        .map(row => {
                            // Extract and Clean SKU
                            const sku = row[colMap.sku] || '';
                            if (!sku || sku.length < 2) return null;

                            // Extract and Clean Price (Handle "R 1,234.56" format)
                            let rawPrice = row[colMap.price] || '0';
                            const cleanPrice = parseFloat(rawPrice.replace(/[R\s,]/g, '')) || 0;

                            // Extract Stock (Universal handling)
                            let stock = parseInt(row[colMap.stock]) || 0;
                            // If it's the old format with JHB/CPT/DBN, try to sum them (simplified for new format)
                            if (colMap.stock === -1) stock = 10; // Fallback if no stock column found

                            return {
                                id: `prod_${supplierId}_${sku.replace(/[^a-zA-Z0-9_\-]/g, '_')}`,
                                name: row[colMap.name] || 'Unknown Product',
                                description: row[colMap.name] || '',
                                price: cleanPrice,
                                category: (row[colMap.category] || 'Hardware').split('>')[0].trim(),
                                brand: row[colMap.brand] || 'Various',
                                stock: stock,
                                supplier_id: supplierId,
                                image_url: row[colMap.image] || 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=400'
                            };
                        })
                        .filter(p => p !== null && p.price > 0);

                    console.log(`Mapped ${productsToUpsert.length} products. Syncing...`);
                    
                    try {
                        await supabase
                            .from('products')
                            .update({ stock: 0 })
                            .eq('supplier_id', supplierId);

                        const batchSize = 1000;
                        let successCount = 0;
                        
                        for (let i = 0; i < productsToUpsert.length; i += batchSize) {
                            const batch = productsToUpsert.slice(i, i + batchSize);
                            const { error } = await supabase
                                .from('products')
                                .upsert(batch, { onConflict: 'id' });
                                
                            if (error) throw error;
                            successCount += batch.length;
                        }
                        
                        resolve({ 
                            success: true, 
                            message: `Successfully synced ${successCount} products`, 
                            count: successCount 
                        });
                        
                    } catch (error: any) {
                        console.error('Fatal error during sync:', error);
                        reject({ success: false, message: error.message, count: 0 });
                    }
                },
                error: (error) => {
                    reject({ success: false, message: error.message, count: 0 });
                }
            });
        });
    }

    normalizeProduct(supplierData: SupplierProduct): Product {
        return {
            id: `prod_${supplierData.sku}`,
            name: supplierData.name,
            description: supplierData.description,
            basePrice: supplierData.costPrice,
            imageUrl: supplierData.imageUrl || 'https://via.placeholder.com/300',
            category: supplierData.category,
            categoryType: 'Hardware',
            subCategory: 'General',
            brand: supplierData.brand,
            stock: supplierData.stockLevel,
            supplierId: supplierData.supplierId
        };
    }
}

export const productService = new ProductService();
