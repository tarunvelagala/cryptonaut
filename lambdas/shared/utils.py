import json

def format_response(status_code: int, body: dict) -> dict:
    """
    Sample shared utility to format API Gateway responses
    """
    return {
        "statusCode": status_code,
        "body": json.dumps(body),
        "headers": {
            "Content-Type": "application/json"
        }
    }
