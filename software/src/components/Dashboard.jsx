import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import OverviewTab from './OverviewTab';
import RoomMapVisualizer from './RoomMapVisualizer';
import AnalyticsTab from './AnalyticsTab';
import AIMediatorTab from './AIMediatorTab';
import SimulationLabTab from './SimulationLabTab';
import { useMultiSensorData } from '../hooks/useMultiSensorData';
import { ROOM_PRESETS } from '../utils/climateCalculations';
import { THEMES } from '../utils/themeConfig';
import { Sparkles, X, Server } from 'lucide-react';

export default function Dashboard({ config, onReset, onUpdateConfig }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeScenario, setActiveScenario] = useState('normal');
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [currentThemeId, setCurrentThemeId] = useState('pink');

  const currentTheme = THEMES[currentThemeId] || THEMES.pink;

  // Nodes configured for this room
  const [nodes, setNodes] = useState(config.nodes || ROOM_PRESETS[config.roomPresetKey || 2].nodes);

  // Multi-sensor live stream
  const { nodeDataMap, historyMap, statusMap, lastSync, roomSummary } = useMultiSensorData(
    nodes,
    activeScenario
  );

  const handleSelectScenario = (scenarioId) => {
    setActiveScenario(scenarioId);
    setIsScenarioModalOpen(false);
  };

  const handleUpdateNodeIp = (id, newIp) => {
    const updated = nodes.map((n) => (n.id === id ? { ...n, ip: newIp } : n));
    setNodes(updated);
    if (onUpdateConfig) {
      onUpdateConfig({ ...config, nodes: updated });
    }
  };

  return (
    <div className={`min-h-screen ${currentTheme.bgClass} bg-cutesy-grid text-slate-800 flex flex-col font-sans transition-colors duration-300`}>
      {/* Top Header with live Palette Switcher */}
      <Header
        roomSummary={roomSummary}
        lastSync={lastSync}
        activeScenario={activeScenario}
        onOpenScenarios={() => setIsScenarioModalOpen(true)}
        onResetConfig={onReset}
        currentTheme={currentTheme}
        onSelectTheme={setCurrentThemeId}
      />

      {/* Main Console Body: Sidebar + Dynamic Tab View */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          roomPresetKey={config.roomPresetKey || 2}
          nodeCount={nodes.length}
          currentTheme={currentTheme}
        />

        {/* Center / Right Content Stage */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <OverviewTab
              nodes={nodes}
              nodeDataMap={nodeDataMap}
              historyMap={historyMap}
              statusMap={statusMap}
              roomSummary={roomSummary}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'roomMap' && (
            <RoomMapVisualizer
              nodes={nodes}
              nodeDataMap={nodeDataMap}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsTab
              nodes={nodes}
              historyMap={historyMap}
            />
          )}

          {activeTab === 'mediator' && (
            <AIMediatorTab
              nodes={nodes}
              nodeDataMap={nodeDataMap}
              roomSummary={roomSummary}
            />
          )}

          {activeTab === 'scenarios' && (
            <SimulationLabTab
              activeScenario={activeScenario}
              onSelectScenario={handleSelectScenario}
            />
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Bunk Node Configuration & IP Endpoints
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Update IP addresses for physical ESP32 sensors or change the dorm occupancy layout
                </p>
              </div>

              <div className="cutesy-card rounded-3xl p-5 shadow-2xs space-y-4 border border-[#fce7f3]">
                <div className="flex items-center justify-between pb-3 border-b border-[#fce7f3]">
                  <span className="text-xs font-bold text-slate-800">
                    Active Room: {config.roomPresetKey || 2}-Sharing ({nodes.length} Bunk Sensors)
                  </span>
                  <button
                    onClick={onReset}
                    className="text-xs font-semibold text-[#9d4d6e] hover:text-[#831843] underline cursor-pointer"
                  >
                    Change Room Layout Preset ✨
                  </button>
                </div>

                <div className="space-y-3">
                  {nodes.map((node) => (
                    <div 
                      key={node.id} 
                      className="p-3.5 rounded-2xl bg-[#faf8f5]/80 border border-[#fce7f3]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{node.name}</div>
                        <div className="text-[10px] text-slate-500 font-medium capitalize">
                          {node.bunk === 'top' ? 'Top Bunk Tier 🌷' : 'Bottom Bunk Tier 🌼'} • ID: {node.id}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:w-72">
                        <Server className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <input
                          type="text"
                          value={node.ip}
                          placeholder="ESP32 IP (e.g. 192.168.1.100)"
                          onChange={(e) => handleUpdateNodeIp(node.id, e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-[#fbcfe8] focus:outline-none font-medium shadow-2xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Quick Scenario Modal */}
      {isScenarioModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#fce7f3] rounded-3xl p-6 max-w-xl w-full shadow-xl relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#fce7f3]">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <Sparkles className="w-5 h-5 text-pink-400" />
                <span>Quick Climate Simulation Preset</span>
              </div>
              <button
                onClick={() => setIsScenarioModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <SimulationLabTab
              activeScenario={activeScenario}
              onSelectScenario={handleSelectScenario}
            />
          </div>
        </div>
      )}
    </div>
  );
}
