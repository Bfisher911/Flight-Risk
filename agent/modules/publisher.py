import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import git
from pathlib import Path
from config import PROJECT_ROOT

logger = logging.getLogger("FlightRiskAgent.Publisher")

class Publisher:
    def __init__(self, dry_run=False):
        self.dry_run = dry_run
        # Email settings from env
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.sender_email = os.getenv("SENDER_EMAIL")
        self.sender_password = os.getenv("SENDER_PASSWORD")
        self.recipient_email = "blaine@flightriskdrones.com" # As per user request imply

    def publish_changes(self, summary_data):
        """
        Commits changes and sends email.
        summary_data: dict with keys: links_fixed, new_products, new_article_title
        """
        logger.info("Starting Deployment Phase...")
        
        # 1. Git Commit & Push
        self.git_commit_push(summary_data)
        
        # 2. Send Summary Email
        self.send_summary_email(summary_data)

    def git_commit_push(self, summary):
        """Commits changes to the repo."""
        if self.dry_run:
            logger.info("DRY RUN: Skipping Git Commit & Push")
            return

        try:
            repo = git.Repo(PROJECT_ROOT)
            
            # Check if dirty
            if not repo.is_dirty(untracked_files=True):
                logger.info("No changes to commit.")
                return

            # Add specific files we care about to avoid adding junk
            files_to_add = ["src/data/products.json", "src/data/articles/"]
            # Or just add all
            repo.git.add(all=True)
            
            # Commit message
            msg_parts = []
            if summary.get("links_fixed"):
                msg_parts.append(f"Fixed {summary['links_fixed']} dead links")
            if summary.get("new_products"):
                msg_parts.append(f"Added {len(summary['new_products'])} products")
            if summary.get("new_article_title"):
                msg_parts.append(f"Published: {summary['new_article_title']}")
            
            commit_msg = "Agent Update: " + ", ".join(msg_parts) if msg_parts else "Agent Routine Maintenance"
            
            repo.index.commit(commit_msg)
            logger.info(f"Committed changes: {commit_msg}")
            
            # Push (assuming remote is origin/main or origin/master)
            origin = repo.remote(name='origin')
            origin.push()
            logger.info("Pushed changes to remote.")
            
        except Exception as e:
            logger.error(f"Git operation failed: {e}")

    def send_summary_email(self, summary):
        """Sends an HTML summary email."""
        if not self.sender_email or not self.sender_password:
            logger.warning("Email credentials not found. Skipping email.")
            # Start of mock email output for verification
            logger.info(f"MOCK EMAIL TO: {self.recipient_email}")
            logger.info(f"SUBJECT: Agent Report - {summary.get('new_article_title', 'Update')}")
            logger.info(f"BODY: Fixed {summary.get('links_fixed', 0)} links. Added {len(summary.get('new_products', []))} products.")
            return

        if self.dry_run:
            logger.info("DRY RUN: Skipping Email Send")
            return

        msg = MIMEMultipart()
        msg['From'] = self.sender_email
        msg['To'] = self.recipient_email
        msg['Subject'] = f"Flight Risk Agent Report: {len(summary.get('new_products', []))} New Products Found"

        body = f"""
        <html>
          <body>
            <h2>Agent Run Summary</h2>
            
            <h3>Phase 1: Maintenance</h3>
            <p>Dead links remediated: <b>{summary.get('links_fixed', 0)}</b></p>
            
            <h3>Phase 2 & 3: Inventory</h3>
            <p>New Products Added: {len(summary.get('new_products', []))}</p>
            <ul>
                {''.join([f"<li>{p.get('name')}</li>" for p in summary.get('new_products', [])])}
            </ul>
            
            <h3>Phase 4: Content</h3>
            <p>New Blog Post: <b>{summary.get('new_article_title', 'None')}</b></p>
            
            <p><i>automated message from Flight Risk Agent</i></p>
          </body>
        </html>
        """
        msg.attach(MIMEText(body, 'html'))

        try:
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)
                server.send_message(msg)
            logger.info(f"Email sent to {self.recipient_email}")
        except Exception as e:
            logger.error(f"Failed to send email: {e}")
