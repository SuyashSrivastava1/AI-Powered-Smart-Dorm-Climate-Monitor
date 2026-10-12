import React from 'react';
import { ArrowUp, ArrowDown, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';

export default function MicroclimateStratificationCard({ roomSummary }) {
  const { topAvgTemp, bottomAvgTemp, tempStratificationDelta, topAvgCo2, bottomAvgCo2, co2StratificationDelta } = roomSummary;
  
  const isHighDelta = Math.abs(tempStratificationDelta) >= 1.5;
  const isHighCo2Delta = Math.abs(co2StratificationDelta) >= 150;
  const hasStratificationAnomaly = isHighDelta || isHighCo2Delta;

  return (
    <div className="cutesy-card rounded-3xl p-5 shadow-2xs relative overflow-hidden border border-[#fce7f3]">
      {/* Background ambient soft butter & blush glow */}
      <div className="absolute -right-12 -top-12 w-52 h-52 bg-gradient-to-br from-[#fef08a]/20 via-[#fbcfe8]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#fce7f3]/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#fef9c3] to-[#fce7f3] border border-[#fbcfe8] flex items-center justify-center text-xl shadow-2xs text-[#9d4d6e]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm md:text-base">
              Bunk Thermal & CO2 Stratification
              <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#fef9c3]/70 text-[#854d0e] border border-[#fef08a]">
                Upper vs Lower Bunks
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Monitoring vertical thermal stratification between upper and lower sleeping levels
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasStratificationAnomaly ? (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-[#fffbeb] border border-[#fde047] text-[#854d0e] text-xs font-bold shadow-2xs">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Uneven Bunk Temperatures</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-[#fdf2f8] border border-[#fce7f3] text-[#9d4d6e] text-xs font-bold shadow-2xs">
              <CheckCircle className="w-4 h-4 text-[#9d4d6e]" />
              <span>Balanced Bunk Comfort</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Top Bunk Zone in Soft Blush Pink */}
        <div className="bg-[#fdf2f8]/60 border border-[#fce7f3] rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-2 font-semibold">
            <span className="text-[#9d4d6e] flex items-center gap-1 font-bold">
              <ArrowUp className="w-3.5 h-3.5 text-pink-400" /> Upper Bunk Zone 🌷
            </span>
            <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-[#9d4d6e] border border-[#fce7f3] font-semibold">Ceiling Tier</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-slate-900 flex items-baseline gap-2">
              {topAvgTemp}°C
              <span className="text-xs font-medium text-slate-500">({topAvgCo2} ppm)</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              Warm buoyant air typically floats upward toward the top bed during sleep.
            </p>
          </div>
        </div>

        {/* Delta Gauge in Soft Butter Yellow */}
        <div className="bg-[#fefce8]/70 border border-[#fef08a] rounded-2xl p-4 flex flex-col justify-between text-center">
          <div className="text-xs text-slate-700 mb-2 font-bold">Vertical Thermal Delta (ΔT)</div>
          <div className="my-1">
            <div className="text-3xl font-extrabold text-[#854d0e]">
              {tempStratificationDelta > 0 ? `+${tempStratificationDelta}°C` : `${tempStratificationDelta}°C`}
            </div>
            <div className="text-[11px] text-slate-600 font-semibold mt-0.5">
              CO2 Delta: {co2StratificationDelta > 0 ? `+${co2StratificationDelta}` : co2StratificationDelta} ppm
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            {tempStratificationDelta > 1.0 
              ? 'Top bunk is noticeably warmer than the bottom bunk.'
              : 'Both bunks share balanced, uniform temperatures.'}
          </div>
        </div>

        {/* Bottom Bunk Zone in Soft Butter Yellow */}
        <div className="bg-[#fefce8]/40 border border-[#fef08a]/80 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-2 font-semibold">
            <span className="text-[#854d0e] flex items-center gap-1 font-bold">
              <ArrowDown className="w-3.5 h-3.5 text-amber-500" /> Lower Bunk Zone 🌼
            </span>
            <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-[#854d0e] border border-[#fef08a] font-semibold">Floor Tier</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-slate-900 flex items-baseline gap-2">
              {bottomAvgTemp}°C
              <span className="text-xs font-medium text-slate-500">({bottomAvgCo2} ppm)</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              Cooler, denser air settles lower to keep bottom beds naturally cooler.
            </p>
          </div>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div className="mt-4 pt-3 border-t border-[#fce7f3] flex items-start gap-2.5 text-xs text-slate-700">
        <Sparkles className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900">AI Climate Recommendation: </span>
          <span className="text-slate-600 font-medium">
            {isHighDelta 
              ? 'Activate fan destratification oscillation downward to mix warm upper air and equalize temperatures across both beds.'
              : 'Both bunk tiers are balanced with even temperature distribution across the room.'}
          </span>
        </div>
      </div>
    </div>
  );
}
