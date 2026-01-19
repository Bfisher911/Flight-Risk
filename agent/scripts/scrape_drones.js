const FirecrawlApp = require('@mendable/firecrawl-js').default;
const fs = require('fs');
const path = require('path');
const https = require('https');

const apiKey = "fc-8ed75294f4c34e5ea4b716a2408efd48";
const app = new FirecrawlApp({ apiKey: apiKey });

const IMAGES_DIR = path.resolve(__dirname, '../../public/images/parts');

const TARGETS = [
    {
        filename: "iflight-nazgul-evoque-f5-v2.png",
        searchUrl: "https://www.racedayquads.com/products/iflight-bnf-nazgul-evoque-f5x-v2-squashed-x-6s-hd-w-dji-o3-gps",
        isSearch: false
    },
    {
        filename: "happymodel-mobula6-2024.png",
        searchUrl: "https://pyrodrone.com/products/happymodel-mobula6-2024-v3-analog-elrs-2-4ghz-1s-65mm-ultra-light-fpv-whoop-drone",
        isSearch: false
    },
    {
        filename: "emax-tinyhawk-iii-plus.png",
        searchUrl: "https://pyrodrone.com/products/emax-tinyhawk-3-plus-freestyle-fpv-racing-drone-rtf-analog-elrs",
        isSearch: false
    },
    // Successful items - Keep direct or comment out if assumed done (keeping for safety)
    {
        filename: "flywoo-explorer-lr-4-v2.png",
        searchUrl: "https://flywoo.net/products/explorer-lr-4-v2-4-inch-micro-long-range-fs-quad-analog-w-caddx-ant",
        isSearch: false
    },
    {
        filename: "dji-avata-2.png",
        searchUrl: "https://store.dji.com/product/dji-avata-2",
        isSearch: false
    },
    {
        filename: "geprc-cinelog35-v2.png",
        searchUrl: "https://geprc.com/product/geprc-cinelog35-v2-analog/",
        isSearch: false
    }
];

async function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                // consume response data to free up memory
                res.resume();
                reject(new Error(`Request Failed With Code ${res.statusCode}`));
                return;
            }
            const fileStream = fs.createWriteStream(filepath);
            res.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`Saved: ${filepath}`);
                resolve();
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

function extractImage(markdown, metadata) {
    // 1. Try metadata image (og:image)
    if (metadata && metadata['og:image']) return metadata['og:image'];

    // 2. Regex for first markdown image
    const imgRegex = /!\[.*?\]\((.*?)\)/;
    const match = markdown.match(imgRegex);
    if (match && match[1]) return match[1];
    return null;
}

function extractProductLink(markdown, baseUrl) {
    // Look for markdown links: [Title](url)
    // Filter for /products/ for Pyrodrone/Shopify
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    while ((match = linkRegex.exec(markdown)) !== null) {
        const text = match[1];
        const href = match[2];
        if (href.includes('/products/') && !href.includes('?')) { // Simple filter
            // Resolve relative
            if (href.startsWith('/')) {
                const u = new URL(baseUrl);
                return `${u.origin}${href}`;
            }
            if (href.startsWith('http')) return href;
        }
    }
    return null;
}

async function run() {
    for (const target of TARGETS) {
        console.log(`\nProcessing ${target.filename}...`);

        try {
            let urlToScrape = target.searchUrl;

            if (target.isSearch) {
                console.log(`Searching: ${target.searchUrl}`);
                const searchResult = await app.scrape(target.searchUrl, { formats: ['markdown'] });
                if (!searchResult.success && !searchResult.markdown) {
                    console.error("Failed to scrape search page.");
                    continue;
                }

                const productUrl = extractProductLink(searchResult.markdown, target.searchUrl);
                if (productUrl) {
                    console.log(`Found Product URL: ${productUrl}`);
                    urlToScrape = productUrl;
                } else {
                    console.error("No product link found in search results.");
                    continue;
                }
            }

            console.log(`Scraping Product: ${urlToScrape}`);
            const result = await app.scrape(urlToScrape, { formats: ['markdown'] });

            if (!result.success && !result.markdown) {
                console.error(`Failed to scrape ${urlToScrape}`);
                continue;
            }

            let imgUrl = extractImage(result.markdown, result.metadata);

            if (imgUrl) {
                console.log(`Found Image: ${imgUrl}`);
                if (imgUrl.startsWith('/')) {
                    const u = new URL(urlToScrape);
                    imgUrl = `${u.origin}${imgUrl}`;
                }
                if (imgUrl.startsWith('//')) {
                    imgUrl = `https:${imgUrl}`;
                }
                if (imgUrl.startsWith('http:')) {
                    imgUrl = imgUrl.replace('http:', 'https:');
                }

                await downloadImage(imgUrl, path.join(IMAGES_DIR, target.filename));
            } else {
                console.log("No image found in scrape result.");
            }

        } catch (error) {
            console.error(`Error processing ${target.filename}:`, error.message);
        }
    }
}

run();
