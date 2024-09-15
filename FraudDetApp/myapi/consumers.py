import json
import asyncio
import pandas as pd
from channels.generic.websocket import AsyncWebsocketConsumer
from .model_loader import predict_fraud
from asgiref.sync import sync_to_async
import random
import os
from logging import getLogger

# Setup logging
logger = getLogger(__name__)

# Ensure the order of columns matches the training data
COLUMNS_ORDER = ["Time", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9", "V10", "V11", "V12", "V13", "V14", "V15", "V16", "V17", "V18", "V19", "V20", "V21", "V22", "V23", "V24", "V25", "V26", "V27", "V28", "Amount"]

class FraudDetectionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.send(text_data=json.dumps({"message": "Connected to WebSocket"}))
        
        # Load the CSV data
        csv_path = os.path.join(os.path.dirname(__file__), 'ml_models', 'models', 'credit_card_data.csv')
        self.df = pd.read_csv(csv_path)
        
        asyncio.create_task(self.send_periodic_predictions())

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        # Handle incoming messages if needed
        # data = json.loads(text_data)
        # transaction = data.get('transaction')
        # if transaction:
        #     result = await self.get_predictions(transaction)
        #     await self.send(text_data=json.dumps(result))
        pass        

    async def send_periodic_predictions(self):
        while True:
            await asyncio.sleep(2)  # Send a prediction every 5 seconds
            transaction = await self.get_sample_transaction()
            result = await self.get_predictions(transaction)
            await self.send(text_data=json.dumps(result, default=str))

    @sync_to_async
    def get_sample_transaction(self):
        # Randomly select a transaction from the DataFrame
        return self.df.sample(n=1).iloc[0]

    @sync_to_async
    def get_predictions(self, transaction):
        # Convert the transaction to a DataFrame
        df = pd.DataFrame([transaction])
        
        # Ensure the order of columns matches the training data
        columns = ["Time", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9", "V10", 
                   "V11", "V12", "V13", "V14", "V15", "V16", "V17", "V18", "V19", "V20", 
                   "V21", "V22", "V23", "V24", "V25", "V26", "V27", "V28", "Amount"]
        df = df[columns]
        
        # Get predictions using the imported predict_fraud function
        predictions = predict_fraud(df)
        
        # Convert transaction to a dictionary and handle NaN values
        transaction_dict = transaction.to_dict()
        for key, value in transaction_dict.items():
            if pd.isna(value):
                transaction_dict[key] = None
        
        return {
            "predictions": predictions,
            "transaction": transaction_dict
        }
