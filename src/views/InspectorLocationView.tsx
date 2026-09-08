import React, { useState } from 'react';
import { ScreenId } from '../types';

interface InspectorLocationViewProps {
  onNavigate: (screen: ScreenId) => void;
}

export const InspectorLocationView: React.FC<InspectorLocationViewProps> = ({ onNavigate }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(true);

  const handleReverify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerified(true);
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-950 text-white flex flex-col justify-between relative overflow-hidden shadow-2xl">
      {/* Top Floating App Bar */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        <button
          onClick={() => onNavigate('inspector-home')}
          className="pointer-events-auto p-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white shadow-lg active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>

        <div className="pointer-events-auto px-3 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700 text-[11px] font-mono font-bold flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>SATELLITE FIX: 12 BARS</span>
        </div>

        <button
          onClick={handleReverify}
          className="pointer-events-auto p-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white shadow-lg active:scale-95"
          title="Refresh GPS"
        >
          <span className={`material-symbols-outlined text-[20px] ${isVerifying ? 'animate-spin' : ''}`}>
            sync
          </span>
        </button>
      </div>

      {/* Map Canvas Background (Simulated Realistic Vector Map) */}
      <div className="flex-1 relative w-full h-full bg-[#111827] overflow-hidden">
        {/* Stylized Dark Mode Road & Street Grid */}
        <svg className="w-full h-full absolute inset-0 opacity-40" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="roadGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#334155" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#roadGrid)" />

          {/* Major arterial roads */}
          <path d="M -50 180 Q 150 120 450 220" fill="none" stroke="#475569" strokeWidth="8" />
          <path d="M 120 -50 L 180 550" fill="none" stroke="#475569" strokeWidth="6" />
          <path d="M 280 -50 L 260 550" fill="none" stroke="#334155" strokeWidth="4" />

          {/* Verification distance vector line */}
          <line
            x1="180"
            y1="230"
            x2="240"
            y2="190"
            stroke="#10b981"
            strokeWidth="3"
            strokeDasharray="6,4"
          />
        </svg>

        {/* Institution Target Marker */}
        <div className="absolute top-[32%] left-[58%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-20">
          <div className="w-12 h-12 rounded-full bg-red-600/30 border-2 border-red-500 flex items-center justify-center animate-pulse mx-auto">
            <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs shadow-md">
              <span className="material-symbols-outlined text-sm">home_work</span>
            </div>
          </div>
          <div className="mt-1 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[10px] font-bold text-white whitespace-nowrap shadow-lg">
            ABC Welfare Centre
          </div>
        </div>

        {/* Inspector (You are here) Marker */}
        <div className="absolute top-[42%] left-[44%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-20">
          <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center animate-ping mx-auto absolute inset-0" />
          <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-white text-white flex items-center justify-center mx-auto shadow-xl relative z-10">
            <span className="material-symbols-outlined text-base">person_pin_circle</span>
          </div>
          <div className="mt-1 px-2 py-0.5 rounded bg-blue-900/90 border border-blue-400 text-[10px] font-bold text-white whitespace-nowrap shadow-lg relative z-10">
            Inspector (18m away)
          </div>
        </div>

        {/* Geofence Ring around institution */}
        <div className="absolute top-[32%] left-[58%] -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-emerald-500/40 bg-emerald-500/5 pointer-events-none" />
      </div>

      {/* Bottom Sheet Card - Location Verified */}
      <div className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-6 space-y-4 z-30 shadow-2xl">
        <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto -mt-2 mb-2" />

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Geofence Status
            </div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <span>Location Verified</span>
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Within Acceptable Range
          </span>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">
              Distance to Perimeter
            </div>
            <div className="text-xl font-extrabold text-emerald-400 mt-0.5">
              18 meters
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Max allowable: 50m</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">
              GPS Precision
            </div>
            <div className="text-xl font-extrabold text-white mt-0.5">
              ± 4.2 meters
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">High Accuracy</div>
          </div>
        </div>

        {/* Verified Address & Hardware Coordinates */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-start gap-2 text-slate-300">
            <span className="material-symbols-outlined text-blue-400 text-sm mt-0.5">location_on</span>
            <div className="leading-snug">
              <strong className="text-white block font-medium">ABC Welfare Centre</strong>
              <span className="text-[11px] text-slate-400">
                Sector 14, Urban Zone C, Navi Mumbai, Maharashtra 400703
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>19.0330° N, 73.0297° E</span>
            <span className="text-emerald-400">Anti-Spoofing: OK</span>
          </div>
        </div>

        {/* Action Button to proceed to checklist */}
        <button
          onClick={() => onNavigate('inspector-checklist')}
          className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98"
        >
          <span>Continue to Checklist</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
