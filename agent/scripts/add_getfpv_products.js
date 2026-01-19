const FirecrawlApp = require('@mendable/firecrawl-js').default;
const fs = require('fs');
const path = require('path');
const https = require('https');

const apiKey = "fc-8ed75294f4c34e5ea4b716a2408efd48";
const app = new FirecrawlApp({ apiKey: apiKey });

const PRODUCTS_FILE = path.resolve(__dirname, '../../src/data/products.json');
const IMAGES_DIR = path.resolve(__dirname, '../../public/images/parts');
const SEED_URL = "https://www.getfpv.com/best-sellers.html";

// Max products to add
const LIMIT = 30;

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

async function downloadImage(url, filename) {
    const filepath = path.join(IMAGES_DIR, filename);
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
            fs.unlink(filepath, () => { }); // Delete failed file
            reject(err);
        });
    });
}

function extractPrice(markdown) {
    // Look for price patterns like $123.45
    const match = markdown.match(/\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/);
    return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
}

function extractSpecs(markdown) {
    // Heuristic: Look for lists under a "Specifications" header
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
                inSpecs = false; // Next header
                break;
            }
            // Parse list items: - Key: Value
            const match = line.match(/^[-*]\s*([^:]+):\s*(.+)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim();
                // Basic filtering to keep specs clean
                if (key.length < 20 && value.length < 50) {
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
            break; // Success
        } catch (err) {
            if (err.message.includes("Rate limit")) {
                console.log("Rate limit hit. Waiting 30 seconds...");
                await new Promise(r => setTimeout(r, 30000));
                retries--;
            } else {
                throw err; // Other error
            }
        }
    }

    if (!result || (!result.success && !result.markdown)) {
        console.error("Failed to scrape product page after retries");
        return null;
    }

    const md = result.markdown;
    const meta = result.metadata || {};

    // Extract info
    const name = meta.title ? meta.title.replace(' - GetFPV', '').trim() : "Unknown Product";
    const price = extractPrice(md);
    const description = meta.description || "No description available.";
    let imageUrl = meta['og:image'] || "";
    if (Array.isArray(imageUrl)) {
        imageUrl = imageUrl[0];
    }

    const specs = extractSpecs(md);

    // Determine Category/Brand (Hueristics)
    let category = "Components";
    if (name.toLowerCase().includes('drone') || name.toLowerCase().includes('bnf')) category = "Drones";
    else if (name.toLowerCase().includes('motor')) category = "Motors";
    else if (name.toLowerCase().includes('battery')) category = "Batteries";
    else if (name.toLowerCase().includes('controller')) category = "Electronics";

    // Brand guessing
    const brands = ["BetaFPV", "DJI", "iFlight", "GEPRC", "Lumenier", "RadioMaster", "TBS", "Emax", "Flywoo"];
    let brand = "Generic";
    for (const b of brands) {
        if (name.toLowerCase().includes(b.toLowerCase())) {
            brand = b;
            break;
        }
    }

    return {
        id: slugify(name) + "-" + Math.floor(Math.random() * 100),
        name,
        brand,
        category,
        subCategory: "General", // Default
        weight: specs["Weight"] || "N/A",
        description,
        price,
        amazonLink: "", // Empty for now
        imageUrl, // Remote URL, will be replaced after download
        specs,
        consensusReview: "Freshly added from GetFPV.",
        getfpvLink: url
    };
}

async function run() {
    console.log(`Scanning New Arrivals: ${SEED_URL}`);

    // 1. Scrape Seed Page for Product Links
    const seedResult = await app.scrape(SEED_URL, { formats: ['markdown'] });
    if (!seedResult.success && !seedResult.markdown) {
        console.error("Failed to scrape seed URL");
        return;
    }

    const seedMd = seedResult.markdown;
    const productLinks = new Set();
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;

    // Heuristic: GetFPV product URLs typically end in .html and don't contain 'blog', 'account', etc.
    // And usually are relative or absolute
    while ((match = linkRegex.exec(seedMd)) !== null) {
        let href = match[2];
        if (href.startsWith('/')) href = `https://www.getfpv.com${href}`;

        // Filter for valid product pages
        // Exclude common category words and top-level pages
        if (href.includes('.html') &&
            !href.includes('category') &&
            !href.includes('login') &&
            !href.includes('blog') &&
            !href.includes('account') &&
            !href.endsWith('/fpv.html') &&
            !href.endsWith('/electronics.html') &&
            !href.endsWith('/motors.html') &&
            !href.endsWith('/batteries.html') &&
            !href.endsWith('/radios.html') &&
            !href.endsWith('/propellers.html') &&
            !href.endsWith('/fpv-quad-kits.html') &&
            !href.endsWith('/multi-rotor-frames.html')
        ) {
            productLinks.add(href);
        }
    }

    console.log(`Found ${productLinks.size} potential product links.`);

    // 2. Process Products
    const newProducts = [];
    const existingData = JSON.parse(fs.readFileSync(PRODUCTS_FILE));
    const existingIds = new Set(existingData.products.map(p => p.id));

    let count = 0;
    for (const link of productLinks) {
        if (count >= LIMIT) break;

        // Rate limit delay (6 seconds)
        await new Promise(resolve => setTimeout(resolve, 6000));

        try {
            const product = await scrapeProduct(link);
            if (!product || !product.price || !product.imageUrl) continue;

            // Avoid duplicates (by name check usually, or URL)
            if ([...existingIds].some(id => id === product.id)) continue;

            // Download Image
            const ext = path.extname(product.imageUrl).split('?')[0] || '.jpg';
            const imgFilename = `${product.id}${ext}`;
            try {
                console.log(`Downloading image: ${product.imageUrl}`);
                await downloadImage(product.imageUrl, imgFilename);
                product.imageUrl = `/images/parts/${imgFilename}`;

                newProducts.push(product);
                existingIds.add(product.id);
                count++;
                console.log(`Added [${count}/${LIMIT}]: ${product.name}`);

            } catch (imgErr) {
                console.error(`Failed to download image for ${product.name}: ${imgErr.message}`);
            }

        } catch (err) {
            console.error(`Error processing ${link}: ${err.message}`);
        }
    }

    // 3. Save Data
    if (newProducts.length > 0) {
        existingData.products.push(...newProducts);
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(existingData, null, 2));
        console.log(`\nSuccess! Added ${newProducts.length} new products to ${PRODUCTS_FILE}`);
    } else {
        console.log("\nNo new products were added.");
    }
}

run();
