// src/features/expenses/components/ExpenseFilters.jsx
import React, { useState } from 'react';
import './ExpenseFilters.css';
import './ExpenseForm.css';
import './ExpenseList.css'


const ExpenseFilters = () => {
  const [filter, setFilter] = useState('');

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    console.log('Filter by:', e.target.value);
  };

  return (
    <div className="expense-filters">
      <h3 className="filters-title">Filter Expenses</h3>
      <select
        className="filter-select"
        value={filter}
        onChange={handleFilterChange}
      >
        <option value="">All Categories</option>
        <option value="Food">Food</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Transportation">Transportation</option>
        <option value="Bills">Bills</option>
        <option value="Miscellaneous">Miscellaneous</option>
      </select>
    </div>
  );
}; export {ExpenseFilters};


const ExpenseForm = () => {
  const [expense, setExpense] = useState({ title: '', amount: '', category: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New Expense:', expense);
    setExpense({ title: '', amount: '', category: '' });
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h3 className="form-title">Add New Expense</h3>
      <div className="form-group">
        <label htmlFor="title">Expense Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={expense.title}
          onChange={handleChange}
          placeholder="Enter expense name"
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
        />
      </div>
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={expense.category}
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Transportation">Transportation</option>
          <option value="Bills">Bills</option>
          <option value="Miscellaneous">Miscellaneous</option>
        </select>
      </div>
      <button type="submit" className="submit-btn">Add Expense</button>
    </form>
  );
};

export {ExpenseForm};

const ExpenseList = () => {
  const expenses = [
    { id: 1, title: 'Groceries', amount: 50, category: 'Food' },
    { id: 2, title: 'Movie Night', amount: 20, category: 'Entertainment' },
    { id: 3, title: 'Gas', amount: 40, category: 'Transportation' },
  ];

  return (
    <div className="expense-list">
      <h3 className="list-title">Expense History</h3>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id} className="expense-item">
            <span className="expense-title">{expense.title}</span>
            <span className="expense-category">{expense.category}</span>
            <span className="expense-amount">${expense.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export {ExpenseList};
