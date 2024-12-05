// src/pages/settings/Settings.jsx
import React from 'react';
import { NotificationSettings, ThemeSettings, ExportData } from '../../components/settings';

const Settings = () => {
  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
      </header>
      
      <div className="space-y-6">
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <NotificationSettings />
        </section>
        
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          <ThemeSettings />
        </section>
        
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Data Management</h2>
          <ExportData />
        </section>
      </div>
    </div>
  );
};

export default Settings;