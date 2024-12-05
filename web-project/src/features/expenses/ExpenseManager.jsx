// src/pages/expenses/ExpenseManager.jsx
import React from 'react';
import { ExpenseForm, ExpenseList, ExpenseFilters } from '../../features/expenses/components';

const ExpenseManager = () => {
  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Expense Management</h1>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ExpenseList />
        </div>
        <div>
          <ExpenseForm />
          <ExpenseFilters />
        </div>
      </div>
    </div>
  );
};

export default ExpenseManager;