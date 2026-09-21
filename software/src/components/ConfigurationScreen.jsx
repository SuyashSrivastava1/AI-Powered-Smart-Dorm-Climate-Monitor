import React, { useState } from 'react';
import { Settings, Server, ChevronRight } from 'lucide-react';

export default function ConfigurationScreen({ onLaunch }) {
  const [topIp, setTopIp] = useState('');
  const [bottomIp, setBottomIp] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLaunch({ topIp, bottomIp });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-850 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-6 h-6 text-blue-400" />
            <h1 className="text-xl font-semibold">Climate Mediator Setup</h1>
          </div>
          <p className="text-slate-300 text-sm">Configure your sensor endpoints to begin.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="topIp" className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <Server className="w-4 h-4" /> Top Bunk Node IP/URL
              </label>
              <input
                id="topIp"
                type="text"
                placeholder="e.g. http://192.168.1.100"
                value={topIp}
                onChange={(e) => setTopIp(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="bottomIp" className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <Server className="w-4 h-4" /> Bottom Bunk Node IP/URL
              </label>
              <input
                id="bottomIp"
                type="text"
                placeholder="e.g. http://192.168.1.101"
                value={bottomIp}
                onChange={(e) => setBottomIp(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            
            <p className="text-xs text-slate-500 italic">
              Leave blank to run in simulation mode for demonstration purposes.
            </p>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors active:bg-blue-800"
            >
              Connect & Launch Dashboard
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => onLaunch({ topIp: '', bottomIp: '' })}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors active:bg-slate-300 border border-slate-200"
            >
              Launch Demo Mode
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
