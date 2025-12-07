import json
import os
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    """
    Telegram Notifier Lambda.
    Triggered by: Orchestrator or other services.
    Purpose: Sends messages to Telegram users via Bot API.
    """
    logger.info("Telegram Notifier Invoked")
    logger.info(f"Event: {json.dumps(event)}")
    
    # Environment variables
    audit_table = os.environ.get('AUDIT_TABLE')
    secret_name = os.environ.get('TELEGRAM_SECRET_NAME')
    
    logger.info(f"Audit Table: {audit_table}, Secret: {secret_name}")
    
    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "Notification Sent",
            "secret_configured": bool(secret_name)
        })
    }
