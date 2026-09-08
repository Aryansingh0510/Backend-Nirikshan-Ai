import React, { useState, useEffect } from 'react';
import { ScreenId, Institution } from '../types';
import { sampleImages } from '../data/mockData';
import { RealityGapBar } from '../components/RealityGapBar';
import { api, AIDiscrepancyAnalysis } from '../lib/api';

interface InstitutionDetailViewProps {
  institution?: Institution;
  onNavigate: (screen: ScreenId) => void;
  onTriggerSurpriseModal: () => void;
}

export const InstitutionDetailView: React.FC<InstitutionDetailViewProps> = ({
  institution,
  onNavigate,
  onTriggerSurpriseModal,
}) => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'overview' | 'history' | 'ai' | 'evidence'>('comparison');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [clarificationSent, setClarificationSent] = useState(false);
  const [escalated, setEscalated] = useState(false);

  // AI Analysis state
  const [aiAnalysis, setAiAnalysis] = useState<AIDiscrepancyAnalysis | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSource, setAiSource] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Defaults if institution not passed
  const inst = institution || {
    id: 'NIR-8821',
    name: 'ABC Welfare Centre',
    location: 'Sector 14, Urban Zone C, Navi Mumbai',
    state: 'Maharashtra',
    district: 'Thane',
    type: 'Welfare',
    riskScore: 78,
    reportedCompliance: 91,
    verifiedCompliance: 63,
    realityGap: 28,
    lastInspectionDate: '14 Oct 2023',
    inspectionMethod: 'Field Agent',
    status: 'Critical',
    activeStaffReported: 12,
    activeStaffVerified: 7,
    beneficiariesReported: 85,
    beneficiariesVerified: 51,
    facilityStatusReported: 'Operational (Full)',
    facilityStatusObserved: 'Partially Operational',
    facilityNotes: 'North wing closed for unrecorded maintenance. Medical dispensary locked during mandated hours.',
    zone: 'Urban Zone C',
  };

  const handleLoadAI = async () => {
    setAiLoading(true);
    try {
      const res = await api.analyzeDiscrepancyAI({
        institutionId: inst.id,
        name: inst.name,
        type: inst.type,
        location: inst.location,
        reportedCompliance: inst.reportedCompliance,
        verifiedCompliance: inst.verifiedCompliance,
        realityGap: inst.realityGap,
        staffReported: inst.activeStaffReported,
        staffVerified: inst.activeStaffVerified,
        beneficiariesReported: inst.beneficiariesReported,
        beneficiariesVerified: inst.beneficiariesVerified,
        facilityNotes: inst.facilityNotes,
      });
      setAiAnalysis(res.data);
      setAiSource(res.source);
    } catch (err) {
      console.error('Failed to run AI analysis:', err);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'ai' && !aiAnalysis && !aiLoading) {
      handleLoadAI();
    }
  }, [activeTab]);

  return (
    <div className="space-y-6 pb-16">
      {/* Alert Banner */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[18px]">warning</span>
          </div>
          <div>
            <span className="font-bold text-red-900 uppercase tracking-wider text-[11px] block">
              High Discrepancy Detected
            </span>
            <span className="text-red-700">
              Reality Gap of <strong>28%</strong> exceeds the 15% institutional tolerance threshold. Review verified data points below.
            </span>
          </div>
        </div>
        <button
          onClick={() => onNavigate('alerts')}
          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold whitespace-nowrap transition-colors"
        >
          View Alert Details
        </button>
      </div>

      {/* Header Info Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1 text-slate-400 text-xs">
              <button
                onClick={() => onNavigate('institutions')}
                className="hover:text-slate-800 flex items-center gap-1 font-medium"
              >
                <span>Institutions</span>
                <span>/</span>
              </button>
              <span className="font-mono font-bold text-slate-600">{inst.id}</span>
              <span>•</span>
              <span className="uppercase tracking-wider">{inst.zone}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {inst.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              {inst.location} • Registered facility providing certified welfare support, rehabilitation, and grant-subsidized care.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Risk Score
              </div>
              <div className="text-2xl font-black text-red-600 mt-0.5">
                {inst.riskScore}<span className="text-sm font-normal text-slate-400">/100</span>
              </div>
              <div className="text-[10px] font-semibold text-red-600 uppercase">High Risk</div>
            </div>

            <div className="h-10 w-px bg-slate-200" />

            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Reality Gap
              </div>
              <div className="text-2xl font-black text-slate-900 mt-0.5">
                {inst.realityGap}%
              </div>
              <div className="text-[10px] font-semibold text-red-600 uppercase">Severe Delta</div>
            </div>

            <div className="h-10 w-px bg-slate-200" />

            <div className="text-right">
              <button
                onClick={onTriggerSurpriseModal}
                className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">bolt</span>
                <span>Surprise Audit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-b border-slate-200 mt-6 -mb-6 overflow-x-auto text-xs font-semibold text-slate-500">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'comparison'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
            <span>Reported vs Verified</span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'overview'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">info</span>
            <span>Facility Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'history'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">history</span>
            <span>Inspection Log</span>
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'ai'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">psychology</span>
            <span>AI Anomaly Analysis</span>
          </button>
          <button
            onClick={() => setActiveTab('evidence')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'evidence'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">photo_library</span>
            <span>Evidence Media (12)</span>
          </button>
        </div>
      </div>

      {/* AI Diagnostic Summary Card */}
      <div className="bg-white rounded-2xl border border-blue-200 p-5 shadow-2xs flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-2xl">auto_awesome</span>
        </div>
        <div className="text-xs">
          <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
            AI Diagnostic Summary • Discrepancy Confidence 94.2%
          </div>
          <p className="text-slate-600 leading-relaxed">
            Discrepancy pattern indicates persistent over-reporting in staff headcount (<strong className="text-red-700">-41.6%</strong>) and beneficiary attendance (<strong className="text-red-700">-40.0%</strong>). Spatial biometric signatures and on-ground inspection corroborate low active occupancy during mandated operational hours.
          </p>
        </div>
      </div>

      {/* AI Analysis Tab Panel */}
      {activeTab === 'ai' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  AI Discrepancy & Root-Cause Intelligence Engine
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">
                  {aiSource ? (aiSource.includes('gemini') ? 'Gemini 3.8 Flash' : 'Deterministic Engine') : 'Gemini AI'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Automated forensic reconciliation between self-reported compliance and physical ground observation.
              </p>
            </div>
            <button
              onClick={handleLoadAI}
              disabled={aiLoading}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span className={`material-symbols-outlined text-sm ${aiLoading ? 'animate-spin' : ''}`}>
                {aiLoading ? 'refresh' : 'auto_awesome'}
              </span>
              <span>{aiLoading ? 'Analyzing Ground Data...' : 'Re-Run AI Forensic Audit'}</span>
            </button>
          </div>

          {aiLoading && (
            <div className="p-8 text-center space-y-3">
              <div className="w-10 h-10 mx-auto rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
              <div className="text-xs font-semibold text-slate-700">
                Running forensic analysis on {inst.name} records...
              </div>
              <p className="text-[11px] text-slate-400">
                Evaluating attendance rosters, spatial biometric signatures, and facility photo telemetry.
              </p>
            </div>
          )}

          {!aiLoading && aiAnalysis && (
            <div className="space-y-6 text-xs">
              {/* Executive Summary */}
              <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                    Executive Intelligence Briefing
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    aiAnalysis.severity === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
                  }`}>
                    {aiAnalysis.severity} RISK
                  </span>
                </div>
                <p className="text-slate-800 leading-relaxed text-xs">
                  {aiAnalysis.executiveSummary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Root Causes */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-red-600">report_problem</span>
                    Root Cause Factors Identified
                  </h3>
                  <ul className="space-y-2 text-slate-600 text-xs">
                    {aiAnalysis.rootCauses.map((cause, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">•</span>
                        <span>{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Financial Risk & Sanction */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-amber-600">payments</span>
                      Estimated Financial Leakage
                    </h3>
                    <p className="text-slate-700 font-semibold mt-1">
                      {aiAnalysis.financialRiskEstimate}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Recommended PMU Directive
                    </span>
                    <p className="text-slate-800 font-bold text-xs mt-0.5">
                      {aiAnalysis.recommendedAction}
                    </p>
                  </div>
                </div>
              </div>

              {/* Targeted Audit Checklist */}
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-2">
                <h3 className="font-bold text-blue-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-blue-600">checklist</span>
                  Targeted Protocol for Follow-Up Inspection
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {aiAnalysis.targetedAuditChecklist.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-white border border-blue-200/80 flex items-start gap-2">
                      <span className="text-blue-600 font-bold text-xs">{idx + 1}.</span>
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formal Notice Draft */}
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-400 text-sm">gavel</span>
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Draft Statutory Show-Cause Notice (PMU Form-9B)
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(aiAnalysis.formalInquiryDraft);
                      setCopySuccess(true);
                      setTimeout(() => setCopySuccess(false), 2000);
                    }}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {copySuccess ? 'check' : 'content_copy'}
                    </span>
                    <span>{copySuccess ? 'Copied!' : 'Copy Notice'}</span>
                  </button>
                </div>
                <pre className="text-[11px] font-mono whitespace-pre-wrap bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300 leading-relaxed max-h-48 overflow-y-auto">
                  {aiAnalysis.formalInquiryDraft}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Grid: Comparison Column Left + Evidence/Geo Right */}
      {activeTab !== 'ai' && (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Side-by-Side Dual Comparison */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Column 1: Self-Reported Data */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Self-Submitted Data
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">Reported Reality</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  01-Oct-2023
                </span>
              </div>

              <div className="space-y-4">
                {/* Metric 1 */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Active Staff Headcount
                  </div>
                  <div className="text-xl font-extrabold text-slate-900">
                    {inst.activeStaffReported} Personnel
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Full duty roster logged in central grant portal.
                  </p>
                </div>

                {/* Metric 2 */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Daily Beneficiaries Count
                  </div>
                  <div className="text-xl font-extrabold text-slate-900">
                    {inst.beneficiariesReported} Individuals
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Target capacity utilized: 94.4% claimed.
                  </p>
                </div>

                {/* Metric 3 */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Facility Operational Status
                  </div>
                  <div className="text-base font-bold text-emerald-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {inst.facilityStatusReported}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    All 4 operational wings reported fully functional.
                  </p>
                </div>
              </div>
            </div>

            {/* Column 2: Ground Verified Data */}
            <div className="bg-white rounded-2xl border-2 border-red-300 p-5 shadow-sm relative">
              <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                Field Audit
              </div>

              <div className="pb-3 border-b border-red-100 mb-4">
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block">
                  Ground-Truth Audit
                </span>
                <h3 className="font-bold text-slate-900 text-sm">Ground Reality (Verified)</h3>
                <span className="text-[11px] font-mono text-slate-500">
                  14-Oct-2023 • Inspector INSP-492
                </span>
              </div>

              <div className="space-y-4">
                {/* Metric 1 */}
                <div className="p-3.5 rounded-xl bg-red-50/50 border border-red-200">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    <span>Active Staff Headcount</span>
                    <span className="text-red-700 font-bold">-41.6% Gap</span>
                  </div>
                  <div className="text-xl font-extrabold text-red-700 flex items-center gap-2">
                    <span>{inst.activeStaffVerified} Personnel</span>
                    <span className="text-xs font-normal text-slate-400">(-5 missing)</span>
                  </div>
                  <div className="mt-2">
                    <RealityGapBar reported={inst.activeStaffReported * 8} verified={inst.activeStaffVerified * 8} height="h-2" showLabels={false} />
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="p-3.5 rounded-xl bg-red-50/50 border border-red-200">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    <span>Daily Beneficiaries Count</span>
                    <span className="text-red-700 font-bold">-40.0% Gap</span>
                  </div>
                  <div className="text-xl font-extrabold text-red-700 flex items-center gap-2">
                    <span>{inst.beneficiariesVerified} Individuals</span>
                    <span className="text-xs font-normal text-slate-400">(-34 missing)</span>
                  </div>
                  <div className="mt-2">
                    <RealityGapBar reported={85} verified={51} height="h-2" showLabels={false} />
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Observed Operational Status
                  </div>
                  <div className="text-base font-bold text-amber-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    {inst.facilityStatusObserved}
                  </div>
                  <p className="text-[11px] text-amber-900 mt-1">
                    {inst.facilityNotes}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="text-xs text-slate-500">
              Audited by: <strong>Inspector Priya Nair (INSP-492)</strong> • Cryptographically signed with Device GPS
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setClarificationSent(true);
                  setTimeout(() => setClarificationSent(false), 3500);
                }}
                className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">mail</span>
                <span>{clarificationSent ? 'Clarification Requested!' : 'Request Clarification'}</span>
              </button>

              <button
                onClick={() => {
                  setEscalated(true);
                  setTimeout(() => setEscalated(false), 3500);
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">priority_high</span>
                <span>{escalated ? 'Escalated to PMU!' : 'Escalate to PMU'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Evidence Media & Geo Context */}
        <div className="space-y-4">
          {/* Evidence Photos Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Inspection Media (Evidence)
              </h3>
              <span className="text-[11px] text-blue-600 font-semibold cursor-pointer hover:underline">
                12 Items
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div
                onClick={() => setSelectedPhoto(sampleImages.inspectionHall)}
                className="group relative rounded-xl overflow-hidden border border-slate-200 cursor-pointer h-28 bg-slate-100"
              >
                <img
                  src={sampleImages.inspectionHall}
                  alt="Inspection Hall"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-2">
                  <span className="text-[10px] text-white font-medium">Main Hall (Occupancy)</span>
                </div>
              </div>

              <div
                onClick={() => setSelectedPhoto(sampleImages.attendanceRegister)}
                className="group relative rounded-xl overflow-hidden border border-slate-200 cursor-pointer h-28 bg-slate-100"
              >
                <img
                  src={sampleImages.attendanceRegister}
                  alt="Register"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-2">
                  <span className="text-[10px] text-white font-medium">Register Discrepancy</span>
                </div>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-slate-500 leading-snug">
              Photos stamped with tamper-proof SHA-256 hash and satellite coordinates at 11:24 IST.
            </div>
          </div>

          {/* Geo-Context Mini Map Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Geofence Verification
              </h3>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                Locked (18m)
              </span>
            </div>

            {/* Visual satellite mockup container */}
            <div className="w-full h-36 rounded-xl bg-slate-800 relative overflow-hidden border border-slate-300 flex items-center justify-center">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:12px_12px]" />
              <div className="relative z-10 text-center text-white space-y-1">
                <div className="w-8 h-8 mx-auto rounded-full bg-blue-500/30 border-2 border-blue-400 flex items-center justify-center animate-ping">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                </div>
                <div className="text-[11px] font-mono text-slate-200 font-semibold">
                  19.0330° N, 73.0297° E
                </div>
                <div className="text-[10px] text-slate-400">
                  Urban Zone C, Navi Mumbai
                </div>
              </div>
            </div>

            <div className="mt-3 space-y-1 text-xs">
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Accuracy Radius:</span>
                <strong className="text-slate-800">± 4.2 meters</strong>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Device Fingerprint:</span>
                <strong className="text-slate-800 font-mono">DEV-TAB-892</strong>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Inspection Method:</span>
                <strong className="text-slate-800">On-Site Physical Audit</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Lightbox photo modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-4 overflow-hidden border border-slate-200 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-100">
              <div className="text-xs font-bold text-slate-800 uppercase">
                Evidence Record • High Resolution
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="text-slate-400 hover:text-slate-600 text-base"
              >
                ✕
              </button>
            </div>
            <img
              src={selectedPhoto}
              alt="Inspection zoomed evidence"
              className="w-full h-80 object-cover rounded-xl border border-slate-200"
            />
            <div className="mt-3 text-xs text-slate-500 flex items-center justify-between">
              <span>Timestamp: 14-Oct-2023 11:24:12 IST</span>
              <span className="font-mono text-[11px]">Hash: 8a9f2c...4e1d</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
