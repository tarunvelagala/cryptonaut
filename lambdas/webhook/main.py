import json
import os
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    """
    Telegram Webhook Lambda.
    Triggered by: API Gateway (Telegram Webhook).
    Purpose: Receives updates from Telegram and processes commands.
    """
    logger.info("Telegram Webhook Received")
    logger.info(f"Event: {json.dumps(event)}")
    
    # Environment variables
    audit_table = os.environ.get('AUDIT_TABLE')
    secret_name = os.environ.get('TELEGRAM_SECRET_NAME')
    
    logger.info(f"Audit Table: {audit_table}, Secret: {secret_name}")
    
    return {
        "statusCode": 200,
        "body": json.dumps({"message": "Webhook Processed"})
    }
