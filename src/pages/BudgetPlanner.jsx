// src/pages/BudgetPlanner.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../src/contexts/AuthContext.jsx';
import Navbar from '../../src/pages/dashboard/Navbar.jsx';
import '../styles/BudgetPlanner.css';

const BudgetPlanner = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format
  const [categories, setCategories] = useState([
    { name: 'Food', budget: 0, id: null },
    { name: 'Entertainment', budget: 0, id: null },
    { name: 'Bills', budget: 0, id: null },
    { name: 'Transportation', budget: 0, id: null },
    { name: 'Savings', budget: 0, id: null },
    { name: 'Miscellaneous', budget: 0, id: null },
  ]);
  const [totalBudget, setTotalBudget] = useState(0);

  // Fetch categories and existing budget on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch('http://localhost:5001/api/categories', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          // Update categories with IDs from database
          setCategories(prevCategories => 
            prevCategories.map(cat => {
              const dbCategory = categoriesData.find(c => c.name === cat.name);
              return dbCategory ? { ...cat, id: dbCategory._id } : cat;
            })
          );
        }

        // Fetch existing budget for selected month
        const budgetResponse = await fetch(`http://localhost:5001/api/budget/${selectedMonth}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (budgetResponse.ok) {
          const budgetData = await budgetResponse.json();
          setTotalBudget(budgetData.totalBudget);
          
          // Update categories with existing budget allocations
          setCategories(prevCategories =>
            prevCategories.map(cat => {
              const budgetCategory = budgetData.categories.find(
                bc => bc.category._id === cat.id
              );
              return budgetCategory 
                ? { ...cat, budget: budgetCategory.amount }
                : cat;
            })
          );
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load budget data');
      }
    };

    if (token) {
      fetchData();
    }
  }, [token, selectedMonth]);

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

  const handleSaveBudget = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    // Validate total budget
    if (totalBudget <= 0) {
      setError('Total budget must be greater than 0');
      setLoading(false);
      return;
    }

    // Validate allocations
    if (calculateRemaining() < 0) {
      setError('Total allocations cannot exceed total budget');
      setLoading(false);
      return;
    }

    try {
      // Format categories for API
      const categoryAllocations = categories
        .filter(cat => cat.id && cat.budget > 0)
        .map(cat => ({
          category: cat.id,
          amount: cat.budget
        }));

      const budgetData = {
        month: `${selectedMonth}-01`, // Add day for full date
        totalBudget,
        categories: categoryAllocations
      };

      const response = await fetch('http://localhost:5001/api/budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(budgetData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save budget');
      }

      setSuccessMessage('Budget saved successfully!');
      
      // Optionally redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Save budget error:', error);
      setError(error.message || 'Failed to save budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="budget-planner-container">
        <div className="budget-header text-center">
          <h2 className="title">Budget Planner</h2>
          <p className="subtitle">Plan your budget effectively and track expenses seamlessly.</p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        <div className="budget-input-section">
          <div className="input-group month-selector">
            <label htmlFor="monthSelect" className="input-label">Select Month</label>
            <input
              type="month"
              id="monthSelect"
              className="input-field"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>

          <div className="input-group total-budget">
            <label htmlFor="totalBudget" className="input-label">Total Budget</label>
            <input
              type="number"
              id="totalBudget"
              className="input-field"
              placeholder="Enter total budget"
              value={totalBudget}
              onChange={(e) => handleTotalBudgetChange(e.target.value)}
              disabled={loading}
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
                      disabled={loading}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="remaining-budget-section">
          <h5 className="remaining-budget">
            Remaining Budget: {' '}
            <span className={`remaining-amount ${calculateRemaining() < 0 ? 'negative' : 'positive'}`}>
              ${calculateRemaining()}
            </span>
          </h5>
        </div>

        <div className="save-button-wrapper">
          <button 
            className="save-button"
            onClick={handleSaveBudget}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Budget'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanner;