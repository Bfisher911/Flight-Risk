import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Base Paths
AGENT_DIR = Path(__file__).parent
PROJECT_ROOT = AGENT_DIR.parent
DATA_DIR = PROJECT_ROOT / "src" / "data"
PRODUCTS_FILE = DATA_DIR / "products.json"
ARTICLES_DIR = DATA_DIR / "articles"

# API Keys
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# Models (Defaulting to Flash for cost/speed, Pro for quality)
GEMINI_MODEL_FAST = os.getenv("GEMINI_MODEL_FAST", "gemini-1.5-flash") 
GEMINI_MODEL_SMART = os.getenv("GEMINI_MODEL_SMART", "gemini-1.5-pro")

# Amazon/Associate Settings
AMAZON_TAG = "sparkfish-20"
USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

# Site Settings
SITE_URL = "https://flightriskdrones.com"
