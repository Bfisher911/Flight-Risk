import json
import logging
import os
import requests
from pathlib import Path
from config import PRODUCTS_FILE, GEMINI_API_KEY, PROJECT_ROOT, GEMINI_MODEL_FAST
import google.generativeai as genai

logger = logging.getLogger("FlightRiskAgent.Builder")

class Builder:
    def __init__(self, dry_run=False):
        self.dry_run = dry_run
        self.model = None
        if GEMINI_API_KEY:
            genai.configure(api_key=GEMINI_API_KEY)
            self.model = genai.GenerativeModel(GEMINI_MODEL_FAST)
        
    def build_product_pages(self, new_products):
        """
        Receives a list of new product dicts, enriches them with LLM content,
        downloads images, and appends to products.json.
        """
        if not new_products:
            logger.info("No new products to build.")
            return

        logger.info(f"Building {len(new_products)} new product pages...")
        
        enriched_products = []
        for product in new_products:
            try:
                # 1. Scrape/Download Image
                image_path = self.process_image(product)
                
                # 2. Generate Content
                description = self.generate_description(product)
                consensus = self.generate_consensus(product)
                
                # 3. Construct Final Product Object
                # We need to map the "mock" scanner fields to our schema
                # Schema: id, name, brand, category, subCategory, weight, description, price, amazonLink, imageUrl, specs
                
                final_product = {
                    "id": self.generate_id(product),
                    "name": product.get("name"),
                    "brand": product.get("brand"),
                    "category": product.get("category", "Uncategorized"),
                    "subCategory": product.get("subCategory", "General"),
                    "weight": product.get("weight", "N/A"),
                    "description": description,
                    "price": product.get("price", 0.0),
                    "amazonLink": product.get("amazonLink"),
                    "imageUrl": image_path,
                    "specs": product.get("specs", {}),
                    "consensusReview": consensus # Adding this new field to schema
                }
                
                enriched_products.append(final_product)
                logger.info(f"Built page for: {product.get('name')}")
                
            except Exception as e:
                logger.error(f"Failed to build product {product.get('name')}: {e}")

        # 4. Update Inventory
        if enriched_products and not self.dry_run:
            self.update_inventory(enriched_products)

    def process_image(self, product):
        """Downloads image to public/images/parts/ and returns relative path."""
        # For mock products or simple links, we might just return a placeholder 
        # or download if it's a real URL.
        # Assuming product['imageUrl'] might exist from the scanner or not.
        
        # Mock behavior:
        return "/images/parts/placeholder.png"

    def generate_description(self, product):
        """Uses LLM to write a unique description."""
        # Prefer pre-supplied description if available
        if product.get("description") and product.get("description") != "No description available.":
            return product.get("description")

        if not self.model:
            return product.get("description", "No description available.")
            
        prompt = f"""
        Write a unique, engaging description for a drone product named "{product.get('name')}".
        Focus on: What it is, Flight Characteristics, and Compatibility.
        Tone: "Observant Professor" - knowledgeable tech engineering mixed with pilot reality.
        Max 50 words.
        """
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            logger.error(f"LLM Generation failed: {e}")
            return "Description generation failed."

    def generate_consensus(self, product):
        """Uses LLM to synthesize a consensus review."""
        # Prefer pre-supplied review if available
        if product.get("consensusReview") and product.get("consensusReview") != "Consensus review unavailable.":
            return product.get("consensusReview")

        if not self.model:
            return "Consensus review unavailable."

        # In a real scenario, we'd pass scraped reviews here.
        # For now, we ask the LLM to hallucinate a consensus based on its knowledge base 
        # (or just generic if it's a made-up product).
        prompt = f"""
        Based on general knowledge of FPV gear, write a brutally honest logical consensus review for "{product.get('name')}" by "{product.get('brand')}".
        Highlight pros and cons. If it has known issues (drift, fragile), state them.
        Max 3 sentences.
        """
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            logger.error(f"LLM Generation failed: {e}")
            return "Consensus generation failed."

    def generate_id(self, product):
        """Generates a simple ID like 'brand-name-01'."""
        slug = product.get("name", "").lower().replace(" ", "-")
        return f"{slug[:20]}-{str(product.get('price'))[:2]}"

    def update_inventory(self, new_items):
        """Appends new items to products.json."""
        try:
            with open(PRODUCTS_FILE, 'r') as f:
                data = json.load(f)
            
            data["products"].extend(new_items)
            
            with open(PRODUCTS_FILE, 'w') as f:
                json.dump(data, f, indent=2)
            
            logger.info(f"Inventory updated with {len(new_items)} new items.")
        except Exception as e:
            logger.error(f"Failed to update inventory: {e}")
