import pytest
from lambda2 import handler
from shared import utils

def test_lambda2_handler(mocker):
    mock_context = mocker.Mock()
    event = {"key": "value"}
    
    response = handler.handler(event, mock_context)
    
    assert response["statusCode"] == 200
    assert "Hello from Lambda 2" in response["body"]
