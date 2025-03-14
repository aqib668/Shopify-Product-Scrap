import React, { useState } from 'react';

const Dashboard = () => {
  const [storeConnected, setStoreConnected] = useState(false);

  const handleConnectStore = () => {
    // Implement store connection logic here
    setStoreConnected(true);
  };

  return (
    <div>
      {storeConnected ? (
        <div>Welcome to your dashboard!</div>
      ) : (
        <button onClick={handleConnectStore}>Connect Store</button>
      )}
    </div>
  );
};

export default Dashboard;
