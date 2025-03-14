import React, { useState } from 'react';

const Dashboard = () => {
  const [storeConnected, setStoreConnected] = useState(false);

  const handleConnectStore = () => {
    // Implement store connection logic here
    setStoreConnected(true);
  };

  const handleLogout = () => {
    // Implement logout logic here
    localStorage.removeItem('authToken');
    window.location.reload();
  };

  return (
    <div>
      {storeConnected ? (
        <div>
          <div>Welcome to your dashboard!</div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleConnectStore}>Connect Store</button>
      )}
    </div>
  );
};

export default Dashboard;
