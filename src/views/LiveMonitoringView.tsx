import React, { useState, useEffect } from 'react';
import { ScreenId } from '../types';
import { api, InspectorTelemetry } from '../lib/api';

interface LiveMonitoringViewProps {
  onNavigate: (screen: ScreenId) => void;
}

export const LiveMonitoringView: React.FC<LiveMonitoringViewProps> = ({ onNavigate }) => {
  const [telemetry, setTelemetry] = useState<InspectorTelemetry[]>([]);
  const [loading, setLoading] = useState(true);
  const [pingSuccess, setPingSuccess] = useState<string | null>(null);

  const loadTelemetry = async () => {
    try {
      const res = await api.getTelemetry();
      if (res.data && res.data.length > 0) {
        setTelemetry(res.data);
      }
    } catch (err) {
      console.warn('Using local telemetry fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTelemetry();
  }, []);

  const handleSimulatePing = async () => {
    try {
      const res = await api.pingTelemetry({
        inspectorId: 'INSP-492',
        inspectorName: 'Inspector Priya Nair',
        targetInstitutionId: 'NIR-8821',
        latitude: 19.03305,
        longitude: 73.02975,
        accuracyMeters: 3.8,
      });
      setPingSuccess(
        `Telemetry Ping Received: ${res.data.distanceToPerimeterMeters ?? 0}m from target (${
          res.data.isWithinGeofence ? 'Geofence LOCKED' : 'Approaching Geofence'
        })`
      );
      loadTelemetry();
    } catch {
      setPingSuccess('Telemetry Ping Dispatched');
    }
    setTimeout(() => setPingSuccess(null), 3500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast */}
      {pingSuccess && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in">
          <span className="material-symbols-outlined text-emerald-400 text-sm">satellite_alt</span>
          <span>{pingSuccess}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Live Monitoring Stream
            </h1>
            <span className="flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
              Backend Telemetry Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Active GPS positions, telemetry pings, and field auditor tracking across Maharashtra state.
          </p>
        </div>

        <button
          onClick={handleSimulatePing}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">sensors</span>
          <span>Send Live GPS Fix to Backend</span>
        </button>
      </div>

      {/* Map Simulation Container */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 text-white relative overflow-hidden h-96 shadow-lg flex flex-col justify-between">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <span className="material-symbols-outlined text-emerald-400 text-base">radar</span>
            <span>ACTIVE MONITORED NODES: 845</span>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Map Engine: Satellite Ground Layer
          </div>
        </div>

        {/* Pulsing Hotspot pins */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-red-500/60 backdrop-blur-xs">
            <div className="flex items-center justify-between text-[11px] text-red-400 font-bold mb-1">
              <span>Navi Mumbai Zone</span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            </div>
            <div className="text-sm font-extrabold text-white">ABC Welfare Centre</div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">Inspector INSP-492 on-site</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-red-500/60 backdrop-blur-xs">
            <div className="flex items-center justify-between text-[11px] text-red-400 font-bold mb-1">
              <span>Mumbai Suburban</span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            </div>
            <div className="text-sm font-extrabold text-white">St. Xavier&apos;s High School</div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">Discrepancy 27% Flagged</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 backdrop-blur-xs">
            <div className="flex items-center justify-between text-[11px] text-slate-300 font-bold mb-1">
              <span>Nashik PWD</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <div className="text-sm font-extrabold text-white">Water Works Unit 4</div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">Telemetry Verified (3% Gap)</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-amber-500/60 backdrop-blur-xs">
            <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold mb-1">
              <span>Thane Sub-District</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            </div>
            <div className="text-sm font-extrabold text-white">Apeksha Orphanage</div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">Surprise Squad En Route</div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
          <span>Lat: 19.0760° N | Lon: 72.8777° E | Cryptographic Ledger Sync: Active</span>
          <button
            onClick={() => onNavigate('institution-detail')}
            className="text-blue-400 hover:underline font-semibold"
          >
            Open Active Target Details →
          </button>
        </div>
      </div>

      {/* Active Field Inspectors table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Active Field Inspectors in Transit</h2>
          <span className="text-xs text-slate-500">14 Officers Deployed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Officer Name &amp; ID</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">GPS Accuracy</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900">
                  Priya Nair (INSP-492)
                </td>
                <td className="py-3 px-4">ABC Welfare Centre (NIR-8821)</td>
                <td className="py-3 px-4 text-emerald-600 font-mono font-semibold">± 4.2m (Locked)</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold text-[11px]">
                    Checklist in Progress
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => onNavigate('inspector-checklist')}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    View Screen
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900">
                  Rajesh Mane (INSP-811)
                </td>
                <td className="py-3 px-4">St. Xavier&apos;s High School (SCH-0942)</td>
                <td className="py-3 px-4 text-emerald-600 font-mono font-semibold">± 6.1m (Locked)</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold text-[11px]">
                    En Route (8 mins)
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => onNavigate('inspector-gps')}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Track GPS
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
