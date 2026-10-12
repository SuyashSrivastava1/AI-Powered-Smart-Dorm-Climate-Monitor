import React from 'react';
import { 
  Sliders, 
  Flame, 
  Snowflake, 
  Wind, 
  CheckCircle2, 
  Play, 
  Sparkles
} from 'lucide-react';

export default function SimulationLabTab({ activeScenario, onSelectScenario }) {
  const scenarios = [
    {
      id: 'normal',
      title: 'Optimal Ambient Study & Sleep',
      badge: 'Balanced & Comfortable',
      icon: CheckCircle2,
      color: 'emerald',
      temp: '23.5°C',
      co2: '650 ppm',
      desc: 'Ideal dorm evening. Gentle air exchange, balanced temperature between upper and lower bunks.',
    },
    {
      id: 'stuffy',
      title: 'Stuffy Dorm Air Spike 🫧',
      badge: 'Air Quality Alert',
      icon: Wind,
      color: 'amber',
      temp: '26.4°C',
      co2: '1420 ppm',
      desc: 'Windows closed with full occupancy. CO2 elevates, prompting automated fresh air intake.',
    },
    {
      id: 'heatwave',
      title: 'Summer Heatwave (Bunk Gradient) ☀️',
      badge: 'High Thermal Delta',
      icon: Flame,
      color: 'rose',
      temp: '29.8°C (Top) / 26.9°C (Bottom)',
      co2: '890 ppm',
      desc: 'Upper bunk absorbs ceiling heat (ΔT = +2.9°C), triggering the automated destratification routine.',
    },
    {
      id: 'cold_draft',
      title: 'Winter Cold Draft ❄️',
      badge: 'Low Temperature',
      icon: Snowflake,
      color: 'blue',
      temp: '19.8°C',
      co2: '540 ppm',
      desc: 'Chilly window draft settles across lower beds, automatically adjusting the HVAC setpoint.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#9d4d6e]" />
          <span>Interactive Climate Simulation Lab</span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#fef9c3]/70 text-[#854d0e] border border-[#fef08a]">
            Demo Presets
          </span>
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Switch environmental scenarios instantly to demonstrate the Dorm Climate Mediator in real time
        </p>
      </div>

      {/* Scenario Presets Grid in Soft Butter Yellow & Blush */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenarios.map((sc) => {
          const Icon = sc.icon;
          const isActive = activeScenario === sc.id;

          return (
            <div
              key={sc.id}
              className={`rounded-3xl p-5 border transition-all relative overflow-hidden flex flex-col justify-between ${
                isActive
                  ? 'bg-white border-[#fbcfe8] shadow-2xs ring-1 ring-[#fce7f3]'
                  : 'bg-white/95 border-[#fce7f3] hover:border-[#fbcfe8] shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#fef9c3] to-[#fce7f3] border border-[#fbcfe8] text-slate-800 shadow-2xs">
                      <Icon className="w-5 h-5 text-slate-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{sc.title}</h3>
                      <span className="text-[10px] text-[#9d4d6e] font-semibold">{sc.badge}</span>
                    </div>
                  </div>

                  {isActive && (
                    <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#fdf2f8] text-[#9d4d6e] border border-[#fce7f3]">
                      Active
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 mb-4 leading-relaxed font-medium">
                  {sc.desc}
                </p>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#fefce8]/60 border border-[#fef08a] text-xs font-semibold mb-4">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-normal">Target Temp:</span>
                    <span className="text-slate-900 font-bold">{sc.temp}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-normal">Target CO2:</span>
                    <span className="text-[#854d0e] font-bold">{sc.co2}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectScenario(sc.id)}
                className={`w-full py-2.5 px-4 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#fce7f3] text-[#831843] border border-[#fbcfe8] shadow-2xs'
                    : 'bg-white hover:bg-[#faf8f5] text-slate-700 border border-slate-200'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isActive ? 'Currently Active' : `Inject ${sc.title}`}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Info Card */}
      <div className="cutesy-card rounded-3xl p-5 shadow-2xs text-xs text-slate-600 flex items-start gap-3 border border-[#fce7f3]">
        <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-slate-900 text-sm mb-1">Dual-Engine Architecture</h4>
          <p className="leading-relaxed font-normal text-slate-500">
            The Dorm Climate Monitor automatically synchronizes with live ESP32 DHT22 + MQ-135 hardware nodes over WiFi. When endpoints are blank or disconnected, our physics-based simulation engine seamlessly generates realistic microclimate and stratification drift.
          </p>
        </div>
      </div>
    </div>
  );
}
