import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StoreConnectionSettings = () => {
  const [dbConnectionStatus, setDbConnectionStatus] = useState('');

  useEffect(() => {
    // Fetch the database connection status from environment variables
    const status = process.env.NEXT_PUBLIC_DB_CONNECTION_STATUS || 'unknown';
    setDbConnectionStatus(status);
  }, []);

  const handleClearCache = async () => {
    try {
      await axios.post('/api/clear-cache');
      alert('Cache cleared successfully');
    } catch (error) {
      alert('Failed to clear cache');
    }
  };

  return (
    <div>
      <h1>Store Connection Settings</h1>
      <div className="connection-status">
        <p>Database Connection Status: {dbConnectionStatus}</p>
      </div>
      <button onClick={handleClearCache}>Clear Cache</button>
      <form>
        {/* ...existing code... */}
      </form>
    </div>
  );
};

export default StoreConnectionSettings;