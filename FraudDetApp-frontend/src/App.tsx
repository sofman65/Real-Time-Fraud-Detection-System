import React from 'react';
import FraudDetectionDashboard from './components/Dashboard';
import { Typography } from '@material-tailwind/react';

function App() {
  return (
    <div className="App bg-gray-100 min-h-screen flex flex-col items-center p-4">
      <header className="mb-6 w-full text-center">
        <Typography 
          variant="h2" 
          className="text-blue-700" 
          title="Real-Time Fraud Detection System"
          placeholder="Enter text here"
        >
          Real-Time Fraud Detection System
        </Typography>
      </header>

      <FraudDetectionDashboard />
    </div>
  );
}

export default App;