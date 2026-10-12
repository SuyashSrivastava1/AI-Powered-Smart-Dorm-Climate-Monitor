import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, YAxis } from 'recharts';
import { getAirQualityStatus, getComfortStatus } from '../utils/climateCalculations';

export default function SensorNodeCard({ node, data, history = [], status }) {
  if (!data) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-5 animate-pulse shadow-xs">
        <div className="h-5 bg-slate-100 rounded w-1/3 mb-4"></div>
        <div className="h-16 bg-slate-50 rounded mb-3"></div>
        <div className="h-12 bg-slate-50/50 rounded"></div>
      </div>
    );
  }

  const airStatus = getAirQualityStatus(data.co2);
  const comfortStatus = getComfortStatus(data.temp);
  const isTopBunk = node.bunk === 'top';

  const sparklineData = history.map((item, index) => ({
    index,
    temp: item.temp,
    co2: item.co2,
  }));

  return (
    <div className="cutesy-card cutesy-card-hover rounded-3xl p-5 shadow-2xs flex flex-col justify-between">
      {/* Node Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-2xl border flex items-center justify-center text-base font-bold shadow-2xs ${
              isTopBunk 
                ? 'bg-[#fdf2f8] border-[#fce7f3] text-[#9d4d6e]' 
                : 'bg-[#fefce8] border-[#fef08a] text-[#854d0e]'
            }`}>
              {isTopBunk ? '🌷' : '🌼'}
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                {node.name}
              </h3>
              <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                <span className={isTopBunk ? 'text-[#9d4d6e] font-semibold' : 'text-[#854d0e] font-semibold'}>
                  <span>{isTopBunk ? 'Top Bunk' : 'Bottom Bunk'}</span>
                </span>
                <span className="text-slate-300">•</span>
                <span>{node.ip ? node.ip : 'Simulated Node'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border ${
              status?.isSimulated
                ? 'bg-[#fef9c3]/70 text-[#854d0e] border-[#fef08a]'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              {status?.isSimulated ? 'Simulated' : 'ESP32 Active'}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {data.timestamp || 'Live'}
            </span>
          </div>
        </div>

        {/* 3 Metric Cards in Soft Butter & Soft Blush */}
        <div className="grid grid-cols-3 gap-2.5 my-3">
          {/* Temperature in Soft Blush Pink */}
          <div className="bg-[#fdf2f8]/60 border border-[#fce7f3] rounded-2xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-medium">Temp</span>
              <Thermometer className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="my-1">
              <div className="text-xl font-bold text-slate-900 tracking-tight">
                {data.temp.toFixed(1)}°
              </div>
              <div className="text-[10px] text-[#9d4d6e] font-semibold">
                Feels {data.heatIndex}°
              </div>
            </div>
            <div className={`mt-1 text-[10px] px-1.5 py-0.5 rounded-full font-semibold text-center ${
              comfortStatus.color === 'emerald' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
              'bg-[#fdf2f8] text-[#9d4d6e] border border-[#fce7f3]'
            }`}>
              {comfortStatus.label}
            </div>
          </div>

          {/* Humidity in Soft Butter Yellow */}
          <div className="bg-[#fefce8]/60 border border-[#fef08a] rounded-2xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-medium">Humidity</span>
              <Droplets className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="my-1">
              <div className="text-xl font-bold text-slate-900 tracking-tight">
                {data.hum.toFixed(0)}%
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                45-55%
              </div>
            </div>
            <div className="mt-1 text-[10px] px-1.5 py-0.5 rounded-full bg-[#fef9c3]/70 text-[#854d0e] border border-[#fef08a] text-center font-semibold">
              {data.hum >= 40 && data.hum <= 60 ? 'Optimal' : data.hum > 60 ? 'Humid' : 'Dry'}
            </div>
          </div>

          {/* CO2 Air Quality in Soft Cream */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-medium">CO2</span>
              <Wind className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="my-1">
              <div className="text-xl font-bold text-slate-900 tracking-tight">
                {data.co2}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                ppm
              </div>
            </div>
            <div className={`mt-1 text-[10px] px-1.5 py-0.5 rounded-full font-semibold text-center ${
              airStatus.color === 'emerald' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
              airStatus.color === 'blue' ? 'bg-[#fdf2f8] text-[#9d4d6e] border border-[#fce7f3]' :
              airStatus.color === 'amber' ? 'bg-[#fef9c3] text-[#854d0e] border border-[#fef08a]' :
              'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {airStatus.label}
            </div>
          </div>
        </div>
      </div>

      {/* Mini Trend Sparkline */}
      <div className="mt-2 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1 font-medium">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Temperature Trace</span>
          </span>
          <span className="text-slate-800 font-bold">{data.temp.toFixed(1)}°C</span>
        </div>
        <div className="h-10 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
              <Line 
                type="monotone" 
                dataKey="temp" 
                stroke={isTopBunk ? '#f472b6' : '#eab308'} 
                strokeWidth={2} 
                dot={false} 
                isAnimationActive={false} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
