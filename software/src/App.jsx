import React, { useState } from 'react';
import ConfigurationScreen from './components/ConfigurationScreen';
import Dashboard from './components/Dashboard';

function App() {
  const [config, setConfig] = useState(null);

  if (!config) {
    return (
      <ConfigurationScreen
        initialConfig={config}
        onLaunch={(newConfig) => setConfig(newConfig)}
      />
    );
  }

  return (
    <Dashboard
      config={config}
      onReset={() => setConfig(null)}
      onUpdateConfig={(updated) => setConfig(updated)}
    />
  );
}

export default App;
