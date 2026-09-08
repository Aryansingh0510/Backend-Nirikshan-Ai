import React, { useState, useEffect } from 'react';
import { ScreenId, Institution } from '../types';
import { mockInstitutions } from '../data/mockData';
import { RealityGapBar } from '../components/RealityGapBar';
import { api, AnalyticsOverview } from '../lib/api';

interface DashboardViewProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectInstitution?: (inst: Institution) => void;
  onTriggerSurpriseModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onSelectInstitution,
  onTriggerSurpriseModal,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'critical' | 'pending'>('all');
  const [institutions, setInstitutions] = useState<Institution[]>(mockInstitutions);
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [instRes, analyticsRes] = await Promise.all([
          api.getInstitutions(),
          api.getAnalyticsOverview(),
        ]);
        if (instRes.data && instRes.data.length > 0) {
          setInstitutions(instRes.data);
        }
        if (analyticsRes.data) {
          setAnalytics(analyticsRes.data);
        }
      } catch (err) {
        console.warn('Using local fallback in DashboardView:', err);
      }
    };
    fetchData();
  }, []);

  const filteredInstitutions = institutions.filter((inst) => {
    if (filterTab === 'critical') return inst.realityGap >= 20;
    if (filterTab === 'pending') return inst.status === 'Warning';
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Welcome & Surprise Trigger Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-2xl overflow-hidden border-2 border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80"
              alt="S. Rameshwar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Ground Reality Monitoring
              </h1>
              <span className="hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                Live State Matrix
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Verify what institutions report against what physical ground inspections reveal.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => onNavigate('reality-gap-analytics')}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">analytics</span>
            <span>Analytics Hub</span>
          </button>
          <button
            onClick={onTriggerSurpriseModal}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            <span>Trigger Surprise Inspection</span>
          </button>
        </div>
      </div>

      {/* 6 Key Performance Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Institutions
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {analytics ? analytics.totalInstitutions.toLocaleString() : '1,248'}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <span>↑ 12%</span>
            <span className="text-slate-400 text-[10px]">vs last qtr</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Audits This Month
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {analytics ? analytics.auditsThisMonth : '186'}
          </div>
          <div className="text-[11px] text-blue-600 font-medium mt-1 flex items-center gap-1">
            <span>↑ 8%</span>
            <span className="text-slate-400 text-[10px]">target met</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-red-200 bg-red-50/20 shadow-2xs">
          <div className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
            High Risk Entities
          </div>
          <div className="text-2xl font-extrabold text-red-700 mt-1">
            {analytics ? analytics.highRiskEntities : '47'}
          </div>
          <div className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
            <span>↑ 4</span>
            <span className="text-slate-400 text-[10px]">active watch</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Reported Compliance
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {analytics ? `${analytics.reportedComplianceAvg}%` : '82%'}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1">
            <span>Self-reported avg</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-2xs">
          <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
            Avg Reality Gap
          </div>
          <div className="text-2xl font-extrabold text-amber-900 mt-1">
            {analytics ? `${analytics.avgRealityGap}%` : '17%'}
          </div>
          <div className="text-[11px] text-amber-700 font-medium mt-1 flex items-center gap-1">
            <span>Variance detected</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Pending Follow-ups
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {analytics ? analytics.pendingFollowUps : '23'}
          </div>
          <div className="text-[11px] text-purple-600 font-medium mt-1 flex items-center gap-1">
            <span>Requires PMU action</span>
          </div>
        </div>
      </div>

      {/* Signature Reality Gap Highlight Banner (ABC Welfare Centre) */}
      <div className="bg-white rounded-2xl border-2 border-red-200 p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl tracking-wider uppercase flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
          Critical Discrepancy Detected
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 font-mono">NIR-8821</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="text-xs font-semibold text-slate-600">Urban Zone C • Navi Mumbai</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              ABC Welfare Centre
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unannounced physical audit by Inspector INSP-492 revealed significant headcount shortage in staff roster and mid-day beneficiary attendance compared to claimed figures.
            </p>

            {/* Main Reality Gap Gauge */}
            <div className="pt-2">
              <div className="flex items-center gap-6 mb-2">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Self-Reported</span>
                  <span className="text-lg font-bold text-slate-700">91%</span>
                </div>
                <div className="text-slate-300 text-lg">→</div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Ground Verified</span>
                  <span className="text-lg font-bold text-slate-900">63%</span>
                </div>
                <div className="text-slate-300 text-lg">=</div>
                <div>
                  <span className="text-[11px] text-red-500 block font-bold">Reality Gap</span>
                  <span className="text-lg font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                    28% Discrepancy
                  </span>
                </div>
              </div>
              <RealityGapBar reported={91} verified={63} height="h-3" showLabels={false} />
            </div>
          </div>

          {/* Breakdown Mini Cards */}
          <div className="lg:w-96 space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
              <span>Discrepancy Breakdown</span>
              <span className="text-[10px] text-red-600 font-bold bg-red-100 px-1.5 py-0.5 rounded">High Severity</span>
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="font-medium text-slate-700">Staff Attendance</span>
                  <span className="font-bold text-red-700">42% Gap (7 ver. vs 12 rep.)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex">
                  <div className="bg-slate-900 w-[58%]" />
                  <div className="bg-red-500 w-[42%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="font-medium text-slate-700">Beneficiary Headcount</span>
                  <span className="font-bold text-red-700">40% Gap (51 ver. vs 85 rep.)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex">
                  <div className="bg-slate-900 w-[60%]" />
                  <div className="bg-red-500 w-[40%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="font-medium text-slate-700">Infrastructure Functionality</span>
                  <span className="font-bold text-amber-700">24% Gap (North wing closed)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex">
                  <div className="bg-slate-900 w-[76%]" />
                  <div className="bg-amber-500 w-[24%]" />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  if (onSelectInstitution) {
                    const inst = mockInstitutions.find((i) => i.id === 'NIR-8821');
                    if (inst) onSelectInstitution(inst);
                  }
                  onNavigate('institution-detail');
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Audit Details</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
              <button
                onClick={onTriggerSurpriseModal}
                className="py-2 px-3 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-xs text-red-600">report</span>
                <span>Escalate</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Institutions Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Institutions Requiring Attention</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked by discrepancy delta between self-declaration and physical audit.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-medium text-slate-600">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  filterTab === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'hover:text-slate-900'
                }`}
              >
                All ({mockInstitutions.length})
              </button>
              <button
                onClick={() => setFilterTab('critical')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  filterTab === 'critical' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'hover:text-slate-900'
                }`}
              >
                Critical Gap &gt; 20%
              </button>
              <button
                onClick={() => setFilterTab('pending')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  filterTab === 'pending' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'hover:text-slate-900'
                }`}
              >
                Warning
              </button>
            </div>

            <button
              onClick={() => onNavigate('institutions')}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              View All Directory →
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Institution</th>
                <th className="py-3 px-4">Type &amp; District</th>
                <th className="py-3 px-4">Risk Index</th>
                <th className="py-3 px-4 min-w-[200px]">Compliance &amp; Reality Gap</th>
                <th className="py-3 px-4">Last Inspected</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInstitutions.map((inst) => (
                <tr
                  key={inst.id}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  onClick={() => {
                    if (onSelectInstitution) onSelectInstitution(inst);
                    onNavigate('institution-detail');
                  }}
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 hover:text-blue-600 transition-colors">
                      {inst.name}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {inst.id}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-800 font-medium">{inst.type}</div>
                    <div className="text-[11px] text-slate-400">{inst.district}, {inst.state}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                        inst.riskScore >= 70
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : inst.riskScore >= 40
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {inst.riskScore} / 100
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <RealityGapBar
                      reported={inst.reportedCompliance}
                      verified={inst.verifiedCompliance}
                      height="h-2"
                    />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-800">{inst.lastInspectionDate}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[12px]">
                        {inst.inspectionMethod === 'Drone Survey'
                          ? 'flight'
                          : inst.inspectionMethod === 'AI Monitored'
                          ? 'psychology'
                          : 'person'}
                      </span>
                      <span>{inst.inspectionMethod}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectInstitution) onSelectInstitution(inst);
                        onNavigate('institution-detail');
                      }}
                      className="px-2.5 py-1.5 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors inline-flex items-center gap-1"
                    >
                      <span>Inspect</span>
                      <span className="material-symbols-outlined text-xs">chevron_right</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
