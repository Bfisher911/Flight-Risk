const FirecrawlApp = require('@mendable/firecrawl-js').default;
const fs = require('fs');
const path = require('path');
const https = require('https');

const apiKey = "fc-8ed75294f4c34e5ea4b716a2408efd48";
const app = new FirecrawlApp({ apiKey: apiKey });

const PRODUCTS_FILE = path.resolve(__dirname, '../../src/data/products.json');
const IMAGES_DIR = path.resolve(__dirname, '../../public/images/parts');

// Configuration
const LIMIT = 100;
const AFFILIATE_ID = "oUUXh2q4mRKjRBXv";
const AFFILIATE_PARAMS = `afid=${AFFILIATE_ID}&referring_service=link`;

// Expanded Seed List
const SEED_URLS = [
    "https://www.getfpv.com/new-arrivals.html",
    "https://www.getfpv.com/best-sellers.html",
    "https://www.getfpv.com/fpv-quad-kits.html",
    "https://www.getfpv.com/electronics.html",
    "https://www.getfpv.com/motors.html",
    "https://www.getfpv.com/batteries.html",
    "https://www.getfpv.com/propellers.html"
];

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

async function downloadImage(url, filename) {
    const filepath = path.join(IMAGES_DIR, filename);

    // Skip if exists and valid size
    if (fs.existsSync(filepath)) {
        const stats = fs.statSync(filepath);
        if (stats.size > 2000) {
            console.log(`Image exists, skipping download: ${filename}`);
            return filepath;
        }
    }

    return new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(filepath);
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                res.resume();
                reject(new Error(`Status ${res.statusCode}`));
                return;
            }
            res.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close();
                resolve(filepath);
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => { });
            reject(err);
        });
    });
}

function extractPrice(markdown) {
    const match = markdown.match(/\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/);
    return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
}

function extractSpecs(markdown) {
    const specs = {};
    const lines = markdown.split('\n');
    let inSpecs = false;

    for (const line of lines) {
        if (line.toLowerCase().includes('specifications') || line.toLowerCase().includes('## specs')) {
            inSpecs = true;
            continue;
        }
        if (inSpecs) {
            if (line.trim().startsWith('#') && !line.toLowerCase().includes('spec')) {
                inSpecs = false;
                break;
            }
            const match = line.match(/^[-*]\s*([^:]+):\s*(.+)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim();
                if (key.length < 30 && value.length < 100) {
                    specs[key] = value;
                }
            }
        }
    }
    return specs;
}

async function scrapeProduct(url) {
    console.log(`Scraping product: ${url}`);
    let retries = 3;
    let result = null;

    while (retries > 0) {
        try {
            result = await app.scrape(url, { formats: ['markdown'] });
            break;
        } catch (err) {
            if (err.message.includes("Rate limit")) {
                console.log("Rate limit hit. Waiting 45 seconds...");
                await new Promise(r => setTimeout(r, 45000)); // Increased wait
                retries--;
            } else {
                console.error(`Error scraping ${url}: ${err.message}`);
                return null;
            }
        }
    }

    if (!result || !result.markdown) {
        console.error("Failed to scrape product page content");
        return null;
    }

    const md = result.markdown;
    const meta = result.metadata || {};

    const name = meta.title ? meta.title.replace(' - GetFPV', '').trim() : "Unknown Product";
    const price = extractPrice(md);
    const description = meta.description || "No description available.";

    let imageUrl = meta['og:image'] || "";
    if (Array.isArray(imageUrl)) imageUrl = imageUrl[0];

    // Fallback/Cleanup for image URL
    if (!imageUrl || !imageUrl.startsWith('http')) {
        console.warn(`Invalid Image URL: ${imageUrl}`);
        return null;
    }

    const specs = extractSpecs(md);

    let category = "Components";
    if (name.toLowerCase().includes('drone') || name.toLowerCase().includes('bnf') || name.toLowerCase().includes('kit')) category = "Drones";
    else if (name.toLowerCase().includes('motor')) category = "Motors";
    else if (name.toLowerCase().includes('battery') || name.toLowerCase().includes('lipo')) category = "Batteries";
    else if (name.toLowerCase().includes('controller') || name.toLowerCase().includes('esc') || name.toLowerCase().includes('fc')) category = "Electronics";
    else if (name.toLowerCase().includes('propeller') || name.toLowerCase().includes('prop')) category = "Propellers";
    else if (name.toLowerCase().includes('goggle') || name.toLowerCase().includes('headset')) category = "FPV Gear";

    const brands = ["BetaFPV", "DJI", "iFlight", "GEPRC", "Lumenier", "RadioMaster", "TBS", "Emax", "Flywoo", "DOGCOM", "Gemfan", "HQProp", "T-Motor", "Foxeer", "RunCam", "HDO", "Fat Shark", "Walksnail"];
    let brand = "Generic";
    for (const b of brands) {
        if (name.toLowerCase().includes(b.toLowerCase())) {
            brand = b;
            break;
        }
    }

    const productLink = url.includes('?') ? `${url}&${AFFILIATE_PARAMS}` : `${url}?${AFFILIATE_PARAMS}`;

    return {
        id: slugify(name) + "-" + Math.floor(Math.random() * 1000),
        name,
        brand,
        category,
        subCategory: "General",
        weight: specs["Weight"] || "N/A",
        description,
        price,
        amazonLink: "",
        imageUrl,
        specs,
        consensusReview: "Freshly added from GetFPV.",
        getfpvLink: productLink
    };
}

async function run() {
    console.log(`Starting bulk scrape for ${LIMIT} products with INCREMENTAL SAVE...`);

    // Always load fresh data
    const loadData = () => JSON.parse(fs.readFileSync(PRODUCTS_FILE));

    let existingData = loadData();
    let existingIds = new Set(existingData.products.map(p => p.id));
    let existingUrls = new Set(existingData.products.map(p => {
        try {
            const u = new URL(p.getfpvLink);
            return u.origin + u.pathname;
        } catch (e) { return p.getfpvLink; }
    }));

    let count = 0;
    const visitedLinks = new Set();

    for (const seedUrl of SEED_URLS) {
        if (count >= LIMIT) break;
        console.log(`\n--- Scanning Category: ${seedUrl} ---`);

        let retries = 3;
        let seedResult = null;
        while (retries > 0) {
            try {
                seedResult = await app.scrape(seedUrl, { formats: ['markdown'] });
                break;
            } catch (e) {
                if (e.message.includes("Rate limit")) {
                    console.log("Rate limit hit on seed. Waiting 45s...");
                    await new Promise(r => setTimeout(r, 45000));
                    retries--;
                } else {
                    break;
                }
            }
        }

        if (!seedResult || !seedResult.markdown) {
            console.error(`Skipping category ${seedUrl} due to scrape failure.`);
            continue;
        }

        const seedMd = seedResult.markdown;
        const productLinks = new Set();
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let match;

        while ((match = linkRegex.exec(seedMd)) !== null) {
            let href = match[2];
            if (href.startsWith('/')) href = `https://www.getfpv.com${href}`;

            if (href.includes('.html') &&
                !href.includes('category') &&
                !href.includes('review') &&
                !href.endsWith('/fpv.html')
            ) {
                const cleanHref = href.split('?')[0];
                if (!existingUrls.has(cleanHref) && !visitedLinks.has(cleanHref)) {
                    productLinks.add(cleanHref);
                    visitedLinks.add(cleanHref);
                }
            }
        }

        console.log(`Found ${productLinks.size} potential product links in this category.`);

        for (const link of productLinks) {
            if (count >= LIMIT) break;

            // Re-load data to ensure we are up to date and clean state
            existingData = loadData();
            existingIds = new Set(existingData.products.map(p => p.id));

            await new Promise(resolve => setTimeout(resolve, 6000));

            try {
                const product = await scrapeProduct(link);
                if (!product || !product.price || !product.imageUrl) continue;
                if ([...existingIds].some(id => id === product.id)) continue;

                const ext = path.extname(product.imageUrl).split('?')[0] || '.jpg';
                const imgFilename = `${product.id}${ext}`;
                try {
                    await downloadImage(product.imageUrl, imgFilename);

                    const localPath = path.join(IMAGES_DIR, imgFilename);
                    // Double check existence
                    if (fs.existsSync(localPath)) {
                        const stats = fs.statSync(localPath);
                        if (stats.size < 2000) {
                            console.warn("Downloaded image is too small.");
                            fs.unlinkSync(localPath);
                            continue;
                        }
                    } else {
                        console.warn("Image file not found after download attempt.");
                        continue;
                    }

                    product.imageUrl = `/images/parts/${imgFilename}`;

                    // INCREMENTAL SAVE
                    existingData.products.push(product);
                    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(existingData, null, 2));
                    existingIds.add(product.id);
                    existingUrls.add(link.split('?')[0]);

                    count++;
                    console.log(`Added [${count}/${LIMIT}]: ${product.name} (SAVED)`);

                } catch (imgErr) {
                    console.error(`Failed to download/save image for ${product.name}: ${imgErr.message}`);
                }

            } catch (err) {
                console.error(`Error processing ${link}: ${err.message}`);
            }
        }
    }

    console.log(`\nJob Complete. Total added in this run: ${count}`);
}

run();
