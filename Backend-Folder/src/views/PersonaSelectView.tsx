import React from 'react';
import { ScreenId } from '../types';

interface PersonaSelectViewProps {
  onSelectPersona: (persona: 'official' | 'inspector' | 'institution', screenId: ScreenId) => void;
}

export const PersonaSelectView: React.FC<PersonaSelectViewProps> = ({ onSelectPersona }) => {
  return (
    <div className="min-h-screen bg-[#f7f9fb] text-slate-900 flex flex-col justify-between p-6 sm:p-12">
      {/* Header */}
      <header className="max-w-5xl mx-auto w-full pt-4 sm:pt-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/80 text-slate-700 text-xs font-semibold tracking-wider uppercase mb-4">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          System Prototype Initialization
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
          Select Operational Persona
        </h1>
        <p className="text-slate-600 max-w-2xl text-sm sm:text-base leading-relaxed">
          Choose an interface perspective to experience Nirikshan AI&apos;s continuous ground-truth auditing and discrepancy detection ecosystem.
        </p>
      </header>

      {/* 3 Persona Cards Grid */}
      <main className="max-w-5xl mx-auto w-full my-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Government Official */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group hover:border-slate-400">
          <div>
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">account_balance</span>
            </div>
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 inline-block mb-3">
              Strategic Oversight
            </span>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Government Official</h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Program Management Unit (PMU) &amp; District Administrators overseeing compliance, systemic gaps, and surprise inspections.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-sm mt-0.5">check_circle</span>
                <span>Executive Reality Gap KPI dashboards</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-sm mt-0.5">check_circle</span>
                <span>Automated risk scoring &amp; surprise audit trigger</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-sm mt-0.5">check_circle</span>
                <span>Discrepancy pattern intelligence &amp; analytics</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => onSelectPersona('official', 'dashboard')}
            className="mt-8 w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold tracking-wide uppercase flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <span>Access PMU Console</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        {/* Card 2: Field Inspector */}
        <div className="bg-white rounded-2xl border-2 border-slate-900 p-6 sm:p-7 shadow-md flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-slate-900 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider">
            Primary Action
          </div>
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-xs">
              <span className="material-symbols-outlined text-2xl">verified_user</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 inline-block mb-3">
              Tactical Execution
            </span>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Field Inspector</h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              On-ground verification officers conducting physical headcounts, GPS boundary checks, and unannounced spot audits.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-sm mt-0.5">check_circle</span>
                <span>Cryptographic GPS &amp; timestamp verification lock</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-sm mt-0.5">check_circle</span>
                <span>Adaptive checklist with dynamic anomaly prompts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-sm mt-0.5">check_circle</span>
                <span>Offline-first media &amp; biometric evidence capture</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => onSelectPersona('inspector', 'inspector-home')}
            className="mt-8 w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold tracking-wide uppercase flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <span>Access Inspector App</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        {/* Card 3: Institution / NGO */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group hover:border-slate-400">
          <div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform border border-slate-200">
              <span className="material-symbols-outlined text-2xl">domain</span>
            </div>
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100 inline-block mb-3">
              Compliance &amp; Submission
            </span>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Institution / NGO</h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Registered facility administrators submitting self-reported attendance, infrastructure, and fund expenditure claims.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-sm mt-0.5">check_circle</span>
                <span>Grant compliance self-reporting portal</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-sm mt-0.5">check_circle</span>
                <span>Biometric staff &amp; beneficiary registry sync</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-sm mt-0.5">check_circle</span>
                <span>Audit clarification &amp; rebuttal submission</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => onSelectPersona('official', 'institution-detail')}
            className="mt-8 w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold tracking-wide uppercase flex items-center justify-center gap-2 transition-colors border border-slate-200"
          >
            <span>Access Institution View</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </main>

      {/* Featured Guided Demo Workflow bar */}
      <footer className="max-w-5xl mx-auto w-full bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-blue-400">
            <span className="material-symbols-outlined text-sm">play_circle</span>
            INTEGRATED DEMONSTRATION WORKFLOW
          </div>
          <h2 className="text-lg font-bold">Experience the Complete Verification Cycle</h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Simulate how a routine check triggers an AI adaptive prompt, logs ground evidence, and flags a 28% Reality Gap on the PMU Director dashboard.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => onSelectPersona('inspector', 'inspector-gps')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-colors whitespace-nowrap shadow-xs"
          >
            <span>Run Full Demo</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
          <button
            onClick={() => onSelectPersona('official', 'login')}
            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-sm">login</span>
            <span>Login Screen</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
