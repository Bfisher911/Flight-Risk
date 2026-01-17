# Cron Scheduling for Flight Risk Agent

To run the agent automatically on Tuesdays and Fridays at 04:00 AM CST (System time), follow these steps:

## 1. Prerequisites
Ensure you have the required environment variables. You can put them in the `.env` file in the `agent/` directory, or export them in the cron script.

Required in `.env`:
- `OPENAI_API_KEY`
- `SMTP_SERVER` (optional for email)
- `SMTP_PORT` (optional for email)
- `SENDER_EMAIL` (optional for email)
- `SENDER_PASSWORD` (optional for email)

## 2. Cron Entry
Open your crontab editor:
```bash
crontab -e
```

Add the following line (adjust paths to match your system):

```cron
# Run FlightRisk Agent on Tuesdays and Fridays at 04:00 AM
0 4 * * 2,5 cd "/Users/blainefisher/Websites/Flight Risk/Flight-Risk/agent" && /usr/bin/python3 main.py >> agent.log 2>&1
```

**Note:**
- Replace `/usr/bin/python3` with the path to your Python executable (run `which python3` to find it).
- Ensure the `cd` path points to the `agent` directory.

## 3. Verify
You can test the cron job by setting it to run a few minutes from now, or by running the command manually to ensure it works.
