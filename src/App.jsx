import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/dashboard/Dashboard';
import BudgetPlanner from '../src/pages/BudgetPlanner.jsx';
import ExpenseManager from '../web-project/src/features/expenses/ExpenseManager.jsx';
import Settings from '../web-project/src/pages/settings/Settings.jsx';

function App() {
  return (
    <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/budget-planner"
              element={
                <ProtectedRoute>
                  <BudgetPlanner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expense-manager"
              element={
                <ProtectedRoute>
                  <ExpenseManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Default route */}
            <Route path="/" element={<Navigate to="/dashboard" />} />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
    </AuthProvider>
  );
}

export default App;
