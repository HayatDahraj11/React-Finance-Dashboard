// src/pages/dashboard/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

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
            <h1>Dashboard</h1>
            {dashboardData && (
                <div>
                    <p>Message: {dashboardData.msg}</p>
                    <p>User ID: {dashboardData.user?.id}</p>
                    <p>Access Time: {dashboardData.user?.accessTime}</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;