# Real-Time-Fraud-Detection-System

## Overview

This project is a **Real-Time Fraud Detection System** that utilizes machine learning models to detect fraudulent transactions. It is built using **Django Channels** for real-time WebSocket communication and **React** for the frontend visualization of transaction data and fraud predictions. The backend hosts trained machine learning models (Logistic Regression, Random Forest, XGBoost), while the frontend displays these predictions in real-time using **Recharts**.

---

## Features

- **Real-Time Predictions**: Stream predictions for fraudulent transactions in real-time.
- **Machine Learning**: Uses Logistic Regression, Random Forest, and XGBoost models to predict fraud.
- **WebSockets**: Backend-to-frontend real-time data streaming using Django Channels and WebSockets.
- **Visualization**: Dynamic data visualization using React and Recharts for transactions and fraud detection alerts.
- **Scalable Backend**: Easily adaptable to support more models and scale with Redis-backed WebSockets.

---

## Project Structure

```bash
├── FraudDetApp/
│   ├── ml_models/                  # Folder to store machine learning models and CSV datasets
│   ├── myapi/                      # Django app with views, models, and consumers
│   │   ├── consumers.py            # WebSocket Consumer for real-time data
│   │   ├── views.py                # REST API Views for the backend
│   │   ├── model_loader.py         # Logic for loading ML models
│   ├── asgi.py                     # Django ASGI config for Channels
│   ├── settings.py                 # Django settings
├── FraudDetApp-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RealTimeChart.tsx   # React component for real-time visualization
│   │   ├── App.tsx                 # Main React app
│   ├── public/                     # Public assets for the frontend
├── requirements.txt                # Python dependencies
├── package.json                    # Node.js dependencies for frontend




```
---

## Installation

To set up the project, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/Real-Time-Fraud-Detection-System.git
   cd Real-Time-Fraud-Detection-System
   ```

2. **Set up the backend**:
   - Navigate to the `FraudDetApp` directory:
     ```bash
     cd FraudDetApp
     ```
   - Create a virtual environment and activate it:
     ```bash
     python -m venv venv
     source venv/bin/activate  # On Windows use `venv\Scripts\activate`
     ```
   - Install the required Python packages:
     ```bash
     pip install -r requirements.txt
     ```
   - **Run Redis** (make sure Redis is installed):
     ```bash
     redis-server
     ```

3. **Set up the frontend**:
   - Navigate to the `FraudDetApp-frontend` directory:
     ```bash
     cd ../FraudDetApp-frontend
     ```
   - Install the required Node.js packages:
     ```bash
     npm install
     ```

4. **Run the Django Application with Daphne**: Use the following command to start the application:

   ```bash
   daphne FraudDetApp.asgi:application
   ```

5. **Run the frontend**:
   - Start the React app:
     ```bash
     npm start
     ```

---

## Usage

Once both the backend and frontend are running, you can access the application at `http://localhost:3000`. The real-time fraud detection system will display transaction data and predictions as they are processed.

