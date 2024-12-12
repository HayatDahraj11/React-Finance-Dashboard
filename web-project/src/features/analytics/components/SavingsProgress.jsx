// src/features/analytics/components/SavingsProgress.jsx
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

// Register chart components with Chart.js
ChartJS.register(LineElement, PointElement, Tooltip, Legend, CategoryScale, LinearScale);

const SavingsProgress = () => {
  // Dummy data for savings progress
  const savingsData = {
    goal: 5000,
    current: 3500,
    progress: [500, 1200, 2000, 3000, 3500],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  };

  // Line chart data
  const lineData = {
    labels: savingsData.months,
    datasets: [
      {
        label: 'Savings Over Time',
        data: savingsData.progress,
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

      {/* Goal and Current Savings */}
      <div className="mb-6">
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-sm text-gray-600">Savings Goal</span>
          <span className="font-semibold text-lg">${savingsData.goal}</span>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <span className="text-sm text-gray-600">Current Savings</span>
          <span className="font-semibold text-success">${savingsData.current}</span>
        </div>

        <div className="progress bg-gray-200 rounded-full overflow-hidden mt-4" style={{ height: '10px' }}>
    <div
        className="progress-bar bg-primary"
        style={{
            width: `${(savingsData.current / savingsData.goal) * 100}%`, /* Fills correctly */
            margin: 0, /* No additional gap */
            padding: 0, /* Ensure no padding */
        }}
    ></div>
    </div>
</div>


      {/* Line Chart */}
      <div className="chart-container mx-auto" style={{ maxWidth: '300px' }}>
        <Line data={lineData} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

export default SavingsProgress;
