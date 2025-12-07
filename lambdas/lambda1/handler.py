import json
from shared.utils import format_response

def handler(event, context):
    """
    Sample Lambda 1 Handler
    """
    print(f"Lambda 1 event: {json.dumps(event)}")
    return format_response(200, {"message": "Hello from Lambda 1"})
