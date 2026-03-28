import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
    console.log('Testing Supabase Connection...');
    const { data: selectData, error: selectError } = await supabase.from('products').select('*').limit(1);
    console.log('Select Result:', { count: selectData?.length, error: selectError?.message });

    const testProduct = {
        id: 'test_insert_001',
        name: 'Test Product',
        price: 100,
        supplier_id: 'test'
    };

    const { data: insertData, error: insertError } = await supabase.from('products').upsert([testProduct]).select();
    console.log('Insert Result:', { inserted: insertData?.length, error: insertError?.message });
}
test();
