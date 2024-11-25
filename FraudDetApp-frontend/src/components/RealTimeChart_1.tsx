import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Transaction, Prediction } from '../types/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin,
  annotationPlugin
);

interface RealTimeChartProps {
  predictions: Prediction[];
  transactions: Transaction[];
}

const RealTimeChart: React.FC<RealTimeChartProps> = ({ predictions, transactions }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [insights, setInsights] = useState<string[]>([]);

  useEffect(() => {
    if (transactions.length === 0 || predictions.length === 0) return;

    const labels = transactions.map(t => new Date(t.Time * 1000).toLocaleTimeString());
    const amounts = transactions.map(t => t.Amount);
    const fraudStatus = transactions.map(t => t.Class === 1);

    // Identify anomalies
    const anomalies = identifyAnomalies(amounts);

    // Calculate insights
    const newInsights = calculateInsights(transactions, predictions, anomalies);
    setInsights(newInsights);

    setChartData({
      labels,
      datasets: [
        {
          type: 'line' as const,
          label: 'Logistic Regression',
          data: predictions.map(p => p.logistic),
          borderColor: 'rgb(255, 99, 132)',
          yAxisID: 'y',
        },
        {
          type: 'line' as const,
          label: 'Random Forest',
          data: predictions.map(p => p.random_forest),
          borderColor: 'rgb(54, 162, 235)',
          yAxisID: 'y',
        },
        {
          type: 'line' as const,
          label: 'XGBoost',
          data: predictions.map(p => p.xgboost),
          borderColor: 'rgb(75, 192, 192)',
          yAxisID: 'y',
        },
        {
          type: 'bar' as const,
          label: 'Transaction Amount',
          data: amounts,
          backgroundColor: amounts.map((_, i) => 
            fraudStatus[i] 
              ? 'rgba(255, 99, 132, 0.5)' 
              : anomalies[i] 
                ? 'rgba(255, 206, 86, 0.5)'
                : 'rgba(75, 192, 192, 0.5)'
          ),
          yAxisID: 'y1',
        },
      ],
    });
  }, [predictions, transactions]);

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Fraud Probability',
        },
        min: 0,
        max: 1,
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Transaction Amount',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'xy' as const,
        },
        pan: {
          enabled: true,
          mode: 'xy' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const datasetLabel = context.dataset.label;
            const value = context.parsed.y;
            const index = context.dataIndex;
            const fraudStatus = transactions[index]?.Class === 1 ? 'Fraudulent' : 'Legitimate';
            const isAnomaly = identifyAnomalies(transactions.map(t => t.Amount))[index];
            return `${datasetLabel}: ${value.toFixed(2)} (${fraudStatus}${isAnomaly ? ', Anomaly' : ''})`;
          },
        },
      },
    },
  };

  const identifyAnomalies = (amounts: number[]) => {
    const mean = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
    const stdDev = Math.sqrt(amounts.reduce((sum, amount) => sum + Math.pow(amount - mean, 2), 0) / amounts.length);
    const threshold = mean + 3 * stdDev;

    return amounts.map(amount => amount > threshold);
  };

  const calculateInsights = (transactions: Transaction[], predictions: Prediction[], anomalies: boolean[]) => {
    const fraudCount = transactions.filter(t => t.Class === 1).length;
    const fraudRate = (fraudCount / transactions.length) * 100;
    const averageAmount = transactions.reduce((sum, t) => sum + t.Amount, 0) / transactions.length;
    const maxAmount = Math.max(...transactions.map(t => t.Amount));
    const anomalyCount = anomalies.filter(a => a).length;

    const modelAccuracies = {
      logistic: predictions.reduce((sum, p) => sum + p.logistic, 0) / predictions.length,
      random_forest: predictions.reduce((sum, p) => sum + p.random_forest, 0) / predictions.length,
      xgboost: predictions.reduce((sum, p) => sum + p.xgboost, 0) / predictions.length,
    };

    return [
      `Fraud Rate: ${fraudRate.toFixed(2)}%`,
      `Average Transaction Amount: $${averageAmount.toFixed(2)}`,
      `Highest Transaction Amount: $${maxAmount.toFixed(2)}`,
      `Anomalies Detected: ${anomalyCount}`,
      `Model Accuracies: Logistic (${(modelAccuracies.logistic * 100).toFixed(2)}%), Random Forest (${(modelAccuracies.random_forest * 100).toFixed(2)}%), XGBoost (${(modelAccuracies.xgboost * 100).toFixed(2)}%)`,
    ];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">Real-Time Fraud Detection</h2>
      {chartData && <Chart type="bar" data={chartData} options={options} />}
      <div className="mt-4">
        <h3 className="text-md font-semibold mb-2">Insights:</h3>
        <ul className="list-disc pl-5">
          {insights.map((insight, index) => (
            <li key={index} className="text-sm text-gray-600">{insight}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex justify-between text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-rgba(75, 192, 192, 0.5) mr-2"></div>
          <span>Normal Transaction</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-rgba(255, 206, 86, 0.5) mr-2"></div>
          <span>Anomaly</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-rgba(255, 99, 132, 0.5) mr-2"></div>
          <span>Fraudulent</span>
        </div>
      </div>
    </div>
  );
};

export default RealTimeChart;

