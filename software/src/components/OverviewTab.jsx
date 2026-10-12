import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Sparkles, 
  MapPin 
} from 'lucide-react';
import SensorNodeCard from './SensorNodeCard';
import MicroclimateStratificationCard from './MicroclimateStratificationCard';
import { getAirQualityStatus, getComfortStatus } from '../utils/climateCalculations';

export default function OverviewTab({ 
  nodes, 
  nodeDataMap, 
  historyMap, 
  statusMap, 
  roomSummary, 
  onNavigateTab 
}) {
  const airStatus = getAirQualityStatus(roomSummary.avgCo2);
  const comfortStatus = getComfortStatus(roomSummary.avgTemp);

  return (
    <div className="space-y-6">
      {/* 4 Elegant KPI Summary Cards in Balanced Soft Butter Yellow & Soft Blush Pink */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: Average Temp in Soft Butter Yellow */}
        <div className="cutesy-card bg-gradient-to-b from-[#fefce8]/80 to-white border border-[#fef08a] rounded-3xl p-4 sm:p-5 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-600 mb-2 font-semibold">
            <span className="text-xs">Room Temperature</span>
            <Thermometer className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {roomSummary.avgTemp}°C
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
              comfortStatus.color === 'emerald' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
              'bg-[#fef9c3] text-[#854d0e] border border-[#fef08a]'
            }`}>
              {comfortStatus.label === 'Optimal' ? 'Comfortable' : comfortStatus.label}
            </span>
            <span className="text-slate-500 font-medium text-[11px]">{roomSummary.nodeCount} Bunks</span>
          </div>
        </div>

        {/* KPI 2: Average Humidity in Soft Blush Pink */}
        <div className="cutesy-card bg-gradient-to-b from-[#fdf2f8]/80 to-white border border-[#fce7f3] rounded-3xl p-4 sm:p-5 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-600 mb-2 font-semibold">
            <span className="text-xs">Relative Humidity</span>
            <Droplets className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {roomSummary.avgHum}%
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-[#fdf2f8] text-[#9d4d6e] border border-[#fce7f3]">
              Balanced Moisture
            </span>
            <span className="text-slate-400 font-medium text-[11px]">DHT22</span>
          </div>
        </div>

        {/* KPI 3: Air Quality / CO2 in Delicate Butter Yellow */}
        <div className="cutesy-card bg-gradient-to-b from-[#fffdf5] to-white border border-[#fef08a]/80 rounded-3xl p-4 sm:p-5 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-600 mb-2 font-semibold">
            <span className="text-xs">CO2 Freshness</span>
            <Wind className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {roomSummary.avgCo2} <span className="text-xs font-normal text-slate-500">ppm</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
              airStatus.color === 'emerald' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
              airStatus.color === 'blue' ? 'bg-[#fdf2f8] text-[#9d4d6e] border border-[#fce7f3]' :
              airStatus.color === 'amber' ? 'bg-[#fef9c3] text-[#854d0e] border border-[#fef08a]' :
              'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {airStatus.label === 'Excellent' ? 'Fresh Air' : airStatus.label}
            </span>
            <span className="text-slate-400 font-medium text-[11px]">MQ-135</span>
          </div>
        </div>

        {/* KPI 4: Perceived Comfort in Soft Blush Pink */}
        <div className="cutesy-card bg-gradient-to-b from-[#fdf2f8]/60 to-white border border-[#fce7f3] rounded-3xl p-4 sm:p-5 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-600 mb-2 font-semibold">
            <span className="text-xs">Heat Index</span>
            <Sparkles className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {roomSummary.avgHeatIndex}°C
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-[#9d4d6e] font-bold text-[11px]">Perceived Comfort</span>
            <span className="text-slate-400 text-[11px] font-medium">Equalized</span>
          </div>
        </div>
      </div>

      {/* Microclimate Stratification Card */}
      <MicroclimateStratificationCard roomSummary={roomSummary} />

      {/* Sensor Node Matrix Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Bunk Microclimate Matrix
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Live environmental readings from your distributed bunk bed sensor network
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('roomMap')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white hover:bg-[#fffdf5] text-slate-700 text-xs font-semibold transition-all cursor-pointer border border-[#fef08a] shadow-2xs"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-500" />
            <span>2D Dorm Map</span>
          </button>
          <button
            onClick={() => onNavigateTab('mediator')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#fce7f3] hover:bg-[#fbcfe8] text-[#831843] border border-[#f9a8d4]/60 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Mediator</span>
          </button>
        </div>
      </div>

      {/* Grid of Sensor Node Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {nodes.map((node) => (
          <SensorNodeCard
            key={node.id}
            node={node}
            data={nodeDataMap[node.id]}
            history={historyMap[node.id]}
            status={statusMap[node.id]}
          />
        ))}
      </div>
    </div>
  );
}
