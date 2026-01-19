import json
import os
import cloudscraper
from bs4 import BeautifulSoup
from pathlib import Path
import sys
import time

# Add project root to path
PROJECT_ROOT = Path(__file__).resolve().parents[2]
sys.path.append(str(PROJECT_ROOT))
from agent.config import PRODUCTS_FILE

IMAGES_DIR = PROJECT_ROOT / "public/images/parts"

def scrape_images():
    print(f"Reading {PRODUCTS_FILE}...")
    with open(PRODUCTS_FILE, 'r') as f:
        data = json.load(f)
    
    products = data.get("products", [])
    updated = False
    
    # Ensure directory exists
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    
    scraper = cloudscraper.create_scraper()
    
    for i, product in enumerate(products):
        name = product.get("name")
        search_link = product.get("getfpvLink", "")
        current_image = product.get("imageUrl", "")
        
        print(f"[{i+1}/{len(products)}] Processing: {name}")
        
        if not search_link:
            print("  -> No GetFPV link found, skipping.")
            continue

        try:
            # 1. Search Page
            product_url = search_link
            if "catalogsearch" in search_link:
                # print(f"  -> Searching: {search_link}")
                resp = scraper.get(search_link)
                # Cloudscraper doesn't raise_for_status by default the same way, but let's check
                if resp.status_code != 200:
                    print(f"  -> Failed to load search page: {resp.status_code}")
                    continue
                    
                soup = BeautifulSoup(resp.text, 'html.parser')
                
                # Find first product link
                product_item = soup.select_one('a.product-item-link')
                if not product_item:
                    print("  -> No products found in search.")
                    continue
                    
                product_url = product_item['href']
                # print(f"  -> Found Product URL: {product_url}")

            # 2. Product Page
            if product_url != search_link:
                time.sleep(1) # Polite delay
                
            resp = scraper.get(product_url)
            if resp.status_code != 200:
                print(f"  -> Failed to load product page: {resp.status_code}")
                continue
                
            soup = BeautifulSoup(resp.text, 'html.parser')
            
            # 3. Find Image
            img_url = None
            
            # Try og:image first (usually high res)
            og_image = soup.find("meta", property="og:image")
            if og_image:
                img_url = og_image["content"]
            
            if not img_url:
                 # Fallback to magic toolbox or standard img
                media_img = soup.select_one('.gallery-placeholder__image')
                if media_img:
                    img_url = media_img['src']
            
            if not img_url:
                print("  -> Could not find image URL on page.")
                continue
                
            # print(f"  -> Image Source: {img_url}")
            
            # 4. Download
            ext = os.path.splitext(img_url)[1].lower()
            if not ext or len(ext) > 5:
                ext = ".jpg" 
            
            slug = product.get("id")
            new_filename = f"{slug}{ext}"
            local_path = IMAGES_DIR / new_filename
            
            # Skip if we already have it and it's not low res (simple optimization to save time?)
            # But the requirement is to update images. Let's overwrite to ensure quality.
            
            img_resp = scraper.get(img_url)
            if img_resp.status_code == 200:
                with open(local_path, 'wb') as f_img:
                    f_img.write(img_resp.content)
                # print(f"  -> Saved to: {local_path.name}")
                
                # 5. Update JSON if needed
                new_image_path = f"/images/parts/{new_filename}"
                if current_image != new_image_path:
                    print(f"  -> Updating products.json: {current_image} -> {new_image_path}")
                    product["imageUrl"] = new_image_path
                    updated = True
            else:
                print(f"  -> Failed to download image: {img_resp.status_code}")
            
            time.sleep(1) # Be polite
            
        except Exception as e:
            print(f"  -> Error: {e}")
            continue

    if updated:
        print("Saving updated products.json...")
        with open(PRODUCTS_FILE, 'w') as f:
            json.dump(data, f, indent=2)
    else:
        print("No changes to products.json.")

if __name__ == "__main__":
    scrape_images()
