import React from 'react';
import { 
  Users, 
  LayoutDashboard, 
  MapPin, 
  BarChart3, 
  Sparkles, 
  Sliders, 
  Settings2 
} from 'lucide-react';

export default function Sidebar({ activeTab, onSelectTab, roomPresetKey, nodeCount }) {
  const navItems = [
    { id: 'overview', label: 'Sensor Matrix', icon: LayoutDashboard, badge: `${nodeCount} Bunks` },
    { id: 'roomMap', label: 'Dorm Floor Plan', icon: MapPin, badge: '2D Map' },
    { id: 'analytics', label: 'Climate Analytics', icon: BarChart3, badge: 'Trends' },
    { id: 'mediator', label: 'AI Mediator & HVAC', icon: Sparkles, badge: 'Smart' },
    { id: 'scenarios', label: 'Simulation Lab', icon: Sliders, badge: 'Demo' },
    { id: 'settings', label: 'Bunk Setup', icon: Settings2, badge: `${roomPresetKey}-Bed` },
  ];

  return (
    <aside className="w-full lg:w-64 bg-[#fbf9f6] border-r border-[#fce7f3] flex flex-col shrink-0 transition-colors duration-300">
      {/* Brand header with tulip */}
      <div className="p-4 border-b border-[#fce7f3]/70 flex items-center justify-between bg-white/70">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#fef9c3] to-[#fce7f3] border border-[#fbcfe8] flex items-center justify-center text-xl shadow-2xs">
            🌷
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-slate-900">
              CLIMATE MEDIATOR
            </div>
            <div className="text-[11px] font-semibold text-[#9d4d6e]">No more AC arguments</div>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <nav className="p-3 space-y-1 flex-1">
        <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <span>Navigation</span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-semibold text-xs transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#fce7f3] text-[#831843] border border-[#fbcfe8] shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-[#fdf2f8]/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#831843]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    isActive
                      ? 'bg-white/70 text-[#831843]'
                      : 'bg-slate-100 text-slate-600 border border-slate-200/80'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Team authors & project badge */}
      <div className="p-4 border-t border-[#fce7f3]/70 bg-white/70 text-xs">
        <div className="flex items-center gap-1.5 text-slate-700 mb-2 font-bold">
          <Users className="w-3.5 h-3.5 text-[#9d4d6e]" />
          <span className="text-[11px] uppercase tracking-wider text-slate-500">Project Team</span>
        </div>
        <div className="space-y-1 text-[11px] text-slate-700 font-semibold">
          <p className="hover:text-[#9d4d6e] transition-colors">Yahvi 🌷</p>
          <p className="hover:text-amber-700 transition-colors">Suyash ☕</p>
          <p className="hover:text-[#9d4d6e] transition-colors">Rida 🌼</p>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
          <span>ESP32 + React</span>
          <span className="text-slate-600 flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Online
          </span>
        </div>
      </div>
    </aside>
  );
}
