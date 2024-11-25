import React, { useState, useEffect } from 'react';
import MetricsSummary from './MetricsSummary';
import RealTimeChart from './RealTimeChart_1';
import TransactionHistory from './TransactionHistory';
import FraudAlerts from './FraudAlerts';
import TransactionDetails from './TransactionDetails';
import { Transaction, Prediction, Metrics } from '../types/types';

const FraudDetectionDashboard: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws/fraud_detection/");

    socket.onopen = (event) => {
      console.log("WebSocket connection opened", event);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.predictions && data.transaction) {
        setPredictions(prev => [...prev, data.predictions]);
        setTransactions(prev => [...prev, data.transaction]);
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  const metrics: Metrics = {
    totalTransactions: transactions.length,
    fraudulentTransactions: transactions.filter(t => t.Class === 1).length,
    accuracies: {
      logistic: 0.85,
      random_forest: 0.92,
      xgboost: 0.95
    }
  };

  const handleSelectTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <MetricsSummary metrics={metrics} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RealTimeChart predictions={predictions} transactions={transactions} />
        </div>
        <div>
          <FraudAlerts transactions={transactions} />
        </div>
      </div>
      <TransactionHistory 
        transactions={transactions} 
        onSelectTransaction={handleSelectTransaction} 
      />
      {selectedTransaction && predictions.length > 0 && (
        <TransactionDetails 
          transaction={selectedTransaction} 
          prediction={predictions[predictions.length - 1]} 
        />
      )}
    </div>
  );
};

export default FraudDetectionDashboard;

