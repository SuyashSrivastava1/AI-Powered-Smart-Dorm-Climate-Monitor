import React from 'react';
import { LineChart, Line, YAxis, ResponsiveContainer } from 'recharts';
import { Thermometer, Droplets, Wind, AlertTriangle } from 'lucide-react';

export default function LiveSensorCard({ title, data, history, isSimulating, error }) {
  if (error && !isSimulating) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="text-red-500 w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-red-800">{title}</h3>
          <p className="text-sm text-red-600 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-4 animate-pulse border border-slate-100">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="h-16 bg-slate-100 rounded mb-2"></div>
      </div>
    );
  }

  const sparklineData = history.map((item, index) => ({
    name: index,
    temp: item.temp,
    hum: item.hum,
    co2: item.co2
  }));

  // Determine styles based on values (basic thresholding)
  const isHot = data.temp > 25;
  const isCold = data.temp < 21;
  const isStuffy = data.co2 > 800;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50">
        <h3 className="font-semibold text-slate-800">{title}</h3>
        {isSimulating && (
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
            Simulated
          </span>
        )}
      </div>

      <div className="p-4 grid grid-cols-3 gap-2">
        {/* Temperature */}
        <div className={`flex flex-col items-center justify-center p-3 rounded-xl transition-colors ${isHot ? 'bg-red-50 text-red-700' : isCold ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-700'}`}>
          <Thermometer className="w-5 h-5 mb-1 opacity-70" />
          <span className="text-2xl font-bold">{data.temp.toFixed(1)}°</span>
          <span className="text-xs font-medium opacity-70">Temp</span>
          
          <div className="w-full h-8 mt-2 opacity-50">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
                <Line type="monotone" dataKey="temp" stroke={isHot ? '#ef4444' : isCold ? '#3b82f6' : '#64748b'} strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Humidity */}
        <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 text-slate-700">
          <Droplets className="w-5 h-5 mb-1 text-blue-400 opacity-70" />
          <span className="text-2xl font-bold">{data.hum.toFixed(0)}%</span>
          <span className="text-xs font-medium opacity-70">Humidity</span>

          <div className="w-full h-8 mt-2 opacity-50">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
                <Line type="monotone" dataKey="hum" stroke="#60a5fa" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CO2 */}
        <div className={`flex flex-col items-center justify-center p-3 rounded-xl transition-colors ${isStuffy ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-700'}`}>
          <Wind className="w-5 h-5 mb-1 opacity-70" />
          <span className="text-2xl font-bold">{data.co2.toFixed(0)}</span>
          <span className="text-xs font-medium opacity-70">CO2 (ppm)</span>

          <div className="w-full h-8 mt-2 opacity-50">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <YAxis domain={['dataMin - 50', 'dataMax + 50']} hide />
                <Line type="monotone" dataKey="co2" stroke={isStuffy ? '#f59e0b' : '#64748b'} strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
