import json
import os
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    """
    CrewAI Orchestrator Lambda.
    Triggered by: API Gateway or EventBridge.
    Purpose: Orchestrates the CrewAI agents to perform analysis.
    """
    logger.info("Crew Orchestrator Invoked")
    logger.info(f"Event: {json.dumps(event)}")
    
    # Environment variables
    audit_table = os.environ.get('AUDIT_TABLE')
    secret_name = os.environ.get('CREWAI_SECRET_NAME')
    
    logger.info(f"Audit Table: {audit_table}, Secret: {secret_name}")
    
    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "Crew Orchestrator Executed",
            "secret_configured": bool(secret_name)
        })
    }
