import React from 'react';

interface Transaction {
  Time: number;
  Amount: number;
  Class?: number;
}

interface FraudAlertsProps {
  transactions: Transaction[];
}

const FraudAlerts: React.FC<FraudAlertsProps> = ({ transactions }) => {
  const fraudulentTransactions = transactions.filter(t => t.Class === 1);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gray-100 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Fraud Alerts</h2>
      </div>
      <div className="p-4">
        <div className="h-[300px] overflow-y-auto">
          {fraudulentTransactions.length === 0 ? (
            <p className="text-gray-600">No fraudulent transactions detected.</p>
          ) : (
            fraudulentTransactions.map((transaction, index) => (
              <div key={index} className="mb-2 p-2 bg-red-100 rounded">
                <p className="font-bold text-red-800">Fraudulent Transaction Detected</p>
                <p className="text-sm text-gray-700">Time: {new Date(transaction.Time * 1000).toLocaleString()}</p>
                <p className="text-sm text-gray-700">Amount: ${transaction.Amount.toFixed(2)}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FraudAlerts;

