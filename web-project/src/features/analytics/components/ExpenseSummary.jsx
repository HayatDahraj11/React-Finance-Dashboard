import React from 'react';
import '../../../../../src/styles/dashboard.css'
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
    <div className="expense-summary">
      <h2>Expense Summary</h2>
      <div>
        {Object.keys(expenses.categories).map((category) => (
          <div key={category} className="expense-item">
            <span className="category">{category}</span>
            <span className="amount">${expenses.categories[category]}</span>
            <div className="progress-bar">
              <div style={{ width: `${calculatePercentage(expenses.categories[category])}%` }}></div>
            </div>
          </div>
        ))}
      </div>
      <div className="total-expenses">
        <strong>Total Expenses:</strong> ${expenses.total}
      </div>
    </div>
  );
};
