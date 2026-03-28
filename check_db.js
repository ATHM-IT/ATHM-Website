import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY);

async function checkDB() {
    console.log('Checking Supabase products table...');
    const { count, error } = await supabase.from('products').select('*', { count: 'exact', head: true });
    
    if (error) {
        console.error("Error fetching count:", error);
    } else {
        console.log(`Total Products in DB: ${count}`);
    }

    const { data: samples, error: sampleError } = await supabase.from('products').select('id, name, price, stock').limit(5);
    console.log("Samples:", samples);
    if(sampleError) console.error(sampleError);
}
checkDB();
