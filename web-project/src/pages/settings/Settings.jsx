import React, { useState } from 'react';
import './settings.css';
import Navbar from '../../../../src/pages/dashboard/Navbar';

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [theme, setTheme] = useState('light');
  const [exportStatus, setExportStatus] = useState('');

  // Toggle Notifications
  const handleNotificationToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  // Change Theme
  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
    document.documentElement.setAttribute('data-theme', selectedTheme);
  };

  // Export Data
  const handleExportData = () => {
    setExportStatus('Exporting data...');
    setTimeout(() => {
      setExportStatus('Data exported successfully!');
    }, 2000);
  };

  return (
    <>
    <Navbar />
    <div className="settings-container">
      <header className="settings-header">
        <h1>Settings</h1>
      </header>

      <div className="settings-section">
        <section className="settings-card">
          <h2>Notifications</h2>
          <div className="settings-toggle">
            <span>Enable Notifications</span>
            <button
              onClick={handleNotificationToggle}
              className={`toggle-button ${notificationsEnabled ? 'enabled' : 'disabled'}`}
            >
              {notificationsEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </section>

        <section className="settings-card">
          <h2>Appearance</h2>
          <div className="settings-theme-options">
            <button
              className={`theme-button ${theme === 'light' ? 'active' : ''}`}
              onClick={() => handleThemeChange('light')}
            >
              Light Theme
            </button>
            <button
              className={`theme-button ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => handleThemeChange('dark')}
            >
              Dark Theme
            </button>
          </div>
        </section>

        <section className="settings-card">
          <h2>Data Management</h2>
          <div className="settings-data-management">
            <button className="export-button" onClick={handleExportData}>
              Export Data
            </button>
            {exportStatus && <p className="export-status">{exportStatus}</p>}
          </div>
        </section>
      </div>
    </div>
    </>
  );
};

export default Settings;
