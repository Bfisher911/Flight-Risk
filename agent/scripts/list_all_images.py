import json
from pathlib import Path
import sys
from collections import defaultdict

# Add project root to path
PROJECT_ROOT = Path(__file__).resolve().parents[2]
sys.path.append(str(PROJECT_ROOT))
from agent.config import PRODUCTS_FILE

def list_all_images():
    print(f"Scanning {PRODUCTS_FILE}...\n")
    
    with open(PRODUCTS_FILE, 'r') as f:
        data = json.load(f)
    
    products = data.get("products", [])
    image_usage = defaultdict(int)
    
    for p in products:
        img = p.get("imageUrl", "(None)")
        image_usage[img] += 1
        
    print(f"Total Products: {len(products)}")
    print(f"Unique Images: {len(image_usage)}")
    
    # Sort by usage count
    sorted_usage = sorted(image_usage.items(), key=lambda x: x[1], reverse=True)
    
    print("\n--- Top 20 Most Used Images ---")
    for img, count in sorted_usage[:20]:
        print(f"{count}: {img}")

if __name__ == "__main__":
    list_all_images()
