import React, { useState } from 'react';
import { 
  Sparkles, 
  Thermometer, 
  Droplets, 
  Wind, 
  Settings, 
  Palette 
} from 'lucide-react';
import { getAirQualityStatus, getComfortStatus } from '../utils/climateCalculations';
import { THEMES } from '../utils/themeConfig';

export default function Header({ 
  roomSummary, 
  lastSync, 
  activeScenario, 
  onOpenScenarios, 
  onResetConfig,
  currentTheme,
  onSelectTheme
}) {
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const airStatus = getAirQualityStatus(roomSummary.avgCo2);
  const comfortStatus = getComfortStatus(roomSummary.avgTemp);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#fce7f3] px-4 lg:px-6 py-3 shadow-2xs transition-colors duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Title and Main Catchy Caption */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Main Bow Emblem (bow used just once) */}
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#fef9c3] to-[#fce7f3] border border-[#fbcfe8] text-2xl shadow-2xs">
              🎀
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base tracking-tight text-slate-900 flex items-center gap-1.5 font-sans">
                  DORM CLIMATE <span className="text-[#9d4d6e] text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#fdf2f8] border border-[#fce7f3]">No more AC arguments 🪩</span>
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#fef9c3]/70 text-[#854d0e] border border-[#fef08a] hidden sm:inline">
                  Balanced Comfort
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-2 mt-0.5">
                <span className="text-slate-600">{roomSummary.nodeCount} Bunk Sensor Nodes</span>
                <span>•</span>
                <span className="text-slate-500">
                  {roomSummary.onlineHardwareCount > 0 
                    ? `${roomSummary.onlineHardwareCount} Hardware / ${roomSummary.nodeCount - roomSummary.onlineHardwareCount} Sim` 
                    : 'Simulation Mesh'}
                </span>
              </p>
            </div>
          </div>

          {/* Mobile buttons */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 transition-colors"
              title="Theme Switcher"
            >
              <Palette className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenScenarios}
              className="p-2 rounded-xl bg-[#fdf2f8] border border-[#fce7f3] text-[#9d4d6e] transition-colors"
              title="Scenarios"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={onResetConfig}
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 transition-colors"
              title="Configure"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Environmental Telemetry & Controls */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Average Temp Pill in Soft Butter Yellow */}
          <div className="flex items-center gap-2 bg-[#fef9c3]/50 border border-[#fef08a] rounded-2xl px-3.5 py-1.5 shadow-2xs">
            <Thermometer className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-slate-600 font-medium">Room Temp:</span>
            <span className="font-bold text-slate-900">{roomSummary.avgTemp}°C</span>
            <span className="text-[10px] px-2 py-0.2 rounded-full font-semibold bg-white text-slate-700 border border-[#fef08a]">
              {comfortStatus.label}
            </span>
          </div>

          {/* Average Humidity Pill in Soft Ballet Pink */}
          <div className="flex items-center gap-2 bg-[#fdf2f8] border border-[#fce7f3] rounded-2xl px-3.5 py-1.5 shadow-2xs">
            <Droplets className="w-3.5 h-3.5 text-pink-500" />
            <span className="text-slate-600 font-medium">Humidity:</span>
            <span className="font-bold text-slate-900">{roomSummary.avgHum}%</span>
          </div>

          {/* Air Quality Pill */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-1.5 shadow-2xs">
            <Wind className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-slate-600 font-medium">Air Quality:</span>
            <span className="font-bold text-slate-900">{roomSummary.avgCo2} ppm</span>
            <span className={`text-[10px] px-2 py-0.2 rounded-full font-semibold ${
              airStatus.color === 'emerald' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
              airStatus.color === 'blue' ? 'bg-[#fdf2f8] text-[#9d4d6e] border border-[#fce7f3]' :
              airStatus.color === 'amber' ? 'bg-[#fef9c3] text-[#854d0e] border border-[#fef08a]' :
              'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {airStatus.label}
            </span>
          </div>

          {/* Scenario Trigger Pill */}
          <button
            onClick={onOpenScenarios}
            className="hidden sm:flex items-center gap-1.5 bg-[#fefce8] hover:bg-[#fef9c3]/70 border border-[#fef08a] text-slate-800 rounded-2xl px-3 py-1.5 transition-all cursor-pointer font-semibold shadow-2xs"
            title="Click to trigger demo situations"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[11px] capitalize">Mode: {activeScenario.replace('_', ' ')}</span>
          </button>

          {/* Theme & Palette Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="flex items-center gap-1.5 bg-white hover:bg-[#faf8f5] border border-slate-200 text-slate-800 rounded-2xl px-3 py-1.5 transition-all cursor-pointer font-semibold text-xs shadow-2xs"
              title="Change Color Palette"
            >
              <span>{currentTheme.emoji}</span>
              <span className="hidden md:inline">{currentTheme.name}</span>
              <Palette className="w-3.5 h-3.5 text-slate-500 ml-0.5" />
            </button>

            {isThemeMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-[#fce7f3] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="text-[11px] font-bold text-slate-500 px-2 py-1 uppercase tracking-wider mb-1">
                  Color Themes
                </div>
                {Object.values(THEMES).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSelectTheme(t.id);
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      currentTheme.id === t.id
                        ? 'bg-[#fdf2f8] text-[#831843] border border-[#fce7f3] shadow-2xs'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-[#faf8f5]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{t.emoji}</span>
                      <span>{t.name}</span>
                    </span>
                    <span className="w-3.5 h-3.5 rounded-full border border-slate-200" style={{ backgroundColor: t.accentColor }}></span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sync Time Pill */}
          <div className="hidden xl:flex items-center gap-1.5 text-slate-500 text-[11px] font-medium bg-white px-3 py-1.5 rounded-2xl border border-slate-200 shadow-2xs">
            <span>Sync {lastSync}</span>
          </div>

          {/* Desktop Setup Button */}
          <button
            onClick={onResetConfig}
            className="hidden lg:flex items-center gap-1.5 bg-white hover:bg-[#faf8f5] border border-slate-200 text-slate-700 hover:text-slate-900 rounded-2xl px-3 py-1.5 transition-colors cursor-pointer shadow-2xs font-semibold"
            title="Configure Nodes"
          >
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            <span>Setup</span>
          </button>
        </div>
      </div>
    </header>
  );
}
