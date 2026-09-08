import React, { useState } from 'react';
import { ScreenId } from '../types';
import { RealityGapBar } from '../components/RealityGapBar';

interface RealityGapAnalyticsViewProps {
  onNavigate: (screen: ScreenId) => void;
}

export const RealityGapAnalyticsView: React.FC<RealityGapAnalyticsViewProps> = ({ onNavigate }) => {
  const [selectedRange, setSelectedRange] = useState('Last 30 Days');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Trend data points Jan - Jun
  const trendMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const reportedTrend = [90, 92, 91, 94, 93, 95];
  const verifiedTrend = [72, 70, 74, 69, 71, 68];

  const topDiscrepancies = [
    { name: 'Govt. Polytechnic Pune', id: 'EDU-4012', reported: 96, verified: 54, gap: 42, category: 'Technical Education', district: 'Pune' },
    { name: 'SVN Medical College Sub-Centre', id: 'MED-8911', reported: 92, verified: 54, gap: 38, category: 'Healthcare', district: 'Solapur' },
    { name: 'ABC Welfare Centre', id: 'NIR-8821', reported: 91, verified: 63, gap: 28, category: 'Welfare', district: 'Navi Mumbai' },
    { name: 'Kendriya Vidyalaya No. 2', id: 'SCH-1092', reported: 88, verified: 64, gap: 24, category: 'Education', district: 'Thane' },
    { name: 'Regional Engineering Institute', id: 'ENG-6632', reported: 94, verified: 76, gap: 18, category: 'Infrastructure', district: 'Nashik' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Reality Gap Analytics
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 font-bold">
              Discrepancy Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Comprehensive analysis of systemic divergence between self-reported institutional data and physical ground verification.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="py-2 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-2xs focus:outline-none"
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last Quarter (Q3)</option>
            <option>Financial Year 2023-24</option>
          </select>

          <button
            onClick={() => alert('Exporting comprehensive Reality Gap dossier (PDF)...')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Export Analytics</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Average Reality Gap
          </div>
          <div className="text-3xl font-extrabold text-red-600 mt-1">18.4%</div>
          <div className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
            <span>↑ 2.1%</span>
            <span className="text-slate-400 text-[11px]">vs last month</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            High Risk Facilities
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">142</div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            Out of 845 total active facilities
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Primary Variance Vector
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">Staffing</div>
          <div className="text-xs text-amber-700 font-semibold mt-1">
            Avg 28.2% ghost headcount detected
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            AI Verification Confidence
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 mt-1">94.2%</div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-600 h-full w-[94.2%]" />
          </div>
        </div>
      </div>

      {/* Main Visuals Row: Trend Chart (Left) + Category Radar/Breakdown (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart (SVG) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h2 className="font-bold text-slate-900 text-sm">
                Systemic Reality Gap Trend (6 Months)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Self-Reported Claims vs Physically Verified Reality
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-3 h-1 bg-blue-500 rounded-full"></span>
                Reported
              </span>
              <span className="flex items-center gap-1.5 text-slate-900">
                <span className="w-3 h-1 bg-slate-900 rounded-full"></span>
                Verified
              </span>
              <span className="flex items-center gap-1.5 text-red-600">
                <span className="w-3 h-2 bg-red-100 border border-red-300 rounded"></span>
                Gap
              </span>
            </div>
          </div>

          {/* SVG Line Graph */}
          <div className="w-full h-64 relative pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200">
              {/* Horizontal Grid lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="160" x2="500" y2="160" stroke="#f1f5f9" strokeWidth="1" />

              {/* Shaded Gap Polygon */}
              <polygon
                points="
                  0,20 100,16 200,18 300,12 400,14 500,10
                  500,64 400,58 300,62 200,52 100,60 0,56
                "
                fill="#fee2e2"
                opacity="0.6"
              />

              {/* Reported Line (Top, Blue) */}
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="0,20 100,16 200,18 300,12 400,14 500,10"
              />

              {/* Verified Line (Bottom, Dark Slate) */}
              <polyline
                fill="none"
                stroke="#0f172a"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="0,56 100,60 200,52 300,62 400,58 500,64"
              />

              {/* Points on Reported */}
              {[
                { x: 0, y: 20 },
                { x: 100, y: 16 },
                { x: 200, y: 18 },
                { x: 300, y: 12 },
                { x: 400, y: 14 },
                { x: 500, y: 10 },
              ].map((pt, i) => (
                <circle key={i} cx={pt.x} cy={pt.y} r="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
              ))}

              {/* Points on Verified */}
              {[
                { x: 0, y: 56 },
                { x: 100, y: 60 },
                { x: 200, y: 52 },
                { x: 300, y: 62 },
                { x: 400, y: 58 },
                { x: 500, y: 64 },
              ].map((pt, i) => (
                <circle key={i} cx={pt.x} cy={pt.y} r="4" fill="#0f172a" stroke="#ffffff" strokeWidth="2" />
              ))}
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between text-slate-400 text-xs font-semibold pt-2 px-1">
              {trendMonths.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Widening trend observed in Q2 due to unannounced surprise audit frequency.</span>
            <span className="font-bold text-red-600">Peak Delta: -27% in June</span>
          </div>
        </div>

        {/* Category Breakdown (Spider/Bar) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 text-sm">Discrepancy by Category</h2>
            <p className="text-xs text-slate-400">Institutional areas with highest variance</p>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-800">Staff Headcount</span>
                <span className="font-bold text-red-600">28.2% Gap</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                <div className="bg-red-500 w-[28.2%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-800">Beneficiary Attendance</span>
                <span className="font-bold text-red-600">26.0% Gap</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                <div className="bg-red-500 w-[26%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-800">Infrastructure &amp; Lab Utility</span>
                <span className="font-bold text-amber-600">22.4% Gap</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                <div className="bg-amber-500 w-[22.4%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-800">Equipment Maintenance</span>
                <span className="font-bold text-amber-600">19.1% Gap</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                <div className="bg-amber-500 w-[19.1%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-800">Safety &amp; Sanitation</span>
                <span className="font-bold text-slate-700">14.0% Gap</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                <div className="bg-slate-700 w-[14%]" />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Source: Cross-verified telemetry and field inspector biometric headcounts.
          </div>
        </div>
      </div>

      {/* Top Discrepancies Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Highest Discrepancy Facilities</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked by total Reality Gap percentage in the current audit period.
            </p>
          </div>
          <button
            onClick={() => onNavigate('institutions')}
            className="text-xs text-blue-600 hover:underline font-semibold"
          >
            Explore All 1,248 Facilities →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3.5 px-4">Entity</th>
                <th className="py-3.5 px-4">District &amp; Category</th>
                <th className="py-3.5 px-4 min-w-[220px]">Reported vs Ground Reality</th>
                <th className="py-3.5 px-4">Reality Gap</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topDiscrepancies.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onNavigate('institution-detail')}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{item.id}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-800 font-medium">{item.category}</div>
                    <div className="text-[11px] text-slate-400">{item.district}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <RealityGapBar reported={item.reported} verified={item.verified} height="h-2" />
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-extrabold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded text-xs">
                      -{item.gap}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('institution-detail');
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold"
                    >
                      Audit
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
