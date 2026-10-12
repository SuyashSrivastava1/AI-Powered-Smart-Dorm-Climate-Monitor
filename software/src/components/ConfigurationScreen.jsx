import React, { useState } from 'react';
import { 
  Server, 
  ChevronRight, 
  Sparkles
} from 'lucide-react';
import { ROOM_PRESETS } from '../utils/climateCalculations';

export default function ConfigurationScreen({ initialConfig, onLaunch }) {
  const [roomPresetKey, setRoomPresetKey] = useState(initialConfig?.roomPresetKey || 2);
  const [nodes, setNodes] = useState(
    initialConfig?.nodes || JSON.parse(JSON.stringify(ROOM_PRESETS[2].nodes))
  );

  const handlePresetChange = (presetNum) => {
    setRoomPresetKey(presetNum);
    setNodes(JSON.parse(JSON.stringify(ROOM_PRESETS[presetNum].nodes)));
  };

  const handleNodeIpChange = (id, newIp) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === id ? { ...node, ip: newIp } : node))
    );
  };

  const handleNodeNameChange = (id, newName) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === id ? { ...node, name: newName } : node))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLaunch({
      roomPresetKey,
      nodes,
    });
  };

  const handleQuickDemo = () => {
    onLaunch({
      roomPresetKey,
      nodes: nodes.map((n) => ({ ...n, ip: '' })),
    });
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] bg-cutesy-grid flex items-center justify-center p-4 lg:p-8 font-sans">
      <div className="w-full max-w-2xl bg-white border border-[#fce7f3] rounded-3xl shadow-sm overflow-hidden relative">
        {/* Header with single bow emblem */}
        <div className="p-6 md:p-8 border-b border-[#fce7f3]/80 bg-gradient-to-r from-[#fefce8]/60 via-white to-[#fdf2f8]/60 relative z-10">
          <div className="flex items-center gap-3.5 mb-1.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#fef9c3] to-[#fce7f3] border border-[#fbcfe8] flex items-center justify-center text-2xl shadow-2xs">
              🎀
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Dorm Climate Setup
              </h1>
              <p className="text-xs text-[#9d4d6e] font-semibold tracking-wide">
                Smart Bunk Monitor • No more AC arguments
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 relative z-10">
          {/* Room Occupancy Layout Buttons with mirrorballs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              <span>1. Choose Room Occupancy Layout</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[2, 4, 6].map((num) => {
                const isSelected = Number(roomPresetKey) === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handlePresetChange(num)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-center ${
                      isSelected
                        ? 'bg-[#fefce8] border-[#fde047] text-slate-900 shadow-2xs ring-1 ring-[#fef08a]'
                        : 'bg-white border-[#fce7f3] text-slate-700 hover:border-[#fbcfe8] hover:bg-[#fffdf5]'
                    }`}
                  >
                    <div className="text-sm font-bold text-slate-900 flex items-center justify-center gap-1.5">
                      <span>{num}-Sharing</span>
                      <span>🪩</span>
                    </div>
                    <div className="text-[11px] mt-1 text-slate-500 font-medium">
                      {num === 2 ? '1 Bunk (2 Beds)' : num === 4 ? '2 Bunks (4 Beds)' : '3 Bunks (6 Beds)'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Node IP Endpoints */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                <span>2. Configure Bunk Sensor Endpoints</span>
              </label>
              <span className="text-[10px] text-[#9d4d6e] font-semibold bg-[#fdf2f8] px-2.5 py-0.5 rounded-full border border-[#fce7f3]">
                Leave blank for simulation mode 🌷
              </span>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {nodes.map((node, index) => (
                <div 
                  key={node.id} 
                  className="p-3.5 rounded-2xl bg-[#faf8f5]/80 border border-[#fce7f3]/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                >
                  <div className="flex items-center gap-2 sm:w-52 shrink-0">
                    <span className="w-5 h-5 rounded-full bg-[#fef9c3] text-[#854d0e] text-[10px] flex items-center justify-center font-bold border border-[#fef08a]">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      value={node.name}
                      onChange={(e) => handleNodeNameChange(node.id, e.target.value)}
                      className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none focus:border-b border-[#fbcfe8] w-full"
                    />
                  </div>

                  <div className="flex-1 flex items-center gap-2">
                    <Server className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="e.g. 192.168.1.100 (or blank for sim)"
                      value={node.ip}
                      onChange={(e) => handleNodeIpChange(node.id, e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-[#fbcfe8] focus:outline-none font-medium"
                    />
                  </div>

                  <span className={`text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full shrink-0 text-center ${
                    node.bunk === 'top' 
                      ? 'bg-[#fdf2f8] text-[#9d4d6e] border border-[#fce7f3]' 
                      : 'bg-[#fef9c3]/70 text-[#854d0e] border border-[#fef08a]'
                  }`}>
                    {node.bunk === 'top' ? 'Top Bunk' : 'Bottom Bunk'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons with soft blush & butter colors */}
          <div className="space-y-2.5 pt-2">
            <button
              type="submit"
              className="w-full bg-[#fce7f3] hover:bg-[#fbcfe8] text-[#831843] border border-[#f9a8d4]/50 font-semibold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-sm transition-all cursor-pointer shadow-2xs"
            >
              <span>Launch Dorm Console</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full bg-white hover:bg-[#faf8f5] text-slate-700 font-semibold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-sm transition-all border border-slate-200 cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Launch Instant Demo Mode (Simulation)</span>
            </button>
          </div>
        </form>

        {/* Footer info with tulip and daisy */}
        <div className="px-6 py-4 bg-[#faf8f5]/60 border-t border-[#fce7f3]/60 text-[11px] text-slate-500 flex items-center justify-between font-medium">
          <span>Project Team: Yahvi 🌷, Suyash ☕, & Rida 🌼</span>
          <span className="text-[#9d4d6e] font-semibold">No more AC arguments</span>
        </div>
      </div>
    </div>
  );
}
