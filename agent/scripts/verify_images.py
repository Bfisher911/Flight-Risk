import json
import os
import sys
from pathlib import Path

# Add project root to path
PROJECT_ROOT = Path(__file__).resolve().parents[2]
sys.path.append(str(PROJECT_ROOT))

PRODUCTS_FILE = PROJECT_ROOT / "src/data/products.json"
IMAGES_DIR = PROJECT_ROOT / "public/images/parts"

def verify_images():
    print(f"Verifying images in {PRODUCTS_FILE}...")
    
    with open(PRODUCTS_FILE, 'r') as f:
        data = json.load(f)
    
    products = data.get("products", [])
    missing_images = []
    
    for product in products:
        name = product.get("name")
        image_url = product.get("imageUrl", "")
        
        if not image_url:
            missing_images.append({"name": name, "reason": "No imageUrl field"})
            continue
            
        if image_url.startswith("http") or image_url.startswith("//"):
            # Remote URL - assume valid for now (could check HEAD)
            continue
            
        # Local file check
        # remove leading slash for path joining
        relative_path = image_url.lstrip("/") 
        # We expect images to be in public/images/parts/... 
        # if the URL is /images/parts/foo.png, relative_path is images/parts/foo.png
        # So we join PROJECT_ROOT / public / relative_path's basename if structure matches
        # Actually proper way: URL /images/parts/foo.png maps to public/images/parts/foo.png
        
        # Verify the path structure
        if "images/parts/" in relative_path:
             filename = os.path.basename(relative_path)
             local_path = IMAGES_DIR / filename
             
             if not local_path.exists():
                 missing_images.append({"name": name, "url": image_url, "reason": "Local file not found"})
        else:
            missing_images.append({"name": name, "url": image_url, "reason": "Unknown local path format"})

    if missing_images:
        print(f"Found {len(missing_images)} products with missing or broken images:")
        for item in missing_images:
            print(f"- {item['name']}: {item.get('url', 'N/A')} ({item['reason']})")
    else:
        print("All products have valid local images or remote URLs.")

if __name__ == "__main__":
    verify_images()
