import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StoreConnectionSettings: React.FC = () => {
  const [dbConnectionStatus, setDbConnectionStatus] = useState<string>('');
  const [dbStatusMessage, setDbStatusMessage] = useState<string>('');

  useEffect(() => {
    // Fetch the database connection status from environment variables
    const status = process.env.NEXT_PUBLIC_DB_CONNECTION_STATUS || 'unknown';
    const message = process.env.NEXT_PUBLIC_DB_STATUS_MESSAGE || 'No status message';
    setDbConnectionStatus(status);
    setDbStatusMessage(message);
  }, []);

  const handleClearCache = async () => {
    try {
      await axios.post('/api/clear-cache');
      alert('Cache cleared successfully');
    } catch (error) {
      console.error('Failed to clear cache:', error);
      alert('Failed to clear cache');
    }
  };

  return (
    <div>
      <h1>Store Connection Settings</h1>
      <div className="connection-status">
        <p>Database Connection Status: {dbConnectionStatus}</p>
        <p>Status Message: {dbStatusMessage}</p>
      </div>
      <button onClick={handleClearCache}>Clear Cache</button>
      <form>
        {/* ...existing code... */}
      </form>
    </div>
  );
};

export default StoreConnectionSettings;