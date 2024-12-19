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
  Title
} from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title
);

const SavingsProgress = ({ data }) => {
  if (!data || !data.current) {
    return <div className="text-center">Loading savings data...</div>;
  }

  // Line chart data
  const chartData = {
    labels: data.months,
    datasets: [
      {
        label: 'Savings Goal',
        data: data.progress.map(item => item.goal),
        borderColor: '#4299e1',
        backgroundColor: 'rgba(66, 153, 225, 0.2)',
        tension: 0.4,
        fill: false,
        pointRadius: 4,
        pointBackgroundColor: '#4299e1',
      },
      {
        label: 'Actual Savings',
        data: data.progress.map(item => item.actual),
        borderColor: '#48bb78',
        backgroundColor: 'rgba(72, 187, 120, 0.2)',
        tension: 0.4,
        fill: false,
        pointRadius: 4,
        pointBackgroundColor: '#48bb78',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Savings Progress Over Time'
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumSignificantDigits: 3
            }).format(value);
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  const calculateProgress = () => {
    if (data.current.goal === 0) return 0;
    return (data.current.current / data.current.goal) * 100;
  };

  return (
    <div className="expense-summary bg-light p-4 rounded shadow">
      <h2 className="text-center text-primary mb-4">Savings Progress</h2>

      <div className="mb-4">
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

        <div className="progress mt-3" style={{ height: '10px' }}>
          <div
            className="progress-bar bg-success"
            style={{
              width: `${calculateProgress()}%`,
              transition: 'width 0.5s ease-in-out'
            }}
          />
        </div>
      </div>

      <div style={{ height: '300px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SavingsProgress;