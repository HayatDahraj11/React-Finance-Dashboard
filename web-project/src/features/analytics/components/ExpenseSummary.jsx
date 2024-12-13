// ExpenseSummary.jsx
import React from 'react';

export const ExpenseSummary = ({ data }) => {
  if (!data) {
    return <div className="text-center">Loading expense data...</div>;
  }

  const calculatePercentage = (amount) => (amount / data.total) * 100;

  return (
    <div className="expense-summary bg-light p-4 rounded shadow">
      <h2 className="text-center text-primary">Expense Summary</h2>
      {Object.values(data.categories).map((category) => (
        <div key={category.name} className="row align-items-center my-3">
          <div className="col-6 text-capitalize text-secondary">
            {category.name}
          </div>
          <div className="col-6">
            <div className="progress" style={{ height: '10px' }}>
              <div
                className="progress-bar"
                style={{ 
                  width: `${calculatePercentage(category.amount)}%`,
                  backgroundColor: category.color 
                }}
              ></div>
            </div>
          </div>
        </div>
      ))}
      <div className="text-center mt-3 text-secondary">
        <strong>Total Expenses:</strong> ${data.total.toLocaleString()}
      </div>
    </div>
  );
};

export default ExpenseSummary;