import React, { useState } from 'react';
import ConfigurationScreen from './components/ConfigurationScreen';
import Dashboard from './components/Dashboard';

function App() {
  const [config, setConfig] = useState(null);

  if (!config) {
    return <ConfigurationScreen onLaunch={setConfig} />;
  }

  return <Dashboard config={config} onReset={() => setConfig(null)} />;
}

export default App;
