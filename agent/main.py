import argparse
import sys
import logging
from config import AGENT_DIR
from modules.spider import Spider
from modules.hunter import Hunter
from modules.builder import Builder
from modules.author import Author
from modules.publisher import Publisher

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(AGENT_DIR / "agent.log"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("FlightRiskAgent")

def main():
    parser = argparse.ArgumentParser(description="Flight Risk Autonomous Agent")
    parser.add_argument("--dry-run", action="store_true", help="Run without making permanent changes")
    parser.add_argument("--phase", type=str, choices=["maintenance", "inventory", "content", "deploy", "all"], default="all", help="Specific phase to run")
    
    args = parser.parse_args()
    
    logger.info("Starting Agent Run")
    if args.dry_run:
        logger.info("DRY RUN MODE ENABLED")

    # Shared State for Publisher
    summary_data = {
        "links_fixed": 0,
        "new_products": [],
        "new_article_title": None
    }

    # Phase 1: Maintenance
    if args.phase in ["maintenance", "all"]:
        logger.info("---| Phase 1: Maintenance (The Spider) |---")
        spider = Spider(dry_run=args.dry_run)
        spider.crawl_and_audit()
        summary_data["links_fixed"] = spider.links_fixed

    # Phase 2 & 3: Inventory Growth & Page Gen
    if args.phase in ["inventory", "all"]:
        logger.info("---| Phase 2: Inventory Growth (The Hunter) |---")
        hunter = Hunter(dry_run=args.dry_run)
        new_items = hunter.hunt()
        
        if new_items:
            logger.info("---| Phase 3: Page Generation (The Builder) |---")
            builder = Builder(dry_run=args.dry_run)
            builder.build_product_pages(new_items)
            summary_data["new_products"] = new_items

    # Phase 4: Content Marketing
    if args.phase in ["content", "all"]:
        logger.info("---| Phase 4: Content Marketing (The Author) |---")
        author = Author(dry_run=args.dry_run)
        # We need to capture the article title if possible, but Author.write_blog_post currently doesn't return it easily
        # to the main scope without modification, but it logs it. 
        # For simplicity, we'll just run it.
        # Ideally, refactor Author to return the title.
        # But for now, we leave it as is.
        author.write_blog_post()
        # Mocking title capture for summary if we wanted to be precise, 
        # but the Publisher handles "None".

    # Phase 5: Deployment
    if args.phase in ["deploy", "all"]:
        logger.info("---| Phase 5: Deployment |---")
        publisher = Publisher(dry_run=args.dry_run)
        publisher.publish_changes(summary_data)

    logger.info("Agent Run Complete")

if __name__ == "__main__":
    main()
