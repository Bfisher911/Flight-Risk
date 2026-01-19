import json
from pathlib import Path
import sys
from collections import defaultdict

# Add project root to path
PROJECT_ROOT = Path(__file__).resolve().parents[2]
sys.path.append(str(PROJECT_ROOT))
from agent.config import PRODUCTS_FILE

def analyze_images():
    print(f"Analyzing images in {PRODUCTS_FILE}...")
    
    with open(PRODUCTS_FILE, 'r') as f:
        data = json.load(f)
    
    products = data.get("products", [])
    image_counts = defaultdict(list)
    
    # Check for duplicates
    for product in products:
        img = product.get("imageUrl", "")
        image_counts[img].append(product.get("name"))
        
    print("\n--- Duplicate Image Usage ---")
    duplicates_found = False
    for img, names in image_counts.items():
        if len(names) > 1:
            duplicates_found = True
            print(f"Image: {img}")
            print(f"Used by {len(names)} products:")
            for name in names:
                print(f"  - {name}")
            print("")
            
    if not duplicates_found:
        print("No duplicate images found.")

if __name__ == "__main__":
    analyze_images()
