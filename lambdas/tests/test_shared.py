from shared.utils import format_response
import json

def test_format_response():
    status = 201
    body = {"created": True}
    
    response = format_response(status, body)
    
    assert response["statusCode"] == 201
    assert json.loads(response["body"]) == body
    assert response["headers"]["Content-Type"] == "application/json"
