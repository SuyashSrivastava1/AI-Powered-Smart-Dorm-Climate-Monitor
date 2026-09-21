import React, { useState } from 'react';
import { Flame, Snowflake, Wind, Sparkles } from 'lucide-react';

export default function SubjectiveFeedback({ topData, bottomData }) {
  const [recommendation, setRecommendation] = useState(null);

  const generateRecommendation = (feedbackType) => {
    // A simple AI logic simulation based on feedback and current mock sensor state
    let rec = "";
    
    // Average or specific sensor logic could go here. We'll use a mix for the demo.
    const avgTemp = topData && bottomData ? (topData.temp + bottomData.temp) / 2 : 24;
    const maxCo2 = topData && bottomData ? Math.max(topData.co2, bottomData.co2) : 800;

    if (feedbackType === 'hot') {
      if (avgTemp > 24) {
        rec = "Automatically changing the temperature to 21°C. Expected drop: 2°C in 15 mins.";
      } else {
        rec = "The room temperature is already optimal. Activating localized airflow for personal cooling.";
      }
    } else if (feedbackType === 'cold') {
      if (avgTemp < 23) {
        rec = "Automatically changing the temperature to 24°C. Expected increase: 1.5°C in 20 mins.";
      } else {
        rec = "The room is already quite warm. Slightly increasing heating to optimize comfort.";
      }
    } else if (feedbackType === 'stuffy') {
      if (maxCo2 > 800) {
        rec = "High CO2 detected. Automatically activating ventilation system. Expected CO2 drop: 200ppm rapidly.";
      } else {
        rec = "CO2 levels are normal. Activating circulation fans to improve air freshness.";
      }
    }

    setRecommendation({ type: feedbackType, text: rec, timestamp: new Date() });
  };

  return (
    <div className="space-y-4 mt-6">
      <h3 className="font-semibold text-slate-800 px-1">How are you feeling?</h3>
      
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => generateRecommendation('hot')}
          className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-red-100 shadow-sm hover:bg-red-50 hover:border-red-200 transition-all active:scale-95 touch-manipulation"
        >
          <Flame className="w-8 h-8 text-red-500 mb-2" />
          <span className="font-medium text-slate-700">I'm hot</span>
        </button>
        
        <button
          onClick={() => generateRecommendation('cold')}
          className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-blue-100 shadow-sm hover:bg-blue-50 hover:border-blue-200 transition-all active:scale-95 touch-manipulation"
        >
          <Snowflake className="w-8 h-8 text-blue-500 mb-2" />
          <span className="font-medium text-slate-700">I'm cold</span>
        </button>

        <button
          onClick={() => generateRecommendation('stuffy')}
          className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-amber-100 shadow-sm hover:bg-amber-50 hover:border-amber-200 transition-all active:scale-95 touch-manipulation"
        >
          <Wind className="w-8 h-8 text-amber-500 mb-2" />
          <span className="font-medium text-slate-700">It's stuffy</span>
        </button>
      </div>

      {recommendation && (
        <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-5 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white rounded-full shadow-sm shrink-0">
              <Sparkles className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <h4 className="font-semibold text-indigo-900 mb-1">AI Mediator Suggestion</h4>
              <p className="text-indigo-800 leading-relaxed text-sm">
                {recommendation.text}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
