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
                        name: headers.findIndex(h => h === 'name'),
                        description: headers.findIndex(h => h === 'description'),
                        shortDesc: headers.findIndex(h => h === 'shortdesc' || h === 'short description'),
                        price: headers.findIndex(h => h.includes('price (excl vat)') || h === 'price'),
                        category: headers.findIndex(h => h.includes('category') || h === 'categories' || h === 'categoriesalt'),
                        brand: headers.findIndex(h => h === 'brand'),
                        image: headers.findIndex(h => h === 'featured image' || h === 'image'),
                        stockCPT: headers.findIndex(h => h === 'cptstock'),
                        stockJHB: headers.findIndex(h => h === 'jhbstock'),
                        stockDBN: headers.findIndex(h => h === 'dbnstock'),
                        stockLegacy: headers.findIndex(h => h === 'stock' || h === 'stock level')
                    };

                    // Identify technical spec columns (everything that isn't a core field)
                    const coreIndices = new Set(Object.values(colMap));
                    // Also ignore columns we know are metadata but not specs
                    const ignoreKeywords = ['additional images', 'all images', 'url', 'categories', 'rrp', 'margin', 'promo', 'eta', 'weight', 'length', 'width', 'height'];
                    
                    const specIndices = headers
                        .map((h, i) => ({ header: h, index: i }))
                        .filter(item => 
                            item.index !== -1 && 
                            !coreIndices.has(item.index) && 
                            !ignoreKeywords.some(k => item.header.includes(k))
                        );

                    console.log(`Detected Column Mappings and ${specIndices.length} spec columns`);

                    const productsToUpsert = dataRows
                        .map(row => {
                            // Extract and Clean SKU
                            const sku = row[colMap.sku] || '';
                            if (!sku || sku.length < 2) return null;

                            // Extract and Clean Price (Handle "R 1,234.56" format)
                            let rawPrice = row[colMap.price] || '0';
                            const cleanPrice = parseFloat(rawPrice.replace(/[R\s,]/g, '')) || 0;

                            // Extract Stock: Sum all visible warehouses (CPT + JHB + DBN)
                            let stock = 0;
                            if (colMap.stockCPT !== -1) stock += parseInt(row[colMap.stockCPT]) || 0;
                            if (colMap.stockJHB !== -1) stock += parseInt(row[colMap.stockJHB]) || 0;
                            if (colMap.stockDBN !== -1) stock += parseInt(row[colMap.stockDBN]) || 0;
                            
                            // Fallback to legacy stock column or default
                            if (stock === 0 && colMap.stockLegacy !== -1) {
                                stock = parseInt(row[colMap.stockLegacy]) || 0;
                            }
                            
                            if (stock === 0 && colMap.stockCPT === -1 && colMap.stockJHB === -1 && colMap.stockDBN === -1 && colMap.stockLegacy === -1) {
                                stock = 10; // Default fallback if no columns found
                            }

                             // Extract and Combine Descriptions
                             const rawName = row[colMap.name] || 'Unknown Product';
                             const rawDesc = row[colMap.description] || '';
                             const rawShort = colMap.shortDesc !== -1 ? row[colMap.shortDesc] : '';
                             
                             // Build Specifications HTML block
                             let specsHtml = '';
                             specIndices.forEach(spec => {
                                 const val = row[spec.index];
                                 if (val && val !== '-' && val !== 'N/A' && val !== '0' && val.length > 0) {
                                     const formattedHeader = spec.header
                                         .split('-')
                                         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                         .join(' ');
                                     specsHtml += `<tr><td style="padding: 8px; border-bottom: 1px solid rgba(255,255,255,0.05); color: rgba(255,255,255,0.5);">${formattedHeader}</td><td style="padding: 8px; border-bottom: 1px solid rgba(255,255,255,0.05); color: white;">${val}</td></tr>`;
                                 }
                             });

                             if (specsHtml) {
                                 specsHtml = `<div class="specs-section"><h3 style="color: var(--color-gold); margin-top: 2rem;">SPECIFICATIONS</h3><table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">${specsHtml}</table></div>`;
                             }

                             const finalDescription = (rawDesc || rawShort || rawName) + specsHtml;

                             return {
                                 id: `prod_${supplierId}_${sku.replace(/[^a-zA-Z0-9_\-]/g, '_')}`,
                                 name: rawName,
                                 description: finalDescription,
                                price: cleanPrice,
                                category: (row[colMap.category] || 'Hardware').split('>')[0].trim(),
                                brand: row[colMap.brand] || 'Various',
                                stock: stock,
                                supplier_id: supplierId,
                                image_url: row[colMap.image] || null
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
