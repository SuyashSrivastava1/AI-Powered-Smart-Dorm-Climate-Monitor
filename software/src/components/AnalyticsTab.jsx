import React, { useState } from 'react';
import { 
  BarChart3, 
  Thermometer, 
  Droplets, 
  Wind, 
  Flame 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';

// Refined Soft Butter Yellow & Soft Blush Pink palette for traces
const BUTTER_PINK_PALETTE = ['#eab308', '#f472b6', '#a855f7', '#fb7185', '#38bdf8', '#34d399'];

export default function AnalyticsTab({ nodes, historyMap }) {
  const [activeMetric, setActiveMetric] = useState('temp');

  const maxHistoryLength = Math.max(...nodes.map((n) => (historyMap[n.id] || []).length), 0);
  
  const chartData = [];
  if (maxHistoryLength > 0) {
    const referenceNodeId = nodes[0]?.id;
    const refHistory = historyMap[referenceNodeId] || [];

    for (let i = 0; i < refHistory.length; i++) {
      const point = {
        timestamp: refHistory[i].timestamp || `T-${refHistory.length - i}`,
      };

      nodes.forEach((node) => {
        const nodeHist = historyMap[node.id] || [];
        if (nodeHist[i]) {
          point[node.id] = nodeHist[i][activeMetric];
        }
      });

      chartData.push(point);
    }
  }

  const metricInfo = {
    temp: { label: 'Temperature (°C)', unit: '°C', icon: Thermometer, color: '#eab308' },
    hum: { label: 'Air Moisture (%)', unit: '%', icon: Droplets, color: '#f472b6' },
    co2: { label: 'CO2 Concentration (ppm)', unit: 'ppm', icon: Wind, color: '#ca8a04' },
    heatIndex: { label: 'Perceived Comfort (°C)', unit: '°C', icon: Flame, color: '#fb7185' },
  };

  const currentMetricInfo = metricInfo[activeMetric];
  const Icon = currentMetricInfo.icon;

  const statsTable = nodes.map((node, idx) => {
    const hist = historyMap[node.id] || [];
    const values = hist.map((h) => h[activeMetric]).filter((v) => typeof v === 'number');
    const min = values.length ? Math.min(...values).toFixed(1) : '-';
    const max = values.length ? Math.max(...values).toFixed(1) : '-';
    const avg = values.length ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : '-';
    return {
      node,
      color: BUTTER_PINK_PALETTE[idx % BUTTER_PINK_PALETTE.length],
      min,
      max,
      avg,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header & Metric Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#9d4d6e]" />
            <span>Dorm Climate Analytics & Traces</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#fef9c3]/70 text-[#854d0e] border border-[#fef08a]">
              Historical Telemetry
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Compare temperature, humidity, and air freshness curves across all roommate bunks
          </p>
        </div>

        {/* Metric buttons */}
        <div className="flex items-center gap-1.5 bg-white border border-[#fce7f3] p-1.5 rounded-2xl shadow-2xs">
          {Object.entries(metricInfo).map(([key, info]) => {
            const BtnIcon = info.icon;
            const isSelected = activeMetric === key;
            return (
              <button
                key={key}
                onClick={() => setActiveMetric(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#fce7f3] text-[#831843] border border-[#fbcfe8] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-[#fffdf5]'
                }`}
              >
                <BtnIcon className="w-3.5 h-3.5" />
                <span>{key === 'temp' ? 'Temperature' : key === 'hum' ? 'Humidity' : key === 'co2' ? 'CO2' : 'Perceived'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="cutesy-card rounded-3xl p-5 shadow-2xs border border-[#fce7f3]">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#fce7f3]">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-[#9d4d6e]" />
            <h3 className="font-bold text-sm text-slate-900">
              Comparative {currentMetricInfo.label} Stream
            </h3>
          </div>
          <span className="text-[11px] text-[#9d4d6e] font-semibold bg-[#fdf2f8] px-2.5 py-0.5 rounded-full border border-[#fce7f3]">
            Last 25 Telemetry Samples
          </span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fef08a" opacity={0.35} />
              <XAxis 
                dataKey="timestamp" 
                stroke="#94a3b8" 
                fontSize={10} 
                tickLine={false} 
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={10} 
                tickLine={false}
                domain={['auto', 'auto']}
                unit={activeMetric === 'co2' ? '' : currentMetricInfo.unit}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  borderColor: '#fce7f3', 
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px -2px rgba(251, 207, 232, 0.2)',
                  fontSize: '12px',
                  color: '#1e293b',
                  fontWeight: '600'
                }} 
              />
              <Legend 
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} 
              />
              {nodes.map((node, index) => (
                <Line
                  key={node.id}
                  type="monotone"
                  dataKey={node.id}
                  name={node.name}
                  stroke={BUTTER_PINK_PALETTE[index % BUTTER_PINK_PALETTE.length]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Statistics Table */}
      <div className="cutesy-card rounded-3xl p-5 shadow-2xs border border-[#fce7f3]">
        <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#9d4d6e]" />
          <span>Sensor Distribution Statistics ({currentMetricInfo.label})</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf8f5] text-slate-700 border-b border-[#fce7f3] uppercase text-[10px] font-bold">
              <tr>
                <th className="py-2.5 px-3">Bunk Bed</th>
                <th className="py-2.5 px-3">Tier</th>
                <th className="py-2.5 px-3">Minimum</th>
                <th className="py-2.5 px-3">Maximum</th>
                <th className="py-2.5 px-3">Average</th>
                <th className="py-2.5 px-3">Spread</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#fce7f3]/60 text-slate-700 font-medium">
              {statsTable.map(({ node, color, min, max, avg }) => {
                const variance = (Number(max) - Number(min)).toFixed(1);
                return (
                  <tr key={node.id} className="hover:bg-[#fdf2f8]/30 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shadow-2xs" style={{ backgroundColor: color }}></span>
                      {node.name}
                    </td>
                    <td className="py-2.5 px-3 capitalize font-semibold">
                      {node.bunk === 'top' ? 'Top Bunk 🌷' : 'Bottom Bunk 🌼'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">{min} {currentMetricInfo.unit}</td>
                    <td className="py-2.5 px-3 text-rose-500 font-semibold">{max} {currentMetricInfo.unit}</td>
                    <td className="py-2.5 px-3 font-bold text-[#854d0e]">{avg} {currentMetricInfo.unit}</td>
                    <td className="py-2.5 px-3 text-slate-400">±{variance}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
