import json
from pathlib import Path
import sys

# Add project root to path
PROJECT_ROOT = Path(__file__).resolve().parents[2]
sys.path.append(str(PROJECT_ROOT))
from agent.config import PRODUCTS_FILE

def list_images():
    with open(PRODUCTS_FILE, 'r') as f:
        data = json.load(f)
    
    products = data.get("products", [])
    print(f"Found {len(products)} products.")
    
    for p in products:
        print(f"{p['id']}: {p.get('imageUrl')}")

if __name__ == "__main__":
    list_images()
