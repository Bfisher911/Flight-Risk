const FirecrawlApp = require('@mendable/firecrawl-js').default;

const apiKey = "fc-8ed75294f4c34e5ea4b716a2408efd48";
const app = new FirecrawlApp({ apiKey: apiKey });

async function scrapeUrl(url) {
    if (!url) {
        console.error("Please provide a URL to scrape.");
        process.exit(1);
    }

    console.log(`Scraping ${url}...`);

    try {
        const scrapeResult = await app.scrape(url, { formats: ['markdown'] });

        if (!scrapeResult.success && !scrapeResult.markdown) {
            throw new Error(`Failed to scrape: ${scrapeResult.error}`)
        }

        console.log("--- Scrape Result ---");
        console.log(JSON.stringify(scrapeResult, null, 2));
        console.log("---------------------");

    } catch (error) {
        console.error("Error scraping URL:", error);
        process.exit(1);
    }
}

const targetUrl = process.argv[2];
scrapeUrl(targetUrl);
