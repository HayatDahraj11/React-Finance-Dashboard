import React from 'react';
import '../../../../../src/styles/dashboard.css';
export const ExpenseSummary = () => {
  const expenses = {
    total: 1200,
    categories: {
      food: 300,
      entertainment: 150,
      bills: 400,
      transportation: 200,
      miscellaneous: 150,
    },
  };

  const calculatePercentage = (amount) => (amount / expenses.total) * 100;

  return (
    <div className="expense-summary bg-light p-4 rounded shadow">
      <h2 className="text-center text-primary">Expense Summary</h2>
      {Object.keys(expenses.categories).map((category) => (
        <div key={category} className="row align-items-center my-3">
          <div className="col-6 text-capitalize text-secondary">
            {category}
          </div>
          <div className="col-6">
            <div className="progress" style={{ height: '10px' }}>
              <div
                className="progress-bar bg-primary"
                style={{ width: `${calculatePercentage(expenses.categories[category])}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
      <div className="text-center mt-3 text-secondary">
        <strong>Total Expenses:</strong> ${expenses.total}
      </div>
    </div>
  );
}; export default ExpenseSummary
