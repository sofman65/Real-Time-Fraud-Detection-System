import joblib
import os
from sklearn.preprocessing import _data  # New import path
import sys

# Map the deprecated module 'sklearn.preprocessing.data' to 'sklearn.preprocessing._data'
sys.modules['sklearn.preprocessing.data'] = _data

# Define the path where the models are stored
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'ml_models', 'models', 'models')

# Paths to the models
logistic_model_path = os.path.join(MODELS_DIR, 'logistic_model.pkl')
rf_model_path = os.path.join(MODELS_DIR, 'rf_model.pkl')
xgb_model_path = os.path.join(MODELS_DIR, 'xgb_model.pkl')
scaler_path = os.path.join(MODELS_DIR, 'scaler.pkl')

# Load the models and scaler
logistic_model = joblib.load(logistic_model_path)
rf_model = joblib.load(rf_model_path)
xgb_model = joblib.load(xgb_model_path)
scaler = joblib.load(scaler_path)

print("Models loaded successfully")

def predict_fraud(transaction_data):
    scaled_data = scaler.transform(transaction_data)
    logistic_pred = logistic_model.predict(scaled_data)[0]
    rf_pred = rf_model.predict(scaled_data)[0]
    xgb_pred = xgb_model.predict(scaled_data)[0]
    
    return {
        'logistic': logistic_pred,
        'random_forest': rf_pred,
        'xgboost': xgb_pred
    }
