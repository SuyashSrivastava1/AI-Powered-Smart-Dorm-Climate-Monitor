import React, { useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  Snowflake, 
  Wind, 
  CheckCircle2, 
  Fan, 
  Power, 
  Users, 
  Zap
} from 'lucide-react';

export default function AIMediatorTab({ nodes, nodeDataMap, roomSummary }) {
  const [occupantVotes, setOccupantVotes] = useState({
    [nodes[0]?.id || 'bunk1-top']: 'hot',
    [nodes[1]?.id || 'bunk1-bottom']: 'cold',
  });

  const [selectedBedId, setSelectedBedId] = useState(nodes[0]?.id || '');
  const [feedbackType, setFeedbackType] = useState('hot');

  const [hvacState, setHvacState] = useState({
    power: true,
    mode: 'auto',
    targetTemp: 23.0,
    fanSpeed: 2,
    destratificationActive: true,
  });

  const [aiActionHistory, setAiActionHistory] = useState([
    {
      time: 'Just now',
      title: 'Arbitrated Bunk Comfort Compromise',
      detail: 'Bed 1 reported warm upper bunk buoyancy while Bed 2 felt cold. Compromise AC setpoint calculated at 23.0°C with low-speed oscillation to mix air layers without over-cooling lower bunk.',
    },
    {
      time: '2 mins ago',
      title: 'Air Quality Check',
      detail: 'CO2 freshness is optimal (680 ppm). Standard baseline airflow maintained.',
    },
  ]);

  const handleVoteSubmit = (e) => {
    e.preventDefault();
    if (!selectedBedId) return;

    const updatedVotes = {
      ...occupantVotes,
      [selectedBedId]: feedbackType,
    };
    setOccupantVotes(updatedVotes);

    arbitrateClimate(updatedVotes);
  };

  const arbitrateClimate = (votes) => {
    const voteValues = Object.values(votes);
    const hotCount = voteValues.filter((v) => v === 'hot' || v === 'warm').length;
    const coldCount = voteValues.filter((v) => v === 'cold' || v === 'chilly').length;
    const stuffyCount = voteValues.filter((v) => v === 'stuffy').length;

    let actionTitle = '';
    let actionDetail = '';

    if (hotCount > 0 && coldCount > 0) {
      actionTitle = 'Arbitrated Bunk Comfort Compromise';
      actionDetail = `Occupants on upper and lower bunks reported conflicting comfort (Hot vs Cold). Adjusted setpoint to 23.5°C and engaged low-noise fan oscillation to break up upper thermal layer without overchilling Bed 2.`;
      setHvacState((prev) => ({
        ...prev,
        targetTemp: 23.5,
        fanSpeed: 3,
        destratificationActive: true,
      }));
    } else if (stuffyCount > 0 || roomSummary.avgCo2 > 1000) {
      actionTitle = 'Fresh Air Flush Activated 🍃';
      actionDetail = `Elevated CO2 detected (${roomSummary.avgCo2} ppm). Increased air exchange speed to bring fresh outdoor ventilation inside.`;
      setHvacState((prev) => ({
        ...prev,
        fanSpeed: 4,
        destratificationActive: true,
      }));
    } else if (hotCount > 0) {
      actionTitle = 'Cooling Breeze Activated';
      actionDetail = `Roommate requested cooler climate. Adjusted AC setpoint to 21.5°C with smooth fan ramping for personal comfort.`;
      setHvacState((prev) => ({
        ...prev,
        targetTemp: 21.5,
        fanSpeed: 2,
      }));
    } else if (coldCount > 0) {
      actionTitle = 'Gentle Warming Mode Activated';
      actionDetail = `Roommate felt chilly. Dialed up setpoint to 24.5°C and lowered fan speed for gentle ambient warmth.`;
      setHvacState((prev) => ({
        ...prev,
        targetTemp: 24.5,
        fanSpeed: 1,
      }));
    } else {
      actionTitle = 'Climate Equilibrium Maintained';
      actionDetail = `All roommate sensations in optimal zone. Operating in Eco-Comfort Mode.`;
      setHvacState((prev) => ({
        ...prev,
        mode: 'eco',
        fanSpeed: 1,
      }));
    }

    setAiActionHistory((prev) => [
      {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: actionTitle,
        detail: actionDetail,
      },
      ...prev.slice(0, 5),
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span>AI Climate Mediator</span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#fdf2f8] text-[#9d4d6e] border border-[#fce7f3]">
            No more AC arguments
          </span>
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Resolving roommate climate disagreements through real-time sensor arbitration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Occupant Feedback (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Submit Your Feedback */}
          <div className="cutesy-card rounded-3xl p-5 shadow-2xs border border-[#fce7f3]">
            <h3 className="font-bold text-sm text-slate-900 mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#9d4d6e]" />
              <span>Roommate Comfort Feedback</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-medium">
              Select your bed and report your current thermal sensation to arbitrate
            </p>

            <form onSubmit={handleVoteSubmit} className="space-y-4">
              {/* Bed Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Your Bunk Bed
                </label>
                <select
                  value={selectedBedId}
                  onChange={(e) => setSelectedBedId(e.target.value)}
                  className="w-full bg-[#fefce8]/60 border border-[#fef08a] rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#fbcfe8] focus:outline-none font-semibold cursor-pointer shadow-2xs"
                >
                  {nodes.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.name} ({n.bunk === 'top' ? 'Top Bunk' : 'Bottom Bunk'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Subjective sensation buttons */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Current Sensation
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'cold', label: 'Too Cold 🥶', icon: Snowflake, color: 'text-blue-400' },
                    { id: 'optimal', label: 'Comfortable 🌼', icon: CheckCircle2, color: 'text-emerald-600' },
                    { id: 'hot', label: 'Too Hot 🥵', icon: Flame, color: 'text-rose-400' },
                    { id: 'stuffy', label: 'Stuffy 🫧', icon: Wind, color: 'text-amber-500' },
                    { id: 'chilly', label: 'Chilly Draft 🧊', icon: Snowflake, color: 'text-blue-300' },
                    { id: 'warm', label: 'Slightly Warm ☀️', icon: Flame, color: 'text-amber-500' },
                  ].map((option) => {
                    const OptIcon = option.icon;
                    const isSelected = feedbackType === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setFeedbackType(option.id)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#fce7f3] border-[#fbcfe8] text-[#831843] shadow-2xs'
                            : 'bg-white border-[#fce7f3]/70 text-slate-700 hover:border-[#fbcfe8] hover:bg-[#fffdf5]'
                        }`}
                      >
                        <OptIcon className={`w-4 h-4 mb-1 ${isSelected ? 'text-[#831843]' : option.color}`} />
                        <span className="text-[11px]">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#fce7f3] hover:bg-[#fbcfe8] text-[#831843] border border-[#f9a8d4]/50 font-semibold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs transition-all cursor-pointer shadow-2xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>Arbitrate AC Compromise</span>
              </button>
            </form>
          </div>

          {/* Roommate Sensation Matrix */}
          <div className="cutesy-card rounded-3xl p-5 shadow-2xs border border-[#fce7f3]">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#9d4d6e]" />
              <span>Roommate Comfort Status</span>
            </h4>
            <div className="space-y-2">
              {nodes.map((node) => {
                const vote = occupantVotes[node.id] || 'optimal';
                const nodeData = nodeDataMap[node.id];
                return (
                  <div 
                    key={node.id} 
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#faf8f5]/80 border border-[#fce7f3]/70 text-xs font-semibold"
                  >
                    <div>
                      <div className="text-slate-800">{node.name}</div>
                      <div className="text-[10px] text-slate-500 font-normal">
                        {nodeData ? `${nodeData.temp}°C • ${nodeData.co2} ppm` : 'Syncing'}
                      </div>
                    </div>
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full capitalize font-semibold ${
                      vote === 'hot' || vote === 'warm' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                      vote === 'cold' || vote === 'chilly' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                      vote === 'stuffy' ? 'bg-[#fef9c3] text-[#854d0e] border border-[#fef08a]' :
                      'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}>
                      {vote === 'hot' ? 'Too Hot 🥵' : vote === 'cold' ? 'Too Cold 🥶' : vote === 'stuffy' ? 'Stuffy 🫧' : 'Comfortable 🌼'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Virtual HVAC Actuator Panel & Decision Feed (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Virtual HVAC Control Dashboard in Soft Butter Yellow & Blush */}
          <div className="cutesy-card rounded-3xl p-5 shadow-2xs border border-[#fef08a]">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#fef08a]/60">
              <div className="flex items-center gap-2">
                <Fan className={`w-5 h-5 text-amber-500 ${hvacState.power ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Smart HVAC Actuator Terminal</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Automated Microclimate Regulation</p>
                </div>
              </div>

              {/* Power Toggle */}
              <button
                type="button"
                onClick={() => setHvacState((prev) => ({ ...prev, power: !prev.power }))}
                className={`p-2.5 rounded-2xl border transition-colors cursor-pointer ${
                  hvacState.power
                    ? 'bg-[#fef9c3] text-[#854d0e] border-[#fef08a] shadow-2xs font-semibold'
                    : 'bg-slate-100 text-slate-400 border-slate-200'
                }`}
                title="Toggle HVAC Power"
              >
                <Power className="w-4 h-4" />
              </button>
            </div>

            {/* Controls Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Target Temperature Slider in Soft Butter Yellow */}
              <div className="bg-[#fefce8]/60 border border-[#fef08a] rounded-2xl p-4">
                <div className="flex items-center justify-between text-xs mb-2 font-semibold">
                  <span className="text-slate-700">Target Setpoint</span>
                  <span className="text-lg font-bold text-[#854d0e]">{hvacState.targetTemp.toFixed(1)}°C</span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="28"
                  step="0.5"
                  value={hvacState.targetTemp}
                  onChange={(e) => setHvacState((prev) => ({ ...prev, targetTemp: parseFloat(e.target.value) }))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-medium mt-1">
                  <span>18°C Cool</span>
                  <span>23°C Ideal</span>
                  <span>28°C Warm</span>
                </div>
              </div>

              {/* Fan Circulation Speed in Soft Blush Pink */}
              <div className="bg-[#fdf2f8]/60 border border-[#fce7f3] rounded-2xl p-4">
                <div className="flex items-center justify-between text-xs mb-2 font-semibold">
                  <span className="text-slate-700">Fan Speed</span>
                  <span className="text-xs font-bold text-[#9d4d6e]">
                    {hvacState.fanSpeed === 4 ? 'MAX Turbo' : `Speed Level ${hvacState.fanSpeed}`}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 mt-2">
                  {[1, 2, 3, 4].map((speed) => (
                    <button
                      key={speed}
                      type="button"
                      onClick={() => setHvacState((prev) => ({ ...prev, fanSpeed: speed }))}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        hvacState.fanSpeed === speed
                          ? 'bg-[#fce7f3] text-[#831843] border border-[#fbcfe8] shadow-2xs'
                          : 'bg-white text-slate-700 hover:bg-[#fdf2f8] border border-slate-200'
                      }`}
                    >
                      {speed === 4 ? 'MAX' : speed}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Smart Modes */}
            <div className="mt-4 pt-4 border-t border-[#fef08a]/60 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 font-semibold">
                <span className="text-slate-700">Mode:</span>
                {['auto', 'cool', 'fan', 'eco'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setHvacState((prev) => ({ ...prev, mode }))}
                    className={`px-3 py-1 rounded-full uppercase text-[10px] font-bold transition-all cursor-pointer ${
                      hvacState.mode === mode
                        ? 'bg-[#fef9c3] text-[#854d0e] border border-[#fef08a] shadow-2xs'
                        : 'bg-white text-slate-700 hover:text-amber-800 border border-slate-200'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[#854d0e] font-semibold text-[11px]">
                  Bunk Equalizer: {hvacState.destratificationActive ? 'Active' : 'Standby'}
                </span>
              </div>
            </div>
          </div>

          {/* AI Decision Feed */}
          <div className="cutesy-card rounded-3xl p-5 shadow-2xs border border-[#fce7f3]">
            <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#9d4d6e]" />
              <span>Mediation & Arbitration Log</span>
            </h4>
            <div className="space-y-3">
              {aiActionHistory.map((item, index) => (
                <div 
                  key={index} 
                  className="p-3.5 rounded-2xl bg-[#faf8f5]/80 border border-[#fce7f3]/70 text-xs flex items-start gap-3"
                >
                  <div className="p-2 rounded-xl bg-[#fdf2f8] text-[#9d4d6e] shrink-0 mt-0.5 font-bold">
                    🌷
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1 font-bold">
                      <span className="text-slate-900">{item.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{item.time}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px] font-medium">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
