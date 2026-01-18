import json
import logging
import sys
from pathlib import Path

# Add project root to path
PROJECT_ROOT = Path(__file__).resolve().parents[2]
sys.path.append(str(PROJECT_ROOT))
from agent.config import PRODUCTS_FILE

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("HydrateImages")

# Map of Product Name -> Remote Image URL
IMAGE_MAP = {
    "BETAFPV Femto Whoop Frame Kit": "https://www.getfpv.com/media/catalog/product/cache/1/small_image/210x/9df78eab33525d08d6e5fb8d27136e95/b/e/betafpv-femto-whoop-frame-kit-main.jpg",
    "SpeedyBee Master3X Modular Frame Kit": "https://www.getfpv.com/media/catalog/product/cache/1/small_image/210x/9df78eab33525d08d6e5fb8d27136e95/s/p/speedybee-master3x-modular-frame-kit-main.jpg",
    "TBS Source One V6 5inch Frame Kit": "https://www.getfpv.com/media/catalog/product/cache/1/small_image/210x/9df78eab33525d08d6e5fb8d27136e95/t/b/tbs-source-one-v6-5-frame-kit-main.jpg",
    "FlyFishRC Atlas 4 LR Frame Kit": "https://www.getfpv.com/media/catalog/product/cache/1/small_image/210x/9df78eab33525d08d6e5fb8d27136e95/f/l/flyfishrc-atlas-4-lr-frame-kit-o4-pro-main.jpg",
    "HGLRC Y6 5inch LR Frame Kit": "https://www.getfpv.com/media/catalog/product/cache/1/small_image/210x/9df78eab33525d08d6e5fb8d27136e95/h/g/hglrc-y6-5-lr-frame-kit-main.jpg",
    "Flycolor SpeedyPizza CrustCore Stack": "https://www.getfpv.com/media/catalog/product/cache/1/small_image/210x/9df78eab33525d08d6e5fb8d27136e95/f/l/flycolor-speedypizza-crustcore-stack-main.jpg",
    "Axisflying Argus ECO Stack": "https://www.getfpv.com/media/catalog/product/cache/1/small_image/210x/9df78eab33525d08d6e5fb8d27136e95/a/x/axisflying-argus-eco-stack-main.jpg",
    "Hobbywing XRotor Stack": "https://www.getfpv.com/media/catalog/product/cache/1/small_image/210x/9df78eab33525d08d6e5fb8d27136e95/h/o/hobbywing-xrotor-stack-main.jpg",
    "TBS Lucid Pro Stack": "https://www.getfpv.com/media/catalog/product/cache/1/small_image/210x/9df78eab33525d08d6e5fb8d27136e95/t/b/tbs-lucid-pro-stack-main.jpg",
    "SkyStars Fly Stack": "https://www.getfpv.com/media/catalog/product/cache/1/small_image/210x/9df78eab33525d08d6e5fb8d27136e95/s/k/skystars-fly-stack-f722-hd-pro-4-main.jpg"
}

def hydrate_images():
    logger.info("Hydrating product images...")
    
    try:
        with open(PRODUCTS_FILE, 'r') as f:
            data = json.load(f)
        
        updated_count = 0
        products = data.get("products", [])
        
        for product in products:
            name = product.get("name")
            if name in IMAGE_MAP:
                # Update image if it's currently a placeholder or we want to force valid URL
                if "placeholder" in product.get("imageUrl", ""):
                    product["imageUrl"] = IMAGE_MAP[name]
                    logger.info(f"Updated image for: {name}")
                    updated_count += 1
        
        if updated_count > 0:
            with open(PRODUCTS_FILE, 'w') as f:
                json.dump(data, f, indent=2)
            logger.info(f"Successfully updated {updated_count} product images.")
        else:
            logger.info("No products needed image updates.")
            
    except Exception as e:
        logger.error(f"Failed to hydrate images: {e}")

if __name__ == "__main__":
    hydrate_images()
