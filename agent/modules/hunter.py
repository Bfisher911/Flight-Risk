import json
import logging
import requests
from pathlib import Path
from config import PRODUCTS_FILE, AMAZON_TAG, USER_AGENT

logger = logging.getLogger("FlightRiskAgent.Hunter")

class Hunter:
    def __init__(self, dry_run=False):
        self.dry_run = dry_run
        self.new_products_found = []

    def hunt(self):
        """Main entry point for the Hunter module."""
        logger.info("Starting Market Scan...")
        
        # 1. Scan Market (Simulated/Best Effort)
        potential_products = self.scan_market()
        
        # 2. Gap Analysis
        missing_products = self.gap_analysis(potential_products)
        
        if missing_products:
            logger.info(f"Found {len(missing_products)} new products not in inventory.")
            # 3. Affiliate Tagging matches are handled during object creation or here
            self.new_products_found = missing_products
            return missing_products
        else:
            logger.info("No new missing products found.")
            return []

    def scan_market(self):
        """
        Scans external sources for new products.
        NOTE: Real Amazon scraping is brittle. 
        This implementation simulates finding a list of 'trending' items 
        or parses a hypothetical search result.
        """
        logger.info("Scanning for new releases...")
        
        # In a real scenario, this would loop through categories and URLs.
        # For this agent's stability, we'll implement a pattern that *could* be real,
        # but defaulting to a safe list for the demo to ensure it runs.
        
        # Example of what we'd look for:
        potential_finds = [
            {
                "name": "DJI O3 Air Unit",
                "brand": "DJI",
                "category": "VTX",
                "price": 229.00,
                "amazonLink": "https://amazon.com/dp/B0BGRZ7T1S", # No tag yet
                "reviews_rating": 4.5
            },
            {
                "name": "RadioMaster Pocket", # This already exists in our products.json, testing gap analysis
                "brand": "RadioMaster",
                "amazonLink": "https://amazon.com/dp/B0CBV2K8N6"
            },
            {
                "name": "BetaFPV Meteor75 Pro",
                "brand": "BetaFPV",
                "category": "Drones",
                "price": 119.99,
                "amazonLink": "https://amazon.com/dp/B0B1234567",
                "reviews_rating": 4.2
            }
        ]
        
        # TODO: Implement actual BeautifulSoup scraping here if a reliable source is found.
        # For now, return the potential finds.
        return potential_finds

    def gap_analysis(self, potential_products):
        """Compares potential finds against products.json."""
        logger.info("Performing Gap Analysis...")
        
        try:
            with open(PRODUCTS_FILE, 'r') as f:
                data = json.load(f)
            
            existing_names = {p.get("name").lower() for p in data.get("products", [])}
            existing_links = {p.get("amazonLink", "").split('?')[0] for p in data.get("products", []) if p.get("amazonLink")}

            missing = []
            for item in potential_products:
                # Normalization for check
                name = item.get("name", "").lower()
                link = item.get("amazonLink", "").split('?')[0]
                
                # Check for 4.0+ stars if rating is available
                if item.get("reviews_rating", 0) < 4.0:
                    continue

                if name not in existing_names and link not in existing_links:
                    logger.info(f"Gap identified: {item.get('name')}")
                    
                    # Tagging
                    tagged_link = self.add_affiliate_tag(item.get("amazonLink"))
                    item["amazonLink"] = tagged_link
                    
                    missing.append(item)
                else:
                    logger.debug(f"Skipping existing item: {item.get('name')}")
            
            return missing

        except Exception as e:
            logger.error(f"Error in gap analysis: {e}")
            return []

    def add_affiliate_tag(self, url):
        """Appends the Associate Tag to the URL."""
        if not url:
            return ""
        
        separator = "&" if "?" in url else "?"
        if f"tag={AMAZON_TAG}" in url:
            return url
        
        return f"{url}{separator}tag={AMAZON_TAG}"
