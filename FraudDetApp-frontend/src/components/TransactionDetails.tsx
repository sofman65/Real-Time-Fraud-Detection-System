import React from 'react';

interface Transaction {
  Time: number;
  Amount: number;
  Class?: number;
  [key: string]: number | undefined;
}

interface Prediction {
  logistic: number;
  random_forest: number;
  xgboost: number;
}

interface TransactionDetailsProps {
  transaction: Transaction;
  prediction: Prediction;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transaction, prediction }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h2 className="text-lg font-semibold p-4 bg-gray-100 border-b border-gray-200">Transaction Details</h2>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold mb-2">Transaction Information</h3>
            <p className="text-sm text-gray-600">Time: {new Date(transaction.Time * 1000).toLocaleString()}</p>
            <p className="text-sm text-gray-600">Amount: ${transaction.Amount.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Status: {transaction.Class === 1 ? 'Fraudulent' : 'Legitimate'}</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Fraud Probabilities</h3>
            <p className="text-sm text-gray-600">Logistic Regression: {(prediction.logistic * 100).toFixed(2)}%</p>
            <p className="text-sm text-gray-600">Random Forest: {(prediction.random_forest * 100).toFixed(2)}%</p>
            <p className="text-sm text-gray-600">XGBoost: {(prediction.xgboost * 100).toFixed(2)}%</p>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-bold mb-2">Transaction Attributes</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {Object.entries(transaction).map(([key, value]) => {
              if (key.startsWith('V') && value !== undefined) {
                return (
                  <p key={key} className="text-sm text-gray-600">
                    {key}: {value.toFixed(4)}
                  </p>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
