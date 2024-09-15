import React from 'react';
// import './App.css';
import RealTimePrediction from './components/RealTimePrediction';
import Chatbot from './components/Chatbot';
import ThreeScene from './components/ThreeScene';
import { Card, CardBody, Typography } from "@material-tailwind/react";



function App() {
  return (
    <div className="App bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4">
      <header className="mb-6">
        <Typography placeholder="Loading..." variant="h2" className="text-blue-700">
          Real-Time Fraud Detection System
        </Typography>
      </header>

      {/* Real-time Fraud Detection */}
      <RealTimePrediction />

      <div className="mt-8 w-full flex justify-between">
        {/* Chatbot Component */}
        {/* <Card placeholder="Loading..." className="w-1/2">
          <CardBody placeholder="Loading...">
            <Chatbot />
          </CardBody>
        </Card> */}

        {/* 3D Visualization */}
        {/* <Card placeholder="Loading..." className="w-1/2">
          <CardBody placeholder="Loading...">
            <ThreeScene />
          </CardBody>
        </Card> */}
      </div>
    </div>
  );
}

export default App;
