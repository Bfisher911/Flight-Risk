import json
import logging
import requests
from pathlib import Path
from config import PRODUCTS_FILE, AMAZON_TAG, USER_AGENT, GETFPV_AFFILIATE_ID
import urllib.parse

logger = logging.getLogger("FlightRiskAgent.Hunter")

class Hunter:
    def __init__(self, dry_run=False):
        self.dry_run = dry_run
        self.new_products_found = []

    def construct_amazon_url(self, product_name):
        """Constructs a standardized Amazon Search URL."""
        if not product_name:
            return ""
        # Clean name (keep alphanumeric and spaces)
        clean_name = "".join([c for c in product_name if c.isalnum() or c.isspace()]).strip()
        encoded_name = urllib.parse.quote_plus(clean_name)
        return f"https://www.amazon.com/s?k={encoded_name}&tag={AMAZON_TAG}"

    def construct_getfpv_url(self, product_name):
        """Constructs a standardized GetFPV Search URL."""
        if not product_name:
            return ""
        # Clean name
        clean_name = "".join([c for c in product_name if c.isalnum() or c.isspace()]).strip()
        encoded_name = urllib.parse.quote_plus(clean_name)
        # Pattern: /catalogsearch/result/?q=query
        base_url = "https://www.getfpv.com/catalogsearch/result/"
        # Append affiliate parameters: ?q=...&afid=...&referring_service=link
        return f"{base_url}?q={encoded_name}&afid={GETFPV_AFFILIATE_ID}&referring_service=link"

    def hunt(self):
        """Main entry point for the Hunter module."""
        logger.info("Starting Market Scan...")
        
        # 1. Scan Market (Simulated/Best Effort)
        potential_products = self.scan_market()
        
        # 2. Gap Analysis
        missing_products = self.gap_analysis(potential_products)
        
        # Load data for pruning
        try:
            with open(PRODUCTS_FILE, 'r') as f:
                data = json.load(f)
        except Exception as e:
            logger.error(f"Failed to load products for pruning: {e}")
            data = {"products": []}
            
        # 4. Prune dead products
        self.prune_inventory(data)

        if missing_products:
            logger.info(f"Found {len(missing_products)} new products not in inventory.")
            # 3. Affiliate Tagging matches are handled during object creation or here
            self.new_products_found = missing_products
            return missing_products
        else:
            logger.info("No new missing products found.")
            return []

    def scan_market(self):
        """
        Scans external sources for new products.
        NOTE: Real Amazon scraping is brittle. 
        This implementation simulates finding a list of 'trending' items 
        or parses a hypothetical search result.
        """
        logger.info("Scanning for new releases...")
        
        # In a real scenario, this would loop through categories and URLs.
        # For this agent's stability, we'll implement a pattern that *could* be real,
        # but defaulting to a safe list for the demo to ensure it runs.
        
        # Simulated Market Scan Results (10+ items per category)
        potential_finds = [
            # --- Drones ---
            {
                "name": "DJI Avata 2",
                "brand": "DJI",
                "category": "Drones",
                "subCategory": "Cinewhoop",
                "price": 999.00,
                "amazonLink": "https://www.amazon.com/s?k=DJI+Avata+2",
                "description": "The ultimate ready-to-fly cinewhoop experience. Features 4K/60fps HDR video, RockSteady stabilization, and integrated propeller guards for safe indoor flight.",
                "consensusReview": "The easiest entry into FPV cinema. Incredible video quality and safety features, though locked into the DJI ecosystem.",
                "reviews_rating": 4.8
            },
            {
                "name": "Emax Tinyhawk III Plus",
                "brand": "Emax",
                "category": "Drones",
                "subCategory": "Tiny Whoop",
                "price": 199.99,
                "amazonLink": "https://www.amazon.com/s?k=Emax+Tinyhawk+III+Plus",
                "description": "A durable and versatile micro drone perfect for beginners. The 'Plus' version features improved video transmission and more powerful motors.",
                "consensusReview": "An excellent starter drone that can take a beating. The proprietary batteries are a downside.",
                "reviews_rating": 4.4
            },
            {
                "name": "GEPRC CineLog35 V2",
                "brand": "GEPRC",
                "category": "Drones",
                "subCategory": "Cinewhoop",
                "price": 429.99,
                "amazonLink": "https://www.amazon.com/s?k=GEPRC+CineLog35+V2",
                "description": "A 3.5-inch cinewhoop designed for carrying full-size action cameras. Features a pusher configuration for better efficiency and lower noise.",
                "consensusReview": "High performance cinewhoop that handles heavy cameras well. The frame is rigid and durable.",
                "reviews_rating": 4.6
            },
            {
                "name": "iFlight Nazgul Evoque F5 V2",
                "brand": "iFlight",
                "category": "Drones",
                "subCategory": "Freestyle",
                "price": 469.99,
                "amazonLink": "https://www.amazon.com/s?k=iFlight+Nazgul+Evoque+F5+V2",
                "description": "The refined version of the classic Nazgul. Features fully enclosed side panels to keep electronics clean and a DeadCat geometry option.",
                "consensusReview": "Still the king of bind-and-fly freestyle quads. Powerful, tuned well out of the box, and looks amazing.",
                "reviews_rating": 4.9
            },
            {
                "name": "Flywoo Explorer LR 4 V2",
                "brand": "Flywoo",
                "category": "Drones",
                "subCategory": "Long Range",
                "price": 369.99,
                "amazonLink": "https://www.amazon.com/s?k=Flywoo+Explorer+LR+4+V2",
                "description": "The sub-250g long range king. Updated V2 version features the Goku GOKU GN 405 Nano stack and improved GPS performance.",
                "consensusReview": "Incredible flight times on Li-Ion. The GPS lock is faster on V2. Essential for mountain surfing.",
                "reviews_rating": 4.7
            },
            {
                "name": "Happymodel Mobula6 2024",
                "brand": "Happymodel",
                "category": "Drones",
                "subCategory": "Tiny Whoop",
                "price": 109.99,
                "amazonLink": "https://www.amazon.com/s?k=Happymodel+Mobula6+2024",
                "description": "The latest refresh of the legendary Mobula6. Lighter frame, higher KV motors, and SuperX flight controller for race-winning performance.",
                "consensusReview": "The fastest 65mm whoop available. Extremely agile but the frame can be fragile in hard crashes.",
                "reviews_rating": 4.5
            },
            {
                "name": "BetaFPV Pavo20",
                "brand": "BetaFPV",
                "category": "Drones",
                "subCategory": "Cinewhoop",
                "price": 139.99,
                "amazonLink": "https://www.amazon.com/s?k=BetaFPV+Pavo20",
                "description": "A 2-inch cinewhoop designed specifically for the DJI O3 Air Unit. Durable injection-molded whoop duct and agile performance.",
                "consensusReview": "Perfect platform for the O3 unit indoors. Surprisingly quiet and smooth.",
                "reviews_rating": 4.3
            },
            {
                "name": "RotorRiot Skyliner MK3",
                "brand": "RotorRiot",
                "category": "Drones",
                "subCategory": "Cinematic Freestyle",
                "price": 499.99,
                "amazonLink": "https://www.amazon.com/s?k=RotorRiot+Skyliner+MK3",
                "description": "A cinematic freestyle frame developed by Le Drib. Smooth flight characteristics ideal for juicy freestyle and chasing cars.",
                "consensusReview": "Very smooth and locked in. The build quality is top tier, backed by RotorRiot support.",
                "reviews_rating": 4.8
            },
            {
                "name": "Axisflying Manta 3.5",
                "brand": "Axisflying",
                "category": "Drones",
                "subCategory": "Freestyle",
                "price": 329.99,
                "amazonLink": "https://www.amazon.com/s?k=Axisflying+Manta+3.5",
                "description": "A unique 3.5-inch freestyle squashed-X frame. Aluminum camera plates protect your expensive HD system.",
                "consensusReview": "Built like a tank. Great for freestyle in tighter spaces where a 5-inch is too much.",
                "reviews_rating": 4.6
            },
            {
                "name": "BetaFPV Meteor65 Pro",
                "brand": "BetaFPV",
                "category": "Drones",
                "subCategory": "Tiny Whoop",
                "price": 109.99,
                "amazonLink": "https://www.amazon.com/s?k=BetaFPV+Meteor65+Pro",
                "description": "The 'Pro' version of the 65mm classic. Larger 35mm props inside the 65mm size class for more thrust and control.",
                "consensusReview": "More power than the standard Meteor65. The 35mm props make a huge difference in cornering.",
                "reviews_rating": 4.5
            },
            {
                "name": "RadioMaster TX16S MKII",
                "brand": "RadioMaster",
                "category": "Radio",
                "subCategory": "Full Size",
                "price": 199.99,
                "amazonLink": "https://www.amazon.com/s?k=RadioMaster+TX16S+MKII",
                "description": "The gold standard full-size OpenTX/EdgeTX radio. Updated circuitry, improved hall gimbals, and a touchscreen interface.",
                "consensusReview": "The best value full-size radio on the market. Limitless customization.",
                "reviews_rating": 4.9
            },
            {
                "name": "DJI Goggles 3",
                "brand": "DJI",
                "category": "Goggles",
                "subCategory": "Digital HD",
                "price": 499.00,
                "amazonLink": "https://www.amazon.com/s?k=DJI+Goggles+3",
                "description": "The newest generation. Real View PiP, integrated forehead pad, and O4 transmission support.",
                "consensusReview": "The best image quality available. The Real View pass-through is handy.",
                "reviews_rating": 4.7
            },
             {
                "name": "RadioMaster Boxer",
                "brand": "RadioMaster",
                "category": "Radio",
                "subCategory": "Compact",
                "price": 139.99,
                "amazonLink": "https://www.amazon.com/s?k=RadioMaster+Boxer",
                "description": "Compact form factor with full-size gimbals and a 1W internal ELRS module. The perfect balance of portability and performance.",
                "consensusReview": "Best in class ergonomics for thumb grippers. The 1W ELRS is a game changer.",
                "reviews_rating": 4.8
            },
            {
                "name": "RadioMaster MT12",
                "brand": "RadioMaster",
                "category": "Radio",
                "subCategory": "Surface",
                "price": 129.99,
                "amazonLink": "https://www.amazon.com/s?k=RadioMaster+MT12",
                "description": "A surface radio for cars/boats running EdgeTX and ELRS. Finally brings open source power to surface RC.",
                "consensusReview": "Revolutionary for surface RC. Infinite customization and incredible range.",
                "reviews_rating": 4.7
            },
            {
                "name": "TBS Tango 2 Pro",
                "brand": "TBS",
                "category": "Radio",
                "subCategory": "Gamepad",
                "price": 199.95,
                "amazonLink": "https://www.amazon.com/s?k=TBS+Tango+2+Pro",
                "description": "The icon of gamepad radios. Integrated Crossfire for rock-solid link. Folding stick ends for ultimate portability.",
                "consensusReview": "Premium build quality. Crossfire is still reliable, though ELRS is catching up.",
                "reviews_rating": 4.8
            },
             {
                "name": "Walksnail Avatar Goggles X",
                "brand": "Caddx",
                "category": "Goggles",
                "subCategory": "Digital HD",
                "price": 459.00,
                "amazonLink": "https://www.amazon.com/s?k=Walksnail+Avatar+Goggles+X",
                "description": "Dual 1080p OLED displays, removable VRX, and HDMI input. Future-proof functionality.",
                "consensusReview": "A great alternative to DJI. HDMI in makes them versatile for Sims.",
                "reviews_rating": 4.5
            },
            {
                "name": "Fat Shark Dominator HD",
                "brand": "Fat Shark",
                "category": "Goggles",
                "subCategory": "Digital HD",
                "price": 599.00,
                "amazonLink": "https://www.amazon.com/s?k=Fat+Shark+Dominator+HD",
                "description": "Walksnail Avatar native goggles with trusted Fat Shark optics and fit.",
                "consensusReview": "Excellent optics. Familiar form factor for long-time pilots.",
                "reviews_rating": 4.4
            },
            {
                "name": "Skyzone SKY04X Pro",
                "brand": "Skyzone",
                "category": "Goggles",
                "subCategory": "Analog",
                "price": 539.00,
                "amazonLink": "https://www.amazon.com/s?k=Skyzone+SKY04X+Pro",
                "description": "The pinnacle of analog goggles. OLED screens, 52-degree FOV, and SteadyView receiver.",
                "consensusReview": "The best analog picture you can get. Menu navigation is superb.",
                "reviews_rating": 4.8
            },
             {
                "name": "Walksnail Avatar HD Pro Kit",
                "brand": "Caddx",
                "category": "VTX",
                "subCategory": "Digital",
                "price": 159.00,
                "amazonLink": "https://www.amazon.com/s?k=Walksnail+Avatar+HD+Pro+Kit",
                "description": "Dual antenna VTX with the Pro camera featuring a 1/1.8 inch Sony Starvis sensor for night vision.",
                "consensusReview": "Amazing low light performance. Onboard recording is a huge plus.",
                "reviews_rating": 4.6
            },
            {
                "name": "Walksnail Avatar HD Nano Kit V3",
                "brand": "Caddx",
                "category": "VTX",
                "subCategory": "Digital",
                "price": 135.00,
                "amazonLink": "https://www.amazon.com/s?k=Walksnail+Avatar+HD+Nano+Kit+V3",
                "description": "Ultra-small VTX for 1S whoops. Replaced the 1S lite, now handles up to 5V input.",
                "consensusReview": "Essential for digital whoops. Runs hot, needs airflow.",
                "reviews_rating": 4.4
            },
            {
                "name": "HDZero Freestyle V2 Kit",
                "brand": "HDZero",
                "category": "VTX",
                "subCategory": "Digital",
                "price": 179.99,
                "amazonLink": "https://www.amazon.com/s?k=HDZero+Freestyle+V2+Kit",
                "description": "Updated VTX capable of 1W output. Includes the Micro V3 camera.",
                "consensusReview": "Rock solid fixed latency. 1W power punches through interference.",
                "reviews_rating": 4.7
            },
             {
                "name": "Pinecil V2",
                "brand": "Pine64",
                "category": "Tools",
                "subCategory": "Soldering",
                "price": 25.99,
                "amazonLink": "https://www.amazon.com/s?k=Pinecil+V2",
                "description": "RISC-V based soldering iron with a shorter tip for better control. USB-C PD input.",
                "consensusReview": "Best portable iron hands down. Heats up instantly.",
                "reviews_rating": 4.8
            },
            {
                "name": "Torvol Quad Pitstop Backpack Pro",
                "brand": "Torvol",
                "category": "Gear",
                "subCategory": "Backpack",
                "price": 199.00,
                "amazonLink": "https://www.amazon.com/s?k=Torvol+Quad+Pitstop+Backpack+Pro",
                "description": "The pilots backpack. Unfolds into a pit area. Holds 4+ quads.",
                "consensusReview": "Expensive but worth it. The expandable pitstop area is genius.",
                "reviews_rating": 4.8
            },
            # --- New Arrivals from GetFPV Scan ---
             {
                "name": "BETAFPV Femto Whoop Frame Kit",
                "brand": "BETAFPV",
                "category": "Frame",
                "subCategory": "Whoop",
                "price": 15.99,
                "imageUrl": "https://www.getfpv.com/media/catalog/product/cache/1/small_image/210x/9df78eab33525d08d6e5fb8d27136e95/b/e/betafpv-femto-whoop-frame-kit-main.jpg",
                "description": "Ultra-lightweight frame for the smallest whoop builds. Durable visuals.",
                "consensusReview": "Perfect for 1S builds. Very resilient.",
                "reviews_rating": 4.5
            },
            {
                "name": "SpeedyBee Master3X Modular Frame Kit",
                "brand": "SpeedyBee",
                "category": "Frame",
                "subCategory": "3-inch",
                "price": 39.99,
                "imageUrl": "https://www.getfpv.com/media/catalog/product/cache/1/small_image/210x/9df78eab33525d08d6e5fb8d27136e95/s/p/speedybee-master3x-modular-frame-kit-main.jpg",
                "description": "Versatile 3-inch frame with modular arms. Great for freestyle or cinematic.",
                "consensusReview": "Excellent build quality for the price. Easy to work on.",
                "reviews_rating": 4.7
            },
            {
                "name": "TBS Source One V6 5inch Frame Kit",
                "brand": "TBS",
                "category": "Frame",
                "subCategory": "5-inch",
                "price": 41.99,
                "imageUrl": "https://www.getfpv.com/media/catalog/product/cache/1/small_image/210x/9df78eab33525d08d6e5fb8d27136e95/t/b/tbs-source-one-v6-5-frame-kit-main.jpg",
                "description": "The community favorite open-source frame. V6 improves arm rigidity and mounting options.",
                "consensusReview": "Unbeatable value. The standard for entry-level freestyle.",
                "reviews_rating": 4.9
            },
            {
                "name": "FlyFishRC Atlas 4 LR Frame Kit",
                "brand": "FlyFishRC",
                "category": "Frame",
                "subCategory": "Long Range",
                "price": 64.99,
                "imageUrl": "https://www.getfpv.com/media/catalog/product/cache/1/small_image/210x/9df78eab33525d08d6e5fb8d27136e95/f/l/flyfishrc-atlas-4-lr-frame-kit-o4-pro-main.jpg",
                "description": "Lightweight 4-inch frame optimized for O3 Air Unit and long flight times.",
                "consensusReview": "Great layout for GPS and heavy batteries.",
                "reviews_rating": 4.6
            },
            {
                "name": "HGLRC Y6 5inch LR Frame Kit",
                "brand": "HGLRC",
                "category": "Frame",
                "subCategory": "Long Range",
                "price": 61.63,
                "imageUrl": "https://www.getfpv.com/media/catalog/product/cache/1/small_image/210x/9df78eab33525d08d6e5fb8d27136e95/h/g/hglrc-y6-5-lr-frame-kit-main.jpg",
                "description": "Unique Y6 configuration for redundancy and stability in long-range flights.",
                "consensusReview": "A specialized frame but performs surprisingly well.",
                "reviews_rating": 4.4
            },
            {
                "name": "Flycolor SpeedyPizza CrustCore Stack",
                "brand": "Flycolor",
                "category": "Electronics",
                "subCategory": "Stack",
                "price": 167.99,
                "imageUrl": "https://www.getfpv.com/media/catalog/product/cache/1/small_image/210x/9df78eab33525d08d6e5fb8d27136e95/f/l/flycolor-speedypizza-crustcore-stack-main.jpg",
                "description": "Reliable F7 stack with BLHeli_32 ESCs. 20x20 mounting perfect for compact builds.",
                "consensusReview": "Solid performance and clean layout.",
                "reviews_rating": 4.5
            },
            {
                "name": "Axisflying Argus ECO Stack",
                "brand": "Axisflying",
                "category": "Electronics",
                "subCategory": "Stack",
                "price": 129.99,
                "imageUrl": "https://www.getfpv.com/media/catalog/product/cache/1/small_image/210x/9df78eab33525d08d6e5fb8d27136e95/a/x/axisflying-argus-eco-stack-main.jpg",
                "description": "Budget-friendly 30x30 stack with aluminum shell for protection and heat dissipation.",
                "consensusReview": "Best value 60A stack. Very durable.",
                "reviews_rating": 4.6
            },
            {
                "name": "Hobbywing XRotor Stack",
                "brand": "Hobbywing",
                "category": "Electronics",
                "subCategory": "Stack",
                "price": 137.49,
                "imageUrl": "https://www.getfpv.com/media/catalog/product/cache/1/small_image/210x/9df78eab33525d08d6e5fb8d27136e95/h/o/hobbywing-xrotor-stack-main.jpg",
                "description": "Industry standard reliability from Hobbywing. Smooth flight performance.",
                "consensusReview": "Never fails. Worth the extra cost for peace of mind.",
                "reviews_rating": 4.8
            },
            {
                "name": "TBS Lucid Pro Stack",
                "brand": "TBS",
                "category": "Electronics",
                "subCategory": "Stack",
                "price": 129.99,
                "imageUrl": "https://www.getfpv.com/media/catalog/product/cache/1/small_image/210x/9df78eab33525d08d6e5fb8d27136e95/t/b/tbs-lucid-pro-stack-main.jpg",
                "description": "Innovative stack for the Lucid frame series. Compact and powerful.",
                "consensusReview": "High quality components as expected from TBS.",
                "reviews_rating": 4.7
            },
            {
                "name": "SkyStars Fly Stack",
                "brand": "SkyStars",
                "category": "Electronics",
                "subCategory": "Stack",
                "price": 127.49,
                "imageUrl": "https://www.getfpv.com/media/catalog/product/cache/1/small_image/210x/9df78eab33525d08d6e5fb8d27136e95/s/k/skystars-fly-stack-f722-hd-pro-4-main.jpg",
                "description": "High power F7 stack with 60A AM32 ESCs. Features barometer and blackbox.",
                "consensusReview": "Great features for the price. AM32 is smooth.",
                "reviews_rating": 4.5
            },
            # --- Motors ---
            {
                "name": "BrotherHobby Avenger 2810 Motor",
                "brand": "BrotherHobby",
                "category": "Motor",
                "subCategory": "2810",
                "price": 19.79,
                "imageUrl": "https://cdn-v2.getfpv.com/media/catalog/product/cache/8636f329c03de7a3ccf2e3f032055eef/b/r/brotherhobby_avenger_2810_motor_5.jpg",
                "description": "Massive 2810 stators for heavy lifting. Perfect for 7-inch cinelifters.",
                "consensusReview": "Incredible torque. Smoothness is legendary.",
                "reviews_rating": 4.9
            },
            {
                "name": "iFlight XING2 2207 Unibell Motor",
                "brand": "iFlight",
                "category": "Motor",
                "subCategory": "2207",
                "price": 28.99,
                "imageUrl": "https://cdn-v2.getfpv.com/media/catalog/product/cache/8636f329c03de7a3ccf2e3f032055eef/x/i/xing2-2207-2_1.jpg",
                "description": "The evolution of the popular XING series. Unibell design for durability.",
                "consensusReview": "Very durable bells. Great performance for freestyle.",
                "reviews_rating": 4.8
            },
            {
                "name": "AOS RC Supernova 1605 FPV Motor",
                "brand": "AOS RC",
                "category": "Motor",
                "subCategory": "1605",
                "price": 18.99,
                "imageUrl": "https://cdn-v2.getfpv.com/media/catalog/product/cache/8636f329c03de7a3ccf2e3f032055eef/a/o/aos_rc_supernova_1605_fpv_motor_-_3900kv3.jpg",
                "description": "Optimized by Chris Rosser for maximum efficiency and response.",
                "consensusReview": "Scientifically designed for performance. Runs cool.",
                "reviews_rating": 4.7
            },
             {
                "name": "AOS RC Supernova 1404 FPV Motor",
                "brand": "AOS RC",
                "category": "Motor",
                "subCategory": "1404",
                "price": 17.99,
                "imageUrl": "https://cdn-v2.getfpv.com/media/catalog/product/cache/8636f329c03de7a3ccf2e3f032055eef/a/o/aos_rc_supernova_1404_fpv_motor_-_4000kv2.jpg",
                "description": "High performance 1404 motor for ultralights. Best in class power-to-weight.",
                "consensusReview": "Makes sub-250g quads feel like 5-inch.",
                "reviews_rating": 4.6
            },
            {
                "name": "Lumenier 2307 JohnnyFPV V3 Pro Motor",
                "brand": "Lumenier",
                "category": "Motor",
                "subCategory": "2307",
                "price": 29.99,
                "imageUrl": "https://cdn-v2.getfpv.com/media/catalog/product/cache/8636f329c03de7a3ccf2e3f032055eef/l/u/lumenier-2307-johnnyfpv-v3-pro-cinematic-motor_1__1.jpg",
                "description": "Cinematic smoothness designed by JohnnyFPV. V3 features improved bearings.",
                "consensusReview": "Butter smooth. Essential for cinematic footage.",
                "reviews_rating": 4.8
            },
            # --- Batteries ---
            {
                "name": "DOGCOM SBang V2 1480mAh 6S Battery",
                "brand": "DOGCOM",
                "category": "Battery",
                "subCategory": "LiPo 6S",
                "price": 39.99,
                "imageUrl": "https://cdn-v2.getfpv.com/media/catalog/product/cache/8636f329c03de7a3ccf2e3f032055eef/2/3/23859-1.jpg",
                "description": "High C-rating battery for racing and freestyle. SBang signature series.",
                "consensusReview": "Holds voltage incredibly well under load.",
                "reviews_rating": 4.7
            },
            {
                "name": "DOGCOM 1480mAh 6S 150C Battery",
                "brand": "DOGCOM",
                "category": "Battery",
                "subCategory": "LiPo 6S",
                "price": 39.99,
                "imageUrl": "https://cdn-v2.getfpv.com/media/catalog/product/cache/8636f329c03de7a3ccf2e3f032055eef/d/o/dogcom-dogcom-sbang-22-2v-6s-1480mah-150c-lipo-battery-xt60-battery-31219903627377.jpg",
                "description": "Standard high-performance pack from DOGCOM. 150C burst rate.",
                "consensusReview": "Reliable power delivery. Good cycle life.",
                "reviews_rating": 4.6
            },
            {
                "name": "DOGCOM Ultra Series 1480mAh 6S Battery",
                "brand": "DOGCOM",
                "category": "Battery",
                "subCategory": "LiPo 6S",
                "price": 49.99,
                "imageUrl": "https://cdn-v2.getfpv.com/media/catalog/product/cache/8636f329c03de7a3ccf2e3f032055eef/2/3/23857-1.jpg",
                "description": "Top of the line Ultra series. Lowest internal resistance for maximum punch.",
                "consensusReview": "Expensive but provides unmatched sag resistance.",
                "reviews_rating": 4.9
            },
            {
                "name": "RadioMaster TX16S 5000mAh Battery",
                "brand": "RadioMaster",
                "category": "Battery",
                "subCategory": "Li-ion 2S",
                "price": 25.99,
                "imageUrl": "https://cdn-v2.getfpv.com/media/catalog/product/cache/8636f329c03de7a3ccf2e3f032055eef/r/a/radiomaster-tx16s-5000mah-2s-li-ion-battery.jpg",
                "description": "Official 5000mAh Li-ion pack for TX16S. Lasts all day.",
                "consensusReview": "Must have for TX16S owners. Fits perfectly.",
                "reviews_rating": 4.8
            },
            {
                "name": "XILO 1250mAh 6S 100c Basher Battery",
                "brand": "XILO",
                "category": "Battery",
                "subCategory": "LiPo 6S",
                "price": 47.49,
                "imageUrl": "https://cdn-v2.getfpv.com/media/catalog/product/cache/8636f329c03de7a3ccf2e3f032055eef/x/i/xilo-1250mah-6s-100c-basher-lipo-battery-xt60-main.jpg",
                "description": "Affordable basher pack. Good performance for the price.",
                "consensusReview": "Great for practice packs.",
                "reviews_rating": 4.4
            }
        ]
        
        # Force standard URL generation
        for item in potential_finds:
             if "name" in item:
                 item["amazonLink"] = self.construct_amazon_url(item["name"])
                 item["getfpvLink"] = self.construct_getfpv_url(item["name"])
                 
        return potential_finds

    def gap_analysis(self, potential_products):
        """Compares potential finds against products.json."""
        logger.info("Performing Gap Analysis...")
        
        try:
            with open(PRODUCTS_FILE, 'r') as f:
                data = json.load(f)
            
            existing_names = {p.get("name").lower() for p in data.get("products", [])}
            
            # Sub-step: Replenish dead links for existing products
            self.check_replenishment(potential_products, data)
            
            # Smart link normalization
            existing_links = set()
            for p in data.get("products", []):
                l = p.get("amazonLink", "")
                if "/s?k=" in l:
                    # For search links, keep the base query, distinct from others
                    clean = l.split('&tag')[0]
                else:
                    # For direct links, usually removing query is safe
                    clean = l.split('?')[0]
                existing_links.add(clean)

            missing = []
            for item in potential_products:
                # Normalization for check
                name = item.get("name", "").lower()
                raw_link = item.get("amazonLink", "")
                
                if "/s?k=" in raw_link:
                    link = raw_link.split('&tag')[0]
                else:
                    link = raw_link.split('?')[0]
                
                # Check for 4.0+ stars if rating is available
                if item.get("reviews_rating", 0) < 4.0:
                    continue

                if name not in existing_names and link not in existing_links:
                    logger.info(f"Gap identified: {item.get('name')}")
                    
                    # Tagging
                    tagged_link = self.add_affiliate_tag(item.get("amazonLink"))
                    item["amazonLink"] = tagged_link
                    
                    missing.append(item)
                else:
                    logger.debug(f"Skipping existing item: {item.get('name')}")
            
            return missing

        except Exception as e:
            logger.error(f"Error in gap analysis: {e}")
            return []

    def check_replenishment(self, potential_products, products_data):
        """Forces update of ALL products to use standardized URLs."""
        logger.info("Force-updating all product links (Amazon + GetFPV)...")
        
        products = products_data.get("products", [])
        updated_count = 0
        
        for product in products:
            name = product.get("name")
            if name:
                # Always regenerate/update the links to ensure compliance
                new_amazon_link = self.construct_amazon_url(name)
                new_getfpv_link = self.construct_getfpv_url(name)
                
                product["amazonLink"] = new_amazon_link
                product["getfpvLink"] = new_getfpv_link
                updated_count += 1

        if updated_count > 0:
            logger.info(f"Updated links for {updated_count} products.")
            try:
                with open(PRODUCTS_FILE, 'w') as f:
                    json.dump(products_data, f, indent=2)
                logger.info(f"Saved replenished links to {PRODUCTS_FILE}")
            except Exception as e:
                logger.error(f"Failed to save products file: {e}")

    def prune_inventory(self, products_data):
        """Removes products that have no valid Amazon link."""
        logger.info("Pruning dead inventory...")
        
        original_count = len(products_data.get("products", []))
        active_products = []
        removed_products = []
        
        for product in products_data.get("products", []):
            if product.get("amazonLink"):
                active_products.append(product)
            else:
                removed_products.append(product.get("name"))
        
        if len(removed_products) > 0:
            logger.info(f"Pruning {len(removed_products)} dead products: {', '.join(removed_products)}")
            
            if not self.dry_run:
                products_data["products"] = active_products
                try:
                    with open(PRODUCTS_FILE, 'w') as f:
                        json.dump(products_data, f, indent=2)
                    logger.info(f"Pruned inventory saved. Count: {original_count} -> {len(active_products)}")
                except Exception as e:
                    logger.error(f"Failed to save pruned inventory: {e}")
        else:
            logger.info("No dead products found to prune.")

    def add_affiliate_tag(self, url):
        """Appends the Associate Tag to the URL."""
        if not url:
            return ""
        
        separator = "&" if "?" in url else "?"
        if f"tag={AMAZON_TAG}" in url:
            return url
        
        return f"{url}{separator}tag={AMAZON_TAG}"
