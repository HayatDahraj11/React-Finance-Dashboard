// src/features/analytics/components/BudgetOverview.jsx
import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register chart components with Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export const BudgetOverview = () => {
  // Dummy data for budget overview
  const budgetData = {
    totalBudget: 2000,
    spent: 1250,
    remaining: 750,
    categories: {
      food: 400,
      entertainment: 200,
      bills: 400,
      transportation: 150,
      savings: 100,
    },
  };

  // Chart data for Doughnut
  const doughnutData = {
    labels: Object.keys(budgetData.categories),
    datasets: [
      {
        data: Object.values(budgetData.categories),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
        hoverBackgroundColor: [
          '#FF7A99',
          '#58B0F0',
          '#FFD96A',
          '#6AD6D6',
          '#B599FF',
        ],
      },
    ],
  };

  // Chart data for Bar
  const barData = {
    labels: Object.keys(budgetData.categories),
    datasets: [
      {
        label: 'Amount Spent',
        data: Object.values(budgetData.categories),
        backgroundColor: '#36A2EB',
        borderColor: '#1E88E5',
        borderWidth: 2,
        borderRadius: 5,
      },
    ],
  };

  return (
    <div className="expense-summary bg-light p-4 rounded shadow">
      <h2 className="text-center text-primary">Budget Overview</h2>

      {/* Charts Section */}
      <div className="d-flex flex-wrap justify-content-center">
        <div className="chart-container flex-grow-1 mx-3" style={{ maxWidth: '300px', minWidth: '200px' }}>
          <Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
        </div>

        <div className="chart-container flex-grow-1 mx-3" style={{ maxWidth: '300px', minWidth: '200px' }}>
          <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
};

export default BudgetOverview;