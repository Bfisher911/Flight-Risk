import json
import logging
import os
import subprocess
import sys
from pathlib import Path
from urllib.parse import urlparse

# Add project root to path
PROJECT_ROOT = Path(__file__).resolve().parents[2]
sys.path.append(str(PROJECT_ROOT))
from agent.config import PRODUCTS_FILE

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("LocalizeImages")

IMAGES_DIR = PROJECT_ROOT / "public/images/parts"

def get_filename_from_url(url, product_name):
    """Generates a clean filename from product name and extension."""
    parsed = urlparse(url)
    ext = os.path.splitext(parsed.path)[1]
    if not ext:
        ext = ".jpg" # Default to jpg if none found
    
    # Clean product name for filename
    slug = product_name.lower().replace(" ", "-").replace("/", "-")
    slug = "".join(c for c in slug if c.isalnum() or c == "-")
    
    return f"{slug}{ext}"

def localize_images():
    logger.info("Starting image localization with curl...")
    
    try:
        with open(PRODUCTS_FILE, 'r') as f:
            data = json.load(f)
        
        products = data.get("products", [])
        updated_count = 0
        
        # Ensure directory exists
        IMAGES_DIR.mkdir(parents=True, exist_ok=True)
        
        for product in products:
            image_url = product.get("imageUrl", "")
            
            if image_url.startswith("http"):
                logger.info(f"downloading image for: {product.get('name')}")
               
                filename = get_filename_from_url(image_url, product.get("name"))
                local_path = IMAGES_DIR / filename
                
                # Use curl
                try:
                    # -L: Follow redirects
                    # -s: Silent mode
                    # -o: Output file
                    # --insecure: Bypass SSL verification issues (same as verify=False)
                    # --user-agent: Spoof UA
                    cmd = [
                        "curl", 
                        "-L", 
                        "-s", 
                        "--insecure",
                        "--user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
                        "-o", str(local_path), 
                        image_url
                    ]
                    
                    result = subprocess.run(
                        cmd,
                        capture_output=True,
                        text=True,
                        timeout=30
                    )
                    
                    if result.returncode == 0 and local_path.exists() and local_path.stat().st_size > 0:
                         # Update product with local path
                        product["imageUrl"] = f"/images/parts/{filename}"
                        updated_count += 1
                        logger.info(f"Saved to {product['imageUrl']}")
                    else:
                        logger.error(f"Failed to download {image_url}. Return code: {result.returncode}, Stderr: {result.stderr}")
                        
                except Exception as e:
                    logger.error(f"Error calling curl for {image_url}: {e}")
                    
        if updated_count > 0:
            with open(PRODUCTS_FILE, 'w') as f:
                json.dump(data, f, indent=2)
            logger.info(f"Successfully localized {updated_count} images.")
        else:
            logger.info("No remote images found to localize.")
            
    except Exception as e:
        logger.error(f"Script failed: {e}")

if __name__ == "__main__":
    localize_images()
