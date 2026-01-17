import json
import logging
import requests
from pathlib import Path
from config import PRODUCTS_FILE, AMAZON_TAG, USER_AGENT

logger = logging.getLogger("FlightRiskAgent.Hunter")

class Hunter:
    def __init__(self, dry_run=False):
        self.dry_run = dry_run
        self.new_products_found = []

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

            # --- Radios ---
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
                "name": "RadioMaster Zorro",
                "brand": "RadioMaster",
                "category": "Radio",
                "subCategory": "Gamepad",
                "price": 119.99,
                "amazonLink": "https://www.amazon.com/s?k=RadioMaster+Zorro",
                "description": "Ergonomic gamepad style radio with a large LCD screen and plenty of switches. Supports external Lite modules.",
                "consensusReview": "Great feel for console gamers. Battery life is short with 18350s, recommend the external kit.",
                "reviews_rating": 4.4
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
                "name": "BetaFPV LiteRadio 3 Pro",
                "brand": "BetaFPV",
                "category": "Radio",
                "subCategory": "Gamepad",
                "price": 89.99,
                "amazonLink": "https://www.amazon.com/s?k=BetaFPV+LiteRadio+3+Pro",
                "description": "An entry-level radio running actual EdgeTX. Hall gimbals and internal ELRS make it a capable starter.",
                "consensusReview": "Good for the price. The screen is tiny but usable for basic setup.",
                "reviews_rating": 4.0
            },
            {
                "name": "FrSky Taranis X9D Plus 2019",
                "brand": "FrSky",
                "category": "Radio",
                "subCategory": "Full Size",
                "price": 219.99,
                "amazonLink": "https://www.amazon.com/s?k=FrSky+Taranis+X9D+Plus+2019",
                "description": "The classic workhorse updated. New ACCESS protocol and a scroll wheel for navigation.",
                "consensusReview": "Still a solid radio, but feels dated compared to the TX16S.",
                "reviews_rating": 4.3
            },
            {
                "name": "Jumper T20S",
                "brand": "Jumper",
                "category": "Radio",
                "subCategory": "Compact",
                "price": 139.99,
                "amazonLink": "https://www.amazon.com/s?k=Jumper+T20S",
                "description": "A powerful compact radio with RDC90 sensor gimbals for ultra-smooth control.",
                "consensusReview": "The gimbals feel amazing. Build quality is improved over previous Jumper radios.",
                "reviews_rating": 4.5
            },
            {
                "name": "Radiolink AT10II",
                "brand": "Radiolink",
                "category": "Radio",
                "subCategory": "Full Size",
                "price": 159.99,
                "amazonLink": "https://www.amazon.com/s?k=Radiolink+AT10II",
                "description": "12-channel radio with excellent interference rejection. Known for robust signal in noisy environments.",
                "consensusReview": "Great range and stability, but the interface is not as flexible as EdgeTX.",
                "reviews_rating": 4.2
            },
            {
                "name": "Flysky NV14",
                "brand": "Flysky",
                "category": "Radio",
                "subCategory": "Gamepad",
                "price": 179.99,
                "amazonLink": "https://www.amazon.com/s?k=Flysky+NV14",
                "description": "The 'Nirvana'. Unique ergonomic design with dual screens and Hall effect gimbals.",
                "consensusReview": "Love the grip or hate it. Very unique, but firmware support has been spotty.",
                "reviews_rating": 4.1
            },

            # --- Goggles ---
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
                "name": "DJI Goggles Integra",
                "brand": "DJI",
                "category": "Goggles",
                "subCategory": "Digital HD",
                "price": 349.00,
                "amazonLink": "https://www.amazon.com/s?k=DJI+Goggles+Integra",
                "description": "Integrated battery headband design for a cable-free experience. O3+ transmission technology.",
                "consensusReview": "Best value for DJI digital. Convenience of no cables is huge.",
                "reviews_rating": 4.6
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
                "name": "Skyzone Cobra X V2",
                "brand": "Skyzone",
                "category": "Goggles",
                "subCategory": "Box Goggle",
                "price": 269.99,
                "amazonLink": "https://www.amazon.com/s?k=Skyzone+Cobra+X+V2",
                "description": "High-end box goggles with a 1280x720 LCD and SteadyView receiver. Glasses friendly.",
                "consensusReview": "Best box goggles on the market. Great for spectacle wearers.",
                "reviews_rating": 4.6
            },
            {
                "name": "Fat Shark HDO2.1",
                "brand": "Fat Shark",
                "category": "Goggles",
                "subCategory": "Analog",
                "price": 499.00,
                "amazonLink": "https://www.amazon.com/s?k=Fat+Shark+HDO2.1",
                "description": "Updated OLED panels and adjustable focus. Requires a separate receiver module.",
                "consensusReview": "Classic premium analog choice. Requires investment in a good module like RapidFire.",
                "reviews_rating": 4.5
            },
            {
                "name": "HDZero Goggles",
                "brand": "HDZero",
                "category": "Goggles",
                "subCategory": "Digital HD",
                "price": 595.00,
                "amazonLink": "https://www.amazon.com/s?k=HDZero+Goggles",
                "description": "Designed for racers. 90fps analog-like latency in digital HD. Open source Linux OS.",
                "consensusReview": "The racer's choice. Lowest latency digital system, period.",
                "reviews_rating": 4.7
            },
            {
                "name": "BetaFPV VR03",
                "brand": "BetaFPV",
                "category": "Goggles",
                "subCategory": "Box Goggle",
                "price": 69.99,
                "amazonLink": "https://www.amazon.com/s?k=BetaFPV+VR03",
                "description": "Entry-level box goggles with DVR recording capability and an external antenna.",
                "consensusReview": "Good starter set with DVR. Screen is decent for the price.",
                "reviews_rating": 4.1
            },
            {
                "name": "Eachine EV100",
                "brand": "Eachine",
                "category": "Goggles",
                "subCategory": "Analog",
                "price": 109.99,
                "amazonLink": "https://www.amazon.com/s?k=Eachine+EV100",
                "description": "Ultra-compact dual screen analog goggles. Adjustable focus and IPD.",
                "consensusReview": "Very portable but the FOV is tiny. Good backup set.",
                "reviews_rating": 3.8
            },

            # --- VTX ---
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
                "name": "HDZero Whoop Lite VTX",
                "brand": "HDZero",
                "category": "VTX",
                "subCategory": "Digital",
                "price": 99.99,
                "amazonLink": "https://www.amazon.com/s?k=HDZero+Whoop+Lite+VTX",
                "description": "Designed for 1S whoops. Weighs only 1.5g. 25/200mW output.",
                "consensusReview": "Transforms flight feel of whoops. Digital clarity with analog weight.",
                "reviews_rating": 4.5
            },
            {
                "name": "TBS Unify Pro32 HV",
                "brand": "TBS",
                "category": "VTX",
                "subCategory": "Analog",
                "price": 49.95,
                "amazonLink": "https://www.amazon.com/s?k=TBS+Unify+Pro32+HV",
                "description": "high voltage analog VTX capable of 1W+ output. Double-decker heat sink design.",
                "consensusReview": "The gold standard for long range analog. Almost indestructible.",
                "reviews_rating": 4.9
            },
            {
                "name": "Rush Tank Solo",
                "brand": "RushFPV",
                "category": "VTX",
                "subCategory": "Analog",
                "price": 39.99,
                "amazonLink": "https://www.amazon.com/s?k=Rush+Tank+Solo",
                "description": "High power solo VTX. Heavy heat sinking for sustained high output.",
                "consensusReview": "Runs cooler than the Unify. Signal is extremely clean.",
                "reviews_rating": 4.8
            },
            {
                "name": "BetaFPV M03",
                "brand": "BetaFPV",
                "category": "VTX",
                "subCategory": "Analog",
                "price": 19.99,
                "amazonLink": "https://www.amazon.com/s?k=BetaFPV+M03",
                "description": "Lightweight 350mW VTX perfect for whoops and toothpicks.",
                "consensusReview": "Good range for the size. Antenna connector is fragile.",
                "reviews_rating": 4.2
            },
            {
                "name": "Happymodel OVX300",
                "brand": "Happymodel",
                "category": "VTX",
                "subCategory": "Analog",
                "price": 16.99,
                "amazonLink": "https://www.amazon.com/s?k=Happymodel+OVX300",
                "description": "OpenVTX protocol support. 300mW output in a tiny package.",
                "consensusReview": "Cheap and effective. SmartAudio setup is easy.",
                "reviews_rating": 4.3
            },
            {
                "name": "SpeedyBee TX800",
                "brand": "SpeedyBee",
                "category": "VTX",
                "subCategory": "Analog",
                "price": 24.99,
                "amazonLink": "https://www.amazon.com/s?k=SpeedyBee+TX800",
                "description": "800mW max output. 20x20 mounting. IRC Tramp protocol.",
                "consensusReview": "Great value for high power. Metal case acts as a good heatsink.",
                "reviews_rating": 4.5
            },
            {
                "name": "RunCam Link",
                "brand": "RunCam",
                "category": "VTX",
                "subCategory": "Digital",
                "price": 139.99,
                "amazonLink": "https://www.amazon.com/s?k=RunCam+Link",
                "description": "The 'Vista' unit manufactured by RunCam. Compatible with DJI FPV System.",
                "consensusReview": "Reliable workhorse for DJI system. Fits where an Air Unit won't.",
                "reviews_rating": 4.7
            },

            # --- Tools ---
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
                "name": "ISDT 608PD",
                "brand": "ISDT",
                "category": "Tools",
                "subCategory": "Charger",
                "price": 29.99,
                "amazonLink": "https://www.amazon.com/s?k=ISDT+608PD",
                "description": "Compact USB-C PD charger for 1-6S batteries. Pocket sized.",
                "consensusReview": "Perfect travel charger. Requires a PD power brick.",
                "reviews_rating": 4.4
            },
            {
                "name": "ISDT Q6 Nano",
                "brand": "ISDT",
                "category": "Tools",
                "subCategory": "Charger",
                "price": 34.99,
                "amazonLink": "https://www.amazon.com/s?k=ISDT+Q6+Nano",
                "description": "200W tiny charger. BattGO support and upgradeable firmware.",
                "consensusReview": "Crazy power for the size. Fan can be noisy.",
                "reviews_rating": 4.5
            },
            {
                "name": "Ethix Tool Case",
                "brand": "Ethix",
                "category": "Tools",
                "subCategory": "Case",
                "price": 24.95,
                "amazonLink": "https://www.amazon.com/s?k=Ethix+Tool+Case",
                "description": "Compact zipper case designed by Mr. Steele to hold essential field tools.",
                "consensusReview": "Keeps tools organized. Fits perfectly in backpacks.",
                "reviews_rating": 4.7
            },
            {
                "name": "TBS Ethix M3 Nut Driver",
                "brand": "TBS",
                "category": "Tools",
                "subCategory": "Drivers",
                "price": 12.95,
                "amazonLink": "https://www.amazon.com/s?k=TBS+Ethix+M3+Nut+Driver",
                "description": "Smooth bearing-assisted prop tool. 8mm hex socket.",
                "consensusReview": "Makes prop changes satisfying. High quality feel.",
                "reviews_rating": 4.9
            },
            {
                "name": "Flywoo Fpv Multimeter",
                "brand": "Flywoo",
                "category": "Tools",
                "subCategory": "Diagnostics",
                "price": 29.99,
                "amazonLink": "https://www.amazon.com/s?k=Flywoo+Fpv+Multimeter",
                "description": "Pocket multimeter designed for drone builds. Check voltages and continuity easily.",
                "consensusReview": "Handy to have in the field bag. Small and effective.",
                "reviews_rating": 4.2
            },
            {
                "name": "VIFLY ShortSaver 2",
                "brand": "VIFLY",
                "category": "Tools",
                "subCategory": "Safety",
                "price": 14.99,
                "amazonLink": "https://www.amazon.com/s?k=VIFLY+ShortSaver+2",
                "description": "Electronic fuse smoke stopper. Essential for first plug-ins.",
                "consensusReview": "Saved my electronics multiple times. Don't build without it.",
                "reviews_rating": 4.9
            },
            {
                "name": "TS101 Smart Soldering Iron",
                "brand": "Miniware",
                "category": "Tools",
                "subCategory": "Soldering",
                "price": 58.99,
                "amazonLink": "https://www.amazon.com/s?k=TS101+Smart+Soldering+Iron",
                "description": "The updated classic. DC and PD input, boost mode, and custom tips.",
                "consensusReview": "Reliable and powerful. The boost button is great for ground pads.",
                "reviews_rating": 4.7
            },
            {
                "name": "VIFLY WhoopStor V3",
                "brand": "VIFLY",
                "category": "Tools",
                "subCategory": "Charger",
                "price": 32.99,
                "amazonLink": "https://www.amazon.com/s?k=VIFLY+WhoopStor+V3",
                "description": "1S charger with storage function. Discharges batteries to safe voltage.",
                "consensusReview": "The best 1S charger period. Saves your batteries.",
                "reviews_rating": 4.9
            },
            {
                "name": "iFixit Mako Driver Kit",
                "brand": "iFixit",
                "category": "Tools",
                "subCategory": "Drivers",
                "price": 39.99,
                "amazonLink": "https://www.amazon.com/s?k=iFixit+Mako+Driver+Kit",
                "description": "64-bit precision driver set. Magnetic case and lid tray.",
                "consensusReview": "High quality bits that don't strip screws. Lasts forever.",
                "reviews_rating": 4.8
            },

            # --- Gear ---
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
            {
                "name": "Torvol Urban Carrier Backpack",
                "brand": "Torvol",
                "category": "Gear",
                "subCategory": "Backpack",
                "price": 149.00,
                "amazonLink": "https://www.amazon.com/s?k=Torvol+Urban+Carrier+Backpack",
                "description": "Stylish everyday carry pack for freestyle pilots. Modular attachment system.",
                "consensusReview": "Great for urban missions. Not as big as the Pitstop but looks better.",
                "reviews_rating": 4.5
            },
            {
                "name": "Lykus DCP-M100 Case",
                "brand": "Lykus",
                "category": "Gear",
                "subCategory": "Case",
                "price": 69.99,
                "amazonLink": "https://www.amazon.com/s?k=Lykus+DCP-M100+Case",
                "description": "Waterproof hard case with DIY foam. Fits DJI Avata or various setups.",
                "consensusReview": "Solid protection at a good price. Foam is easy to customize.",
                "reviews_rating": 4.6
            },
            {
                "name": "BetaFPV Storage Case",
                "brand": "BetaFPV",
                "category": "Gear",
                "subCategory": "Case",
                "price": 19.99,
                "amazonLink": "https://www.amazon.com/s?k=BetaFPV+Storage+Case",
                "description": "Compact hard case for 65/75mm whoops. Includes battery tester slot.",
                "consensusReview": "Perfect fit for tiny whoops. Zipper is high quality.",
                "reviews_rating": 4.4
            },
            {
                "name": "Gemfan Vanover Gate",
                "brand": "Gemfan",
                "category": "Gear",
                "subCategory": "Gate",
                "price": 39.99,
                "amazonLink": "https://www.amazon.com/s?k=Gemfan+Vanover+Gate",
                "description": "Pop-up race gate designed by Captain Vanover. Durable fabric.",
                "consensusReview": "Easy to set up. Highly visible.",
                "reviews_rating": 4.5
            },
            {
                "name": "CNHL Black Series 1300mAh 6S",
                "brand": "CNHL",
                "category": "Gear",
                "subCategory": "Battery",
                "price": 24.99,
                "amazonLink": "https://www.amazon.com/s?k=CNHL+Black+Series+1300mAh+6S",
                "description": "High performance 100C LiPo battery. Excellent sag resistance.",
                "consensusReview": "Best bang for buck battery. Punches way above its price.",
                "reviews_rating": 4.7
            },
            {
                "name": "Tattu R-Line V5.0 1400mAh 6S",
                "brand": "Tattu",
                "category": "Gear",
                "subCategory": "Battery",
                "price": 39.99,
                "amazonLink": "https://www.amazon.com/s?k=Tattu+R-Line+V5.0+1400mAh+6S",
                "description": "Professional racing battery. 150C discharge rate.",
                "consensusReview": "The top tier choice. Power delivery is instant and sustained.",
                "reviews_rating": 4.9
            },
            {
                "name": "GNB 450mAh 1S",
                "brand": "GNB",
                "category": "Gear",
                "subCategory": "Battery",
                "price": 6.99,
                "amazonLink": "https://www.amazon.com/s?k=GNB+450mAh+1S",
                "description": "High voltage 1S battery with A30 header. Lightweight.",
                "consensusReview": "Great flight times for 75mm whoops. A30 connector is solid.",
                "reviews_rating": 4.4
            },
            {
                "name": "VIBES FPV Earbuds",
                "brand": "VIBES",
                "category": "Gear",
                "subCategory": "Audio",
                "price": 14.99,
                "amazonLink": "https://www.amazon.com/s?k=VIBES+FPV+Earbuds",
                "description": "Earbuds designed for hearing motor noise. Single ear and dual ear options.",
                "consensusReview": "Crucial for connecting with the quad. Good isolation.",
                "reviews_rating": 4.3
            },
            {
                "name": "Ethix Neck Strap",
                "brand": "Ethix",
                "category": "Gear",
                "subCategory": "Strap",
                "price": 14.99,
                "amazonLink": "https://www.amazon.com/s?k=Ethix+Neck+Strap",
                "description": "Comfortable lanyard with quick release. Green and grey styling.",
                "consensusReview": "Super soft and comfortable. Quick release is smooth.",
                "reviews_rating": 4.6
            }
        ]
        
        # TODO: Implement actual BeautifulSoup scraping here if a reliable source is found.
        # For now, return the potential finds.
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
        """Forces update of ALL products to use Amazon Search URLs to prevent 404s."""
        logger.info("Force-updating all product links to Amazon Search URLs...")
        
        products = products_data.get("products", [])
        updates_made = False
        
        # Create a lookup map for potential finds by normalized name just in case we have better data
        potential_map = {p.get("name", "").lower(): p for p in potential_products}
        
        for product in products:
            name = product.get("name", "")
            if not name:
                continue
                
            # Construct a safe search URL
            # Format: https://www.amazon.com/s?k=ProductName
            query = name.replace(" ", "+")
            base_url = f"https://www.amazon.com/s?k={query}"
            
            # Apply affiliate tag
            new_link = self.add_affiliate_tag(base_url)
            
            # Check if we need to update (avoid writing if identical)
            if product.get("amazonLink") != new_link:
                product["amazonLink"] = new_link
                # logger.debug(f"Updated link for: {name}") # noisy
                updates_made = True

        if updates_made:
            logger.info("All product links have been standardized.")
    
        if updates_made and not self.dry_run:
            try:
                with open(PRODUCTS_FILE, 'w') as f:
                    json.dump(products_data, f, indent=2)
                logger.info(f"Saved replenished links to {PRODUCTS_FILE}")
            except Exception as e:
                logger.error(f"Failed to save replenished links: {e}")

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
