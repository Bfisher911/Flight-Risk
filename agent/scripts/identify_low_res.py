import json
import os
from pathlib import Path
import sys

# Add project root to path
PROJECT_ROOT = Path(__file__).resolve().parents[2]
sys.path.append(str(PROJECT_ROOT))
from agent.config import PRODUCTS_FILE

IMAGES_DIR = PROJECT_ROOT / "public/images/parts"

def identify_low_res():
    with open(PRODUCTS_FILE, 'r') as f:
        data = json.load(f)
    
    products = data.get("products", [])
    low_res_products = []
    
    for product in products:
        image_url = product.get("imageUrl", "")
        # Check if local
        if image_url.startswith("/images/parts/"):
            filename = os.path.basename(image_url)
            local_path = IMAGES_DIR / filename
            
            if local_path.exists():
                size = local_path.stat().st_size
                if size < 20000: # 20KB
                    low_res_products.append({
                        "name": product["name"],
                        "id": product["id"],
                        "getfpvLink": product.get("getfpvLink", "N/A"),
                        "current_image": str(local_path),
                        "size": size
                    })
    
    print(f"Found {len(low_res_products)} low-res images:")
    for p in low_res_products:
        print(f"{p['name']} | {p['getfpvLink']} | {p['current_image']}")

if __name__ == "__main__":
    identify_low_res()
