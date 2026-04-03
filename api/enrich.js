import * as cheerio from 'cheerio';

export default async function handler(req, res) {
    // Enable CORS for testing
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }

    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        console.log(`Scraping search results for: ${query}`);
        const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
        
        // Use a realistic user agent
        const response = await fetch(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        
        if (!response.ok) {
            throw new Error(`DuckDuckGo responded with status: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Extract the first snippet description
        const snippet = $('.result__snippet').first().text().trim();
        
        // Extract the first image link if possible (DuckDuckGo HTML sometimes has image thumbnails)
        // Alternatively we can use a free placeholder if no image is found
        let imageUrl = '';
        const imgNode = $('.result__image img').first();
        if (imgNode.length) {
            const src = imgNode.attr('src');
            // DuckDuckGo serves images via their proxy: //duckduckgo.com/iu/?u=...
            if (src && src.startsWith('//')) {
                imageUrl = 'https:' + src;
            } else {
                imageUrl = src || '';
            }
        }
        
        if (!imageUrl) {
            // Fallback: A nice generic tech image based on the query words
            imageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(query)}&background=random&color=fff&font-size=0.33&size=500`;
        }
        
        // Clean up the snippet
        let cleanDescription = snippet;
        if (!cleanDescription || cleanDescription.length < 10) {
            cleanDescription = `High-quality ${query} ensuring premium performance and reliability. Perfect for upgrading your hardware setup.`;
        }

        return res.status(200).json({
            success: true,
            description: cleanDescription,
            image_url: imageUrl
        });

    } catch (error) {
        console.error('Scraping error:', error);
        return res.status(500).json({ error: 'Failed to enrich product data', details: error.message });
    }
}
