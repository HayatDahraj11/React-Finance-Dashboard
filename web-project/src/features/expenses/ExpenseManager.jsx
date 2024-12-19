import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../src/contexts/AuthContext';
import Navbar from '../../../../src/pages/dashboard/Navbar';
import './alert';
import './ExpenseManager.css';

const ExpenseForm = ({ onAddExpense, categories }) => {
  const [expense, setExpense] = useState({
    title: '',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onAddExpense({
        ...expense,
        amount: parseFloat(expense.amount)
      });
      setExpense({
        title: '',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      {error && <Alert variant="destructive">{error}</Alert>}
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={expense.title}
          onChange={handleChange}
          placeholder="Enter expense title"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={expense.amount}
          onChange={handleChange}
          placeholder="Enter amount"
          min="0"
          step="0.01"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={expense.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={expense.description}
          onChange={handleChange}
          placeholder="Enter description"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          value={expense.date}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? 'Adding...' : 'Add Expense'}
      </button>
    </form>
  );
};

const ExpenseList = ({ expenses, onDeleteExpense, onUpdateExpense, categories }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEdit = (expense) => {
    setEditingId(expense._id);
    setEditForm(expense);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await onUpdateExpense(editingId, editForm);
      setEditingId(null);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="expense-list">
      {expenses.map(expense => (
        <div key={expense._id} className="expense-item">
          {editingId === expense._id ? (
            <form onSubmit={handleUpdate} className="edit-form">
              <input
                type="text"
                name="title"
                value={editForm.title}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="amount"
                value={editForm.amount}
                onChange={handleChange}
                required
              />
              <select
                name="category"
                value={editForm.category}
                onChange={handleChange}
                required
              >
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
            </form>
          ) : (
            <>
              <div className="expense-info">
                <h3>{expense.title}</h3>
                <p>{expense.description}</p>
                <span className="expense-category">
                  {categories.find(cat => cat._id === expense.category)?.name}
                </span>
              </div>
              <div className="expense-amount">
                ${expense.amount.toFixed(2)}
              </div>
              <div className="expense-actions">
                <button onClick={() => handleEdit(expense)} className="edit-btn">
                  Edit
                </button>
                <button onClick={() => onDeleteExpense(expense._id)} className="delete-btn">
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

const ExpenseFilters = ({ categories, onFilterChange }) => {
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="expense-filters">
      <div className="filter-group">
        <label>Category</label>
        <select name="category" value={filters.category} onChange={handleChange}>
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label>Date Range</label>
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleChange}
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleChange}
        />
      </div>
      <div className="filter-group">
        <label>Amount Range</label>
        <input
          type="number"
          name="minAmount"
          value={filters.minAmount}
          onChange={handleChange}
          placeholder="Min Amount"
        />
        <input
          type="number"
          name="maxAmount"
          value={filters.maxAmount}
          onChange={handleChange}
          placeholder="Max Amount"
        />
      </div>
    </div>
  );
};

const ExpenseManager = () => {
  const { token } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchExpenses = async (filters = {}) => {
    try {
      let url = 'http://localhost:5001/api/transactions?';
      
      if (filters.category) url += `category=${filters.category}&`;
      if (filters.startDate) url += `startDate=${filters.startDate}&`;
      if (filters.endDate) url += `endDate=${filters.endDate}&`;
      if (filters.minAmount) url += `minAmount=${filters.minAmount}&`;
      if (filters.maxAmount) url += `maxAmount=${filters.maxAmount}&`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch expenses');
      
      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      setError('Failed to load expenses');
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch categories');
      
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories');
      console.error(err);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchExpenses(), fetchCategories()]);
      } catch (err) {
        setError('Failed to initialize expense manager');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [token]);

  const handleAddExpense = async (expenseData) => {
    try {
      const response = await fetch('http://localhost:5001/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...expenseData,
          type: 'expense'
        })
      });

      if (!response.ok) throw new Error('Failed to add expense');

      const newExpense = await response.json();
      setExpenses(prev => [...prev, newExpense]);
    } catch (err) {
      throw new Error('Failed to add expense');
    }
  };

  const handleUpdateExpense = async (id, expenseData) => {
    try {
      const response = await fetch(`http://localhost:5001/api/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(expenseData)
      });

      if (!response.ok) throw new Error('Failed to update expense');

      const updatedExpense = await response.json();
      setExpenses(prev => 
        prev.map(expense => 
          expense._id === id ? updatedExpense : expense
        )
      );
    } catch (err) {
      throw new Error('Failed to update expense');
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete expense');

      setExpenses(prev => prev.filter(expense => expense._id !== id));
    } catch (err) {
      setError('Failed to delete expense');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Navbar />
      <div className="expense-manager-container">
        <header className="expense-header">
          <h1 className="title">Expense Management</h1>
          <p className="subtitle">Track, manage, and optimize your expenses effortlessly.</p>
        </header>

        <div className="expense-content">
          <div className="expense-form-section">
            <div className="form-wrapper">
              <h2 className="section-title">Add Expense</h2>
              <ExpenseForm 
                onAddExpense={handleAddExpense}
                categories={categories}
              />
            </div>
            <div className="filters-wrapper">
              <h2 className="section-title">Filter Expenses</h2>
              <ExpenseFilters 
                categories={categories}
                onFilterChange={fetchExpenses}
              />
            </div>
          </div>

          <div className="expense-list-section">
            <h2 className="section-title">Your Expenses</h2>
            <ExpenseList
              expenses={expenses}
              categories={categories}
              onDeleteExpense={handleDeleteExpense}
              onUpdateExpense={handleUpdateExpense}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpenseManager;