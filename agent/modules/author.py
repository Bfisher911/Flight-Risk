import json
import logging
import random
import datetime
from pathlib import Path
from config import PRODUCTS_FILE, ARTICLES_DIR, GEMINI_API_KEY, AMAZON_TAG, GEMINI_MODEL_SMART
import google.generativeai as genai

logger = logging.getLogger("FlightRiskAgent.Author")

class Author:
    def __init__(self, dry_run=False):
        self.dry_run = dry_run
        self.model = None
        if GEMINI_API_KEY:
            genai.configure(api_key=GEMINI_API_KEY)
            self.model = genai.GenerativeModel(GEMINI_MODEL_SMART)
        self.topics = [
            "The physics of PID tuning",
            "Battery safety for LiPos",
            "Cinewhoop vs. Freestyle: A philosophy",
            "The art of crashing gracefully",
            "Why analog video refuses to die",
            "Understanding antenna polarization",
            "The cost of cheap ESCs"
        ]

    def write_blog_post(self):
        """Main entry point for Author module."""
        if not self.model:
            logger.warning("No Gemini API key found. Skipping blog generation.")
            return

        logger.info("Starting Blog Post Generation...")

        # 1. Select Topic
        topic = random.choice(self.topics)
        logger.info(f"Selected topic: {topic}")

        # 2. Get Products for Affiliate Integration
        products_to_link = self.get_products_for_link(3)

        # 3. Generate Content
        content = self.generate_content(topic, products_to_link)
        
        # 4. Save Article
        if content:
            self.save_article(topic, content)

    def get_products_for_link(self, count=3):
        """Selects random products to feature."""
        try:
            with open(PRODUCTS_FILE, 'r') as f:
                data = json.load(f)
            products = data.get("products", [])
            if not products:
                return []
            
            # Filter for items that have actual links
            valid_products = [p for p in products if p.get("amazonLink")]
            return random.sample(valid_products, min(count, len(valid_products)))
        except Exception as e:
            logger.error(f"Failed to load products for author: {e}")
            return []

    def generate_content(self, topic, products):
        """Generates the full blog post with constraints."""
        product_context = "\n".join([f"- {p.get('name')}: {p.get('amazonLink')}" for p in products])
        
        prompt = f"""
        Write a 1000-1500 word blog post about "{topic}".
        
        **Stylistic Constraints (CRITICAL):**
        - Voice: "The Observant Professor". Knowledgeable about tech but grounded in the reality of crashing/repairing.
        - NO "AI cadence" (tidy trios of adjectives).
        - NO mirrored phrasing.
        - NO em-dashes (—).
        - Sentence Structure: Mix short, stoic lines (Hemingway) with occasional longer, atmospheric clauses (Fitzgerald).
        - Tone: Avoid "empower" or "optimize." Use concrete engineering terms + human experience.
        
        **Affiliate Integration:**
        Contextually weave these products into the text where relevant (don't just list them):
        {product_context}
        
        **Format:**
        Return ONLY the body of the article in Markdown format. Do not include frontmatter yet.
        """
        
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            logger.error(f"LLM Generation failed: {e}")
            return None

    def save_article(self, topic, content):
        """Saves the article with frontmatter."""
        slug = topic.lower().replace(" ", "-").replace(":", "").replace(",", "")
        filename = f"{datetime.date.today()}-{slug}.md"
        file_path = ARTICLES_DIR / filename
        
        frontmatter = f"""---
title: "{topic}"
date: "{datetime.date.today()}"
excerpt: "An engineering perspective on {topic.lower()}."
author: "Flight Risk"
categories: ["Tech", "FPV"]
---

"""
        full_text = frontmatter + content
        
        if not self.dry_run:
            # Ensure directory exists
            ARTICLES_DIR.mkdir(exist_ok=True)
            
            with open(file_path, 'w') as f:
                f.write(full_text)
            logger.info(f"Article published: {file_path}")
        else:
            logger.info(f"DRY RUN: Would save article to {file_path}")
