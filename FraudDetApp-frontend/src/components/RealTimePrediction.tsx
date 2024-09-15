import React, { useState, useEffect } from 'react';
import RealTimeChart from './RealTimeChart';

interface Prediction {
    logistic: number;
    random_forest: number;
    xgboost: number;
}

interface Transaction {
    Time: number;
    Amount: number;
    V1: number;
    V2: number;
    V3: number;
    V4: number;
    V5: number;
    V6: number;
    V7: number;
    V8: number;
    V9: number;
    V10: number;
    V11: number;
    V12: number;
    V13: number;
    V14: number;
    V15: number;
    V16: number;
    V17: number;
    V18: number;
    V19: number;
    V20: number;
    V21: number;
    V22: number;
    V23: number;
    V24: number;
    V25: number;
    V26: number;
    V27: number;
    V28: number;
    Class?: number;  // The actual fraud label
}

const RealTimePrediction: React.FC = () => {
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8000/ws/fraud_detection/");

        socket.onopen = (event) => {
            console.log("WebSocket connection opened", event);
        };

        socket.onmessage = (event) => {
            console.log("WebSocket message received", event.data);
            const data = JSON.parse(event.data);
            if (data.predictions && data.transaction) {
                console.log("Updating state with new data", data);
                setPredictions(prev => [...prev, data.predictions]);
                setTransactions(prev => [...prev, data.transaction]);
            }
        };

        return () => {
            socket.close();
        };
    }, []);

    if (predictions.length === 0 || transactions.length === 0) {
        return <div>Waiting for predictions...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <RealTimeChart predictions={predictions} transactions={transactions} />
        </div>
    );
};

export default RealTimePrediction;
