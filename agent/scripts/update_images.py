import json
import os

PRODUCTS_FILE = 'src/data/products.json'

def update_images():
    try:
        with open(PRODUCTS_FILE, 'r') as f:
            data = json.load(f)
        
        products = data.get("products", [])
        count = 0
        
        # Mapping logic
        for p in products:
            name = p.get("name", "").lower()
            category = p.get("category", "").lower()
            
            # 1. Specific Hero Products
            if "avata 2" in name:
                p["imageUrl"] = "/images/parts/dji-avata-2.png"
            elif "radiomaster pocket" in name:
                p["imageUrl"] = "/images/parts/radiomaster-pocket.png"
            elif "o3 air unit" in name:
                p["imageUrl"] = "/images/parts/dji-o3-air-unit.png"
            elif "meteor75" in name:
                 p["imageUrl"] = "/images/parts/betafpv-meteor75.png"
            elif "dominator" in name and "fatshark" in p.get("brand", "").lower():
                p["imageUrl"] = "/images/parts/fatshark-dominator.png"
            elif "ts101" in name:
                p["imageUrl"] = "/images/parts/sequre-ts101.png"
                
            # 2. Generic Category Fallbacks
            # Only apply if it wasn't caught by specific rules (or force overwrite placeholder)
            # We want to overwrite EVERYTHING that is currently a placeholder or generic.
            # But specific rules run first. If imageUrl is set to one of the above, skip.
            
            current_img = p.get("imageUrl", "")
            if current_img in [
                "/images/parts/dji-avata-2.png", 
                "/images/parts/radiomaster-pocket.png",
                "/images/parts/dji-o3-air-unit.png",
                "/images/parts/betafpv-meteor75.png",
                "/images/parts/fatshark-dominator.png",
                "/images/parts/sequre-ts101.png"
            ]:
                count += 1
                continue
            
            # Category Logic
            if "drone" in category or "quad" in category:
                p["imageUrl"] = "/images/parts/generic-drone.png"
            elif "radio" in category or "controller" in category:
                p["imageUrl"] = "/images/parts/generic-radio.png"
            elif "goggle" in category:
                p["imageUrl"] = "/images/parts/generic-goggles.png"
            elif "vtx" in category:
                 p["imageUrl"] = "/images/parts/generic-vtx.png"
            elif "tool" in category:
                p["imageUrl"] = "/images/parts/generic-tool.png"
            elif "gear" in category:
                p["imageUrl"] = "/images/parts/generic-lipo.png" # Assuming gear is mostly batteries/chargers for now or bag? "Generic Lipo" fits batteries.
                if "case" in name or "backpack" in name:
                     # We don't have a generic bag image, maybe stick to generic tool or generic drone?
                     # actually generic-lipo is weird for a bag.
                     # Let's check subcategory?
                     pass 
            
            # Special case for "Battery" if in Gear or its own category
            if "battery" in name or "lipo" in name:
                 p["imageUrl"] = "/images/parts/generic-lipo.png"

            count += 1

        with open(PRODUCTS_FILE, 'w') as f:
            json.dump(data, f, indent=2)
            
        print(f"Updated images for {count} products.")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    update_images()
