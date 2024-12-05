// src/pages/dashboard/Dashboard.jsx
import React from 'react';
import { ExpenseSummary, BudgetOverview, SavingsProgress } from '../../features/analytics/components';

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Financial Dashboard</h1>
        <div className="flex space-x-4">
          {/* Quick action buttons */}
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ExpenseSummary />
        <BudgetOverview />
        <SavingsProgress />
      </div>
      
      {/* Other dashboard sections */}
    </div>
  );
};

export default Dashboard;