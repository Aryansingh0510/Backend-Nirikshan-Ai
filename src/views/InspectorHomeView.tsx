import React from 'react';
import { ScreenId } from '../types';
import { sampleImages } from '../data/mockData';

interface InspectorHomeViewProps {
  onNavigate: (screen: ScreenId) => void;
}

export const InspectorHomeView: React.FC<InspectorHomeViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-900 text-white flex flex-col justify-between pb-20 shadow-2xl">
      {/* Top Mobile App Bar */}
      <div className="p-5 pt-8 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-blue-500 overflow-hidden bg-slate-800">
            <img
              src={sampleImages.inspectorAvatar}
              alt="Inspector Priya Nair"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-xs text-slate-400">Field Auditor</div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Priya Nair</span>
              <span className="text-[10px] bg-slate-800 text-blue-400 px-1.5 py-0.5 rounded font-mono">
                INSP-492
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/60">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>GPS Ready</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 space-y-5 flex-1 overflow-y-auto hide-scrollbar">
        {/* Welcome Text */}
        <div>
          <h1 className="text-lg font-bold text-slate-100">
            Good morning, Inspector
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            You have 1 high priority surprise audit assigned for immediate ground execution.
          </p>
        </div>

        {/* Hero Urgent Assignment Card */}
        <div className="bg-gradient-to-br from-blue-950/80 to-slate-900 border-2 border-blue-500/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-[11px] mb-3">
            <span className="px-2 py-0.5 rounded bg-red-600 text-white font-extrabold uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              High Priority
            </span>
            <span className="text-slate-400 font-mono">Assigned: 10:42 AM</span>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-mono text-blue-400">SURPRISE INSPECTION #4092</div>
            <h2 className="text-xl font-extrabold text-white">ABC Welfare Centre</h2>
            <p className="text-xs text-slate-300">
              Sector 14, Urban Zone C, Navi Mumbai
            </p>
          </div>

          <div className="my-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-400 text-base">near_me</span>
              <span className="font-semibold text-slate-200">4.2 km away</span>
            </div>
            <span className="text-slate-500">•</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="material-symbols-outlined text-base text-slate-400">schedule</span>
              <span>12 min transit</span>
            </div>
            <span className="text-slate-500">•</span>
            <div className="text-emerald-400 font-medium">Within Range</div>
          </div>

          <button
            onClick={() => onNavigate('inspector-gps')}
            className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
          >
            <span>Start Inspection</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>

        {/* Today's Progress */}
        <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
              Today&apos;s Audits
            </span>
            <span className="font-mono text-slate-400">2 Completed • 1 Pending</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
            <div className="bg-emerald-500 h-full w-[66%]" />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 pt-1 font-mono">
            <span>Progress: 66% Complete</span>
            <span>Target: 3 Facilities</span>
          </div>
        </div>

        {/* Recently Uploaded Evidence */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
              Recent Audit Captures
            </span>
            <span className="text-[11px] text-blue-400 font-medium">Stored in Local Vault</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 h-28 relative">
              <img
                src={sampleImages.cracksEvidence}
                alt="Cracks evidence"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                <span className="text-[10px] text-slate-200 truncate">Lab Structural Cracks</span>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 h-28 relative">
              <img
                src={sampleImages.classroom3}
                alt="Classroom"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                <span className="text-[10px] text-slate-200 truncate">Room 3 Vacant Chairs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Inspections Queue */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Upcoming in Queue
          </div>
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <div className="font-semibold text-slate-200">Govt. Senior Secondary School</div>
              <div className="text-[11px] text-slate-500">Scheduled: 15:30 IST Today</div>
            </div>
            <span className="material-symbols-outlined text-slate-500 text-sm">schedule</span>
          </div>
        </div>
      </div>

      {/* Bottom Mobile Inspector Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-16 bg-slate-950 border-t border-slate-800 flex items-center justify-around px-4 z-20">
        <button
          onClick={() => onNavigate('inspector-home')}
          className="flex flex-col items-center text-blue-400 text-[10px] font-medium"
        >
          <span className="material-symbols-outlined text-[22px]">home</span>
          <span>Home</span>
        </button>

        <button
          onClick={() => onNavigate('inspector-gps')}
          className="flex flex-col items-center text-slate-400 hover:text-white text-[10px]"
        >
          <span className="material-symbols-outlined text-[22px]">pin_drop</span>
          <span>GPS Verify</span>
        </button>

        <button
          onClick={() => onNavigate('inspector-checklist')}
          className="flex flex-col items-center text-slate-400 hover:text-white text-[10px]"
        >
          <span className="material-symbols-outlined text-[22px]">fact_check</span>
          <span>Checklist</span>
        </button>

        <button
          onClick={() => onNavigate('persona-select')}
          className="flex flex-col items-center text-slate-400 hover:text-white text-[10px]"
        >
          <span className="material-symbols-outlined text-[22px]">switch_account</span>
          <span>Exit App</span>
        </button>
      </div>
    </div>
  );
};
