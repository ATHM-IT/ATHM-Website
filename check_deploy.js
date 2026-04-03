import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function inspectDeploy() {
    console.log("Checking latest products in DB...");
    const { data: latest, error } = await supabase
        .from('products')
        .select('id, name, stock, supplier_id, updated_at, created_at')
        .order('id', { ascending: false })
        .limit(10);
    
    console.log("Latest DB entries by ID:", latest, error);

    const { data: syntechItems } = await supabase
        .from('products')
        .select('*')
        .ilike('id', '%prod_syntech%')
        .limit(5);

    console.log("Found Syntech ID items:", syntechItems);
}

inspectDeploy();
