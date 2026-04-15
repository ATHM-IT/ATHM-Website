import * as cheerio from 'cheerio';

async function run() {
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent('Asus ROG Strix RTX 3080 High Quality')}`;
    const response = await fetch(searchUrl, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    console.log("Found snippet:", $('.result__snippet').first().text().trim());

    // Print all image tags to see if there are product images
    console.log("Images found:");
    $('img').each((i, el) => {
        console.log($(el).attr('src'), $(el).attr('class'));
    });
}
run();
