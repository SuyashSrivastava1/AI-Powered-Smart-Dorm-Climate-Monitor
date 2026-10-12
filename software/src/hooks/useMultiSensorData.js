import { useState, useEffect } from 'react';
import { calculateHeatIndex } from '../utils/climateCalculations';

const SCENARIO_BASES = {
  normal: {
    top: { temp: 24.6, hum: 52, co2: 680 },
    bottom: { temp: 23.2, hum: 55, co2: 620 },
  },
  stuffy: {
    top: { temp: 26.4, hum: 68, co2: 1420 },
    bottom: { temp: 25.1, hum: 64, co2: 1280 },
  },
  heatwave: {
    top: { temp: 29.8, hum: 62, co2: 890 },
    bottom: { temp: 26.9, hum: 58, co2: 780 },
  },
  cold_draft: {
    top: { temp: 19.8, hum: 38, co2: 540 },
    bottom: { temp: 18.9, hum: 36, co2: 510 },
  },
};

function generateNodeData(prev, node, scenario = 'normal') {
  const isTop = node.bunk === 'top';
  const base = SCENARIO_BASES[scenario] ? (isTop ? SCENARIO_BASES[scenario].top : SCENARIO_BASES[scenario].bottom) : SCENARIO_BASES.normal.top;

  const targetTemp = base.temp + (Math.sin(Date.now() / 30000) * 0.4);
  const targetHum = base.hum + (Math.cos(Date.now() / 40000) * 1.5);
  const targetCo2 = base.co2 + (Math.sin(Date.now() / 20000) * 25);

  const prevTemp = prev?.temp ?? base.temp;
  const prevHum = prev?.hum ?? base.hum;
  const prevCo2 = prev?.co2 ?? base.co2;

  // Drift gradually toward target with small jitter
  const temp = Number((prevTemp + (targetTemp - prevTemp) * 0.2 + (Math.random() - 0.5) * 0.15).toFixed(1));
  const hum = Number((prevHum + (targetHum - prevHum) * 0.2 + (Math.random() - 0.5) * 0.8).toFixed(1));
  const co2 = Math.round(prevCo2 + (targetCo2 - prevCo2) * 0.2 + (Math.random() - 0.5) * 12);

  const heatIndex = Number(calculateHeatIndex(temp, hum).toFixed(1));

  return {
    temp,
    hum,
    co2,
    heatIndex,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
}

export function useMultiSensorData(nodes = [], activeScenario = 'normal') {
  // Map of nodeId -> current data
  const [nodeDataMap, setNodeDataMap] = useState(() => {
    const initial = {};
    nodes.forEach((n) => {
      initial[n.id] = generateNodeData(null, n, activeScenario);
    });
    return initial;
  });

  // Map of nodeId -> history array (last 25 points)
  const [historyMap, setHistoryMap] = useState(() => {
    const initial = {};
    nodes.forEach((n) => {
      const hist = [];
      let cur = generateNodeData(null, n, activeScenario);
      for (let i = 20; i >= 0; i--) {
        const time = new Date(Date.now() - i * 3000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        cur = generateNodeData(cur, n, activeScenario);
        hist.push({ ...cur, timestamp: time });
      }
      initial[n.id] = hist;
    });
    return initial;
  });

  const [statusMap, setStatusMap] = useState({});
  const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    let isMounted = true;

    const pollAllNodes = async () => {
      const updatedData = {};
      const updatedStatus = {};

      await Promise.all(
        nodes.map(async (node) => {
          // If valid IP specified, attempt HTTP fetch from ESP32 node
          if (node.ip && node.ip.trim().length > 0) {
            try {
              let url = node.ip.trim();
              if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = `http://${url}`;
              }
              if (!url.endsWith('/data')) {
                url = `${url.replace(/\/$/, '')}/data`;
              }

              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 2200);

              const res = await fetch(url, { signal: controller.signal });
              clearTimeout(timeoutId);

              if (res.ok) {
                const json = await res.json();
                const temp = Number(Number(json.temp).toFixed(1));
                const hum = Number(Number(json.hum).toFixed(1));
                const co2 = Math.round(Number(json.co2));
                const heatIndex = Number(calculateHeatIndex(temp, hum).toFixed(1));

                updatedData[node.id] = {
                  temp,
                  hum,
                  co2,
                  heatIndex,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                };
                updatedStatus[node.id] = { isSimulated: false, online: true, error: null };
                return;
              }
            } catch {
              // Fallback to simulation gracefully
              updatedStatus[node.id] = { 
                isSimulated: true, 
                online: false, 
                error: 'Hardware unreachable. Live simulator active.' 
              };
            }
          } else {
            updatedStatus[node.id] = { isSimulated: true, online: true, error: null };
          }
        })
      );

      if (!isMounted) return;

      setStatusMap(updatedStatus);
      setLastSync(new Date().toLocaleTimeString());

      setNodeDataMap((prev) => {
        const next = { ...prev };
        nodes.forEach((node) => {
          if (updatedData[node.id]) {
            next[node.id] = updatedData[node.id];
          } else {
            // Simulation path using prev
            next[node.id] = generateNodeData(prev[node.id], node, activeScenario);
          }
        });

        // Also update history using these next values
        setHistoryMap((prevHist) => {
          const nextHist = { ...prevHist };
          nodes.forEach((node) => {
            const currentPoint = next[node.id];
            if (currentPoint) {
              const list = nextHist[node.id] ? [...nextHist[node.id]] : [];
              list.push(currentPoint);
              nextHist[node.id] = list.slice(-25);
            }
          });
          return nextHist;
        });

        return next;
      });
    };

    const intervalId = setInterval(pollAllNodes, 3000);
    pollAllNodes();

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [nodes, activeScenario]);

  // Aggregate room averages
  const activeDataValues = nodes.map((n) => nodeDataMap[n.id]).filter(Boolean);
  const count = activeDataValues.length || 1;

  const avgTemp = Number((activeDataValues.reduce((acc, d) => acc + d.temp, 0) / count).toFixed(1));
  const avgHum = Number((activeDataValues.reduce((acc, d) => acc + d.hum, 0) / count).toFixed(1));
  const avgCo2 = Math.round(activeDataValues.reduce((acc, d) => acc + d.co2, 0) / count);
  const avgHeatIndex = Number(calculateHeatIndex(avgTemp, avgHum).toFixed(1));

  // Stratification metrics (Top Bunk vs Bottom Bunk delta)
  const topNodes = nodes.filter((n) => n.bunk === 'top').map((n) => nodeDataMap[n.id]).filter(Boolean);
  const bottomNodes = nodes.filter((n) => n.bunk === 'bottom').map((n) => nodeDataMap[n.id]).filter(Boolean);

  const topAvgTemp = topNodes.length ? Number((topNodes.reduce((acc, d) => acc + d.temp, 0) / topNodes.length).toFixed(1)) : avgTemp;
  const bottomAvgTemp = bottomNodes.length ? Number((bottomNodes.reduce((acc, d) => acc + d.temp, 0) / bottomNodes.length).toFixed(1)) : avgTemp;
  const tempStratificationDelta = Number((topAvgTemp - bottomAvgTemp).toFixed(1));

  const topAvgCo2 = topNodes.length ? Math.round(topNodes.reduce((acc, d) => acc + d.co2, 0) / topNodes.length) : avgCo2;
  const bottomAvgCo2 = bottomNodes.length ? Math.round(bottomNodes.reduce((acc, d) => acc + d.co2, 0) / bottomNodes.length) : avgCo2;
  const co2StratificationDelta = topAvgCo2 - bottomAvgCo2;

  const onlineHardwareCount = Object.values(statusMap).filter((s) => !s.isSimulated && s.online).length;

  return {
    nodeDataMap,
    historyMap,
    statusMap,
    lastSync,
    roomSummary: {
      avgTemp,
      avgHum,
      avgCo2,
      avgHeatIndex,
      topAvgTemp,
      bottomAvgTemp,
      tempStratificationDelta,
      topAvgCo2,
      bottomAvgCo2,
      co2StratificationDelta,
      nodeCount: nodes.length,
      onlineHardwareCount,
    },
  };
}
