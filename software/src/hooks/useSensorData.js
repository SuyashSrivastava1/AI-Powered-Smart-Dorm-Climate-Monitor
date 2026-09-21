import { useState, useEffect, useRef } from 'react';

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

export const useSensorData = (url, isTopBunk) => {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState(null);

  // Initialize with some fake history if simulating
  useEffect(() => {
    const initHistory = [];
    let current = generateMockData(null);
    for (let i = 0; i < 20; i++) {
      initHistory.unshift({ ...current, timestamp: new Date(Date.now() - i * 3000).toISOString() });
      current = generateMockData(current);
    }
    setHistory(initHistory);
    setData(initHistory[initHistory.length - 1]);
  }, []);

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
    // Fetch immediately on mount or url change
    fetchData();

    return () => clearInterval(interval);
  }, [url]);

  return { data, history, isSimulating, error };
};
