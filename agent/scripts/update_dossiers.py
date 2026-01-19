import json
import logging
import sys

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

PRODUCTS_FILE = 'src/data/products.json'

DOSSIERS = {
    "RadioMaster Pocket": {
        "dossier": """MISSION ROLE: COVERT OPS / BACKPACK CARRY
SYSTEM STATUS: VERIFIED

THE BRIEF: Most radios demand their own hard case and half your backpack space. The Pocket respects your logistics; it slides into a cargo pant pocket or the side sleeve of a bag, living right next to your keys. It runs EdgeTX, meaning it speaks the same language as the big radios, just with a form factor that doesn't scream "I am doing something technical."

OPERATIONAL NOTES:
ERGONOMICS: The gimbals are removable. If you have hands the size of catcher's mitts, you might cramp up after three packs. For everyone else, it’s plenty.
DURABILITY: High. It’s built like a glorious plastic brick. Throw it in the bag; it’ll be fine."""
    },
    "Flywoo Explorer LR 4 V2": {
        "dossier": """MISSION ROLE: LONG RANGE RECON
SYSTEM STATUS: HIGH EFFICIENCY / WIND SENSITIVE

THE BRIEF: A cheat code for physics. This rig stays under the 250g weight limit—which keeps the FAA off your back—but still manages to carry a Lithium-Ion pack for flight times that feel like a clerical error (20+ minutes). It is quiet, unassuming, and will get you to the mountain peak and back while the 5-inch quads are still changing batteries on the ground.

HAZARD WARNING: It’s light. Do not fly this into a stiff headwind unless you want to watch your drone drift into the next county. It lacks the mass to fight heavy turbulence.""",
        "hazardLevel": "HIGH" 
    },
    "iFlight Nazgul Evoque F5 V2": {
        "dossier": """MISSION ROLE: HEAVY KINETIC / BANDO BASHER
SYSTEM STATUS: ARMORED

THE BRIEF: This is not a precision instrument for delicate cinematic flow; it is a blunt object designed to survive high-velocity arguments with concrete and steel. The frame geometry protects the camera, and the arms are thick enough to take a hit without snapping immediately. If you plan to fly inside abandoned buildings where the walls jump out at you, this is the tool.

THE REALITY: It’s heavy. It flies like a muscle car—lots of power, lots of drift, not much subtlety."""
    },
    "Happymodel Mobula6 2024": {
        "dossier": """MISSION ROLE: INDOOR AIR SUPERIORITY / TRAINER
SYSTEM STATUS: HIGH AGILITY / EXPENDABLE

THE BRIEF: This is a mosquito with a camera. It weighs less than a standard AA battery. You buy this for one reason: to learn how to fly without going bankrupt. It bounces off walls, hides under sofas, and survives crashes that would turn a 5-inch drone into confetti.

OPERATIONAL NOTES:
THE "ROOKIE" ADVANTAGE: It’s harmless. You can fly this in your living room at 2 AM while your family sleeps.
MAINTENANCE: The motors are tiny. If you wrap a single hair around the shaft, it’s grounded. Keep it clean."""
    },
    "DJI O3 Air Unit": {
        "dossier": """MISSION ROLE: HIGH-DEF SURVEILLANCE
SYSTEM STATUS: HIGH VALUE / THERMAL CRITICAL

THE BRIEF: The current gold standard for "I want to see the individual leaves on that tree I’m about to hit." It records 4K onboard, meaning you don’t need to strap a heavy GoPro to your quad. The video feed is so clear it feels like cheating.

HAZARD WARNING:
THERMAL RUNAWAY: This unit runs hotter than a stovetop. Do not power it up on the bench without a fan blowing on it, or it will shut itself down to prevent melting.
THE "GLASS" TAX: It is expensive. If you smash this, you will feel it in your soul (and your wallet).""",
        "hazardLevel": "HIGH"
    },
    "TS101 Smart Soldering Iron": {
         "dossier": """MISSION ROLE: FIELD SURGERY
SYSTEM STATUS: MANDATORY

THE BRIEF: If you fly FPV, you are also a part-time electrical engineer. This is your scalpel. It runs off the same LiPo batteries you use to fly, meaning you can repair a severed motor wire in the middle of a field.

WHY YOU NEED IT: Buying a drone without a soldering iron is like buying a car without a spare tire. It’s not a matter of if a wire breaks, but when. This tool turns a "day-ending crash" into a "15-minute pit stop." """
    }
}

def update_dossiers():
    try:
        with open(PRODUCTS_FILE, 'r') as f:
            data = json.load(f)
        
        updated_count = 0
        
        for product in data['products']:
            # Check by name matching
            for name_key, info in DOSSIERS.items():
                if name_key in product['name']:
                    logging.info(f"Updating dossier for: {product['name']}")
                    product['dossier'] = info['dossier']
                    if 'hazardLevel' in info:
                        product['hazardLevel'] = info['hazardLevel']
                    updated_count += 1
        
        with open(PRODUCTS_FILE, 'w') as f:
            json.dump(data, f, indent=2)
            
        logging.info(f"Successfully updated {updated_count} products.")
        
    except Exception as e:
        logging.error(f"Failed to update products: {e}")
        sys.exit(1)

if __name__ == "__main__":
    update_dossiers()
