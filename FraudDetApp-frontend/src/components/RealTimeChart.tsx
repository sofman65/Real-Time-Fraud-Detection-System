import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Card, CardBody, Typography, Alert } from '@material-tailwind/react';

// Register necessary components for Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface Prediction {
    logistic: number;
    random_forest: number;
    xgboost: number;
}

interface Transaction {
    Time: number;
    Amount: number;
    Class?: number;  // The actual fraud label
}

interface RealTimeChartProps {
    predictions: Prediction[];
    transactions: Transaction[];
}

const RealTimeChart: React.FC<RealTimeChartProps> = ({ predictions, transactions }) => {
    const [fraudAlert, setFraudAlert] = useState<string | null>(null);

    // Prepare chart data for Chart.js
    const chartData = {
        labels: transactions.map(t => t.Time ? new Date(t.Time * 1000).toLocaleTimeString() : ''),
        datasets: [
            {
                label: 'Logistic Regression',
                data: predictions.map(p => p.logistic),
                borderColor: '#8884d8',
                fill: false,
                yAxisID: 'y',
            },
            {
                label: 'Random Forest',
                data: predictions.map(p => p.random_forest),
                borderColor: '#82ca9d',
                fill: false,
                yAxisID: 'y',
            },
            {
                label: 'XGBoost',
                data: predictions.map(p => p.xgboost),
                borderColor: '#ffc658',
                fill: false,
                yAxisID: 'y',
            },
            {
                label: 'Transaction Amount',
                data: transactions.map(t => t.Amount),
                borderColor: '#00bfff',
                backgroundColor: '#00bfff',
                type: 'scatter', // Use scatter plot for amounts
                yAxisID: 'y1',  // Amount should use right axis (y1)
            }
        ]
    };

    // Chart.js options for layout and appearance
    const chartOptions = {
        responsive: true,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        scales: {
            y: {
                type: 'linear' as const,
                position: 'left' as const,
                title: {
                    display: true,
                    text: 'Fraud Prediction Probability',
                },
                min: 0,
                max: 1,
            },
            y1: {
                type: 'linear' as const,
                position: 'right' as const,
                title: {
                    display: true,
                    text: 'Transaction Amount ($)',
                },
                beginAtZero: true,
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (tooltipItem: any) {
                        const value = tooltipItem.raw;

                        // Check if the value is a number before formatting
                        if (typeof value === 'number') {
                            if (tooltipItem.dataset.label === 'Transaction Amount') {
                                return `Amount: $${value.toFixed(2)}`;
                            }
                            return `${tooltipItem.dataset.label}: ${value.toFixed(2)}`;
                        }

                        // Fallback for non-number types
                        return `${tooltipItem.dataset.label}: ${value}`;
                    },
                },
            },
            legend: {
                position: 'top' as const,
            },
        }
    };

    // Fraud detection logic
    useEffect(() => {
        const latestTransaction = transactions[transactions.length - 1];
        if (latestTransaction && latestTransaction.Class === 1) {
            const alertMessage = `🚨 Fraud detected at ${new Date(latestTransaction.Time * 1000).toLocaleTimeString()}`;
            setFraudAlert(alertMessage);
        } else {
            setFraudAlert(null);
        }
    }, [transactions]);

    return (
        <div className="p-4 flex flex-col items-center">
            <Card placeholder={<div>Loading...</div>} className="w-full max-w-4xl mb-4 shadow-lg">
                <CardBody placeholder={<div>Loading...</div>}>
                    <Typography placeholder={<div>Loading...</div>} variant="h5" color="blue-gray" className="text-center mb-4">
                        Real-Time Fraud Detection
                    </Typography>

                    {fraudAlert && (
                        <Alert color="red" icon={<span>⚠️</span>} className="mb-4 text-center">
                            {fraudAlert}
                        </Alert>
                    )}

                    <div className="w-full">
                        <Line data={chartData as any} options={chartOptions} />
                    </div>

                    <Typography placeholder={<div>Loading...</div>} variant="h6" className="mt-6 text-center">
                        Transaction History
                    </Typography>
                    <div className="mt-2 max-h-64 overflow-y-auto border border-gray-200 rounded-md p-4 bg-gray-50">
                        <ul>
                            {transactions.map((transaction, index) => (
                                <li key={index} className="text-sm text-gray-700 mb-1">
                                    <strong>Time:</strong> {new Date(transaction.Time * 1000).toLocaleTimeString()} -
                                    <strong> Amount:</strong> ${transaction.Amount.toFixed(2)}
                                </li>
                            ))}
                        </ul>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default RealTimeChart;