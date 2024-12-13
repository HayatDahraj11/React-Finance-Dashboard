// src/pages/expenses/ExpenseManager.jsx
import React from 'react';
import { ExpenseForm, ExpenseList, ExpenseFilters } from './ExpenseComponents.jsx';
import Navbar from '../../../../src/pages/dashboard/Navbar.jsx';
import './ExpenseManager.css';

const ExpenseManager = () => {
  return (
    <>
      <Navbar />
      <div className="expense-manager-container">
      <header className="expense-header">
        <h1 className="title">Expense Management</h1>
        <p className="subtitle">Track, manage, and optimize your expenses effortlessly.</p>
      </header>

      <div className="expense-content">
        <div className="expense-list-section">
          <h2 className="section-title">Your Expenses</h2>
          <ExpenseList />
        </div>
        <div className="expense-form-section">
          <div className="form-wrapper">
            <h2 className="section-title">Add Expense</h2>
            <ExpenseForm />
          </div>
          <div className="filters-wrapper">
            <h2 className="section-title">Filter Expenses</h2>
            <ExpenseFilters />
          </div>
        </div>
      </div>
    </div>
    </>
  );
};export default ExpenseManager;