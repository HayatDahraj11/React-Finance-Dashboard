// SavingsProgress.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, Tooltip, Legend, CategoryScale, LinearScale);

const SavingsProgress = ({ data }) => {
  if (!data || !data.current) {
    return <div className="text-center">Loading savings data...</div>;
  }

  // Line chart data
  const lineData = {
    labels: data.progress.months,
    datasets: [
      {
        label: 'Savings Over Time',
        data: data.progress.progress,
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#36A2EB',
      },
    ],
  };

  return (
    <div className="expense-summary bg-light p-4 rounded shadow">
      <h2 className="text-center text-primary">Savings Progress</h2>

      <div className="mb-6">
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-sm text-gray-600">Savings Goal</span>
          <span className="font-semibold text-lg">
            ${data.current.goal.toLocaleString()}
          </span>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <span className="text-sm text-gray-600">Current Savings</span>
          <span className="font-semibold text-success">
            ${data.current.current.toLocaleString()}
          </span>
        </div>

        <div 
          className="progress bg-gray-200 rounded-full overflow-hidden mt-4" 
          style={{ height: '10px' }}
        >
          <div
            className="progress-bar bg-primary"
            style={{
              width: `${(data.current.current / data.current.goal) * 100}%`,
              margin: 0,
              padding: 0,
            }}
          ></div>
        </div>
      </div>

      <div className="chart-container mx-auto" style={{ maxWidth: '300px' }}>
        <Line data={lineData} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

export default SavingsProgress;

