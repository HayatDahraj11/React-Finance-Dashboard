// BudgetOverview.jsx
import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export const BudgetOverview = ({ data }) => {
  if (!data) {
    return <div className="text-center">Loading budget data...</div>;
  }

  const categories = Object.values(data.categories);
  const categoryNames = categories.map(cat => cat.name);
  const categoryAmounts = categories.map(cat => cat.amount);
  const categoryColors = categories.map(cat => cat.color);

  // Chart data for Doughnut
  const doughnutData = {
    labels: categoryNames,
    datasets: [
      {
        data: categoryAmounts,
        backgroundColor: categoryColors,
        hoverBackgroundColor: categoryColors.map(color => `${color}cc`),
      },
    ],
  };

  // Chart data for Bar
  const barData = {
    labels: categoryNames,
    datasets: [
      {
        label: 'Amount Spent',
        data: categoryAmounts,
        backgroundColor: categoryColors,
        borderColor: categoryColors,
        borderWidth: 2,
        borderRadius: 5,
      },
    ],
  };

  return (
    <div className="expense-summary bg-light p-4 rounded shadow">
      <h2 className="text-center text-primary">Budget Overview</h2>
      
      <div className="mb-4">
        <div className="d-flex justify-content-between">
          <span>Total Budget: ${data.totalBudget.toLocaleString()}</span>
          <span>Remaining: ${data.remaining.toLocaleString()}</span>
        </div>
        <div className="progress mt-2">
          <div 
            className="progress-bar" 
            style={{ width: `${(data.spent / data.totalBudget) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="d-flex flex-wrap justify-content-center">
        <div className="chart-container flex-grow-1 mx-3" style={{ maxWidth: '300px', minWidth: '200px' }}>
          <Doughnut 
            data={doughnutData} 
            options={{ 
              responsive: true, 
              plugins: { legend: { position: 'bottom' } } 
            }} 
          />
        </div>

        <div className="chart-container flex-grow-1 mx-3" style={{ maxWidth: '300px', minWidth: '200px' }}>
          <Bar 
            data={barData} 
            options={{ 
              responsive: true, 
              maintainAspectRatio: false 
            }} 
          />
        </div>
      </div>
    </div>
  );
};

export default BudgetOverview;
