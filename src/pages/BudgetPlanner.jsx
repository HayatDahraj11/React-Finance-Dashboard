import React, { useState } from 'react';
import Navbar from '../../src/pages/dashboard/Navbar.jsx';
import '../styles/BudgetPlanner.css'


const BudgetPlanner = () => {
  const [categories, setCategories] = useState([
    { name: 'Food', budget: 0 },
    { name: 'Entertainment', budget: 0 },
    { name: 'Bills', budget: 0 },
    { name: 'Transportation', budget: 0 },
    { name: 'Savings', budget: 0 },
    { name: 'Miscellaneous', budget: 0 },
  ]);
  const [totalBudget, setTotalBudget] = useState(0);

  const handleBudgetChange = (index, value) => {
    const updatedCategories = [...categories];
    updatedCategories[index].budget = parseInt(value) || 0;
    setCategories(updatedCategories);
  };

  const handleTotalBudgetChange = (value) => {
    setTotalBudget(parseInt(value) || 0);
  };

  const calculateRemaining = () => {
    const totalAllocated = categories.reduce((acc, category) => acc + category.budget, 0);
    return totalBudget - totalAllocated;
  };

  return (
    <div>
        <Navbar />
    <div className="budget-planner-container">
      <div className="budget-header text-center">
        <h2 className="title">Budget Planner</h2>
        <p className="subtitle">Plan your budget effectively and track expenses seamlessly.</p>
      </div>

      <div className="budget-input-section">
        <div className="input-group total-budget">
          <label htmlFor="totalBudget" className="input-label">Total Budget</label>
          <input
            type="number"
            id="totalBudget"
            className="input-field"
            placeholder="Enter total budget"
            value={totalBudget}
            onChange={(e) => handleTotalBudgetChange(e.target.value)}
          />
        </div>
      </div>

      <div className="budget-table-wrapper">
        <table className="budget-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Allocated Budget</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={index} className="budget-row">
                <td className="category-name">{category.name}</td>
                <td>
                  <input
                    type="number"
                    className="input-budget"
                    placeholder="Enter amount"
                    value={category.budget}
                    onChange={(e) => handleBudgetChange(index, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="remaining-budget-section">
        <h5 className="remaining-budget">
          Remaining Budget: <span className={`remaining-amount ${calculateRemaining() < 0 ? 'negative' : 'positive'}`}>
            ${calculateRemaining()}
          </span>
        </h5>
      </div>

      <div className="save-button-wrapper">
        <button className="save-button">Save Budget</button>
      </div>
    </div>
    </div>
  );
};

export default BudgetPlanner;
