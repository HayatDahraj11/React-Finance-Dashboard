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

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      }
    };

    fetchDashboard();
  }, [token]);

  return (
    <div>
      <Navbar /> {/* Include Navbar */}
      <div className="dashboard-container container my-5">
        <header className="dashboard-header text-center mb-4">
          <h1>Financial Dashboard</h1>
        </header>
        <div className="row g-4">
          <div className="col-12 col-lg-4"><ExpenseSummary /></div>
          <div className="col-12 col-lg-4"><BudgetOverview /></div>
          <div className="col-12 col-lg-4"><SavingsProgress /></div>
        </div>
        {dashboardData && (
          <div className="mt-4 text-center">
            <p>Message: {dashboardData.msg}</p>
            <p>User ID: {dashboardData.user?.id}</p>
            <p>Access Time: {dashboardData.user?.accessTime}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
