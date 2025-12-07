import pytest
from lambda1 import handler
from shared import utils

def test_lambda1_handler(mocker):
    # Mock context
    mock_context = mocker.Mock()
    event = {"key": "value"}

    response = handler.handler(event, mock_context)
    
    assert response["statusCode"] == 200
    assert "Hello from Lambda 1" in response["body"]
    assert response["headers"]["Content-Type"] == "application/json"
