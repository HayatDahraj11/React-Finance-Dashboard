// src/pages/budget/BudgetPlanner.jsx
import React from 'react';
import { BudgetForm, CategoryAllocation, BudgetAnalytics } from '../../features/budget/components';

const BudgetPlanner = () => {
  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Budget Planning</h1>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CategoryAllocation />
          <BudgetAnalytics />
        </div>
        <div>
          <BudgetForm />
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanner;