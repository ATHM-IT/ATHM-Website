import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import type { Product } from '../types';

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            if (!isSupabaseConfigured) return;

            // 1. Fetch products
            const { data: dbProducts, error: prodErr } = await supabase
                .from('products')
                .select('*');
            if (prodErr) throw prodErr;

            // 2. Fetch global markup
            const { data: dbSettings, error: setErr } = await supabase
                .from('store_settings')
                .select('global_markup_percentage')
                .eq('id', 1)
                .single();
            const markup = setErr || !dbSettings ? 20 : dbSettings.global_markup_percentage;

            // 3. Group by name and find the cheapest in-stock
            const productGroups = new Map<string, any>();
            (dbProducts || []).forEach((item: any) => {
                const existing = productGroups.get(item.name);
                const isItemAvailable = item.stock > 0;
                
                if (!existing) {
                    productGroups.set(item.name, item);
                } else {
                    const isExistingAvailable = existing.stock > 0;
                    
                    if (isItemAvailable && !isExistingAvailable) {
                        productGroups.set(item.name, item);
                    } else if (isItemAvailable && isExistingAvailable) {
                         if (item.price < existing.price) {
                             productGroups.set(item.name, item);
                         }
                    } else if (!isItemAvailable && !isExistingAvailable) {
                         if (item.price < existing.price) {
                             productGroups.set(item.name, item);
                         }
                    }
                }
            });

            // 4. Map to Product[] and apply markup
            const mappedProducts: Product[] = Array.from(productGroups.values())
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    basePrice: item.price,
                    price: item.price * (1 + markup / 100), // Retail price with markup
                    category: item.category,
                    categoryType: 'Hardware',
                    subCategory: 'General',
                    brand: item.brand,
                    stock: item.stock,
                    supplierId: item.supplier_id || 'unknown',
                    imageUrl: item.image_url || 'https://via.placeholder.com/400'
                }));

            setProducts(mappedProducts);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();

        if (isSupabaseConfigured) {
            const productSub = supabase
                .channel('public:products')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchProducts)
                .subscribe();

            const settingsSub = supabase
                .channel('public:store_settings')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'store_settings' }, fetchProducts)
                .subscribe();

            return () => {
                supabase.removeChannel(productSub);
                supabase.removeChannel(settingsSub);
            };
        }
    }, []);

    return { products, loading, error, refreshProducts: fetchProducts };
};
