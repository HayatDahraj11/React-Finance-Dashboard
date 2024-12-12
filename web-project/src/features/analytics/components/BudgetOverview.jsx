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
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">Budget Overview</h2>

      {/* Total Budget and Spent Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Total Budget</span>
          <span className="font-semibold text-lg">${budgetData.totalBudget}</span>
        </div>

        <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden relative">
          <div
            className="bg-gradient-to-r from-green-400 to-green-600 h-full"
            style={{ width: `${(budgetData.spent / budgetData.totalBudget) * 100}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-600">Spent</span>
          <span className="font-semibold text-lg text-red-600">${budgetData.spent}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Remaining</span>
          <span className="font-semibold text-lg text-green-600">${budgetData.remaining}</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row">
        {/* Doughnut Chart */}
        <div className="col-12 col-md-6 mb-6">
          <div className="flex justify-center">
            <div style={{ width: '180px', height: '180px' }}>
              <Doughnut 
                data={doughnutData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        color: '#4A4A4A',
                      },
                    },
                  },
                }} 
              />
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="col-12 col-md-6 mb-6">
          <div className="flex justify-center">
            <div style={{ width: '280px', height: '180px' }}>
              <Bar 
                data={barData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                    y: {
                      ticks: {
                        stepSize: 50,
                      },
                      grid: {
                        color: '#E0E0E0',
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetOverview;
