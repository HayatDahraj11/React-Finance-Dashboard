// src/layouts/ProtectedLayout.jsx
import { Outlet } from 'react-router-dom';

const ProtectedLayout = () => {
  return <Outlet />;
};

export default ProtectedLayout;