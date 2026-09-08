import React, { useState } from 'react';
import { Institution, ScreenId } from '../types';
import { mockInstitutions } from '../data/mockData';

interface SurpriseInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDispatch: (instId: string, inspectorName: string, goToInspectorApp: boolean) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const SurpriseInspectionModal: React.FC<SurpriseInspectionModalProps> = ({
  isOpen,
  onClose,
  onDispatch,
}) => {
  const [selectedInstId, setSelectedInstId] = useState('NIR-8821');
  const [inspectorName, setInspectorName] = useState('Inspector Priya Nair (INSP-492)');
  const [urgency, setUrgency] = useState<'Immediate' | 'Within 2 Hours' | 'Scheduled End of Day'>('Immediate');
  const [simulateField, setSimulateField] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDispatch(selectedInstId, inspectorName, simulateField);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Trigger Surprise Ground Audit</h3>
              <p className="text-[11px] text-slate-500">Authorized by PMU Director</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Target Entity for Unannounced Audit
            </label>
            <select
              value={selectedInstId}
              onChange={(e) => setSelectedInstId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-semibold focus:outline-none focus:bg-white"
            >
              {mockInstitutions.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name} ({inst.id}) - Gap: {inst.realityGap}%
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Deploy to Field Auditor / Flying Squad
            </label>
            <select
              value={inspectorName}
              onChange={(e) => setInspectorName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:bg-white"
            >
              <option>Inspector Priya Nair (INSP-492) - 4.2km away</option>
              <option>Flying Squad Alpha (Squad ID SQ-10) - 8.1km away</option>
              <option>Inspector Rajesh Mane (INSP-811) - 14.5km away</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Inspection Urgency Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Immediate', 'Within 2 Hours', 'Scheduled End of Day'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setUrgency(lvl)}
                  className={`p-2 rounded-lg border text-center transition-colors text-[11px] font-semibold ${
                    urgency === lvl
                      ? 'bg-red-50 border-red-400 text-red-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={simulateField}
                onChange={(e) => setSimulateField(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-600"
              />
              <span className="font-semibold text-slate-800">
                Switch to Field Inspector App immediately
              </span>
            </label>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">send</span>
              <span>Deploy Inspection Squad</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
