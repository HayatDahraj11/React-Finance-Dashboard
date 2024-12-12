import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../../contexts/AuthContext';
import { ExpenseSummary } from '../../../web-project/src/features/analytics/components/ExpenseSummary.jsx';
import '../../styles/dashboard.css';
import BudgetOverview from '../../../web-project/src/features/analytics/components/BudgetOverview.jsx';

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
            <nav className="navbar">
                <h1>WealthGuard Pro</h1>
                <ul>
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li><a href="/budget-planner">Budget Planner</a></li>
                    <li><a href="/expense-manager">Expense Manager</a></li>
                    <li><a href="/settings">Settings</a></li>
                </ul>
            </nav>

            <div className="dashboard-container">
                <header className="dashboard-header">
                    <h1>Financial Dashboard</h1>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ExpenseSummary />
                    <BudgetOverview />
                </div>

                {dashboardData && (
                    <div>
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
