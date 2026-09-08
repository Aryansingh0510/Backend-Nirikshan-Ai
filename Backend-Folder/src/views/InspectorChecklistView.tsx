import React, { useState } from 'react';
import { ScreenId } from '../types';
import { sampleImages } from '../data/mockData';
import { api } from '../lib/api';

interface InspectorChecklistViewProps {
  onNavigate: (screen: ScreenId) => void;
  onSubmitComplete: () => void;
}

export const InspectorChecklistView: React.FC<InspectorChecklistViewProps> = ({
  onNavigate,
  onSubmitComplete,
}) => {
  const reportedCount = 12;
  const [observedCount, setObservedCount] = useState<number>(7);
  const [evidencePhotos, setEvidencePhotos] = useState<string[]>([sampleImages.attendanceRegister]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [notes, setNotes] = useState('Observed 5 staff members absent from duty roster during physical head roll.');
  const [submitted, setSubmitted] = useState(false);
  const [showTargetedProtocol, setShowTargetedProtocol] = useState(false);

  const variance = observedCount - reportedCount;
  const gapPercentage = Math.round(Math.abs(variance / reportedCount) * 100);
  const isFail = observedCount < reportedCount;

  const handleCapturePhoto = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      if (!evidencePhotos.includes(sampleImages.inspectionHall)) {
        setEvidencePhotos([...evidencePhotos, sampleImages.inspectionHall]);
      } else if (!evidencePhotos.includes(sampleImages.cracksEvidence)) {
        setEvidencePhotos([...evidencePhotos, sampleImages.cracksEvidence]);
      }
    }, 500);
  };

  const handleFinalSubmit = async () => {
    setSubmitted(true);
    try {
      await api.submitInspection({
        institutionId: 'NIR-8821',
        inspectorId: 'INSP-492',
        inspectorName: 'Inspector Priya Nair',
        verifiedStaff: observedCount,
        verifiedBeneficiaries: 51,
        facilityStatusObserved: 'Partially Operational',
        evidencePhotos,
        notes,
        latitude: 19.0330,
        longitude: 73.0297,
      });
    } catch (err) {
      console.warn('Inspection submit local fallback:', err);
    } finally {
      setTimeout(() => {
        onSubmitComplete();
      }, 1000);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-900 text-white flex flex-col justify-between pb-8 shadow-2xl">
      {/* Top Header */}
      <div className="p-4 pt-6 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => onNavigate('inspector-gps')}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          </button>
          <div className="text-center">
            <div className="text-[10px] font-mono text-slate-400">SURPRISE INSPECTION #4092</div>
            <div className="text-xs font-bold text-white">ABC Welfare Centre</div>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/60">
            GPS Lock
          </span>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
          <div className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-[13px]">check</span>
            <span>1. Infrastructure</span>
          </div>
          <div className="p-1.5 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center gap-1 shadow-sm">
            <span>2. Staff Attendance</span>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-800/60 text-slate-400 flex items-center justify-center gap-1">
            <span>3. Beneficiaries</span>
          </div>
        </div>
      </div>

      {/* Main Checklist Body */}
      <div className="p-5 space-y-5 flex-1 overflow-y-auto hide-scrollbar">
        {/* Question Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div>
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider font-bold">
              Checklist Item 2.1
            </span>
            <h2 className="text-base font-bold text-white mt-0.5">
              Verify Staff Headcount
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Physically count duty personnel on premises and cross-reference with institutional declaration.
            </p>
          </div>

          {/* Dual Counter */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                Reported via Portal
              </div>
              <div className="text-2xl font-extrabold text-blue-400 mt-1">
                {reportedCount} Staff
              </div>
              <div className="text-[10px] text-slate-500">Declared Capacity</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-center">
              <div className="text-[10px] text-slate-300 font-semibold uppercase">
                Observed Physical Count
              </div>
              <div className="flex items-center justify-center gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => setObservedCount(Math.max(0, observedCount - 1))}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center active:scale-95"
                >
                  -
                </button>
                <span className="text-2xl font-extrabold text-white font-mono">
                  {observedCount}
                </span>
                <button
                  type="button"
                  onClick={() => setObservedCount(observedCount + 1)}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center active:scale-95"
                >
                  +
                </button>
              </div>
              <div className="text-[10px] text-slate-400">Headcount Verified</div>
            </div>
          </div>

          {/* Dynamic Result Banner */}
          <div
            className={`p-3 rounded-xl border flex items-center justify-between text-xs font-semibold ${
              isFail
                ? 'bg-red-950/60 border-red-800 text-red-300'
                : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">
                {isFail ? 'error' : 'check_circle'}
              </span>
              <span>
                {isFail ? 'Result: FAIL' : 'Result: PASS'}
              </span>
            </div>
            <div className="font-mono">
              Variance: {variance} ({gapPercentage}% Reality Gap)
            </div>
          </div>
        </div>

        {/* AI Adaptive Trigger Box (When Discrepancy Occurs) */}
        {isFail && (
          <div className="bg-amber-950/80 border-2 border-amber-500 rounded-2xl p-4 space-y-3 shadow-lg animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider bg-amber-900/60 px-2 py-0.5 rounded border border-amber-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                Adaptive Trigger Initiated
              </span>
              <span className="text-[10px] text-amber-300/80 font-mono">Protocol #AD-49</span>
            </div>

            <div>
              <div className="text-xs font-bold text-amber-200">
                AI DISCREPANCY PROTOCOL TRIGGERED
              </div>
              <p className="text-xs text-amber-100/90 mt-1 leading-relaxed">
                Staff attendance discrepancy exceeds threshold. <strong>AI Suggestion:</strong> Verify 3 randomly selected staff members and capture photo evidence of the physical register.
              </p>
            </div>

            <button
              onClick={() => setShowTargetedProtocol(!showTargetedProtocol)}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>{showTargetedProtocol ? 'Hide Protocol Details' : 'Start Targeted Verification'}</span>
              <span className="material-symbols-outlined text-sm">
                {showTargetedProtocol ? 'expand_less' : 'arrow_forward'}
              </span>
            </button>

            {showTargetedProtocol && (
              <div className="p-3 rounded-xl bg-black/40 border border-amber-800 text-[11px] text-amber-200 space-y-1.5">
                <div className="font-bold text-amber-300">Targeted Checklist:</div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs text-amber-400">check_box</span>
                  <span>1. Check biometric log timestamp for Dr. R. Sharma</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs text-amber-400">check_box</span>
                  <span>2. Verify physical presence of Senior Nurse On-Duty</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs text-amber-400">check_box</span>
                  <span>3. Document signature mismatch in physical register</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Photo Evidence Capture Section */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
              Mandatory Photo Evidence ({evidencePhotos.length}/3)
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">Geo-Stamped</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {evidencePhotos.map((src, idx) => (
              <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-800 h-24 bg-slate-900">
                <img src={src} alt="Evidence" className="w-full h-full object-cover" />
                <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-emerald-400">
                  VERIFIED
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleCapturePhoto}
              disabled={isCapturing}
              className="rounded-xl border-2 border-dashed border-slate-700 hover:border-blue-500 bg-slate-900/60 flex flex-col items-center justify-center p-3 text-slate-400 hover:text-blue-400 transition-colors h-24"
            >
              <span className="material-symbols-outlined text-2xl mb-1">
                {isCapturing ? 'hourglass_empty' : 'photo_camera'}
              </span>
              <span className="text-[10px] font-semibold">
                {isCapturing ? 'Capturing...' : '+ Add Evidence Photo'}
              </span>
            </button>
          </div>

          {/* Notes Input */}
          <div className="pt-2">
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Field Inspector Observations
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <button
          onClick={handleFinalSubmit}
          disabled={submitted}
          className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98 disabled:opacity-75"
        >
          {submitted ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Syncing Discrepancy to PMU Director...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-sm">cloud_upload</span>
              <span>Save &amp; Submit Ground Audit</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
