// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../../contexts/AuthContext';
import { ExpenseSummary } from '../../../web-project/src/features/analytics/components/ExpenseSummary.jsx';
import '../../styles/dashboard.css';
import BudgetOverview from '../../../web-project/src/features/analytics/components/BudgetOverview.jsx';
import SavingsProgress from '../../../web-project/src/features/analytics/components/SavingsProgress.jsx';
import Navbar from './Navbar.jsx';

const Dashboard = () => {
  const { token } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-5 text-danger">Error: {error}</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="dashboard-container container my-5">
        <header className="dashboard-header text-center mb-4">
          <h1>Financial Dashboard</h1>
        </header>
        <div className="row g-4">
          <div className="col-12 col-lg-4">
            <ExpenseSummary data={dashboardData?.expenseSummary} />
          </div>
          <div className="col-12 col-lg-4">
            <BudgetOverview data={dashboardData?.budgetOverview} />
          </div>
          <div className="col-12 col-lg-4">
            <SavingsProgress data={dashboardData?.savingsData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;