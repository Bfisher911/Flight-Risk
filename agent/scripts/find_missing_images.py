import json
from pathlib import Path
import sys
from collections import defaultdict

# Add project root to path
PROJECT_ROOT = Path(__file__).resolve().parents[2]
sys.path.append(str(PROJECT_ROOT))
from agent.config import PRODUCTS_FILE

GENERIC_IMAGES = [
    "/images/parts/generic-drone.png",
    "/images/parts/generic-radio.png",
    "/images/parts/generic-goggles.png",
    "/images/parts/generic-vtx.png",
    "/images/parts/generic-tool.png",
    "/images/parts/generic-lipo.png",
    "",
    None
]


def find_missing_images():
    print(f"Scanning {PRODUCTS_FILE} for generic or missing images...\n")
    
    with open(PRODUCTS_FILE, 'r') as f:
        data = json.load(f)
    
    products = data.get("products", [])
    missing_count = 0
    generic_usage = defaultdict(list)
    missing_files = []

    public_dir = PROJECT_ROOT / "public"

    for p in products:
        img_path = p.get("imageUrl", "")
        
        # Check if it's a generic image
        if img_path in GENERIC_IMAGES:
            generic_usage[img_path].append(p.get("name"))
            missing_count += 1
            continue

        # Check if file exists
        if img_path and img_path.startswith("/"):
            full_path = public_dir / img_path.lstrip("/")
            if not full_path.exists():
                missing_files.append(f"[{p.get('id')}] {p.get('name')} -> File not found: {img_path}")
                missing_count += 1
        elif not img_path:
             generic_usage["(Empty)"].append(p.get("name"))
             missing_count += 1

    print("\n--- Products using Generic Images ---")
    for img, names in generic_usage.items():
        print(f"\nImage: {img} (Used by {len(names)} products)")
        for name in names[:5]: # Show first 5 examples
            print(f"  - {name}")
        if len(names) > 5:
            print(f"  ... and {len(names) - 5} more")

    if missing_files:
        print("\n--- Missing Image Files ---")
        for msg in missing_files:
            print(msg)

    print(f"\nTotal products needing attention: {missing_count}")

if __name__ == "__main__":
    find_missing_images()
