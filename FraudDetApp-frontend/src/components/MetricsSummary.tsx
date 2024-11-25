import React from 'react';

interface MetricsSummaryProps {
  metrics: {
    totalTransactions: number;
    fraudulentTransactions: number;
    accuracies: {
      logistic: number;
      random_forest: number;
      xgboost: number;
    };
  };
}

const MetricsSummary: React.FC<MetricsSummaryProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Total Transactions</h3>
        <p className="text-2xl font-bold">{metrics.totalTransactions}</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Fraudulent Transactions</h3>
        <p className="text-2xl font-bold text-red-600">{metrics.fraudulentTransactions}</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4 col-span-2">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Model Accuracies</h3>
        <div className="text-sm">
          <p>Logistic: {(metrics.accuracies.logistic * 100).toFixed(2)}%</p>
          <p>Random Forest: {(metrics.accuracies.random_forest * 100).toFixed(2)}%</p>
          <p>XGBoost: {(metrics.accuracies.xgboost * 100).toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );
};

export default MetricsSummary;
