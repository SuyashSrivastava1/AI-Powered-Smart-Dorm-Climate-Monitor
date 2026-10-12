import { useState, useEffect } from 'react';

const generateMockData = (prev) => {
  const deltaTemp = (Math.random() - 0.5) * 0.5;
  const deltaHum = (Math.random() - 0.5) * 2;
  const deltaCO2 = (Math.random() - 0.5) * 20;

  return {
    temp: Math.max(22, Math.min(26, prev ? prev.temp + deltaTemp : 24)),
    hum: Math.max(50, Math.min(60, prev ? prev.hum + deltaHum : 55)),
    co2: Math.max(600, Math.min(1000, prev ? prev.co2 + deltaCO2 : 800)),
    timestamp: new Date().toISOString(),
  };
};

const createInitialHistory = () => {
  const initHistory = [];
  let current = generateMockData(null);
  for (let i = 0; i < 20; i++) {
    initHistory.unshift({ ...current, timestamp: new Date(Date.now() - i * 3000).toISOString() });
    current = generateMockData(current);
  }
  return initHistory;
};

export const useSensorData = (url, _isTopBunk) => {
  const [history, setHistory] = useState(() => createInitialHistory());
  const [data, setData] = useState(() => {
    const init = createInitialHistory();
    return init[init.length - 1];
  });
  const [isSimulating, setIsSimulating] = useState(!url);
  const [error, setError] = useState(null);

  useEffect(() => {
    let interval;
    
    const fetchData = async () => {
      if (!url) {
        setIsSimulating(true);
        setData(prevData => {
          const newData = generateMockData(prevData);
          setHistory(prevHistory => [...prevHistory.slice(-19), newData]);
          return newData;
        });
        return;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const json = await response.json();
        
        setIsSimulating(false);
        setError(null);
        
        const newData = {
          temp: json.temp,
          hum: json.hum,
          co2: json.co2,
          timestamp: new Date().toISOString(),
        };
        
        setData(newData);
        setHistory((prev) => [...prev.slice(-19), newData]);
      } catch (err) {
        console.warn(`Failed to fetch from ${url}, falling back to simulation.`, err);
        setIsSimulating(true);
        setError('Connection failed. Using simulated data.');
        setData(prevData => {
          const newData = generateMockData(prevData);
          setHistory(prevHistory => [...prevHistory.slice(-19), newData]);
          return newData;
        });
      }
    };

    interval = setInterval(fetchData, 3000);
    fetchData();

    return () => clearInterval(interval);
  }, [url]);

  return { data, history, isSimulating, error };
};
