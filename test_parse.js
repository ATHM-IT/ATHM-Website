import fs from 'fs';
import Papa from 'papaparse';

const fileContent = fs.readFileSync('syntech_products_april.csv', 'utf8');

Papa.parse(fileContent, {
    header: false,
    delimiter: ";",
    skipEmptyLines: true,
    complete: (results) => {
        const rows = results.data;
        let headerIndex = rows.findIndex(row => 
            row.some(cell => cell?.toLowerCase().includes('item code') || cell?.toLowerCase().includes('sku'))
        );
        
        console.log("Header Index Found at:", headerIndex);
        
        if (headerIndex === -1) {
            console.log("Failed to find header!");
            return;
        }

        const headers = rows[headerIndex].map(h => h.toLowerCase().trim());
        const dataRows = rows.slice(headerIndex + 1);
        
        const colMap = {
            sku: headers.findIndex(h => h.includes('item code') || h === 'sku'),
            name: headers.findIndex(h => h === 'description' || h === 'name' || h.includes('desc')),
            price: headers.findIndex(h => h.includes('price (excl vat)') || h === 'price'),
            category: headers.findIndex(h => h.includes('category')),
            brand: headers.findIndex(h => h === 'brand'),
            image: headers.findIndex(h => h.includes('image') || h.includes('featured image')),
            stock: headers.findIndex(h => h.includes('stock'))
        };

        console.log('Column Mappings:', colMap);
        console.log('Headers:', headers);

        let validCount = 0;
        let zeroPriceCount = 0;
        let noSkuCount = 0;

        for (let i = 0; i < Math.min(10, dataRows.length); i++) {
            const row = dataRows[i];
            const sku = row[colMap.sku] || '';
            let rawPrice = row[colMap.price] || '0';
            const cleanPrice = parseFloat(rawPrice.replace(/[R\s,]/g, '')) || 0;
            let stock = colMap.stock > -1 ? parseInt(row[colMap.stock]) || 0 : 10;
            
            console.log(`-- Row ${i} --`);
            console.log(`SKU: "${sku}"`);
            console.log(`Raw Price: "${rawPrice}" -> Clean: ${cleanPrice}`);
            console.log(`Stock: ${stock}`);
        }

        const productsToUpsert = dataRows.map(row => {
            const sku = row[colMap.sku] || '';
            if (!sku || sku.length < 2) {
                noSkuCount++;
                return null;
            }
            const rawPrice = row[colMap.price] || '0';
            const cleanPrice = parseFloat(rawPrice.replace(/[R\s,]/g, '')) || 0;
            if (cleanPrice <= 0) {
                zeroPriceCount++;
            }
            const stock = colMap.stock > -1 ? parseInt(row[colMap.stock]) || 0 : 10;
            return { sku, cleanPrice, stock };
        }).filter(p => p !== null && p.cleanPrice > 0);

        console.log(`\nStats:`);
        console.log(`Total Rows: ${dataRows.length}`);
        console.log(`Valid Products: ${productsToUpsert.length}`);
        console.log(`Skipped (No SKU): ${noSkuCount}`);
        console.log(`Skipped (Zero Price): ${zeroPriceCount}`);
    }
});
