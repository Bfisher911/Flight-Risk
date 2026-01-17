import re
import json
import requests
import logging
from pathlib import Path
from config import PRODUCTS_FILE, ARTICLES_DIR, USER_AGENT

logger = logging.getLogger("FlightRiskAgent.Spider")

class Spider:
    def __init__(self, dry_run=False):
        self.dry_run = dry_run
        self.links_checked = 0
        self.links_fixed = 0

    def crawl_and_audit(self):
        """Main entry point for the Spider module."""
        logger.info("Starting Link Audit...")
        
        # 1. Audit Products
        self.audit_products()
        
        # 2. Audit Articles (Markdown)
        self.audit_articles()
        
        logger.info(f"Link Audit Complete. Checked: {self.links_checked}, Fixed: {self.links_fixed}")

    def audit_products(self):
        """Scans products.json for dead links."""
        logger.info(f"Scanning {PRODUCTS_FILE}...")
        try:
            with open(PRODUCTS_FILE, 'r') as f:
                data = json.load(f)
            
            modified = False
            for product in data.get("products", []):
                # Check Amazon/Affiliate Link
                url = product.get("amazonLink")
                if url:
                    if not self.check_link(url):
                        logger.warning(f"Dead link found for {product.get('name')}: {url}")
                        if not self.dry_run:
                            # For products, we might want to just flag it or remove it. 
                            # The instructions say "remove the hyperlink but preserve text". 
                            # For a JSON data field, we can't really "preserve text" other than the name.
                            # I will leave the field but maybe mark it or log it. 
                            # Actually, for JSON data, removing the link is probably best.
                            product["amazonLink"] = "" 
                            modified = True
                            self.links_fixed += 1

            if modified and not self.dry_run:
                with open(PRODUCTS_FILE, 'w') as f:
                    json.dump(data, f, indent=2)
                logger.info(f"Updated {PRODUCTS_FILE} with removed links.")
                
        except Exception as e:
            logger.error(f"Error auditing products: {e}")

    def audit_articles(self):
        """Scans markdown articles for dead links."""
        if not ARTICLES_DIR.exists():
            logger.warning(f"Articles directory not found: {ARTICLES_DIR}")
            return

        for file_path in ARTICLES_DIR.glob("*.md"):
            logger.info(f"Scanning article: {file_path.name}")
            self.process_markdown_file(file_path)

    def process_markdown_file(self, file_path):
        """Reads a markdown file, finds links, checks them, and remediates if dead."""
        try:
            with open(file_path, 'r') as f:
                content = f.read()

            # Regex for markdown links: [anchor text](url)
            # We skip internal links (starting with / or #)
            # This regex captures the whole link, the anchor text, and the url
            link_pattern = re.compile(r'\[([^\]]+)\]\((https?://[^)]+)\)')
            
            new_content = content
            matches = link_pattern.findall(content)
            
            file_modified = False
            
            for anchor_text, url in matches:
                self.links_checked += 1
                if not self.check_link(url):
                    logger.warning(f"Dead link in {file_path.name}: {url}")
                    if not self.dry_run:
                        # Remediation: Replace [text](dead_url) with text
                        # We need to escape regex special chars in text and url for the substitution
                        safe_anchor = re.escape(anchor_text)
                        safe_url = re.escape(url)
                        # We reconstruct the pattern to match this specific instance
                        specific_pattern = f'\\[{safe_anchor}\\]\\({safe_url}\\)'
                        new_content = re.sub(specific_pattern, anchor_text, new_content)
                        file_modified = True
                        self.links_fixed += 1

            if file_modified and not self.dry_run:
                with open(file_path, 'w') as f:
                    f.write(new_content)
                logger.info(f"Remediated dead links in {file_path.name}")

        except Exception as e:
            logger.error(f"Error processing {file_path.name}: {e}")

    def check_link(self, url):
        """Checks if a URL is alive (200-299 status code)."""
        try:
            # Fake a browser user agent to avoid being blocked by Amazon/Retailers
            headers = {'User-Agent': USER_AGENT}
            response = requests.head(url, headers=headers, timeout=5, allow_redirects=True)
            
            # If HEAD fails (some servers deny it), try GET
            if response.status_code == 405 or response.status_code == 403:
                response = requests.get(url, headers=headers, timeout=5, stream=True)
            
            if 200 <= response.status_code < 300:
                # Extra check for Amazon soft 404s (Dog pages)
                if "amazon.com" in url:
                    # Amazon returns 200 for their "Sorry we couldn't find that page" error
                    # Also "CAPTCHA" pages start with generic <title>Amazon.com</title>
                    try:
                        # We might need to make a full GET if we only did HEAD
                        if response.request.method == 'HEAD':
                             response = requests.get(url, headers=headers, timeout=5)
                        
                        text = response.text
                        if "we couldn't find that page" in text or "SORRY" in text:
                            logger.warning(f"Amazon Soft 404 detected for {url}")
                            return False
                        
                        # CAPTCHA / Generic Home Page check
                        if "<title>Amazon.com</title>" in text or '<title dir="ltr">Amazon.com</title>' in text:
                            logger.warning(f"Amazon Generic/CAPTCHA detected (likely dead/blocked) for {url}")
                            return False

                    except Exception:
                        pass # verification failed, assume it's okay or let it be

                return True
            else:
                logger.debug(f"Link {url} returned status {response.status_code}")
                return False
        except requests.RequestException as e:
            logger.debug(f"Link check failed for {url}: {e}")
            return False
