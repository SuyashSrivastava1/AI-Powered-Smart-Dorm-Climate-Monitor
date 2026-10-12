import React, { useState } from 'react';
import { 
  Wind, 
  Thermometer, 
  Droplets, 
  Sparkles, 
  MapPin, 
  Fan 
} from 'lucide-react';
import { getComfortStatus, getAirQualityStatus } from '../utils/climateCalculations';

export default function RoomMapVisualizer({ nodes, nodeDataMap }) {
  const [selectedNodeId, setSelectedNodeId] = useState(nodes[0]?.id || null);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];
  const selectedData = selectedNode ? nodeDataMap[selectedNode.id] : null;

  return (
    <div className="space-y-6">
      {/* Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#9d4d6e]" />
            <span>2D Dorm Room Layout & Bed Heatmap</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#fdf2f8] text-[#9d4d6e] border border-[#fce7f3]">
              Floor Plan
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Interactive floor plan mapping live sensor nodes to physical bunk bed locations
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fdf2f8] text-[#9d4d6e] font-semibold border border-[#fce7f3] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-pink-400"></span> Upper Bunk Tier 🌷
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fefce8] text-[#854d0e] font-semibold border border-[#fef08a] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> Lower Bunk Tier 🌼
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Architectural 2D Floor Plan Canvas */}
        <div className="lg:col-span-2 cutesy-card rounded-3xl p-6 relative overflow-hidden shadow-2xs flex flex-col justify-between min-h-[420px] border border-[#fce7f3]">
          {/* Subtle micro dot grid */}
          <div className="absolute inset-0 bg-cutesy-grid opacity-60 pointer-events-none" />

          {/* Top wall: Window & Smart AC */}
          <div className="relative z-10 flex items-center justify-between px-6 pb-3 border-b border-[#fce7f3] text-xs">
            {/* Window */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-semibold shadow-2xs">
              <Wind className="w-3.5 h-3.5 text-slate-400" />
              <span>Dorm Window / Intake</span>
            </div>

            {/* Smart AC / Ventilation Unit in Soft Butter Yellow & Blush */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-[#fef9c3] to-[#fce7f3] border border-[#fbcfe8] text-slate-800 font-semibold shadow-2xs">
              <Fan className="w-3.5 h-3.5 text-[#9d4d6e] animate-spin" style={{ animationDuration: '5s' }} />
              <span>Smart HVAC Fan</span>
            </div>
          </div>

          {/* Room Interior with Bunk Beds */}
          <div className="relative z-10 my-8 py-4 px-2 flex-1 flex items-center justify-around gap-4 flex-wrap">
            {Array.from({ length: Math.ceil(nodes.length / 2) }).map((_, bunkIndex) => {
              const bunkNodes = nodes.slice(bunkIndex * 2, bunkIndex * 2 + 2);
              const bunkLetter = String.fromCharCode(65 + bunkIndex);

              return (
                <div 
                  key={bunkIndex}
                  className="bg-white border border-[#fce7f3] rounded-3xl p-4 w-64 shadow-2xs relative flex flex-col gap-3 group hover:border-[#fbcfe8] transition-all"
                >
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-[#fce7f3] font-bold">
                    <span className="text-slate-900 flex items-center gap-1.5">
                      <span>Bunk Set {bunkLetter}</span>
                    </span>
                    <span className="text-[10px] text-[#9d4d6e] bg-[#fdf2f8] px-2 py-0.5 rounded-full border border-[#fce7f3] font-semibold">2 Beds</span>
                  </div>

                  {/* Bed Slots */}
                  {bunkNodes.map((node) => {
                    const data = nodeDataMap[node.id];
                    const isSelected = selectedNodeId === node.id;
                    const isTop = node.bunk === 'top';
                    const comfort = data ? getComfortStatus(data.temp) : { color: 'emerald', label: 'Optimal' };

                    return (
                      <button
                        key={node.id}
                        onClick={() => setSelectedNodeId(node.id)}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                          isSelected
                            ? isTop
                              ? 'bg-[#fdf2f8] border-[#fbcfe8] shadow-2xs ring-1 ring-[#fce7f3]'
                              : 'bg-[#fefce8] border-[#fde047] shadow-2xs ring-1 ring-[#fef08a]'
                            : 'bg-white border-slate-200/90 hover:border-[#fce7f3] hover:bg-[#faf8f5]'
                        }`}
                      >
                        {/* Bed Header */}
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${isTop ? 'bg-pink-400' : 'bg-amber-400'}`}></span>
                            {node.name}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 shadow-2xs">
                            {isTop ? '🌷 Top' : '🌼 Bottom'} • {comfort.label}
                          </span>
                        </div>

                        {/* Live Quick Reading */}
                        {data && (
                          <div className="flex items-center justify-between text-xs font-semibold mt-2 pt-1 border-t border-slate-100 text-slate-600">
                            <span className="text-slate-900 font-bold">{data.temp.toFixed(1)}°C</span>
                            <span className="text-[#9d4d6e]">{data.hum}%</span>
                            <span className="text-[#854d0e]">{data.co2} ppm</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Bottom wall: Dorm Entrance & Study Desks */}
          <div className="relative z-10 flex items-center justify-between px-6 pt-3 border-t border-[#fce7f3] text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-8 h-2 bg-[#fef9c3] border border-[#fef08a] rounded-sm"></span>
              <span>Study Desk</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-10 h-2 bg-[#fce7f3] rounded-full border border-[#fbcfe8]"></span>
              <span>Dorm Door</span>
            </div>
          </div>
        </div>

        {/* Selected Bed Inspector */}
        <div className="cutesy-card rounded-3xl p-5 shadow-2xs flex flex-col justify-between border border-[#fce7f3]">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#fce7f3]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#9d4d6e]" />
                <h3 className="font-bold text-sm text-slate-900">Bed Microclimate</h3>
              </div>
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#fdf2f8] text-[#9d4d6e] border border-[#fce7f3]">
                {selectedNode?.id}
              </span>
            </div>

            {selectedNode && selectedData ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-slate-900">{selectedNode.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">
                    Tier: {selectedNode.bunk === 'top' ? 'Upper Bunk (Ceiling Air Layer) 🌷' : 'Lower Bunk (Floor Air Layer) 🌼'}
                  </p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Sensor: {selectedNode.ip || 'Virtual Simulated Node'}
                  </p>
                </div>

                {/* Big Metric Tiles in Soft Butter Yellow & Blush */}
                <div className="space-y-2.5">
                  <div className="bg-[#fdf2f8]/60 border border-[#fce7f3] rounded-2xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Thermometer className="w-4 h-4 text-rose-400" />
                      <div>
                        <div className="text-xs text-slate-500 font-medium">Temperature</div>
                        <div className="text-lg font-bold text-slate-900">{selectedData.temp.toFixed(1)}°C</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#9d4d6e] bg-white px-2 py-0.5 rounded-full border border-[#fce7f3] shadow-2xs">
                      Feels {selectedData.heatIndex}°C
                    </span>
                  </div>

                  <div className="bg-[#fefce8]/60 border border-[#fef08a] rounded-2xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Droplets className="w-4 h-4 text-amber-500" />
                      <div>
                        <div className="text-xs text-slate-500 font-medium">Relative Humidity</div>
                        <div className="text-lg font-bold text-slate-900">{selectedData.hum.toFixed(0)}%</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#854d0e] bg-white px-2 py-0.5 rounded-full border border-[#fef08a] shadow-2xs">
                      Optimal
                    </span>
                  </div>

                  <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Wind className="w-4 h-4 text-slate-400" />
                      <div>
                        <div className="text-xs text-slate-500 font-medium">CO2 Freshness</div>
                        <div className="text-lg font-bold text-slate-900">{selectedData.co2} ppm</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-700 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                      {getAirQualityStatus(selectedData.co2).label}
                    </span>
                  </div>
                </div>

                {/* Microclimate Advice */}
                <div className="bg-gradient-to-r from-[#fefce8]/60 to-[#fdf2f8]/60 border border-[#fce7f3] rounded-2xl p-3.5 text-xs">
                  <div className="flex items-center gap-1.5 font-bold mb-1 text-slate-800">
                    <Sparkles className="w-3.5 h-3.5 text-pink-400" /> Microclimate Note
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-600 font-medium">
                    {selectedNode.bunk === 'top'
                      ? 'Upper bunk catches warm buoyant air during the night. If feeling warm, turn on fan oscillation directed toward your bed.'
                      : 'Lower bunk enjoys cooler floor air. Ideal for sleeping with light cozy blankets.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs font-medium">
                Click on any bed above to inspect live comfort readings
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#fce7f3] text-[11px] text-slate-400 font-medium flex items-center justify-between">
            <span>Sampling every 3s</span>
            <span className="text-[#9d4d6e] font-semibold">Live Synchronized</span>
          </div>
        </div>
      </div>
    </div>
  );
}
