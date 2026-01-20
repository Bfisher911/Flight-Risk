const FirecrawlApp = require('@mendable/firecrawl-js').default;
const fs = require('fs');
const path = require('path');
const https = require('https');

// --- Configuration ---
const apiKey = "fc-8ed75294f4c34e5ea4b716a2408efd48";
const app = new FirecrawlApp({ apiKey: apiKey });

const AFFILIATE_ID = 'oUUXh2q4mRKjRBXv';
const AFFILIATE_PARAMS = `afid=${AFFILIATE_ID}&referring_service=link`;
const PRODUCTS_FILE = path.resolve(__dirname, '../../src/data/products.json');
const IMAGES_DIR = path.resolve(__dirname, '../../public/images/parts');

const TARGET_SEARCHES = [
    "GEPRC CineLog35 V2 Analog",
    "SpeedyBee Master 5 V2",
    "BetaFPV Meteor75 Pro Analog",
    "TBS Crossfire Nano RX Pro",
    "Caddx Ratel 2",
    "AxisFlying Cineon"
];

// --- Helper Functions ---
function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
}

async function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const filepath = path.join(IMAGES_DIR, filename);
        ensureDirectoryExistence(filepath);

        if (fs.existsSync(filepath) && fs.statSync(filepath).size > 2000) {
            return resolve(`/images/parts/${filename}`);
        }

        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close(() => resolve(`/images/parts/${filename}`));
                });
            } else {
                file.close();
                fs.unlink(filepath, () => { });
                reject(`Server responded with ${response.statusCode}: ${url}`);
            }
        }).on('error', (err) => {
            fs.unlink(filepath, () => { });
            reject(err.message);
        });
    });
}

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
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
    console.log(`Scraping product page: ${url}`);
    let result = null;
    try {
        result = await app.scrape(url, { formats: ['markdown'] });
    } catch (err) {
        console.error(`Error scraping ${url}: ${err.message}`);
        return null;
    }

    if (!result || !result.markdown) return null;

    const md = result.markdown;
    const meta = result.metadata || {};

    const name = meta.title ? meta.title.replace(' - GetFPV', '').trim() : "Unknown Product";
    const price = extractPrice(md);
    const description = meta.description || "No description available.";

    let imageUrl = meta['og:image'] || "";
    if (Array.isArray(imageUrl)) imageUrl = imageUrl[0];

    const specs = extractSpecs(md);

    // Initial Category Guess
    let category = "Components";
    if (name.toLowerCase().includes('drone') || name.toLowerCase().includes('bnf')) category = "Drones";
    else if (name.toLowerCase().includes('frame')) category = "Frames"; // Better guess
    else if (name.toLowerCase().includes('motor')) category = "Motors";
    else if (name.toLowerCase().includes('camera')) category = "Camera"; // Better guess

    const brands = ["BetaFPV", "DJI", "iFlight", "GEPRC", "Lumenier", "RadioMaster", "TBS", "Emax", "Flywoo", "Caddx", "SpeedyBee", "AxisFlying"];
    let brand = "Generic";
    for (const b of brands) {
        if (name.toLowerCase().includes(b.toLowerCase())) {
            brand = b;
            break;
        }
    }

    return {
        id: slugify(name) + "-" + Math.floor(Math.random() * 1000),
        name,
        brand,
        category,
        subCategory: "Curated",
        weight: specs["Weight"] || "N/A",
        description,
        price,
        amazonLink: "",
        imageUrl,
        specs,
        consensusReview: "Freshly added from GetFPV.",
        getfpvLink: `${url}?${AFFILIATE_PARAMS}`
    };
}

async function run() {
    console.log("Starting Curated Search & Scrape (Manual Method)...");

    // Load existing
    let productsData = { products: [] };
    if (fs.existsSync(PRODUCTS_FILE)) {
        productsData = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
    }
    const initialCount = productsData.products.length;

    for (const term of TARGET_SEARCHES) {
        console.log(`\nSearching for: "${term}"...`);

        // 1. Search via scrape of result page
        const searchUrl = `https://www.getfpv.com/catalogsearch/result/?q=${encodeURIComponent(term)}`;
        let searchResult = null;
        try {
            searchResult = await app.scrape(searchUrl, { formats: ['markdown'] });
        } catch (e) {
            console.error(`Search failed for ${term}: ${e.message}`);
            continue;
        }

        if (!searchResult || !searchResult.markdown) {
            console.log("No search results found.");
            continue;
        }

        // Parse markdown for first product link
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let match;
        let productUrl = null;

        // Find first valid product link
        while ((match = linkRegex.exec(searchResult.markdown)) !== null) {
            let href = match[2];
            if (href.startsWith('/')) href = `https://www.getfpv.com${href}`;

            // Simple filter for product pages (ending in .html, not category/review)
            if (href.includes('.html') &&
                !href.includes('review') &&
                !href.includes('#') &&
                !href.includes('wishlist')
            ) {
                productUrl = href.split('?')[0];
                break; // Take the first one!
            }
        }

        if (!productUrl) {
            console.log(`❌ No product link found for "${term}"`);
            continue;
        }

        console.log(`-> Found URL: ${productUrl}`);

        // Check availability
        if (productsData.products.some(p => p.getfpvLink && p.getfpvLink.includes(productUrl))) {
            console.log("-> Already exists. Skipping.");
            continue;
        }

        // 2. Scrape Product
        const product = await scrapeProduct(productUrl);
        if (!product) continue;

        // 3. Enrich with Lore
        if (term.includes("CineLog")) {
            product.hazardLevel = "MEDIUM";
            product.dossier = "MISSION ROLE: CINEMATIC / INDOOR\nSYSTEM STATUS: PROTECTED\n\nTHE BRIEF: The CineLog35 is a workhorse. It carries a full-size GoPro but has ducts to prevent it from shredding tailored suits or expensive drapes. It is the polite way to fly fast.";
        } else if (term.includes("Meteor75")) {
            product.hazardLevel = "LOW";
            product.dossier = "MISSION ROLE: INDOOR TRAINER\nSYSTEM STATUS: EXPENDABLE\n\nTHE BRIEF: The ultimate tiny whoop. Bounce off walls, learn to split-S in your hallway, and annoy your cat. It's indestructible enough to learn on, fast enough to keep."
        } else if (term.includes("Master 5")) {
            product.hazardLevel = "HIGH";
            product.dossier = "MISSION ROLE: FREESTYLE RIPPER\nSYSTEM STATUS: KINETIC\n\nTHE BRIEF: A pure freestyle frame. No ducts, no GPS holding your hand. Just carbon fiber and raw power. Designed to hit concrete and keep flying."
        } else if (term.includes("Crossfire")) {
            product.hazardLevel = "CRITICAL";
            product.dossier = "MISSION ROLE: LONG RANGE LINK\nSYSTEM STATUS: ESSENTIAL\n\nTHE BRIEF: This is the lifeline. 900MHz of 'I am not crashing today'. If you lose video, this will bring you home."
        } else if (term.includes("Ratel")) {
            product.hazardLevel = "LOW";
            product.dossier = "MISSION ROLE: VISUAL SENSOR\nSYSTEM STATUS: NIGHT OPS\n\nTHE BRIEF: This eye sees in the dark. Starlight sensor means you can fly when the sun is gone. High dynamic range means you don't get blinded by the sun."
        }

        // 4. Download Image
        if (product.imageUrl && product.imageUrl.startsWith('http')) {
            const ext = path.extname(product.imageUrl).split('?')[0] || '.jpg';
            const imgFilename = `${product.id}${ext}`;
            try {
                const localPath = await downloadImage(product.imageUrl, imgFilename);
                product.imageUrl = localPath;
            } catch (e) {
                console.error("Image download failed, keeping remote URL.");
            }
        }

        product.systemVerified = true;

        // Save
        productsData.products.push(product);
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(productsData, null, 2));
        console.log(`✅ Added: ${product.name}`);

        await new Promise(r => setTimeout(r, 2000));
    }

    console.log(`\nJob Complete. Total added: ${productsData.products.length - initialCount}`);
}

run();
