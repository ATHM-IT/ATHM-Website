import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDb() {
    console.log("Checking DB constraints and products...");
    const { data: countData, error: countErr } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('supplier_id', 'syntech');
    
    console.log("Total Syntech products in DB:", countData, countErr);

    const { data: sample, error: sampleErr } = await supabase
        .from('products')
        .select('*')
        .limit(5);
        
    console.log("Sample DB row:", sample, sampleErr);

    // Try a test upsert
    console.log("Attempting test upsert...");
    const testProduct = {
        id: 'prod_syntech_TEST_SKU_123',
        name: 'Test Product',
        description: 'Test Desc',
        price: 999.99,
        category: 'Hardware',
        brand: 'TestBrand',
        stock: 10,
        supplier_id: 'syntech',
        image_url: 'https://placeholder.com'
    };

    const { data: testUpsert, error: testErr } = await supabase
        .from('products')
        .upsert([testProduct]);
        
    console.log("Upsert Error (if any):", testErr);
}

checkDb();
