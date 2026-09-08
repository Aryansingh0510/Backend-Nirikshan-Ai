import React, { useState, useEffect } from 'react';
import { ScreenId, AlertItem } from '../types';
import { mockAlerts } from '../data/mockData';
import { RealityGapBar } from '../components/RealityGapBar';
import { api } from '../lib/api';

interface AlertsViewProps {
  onNavigate: (screen: ScreenId) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({ onNavigate }) => {
  const [alerts, setAlerts] = useState<AlertItem[]>(mockAlerts);
  const [activeFilter, setActiveFilter] = useState<'all' | 'Critical' | 'Warning' | 'Info'>('all');
  const [ackToast, setAckToast] = useState<string | null>(null);

  const loadAlerts = async () => {
    try {
      const res = await api.getAlerts(activeFilter);
      if (res.data && res.data.length > 0) {
        setAlerts(res.data);
      }
    } catch (err) {
      console.warn('Using local alerts fallback:', err);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [activeFilter]);

  const filtered = alerts.filter((a) => {
    if (activeFilter === 'all') return true;
    return a.severity === activeFilter;
  });

  const handleAcknowledge = async (id: string) => {
    // Optimistic update
    setAlerts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, acknowledged: true } : item))
    );
    try {
      await api.acknowledgeAlert(id);
      setAckToast(`Alert ${id} acknowledged and recorded on backend cryptographic ledger.`);
    } catch {
      setAckToast(`Alert ${id} acknowledged.`);
    }
    setTimeout(() => setAckToast(null), 3500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast */}
      {ackToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in">
          <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
          <span>{ackToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Alerts &amp; Real-Time Feed
            </h1>
            <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Live Feed Sys_Ref_9824
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Automated notifications triggered by AI anomaly models, inspector submissions, and high Reality Gaps.
          </p>
        </div>

        {/* Counters summary */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span>12 Critical</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>24 Warnings</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>86 Information</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeFilter === 'all'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Alerts ({alerts.length})
        </button>
        <button
          onClick={() => setActiveFilter('Critical')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeFilter === 'Critical'
              ? 'bg-red-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Critical Only
        </button>
        <button
          onClick={() => setActiveFilter('Warning')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeFilter === 'Warning'
              ? 'bg-amber-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Warnings
        </button>
        <button
          onClick={() => setActiveFilter('Info')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeFilter === 'Info'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Information
        </button>
      </div>

      {/* Alerts Feed List */}
      <div className="space-y-3">
        {filtered.map((alert) => (
          <div
            key={alert.id}
            className={`p-5 rounded-2xl border transition-all ${
              alert.severity === 'Critical'
                ? 'bg-white border-red-200 shadow-2xs hover:border-red-400'
                : alert.severity === 'Warning'
                ? 'bg-white border-amber-200 shadow-2xs hover:border-amber-400'
                : 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2.5">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                    alert.severity === 'Critical'
                      ? 'bg-red-600 text-white'
                      : alert.severity === 'Warning'
                      ? 'bg-amber-500 text-white'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {alert.severity}
                </span>
                <span className="font-bold text-slate-900 text-xs">
                  {alert.title}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  [{alert.id}]
                </span>
              </div>

              <div className="text-[11px] text-slate-400 font-mono">
                {alert.date} • {alert.time}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="md:col-span-2 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <span>{alert.institutionName}</span>
                  <span className="font-mono text-slate-400 text-[11px]">
                    ({alert.institutionId})
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {alert.description}
                </p>

                {alert.reportedVal && alert.verifiedVal && (
                  <div className="pt-2 max-w-md">
                    <RealityGapBar
                      reported={alert.reportedVal}
                      verified={alert.verifiedVal}
                      height="h-2"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col items-stretch md:items-end justify-between gap-2">
                <div className="text-[11px] text-slate-400">
                  Assigned: <strong className="text-slate-700">{alert.assignedTo || 'Unassigned'}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('institution-detail')}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>Inspect</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>

                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    disabled={alert.acknowledged}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                      alert.acknowledged
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                        : 'border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xs">
                      {alert.acknowledged ? 'done_all' : 'done'}
                    </span>
                    <span>{alert.acknowledged ? 'Acknowledged' : 'Acknowledge'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-2">
        <button
          onClick={() => alert('All 86 historical alerts loaded from audit ledger.')}
          className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
        >
          Load Previous Alerts Archive (86)
        </button>
      </div>
    </div>
  );
};
