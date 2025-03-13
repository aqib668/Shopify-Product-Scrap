import React from 'react';

const Settings = () => {
  const dbStatus = process.env.NEXT_PUBLIC_DB_CONNECTION_STATUS;

  return (
    <div>
      <div style={{ backgroundColor: 'lightgreen', padding: '10px', textAlign: 'center' }}>
        {dbStatus}
      </div>
      <h1>Store Connection Settings</h1>
    </div>
  );
};

export default Settings;