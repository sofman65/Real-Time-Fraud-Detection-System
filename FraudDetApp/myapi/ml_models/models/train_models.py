import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
import xgboost as xgb
import joblib
import os

# Define paths to save models and scaler
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'models')

# Ensure the models directory exists
if not os.path.exists(MODELS_DIR):
    os.makedirs(MODELS_DIR)

# Paths to save models and scaler
logistic_model_path = os.path.join(MODELS_DIR, 'logistic_model.pkl')
rf_model_path = os.path.join(MODELS_DIR, 'rf_model.pkl')
xgb_model_path = os.path.join(MODELS_DIR, 'xgb_model.pkl')
scaler_path = os.path.join(MODELS_DIR, 'scaler.pkl')

# Get the directory of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))

# Construct the full path to the CSV file
csv_path = os.path.join(current_dir, 'credit_card_data.csv')

# Read the CSV file
df = pd.read_csv(csv_path)

# Assuming 'Class' is the target column (1 = Fraud, 0 = Non-Fraud)
X = df.drop('Class', axis=1)  # Features
y = df['Class']  # Target

# Split the dataset into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(X_train.head())

# Scale the data (standardization)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train Logistic Regression model
print("Training Logistic Regression model...")
logistic_model = LogisticRegression()
logistic_model.fit(X_train_scaled, y_train)

# Train Random Forest model
print("Training Random Forest model...")
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train_scaled, y_train)

# Train XGBoost model
print("Training XGBoost model...")
xgb_model = xgb.XGBClassifier()
xgb_model.fit(X_train_scaled, y_train)

# Save the models and the scaler
print(f"Saving models and scaler in {MODELS_DIR}...")
joblib.dump(logistic_model, logistic_model_path)
joblib.dump(rf_model, rf_model_path)
joblib.dump(xgb_model, xgb_model_path)
joblib.dump(scaler, scaler_path)

print("Models and scaler saved successfully!")

# Optionally: Print accuracy on test set
logistic_acc = logistic_model.score(X_test_scaled, y_test)
rf_acc = rf_model.score(X_test_scaled, y_test)
xgb_acc = xgb_model.score(X_test_scaled, y_test)

print(f"Logistic Regression Test Accuracy: {logistic_acc:.2f}")
print(f"Random Forest Test Accuracy: {rf_acc:.2f}")
print(f"XGBoost Test Accuracy: {xgb_acc:.2f}")
