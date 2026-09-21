import React from 'react';
import LiveSensorCard from './LiveSensorCard';
import SubjectiveFeedback from './SubjectiveFeedback';
import { useSensorData } from '../hooks/useSensorData';
import { LogOut } from 'lucide-react';

export default function Dashboard({ config, onReset }) {
  const topData = useSensorData(config.topIp, true);
  const bottomData = useSensorData(config.bottomIp, false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 py-3 flex items-center justify-between shadow-sm">
        <h1 className="font-bold text-lg text-slate-800">Dorm Climate</h1>
        <button 
          onClick={onReset}
          className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
          title="Reconfigure"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 p-4 max-w-lg mx-auto w-full space-y-6">
        <div className="space-y-4">
          <LiveSensorCard 
            title="Top Bunk Node" 
            data={topData.data} 
            history={topData.history} 
            isSimulating={topData.isSimulating}
            error={topData.error}
          />
          <LiveSensorCard 
            title="Bottom Bunk Node" 
            data={bottomData.data} 
            history={bottomData.history} 
            isSimulating={bottomData.isSimulating}
            error={bottomData.error}
          />
        </div>

        <SubjectiveFeedback topData={topData.data} bottomData={bottomData.data} />
      </main>

      <footer className="bg-slate-850 text-slate-400 py-6 text-center text-sm border-t border-slate-800">
        <p>Created by</p>
        <p className="font-medium text-slate-200 mt-1">Suyash Srivastava, Yahvi Tewari, & Rida Farooqui</p>
      </footer>
    </div>
  );
}
