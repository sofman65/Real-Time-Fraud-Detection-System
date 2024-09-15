print("views.py: Loaded")


import json
import logging
import os
from openai import OpenAI
from dotenv import load_dotenv
from django.http import StreamingHttpResponse
from rest_framework.decorators import api_view, permission_classes, renderer_classes
from rest_framework.permissions import AllowAny
from .server_sent_event_renderer import ServerSentEventRenderer
from .model_loader import predict_fraud as model_predict_fraud
from rest_framework.response import Response
import pandas as pd

# Load environment variables from .env file
load_dotenv()

# Set up logging
logger = logging.getLogger(__name__)

# Set the OpenAI API key
openai_api_key = os.getenv("OPENAI_API_KEY")

if not openai_api_key:
    raise ValueError("No OpenAI API key found. Please set the OPENAI_API_KEY environment variable.")

client = OpenAI(api_key=openai_api_key)

GPT_MODEL_ENGINE = "gpt-4"

@api_view(['GET'])
@permission_classes([AllowAny])
@renderer_classes([ServerSentEventRenderer])
def chatbot(request):
    user_message = request.GET.get('message', 'Generate a list of 20 great names for sentient cheesecakes that teach SQL')
    
    def event_stream():
        for chunk in client.chat.completions.create(
            model=GPT_MODEL_ENGINE,
            messages=[{"role": "user", "content": user_message}],
            stream=True
        ):
            if chunk.choices[0].delta.content is not None:
                yield f"data: {json.dumps({'content': chunk.choices[0].delta.content})}\n\n"

    response = StreamingHttpResponse(event_stream(), content_type="text/event-stream")
    response['X-Accel-Buffering'] = 'no'
    response['Cache-Control'] = 'no-cache'
    return response

# The list of columns the model expects
COLUMNS = ["Time", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9", "V10", "V11", "V12", "V13", "V14", "V15", "V16", "V17", "V18", "V19", "V20", "V21", "V22", "V23", "V24", "V25", "V26", "V27", "V28", "Amount"]


@api_view(['POST'])
@permission_classes([AllowAny])
def predict_transaction_fraud(request):
    # Get transaction data from the request
    transaction_data = request.data.get('transaction')

    if not transaction_data:
        return Response({'error': 'Transaction data is missing'}, status=400)

    try:
        # Convert the transaction data into a pandas DataFrame with the correct columns
        df = pd.DataFrame([transaction_data], columns=COLUMNS)

        # Call the prediction function from model_loader.py and pass the DataFrame
        prediction = model_predict_fraud(df)

        # Return the predictions as a JSON response
        return Response({'prediction': prediction})
    
    except Exception as e:
        # Return an error response in case something goes wrong
        return Response({'error': str(e)}, status=500)