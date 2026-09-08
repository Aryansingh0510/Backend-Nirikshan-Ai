import React, { useState, useEffect } from 'react';
import { ScreenId, Institution } from '../types';
import { mockInstitutions } from '../data/mockData';
import { RealityGapBar } from '../components/RealityGapBar';
import { api } from '../lib/api';

interface InstitutionsViewProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectInstitution: (inst: Institution) => void;
}

export const InstitutionsView: React.FC<InstitutionsViewProps> = ({
  onNavigate,
  onSelectInstitution,
}) => {
  const [institutionsList, setInstitutionsList] = useState<Institution[]>(mockInstitutions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load from backend
  const loadInstitutions = async () => {
    try {
      const res = await api.getInstitutions();
      if (res.data && res.data.length > 0) {
        setInstitutionsList(res.data);
      }
    } catch (err) {
      console.warn('Using local institutions fallback:', err);
    }
  };

  useEffect(() => {
    loadInstitutions();
  }, []);

  // New institution state
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newType, setNewType] = useState<'Healthcare' | 'Education' | 'Infrastructure' | 'Welfare'>('Welfare');
  const [newStaffReported, setNewStaffReported] = useState('20');
  const [newBeneficiariesReported, setNewBeneficiariesReported] = useState('100');

  const filtered = institutionsList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || item.type === selectedType;
    const matchesRisk =
      selectedRisk === 'All' ||
      (selectedRisk === 'Critical' && item.riskScore >= 70) ||
      (selectedRisk === 'Warning' && item.riskScore >= 40 && item.riskScore < 70) ||
      (selectedRisk === 'Stable' && item.riskScore < 40);
    return matchesSearch && matchesType && matchesRisk;
  });

  const handleAddInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setIsSaving(true);
    const payload: Partial<Institution> = {
      name: newName,
      location: newLocation || 'Navi Mumbai, Maharashtra',
      state: 'Maharashtra',
      district: 'Thane',
      type: newType,
      riskScore: 65,
      reportedCompliance: 92,
      verifiedCompliance: 74,
      realityGap: 18,
      lastInspectionDate: 'Pending Audit',
      inspectionMethod: 'Field Agent',
      status: 'Warning',
      activeStaffReported: parseInt(newStaffReported) || 15,
      activeStaffVerified: 12,
      beneficiariesReported: parseInt(newBeneficiariesReported) || 90,
      beneficiariesVerified: 75,
      facilityStatusReported: 'Operational (Full)',
      facilityStatusObserved: 'Awaiting Verification',
      zone: 'Urban Zone D',
    };

    try {
      const res = await api.createInstitution(payload);
      if (res.data) {
        setInstitutionsList([res.data, ...institutionsList]);
      } else {
        setInstitutionsList([{ id: `NIR-${Math.floor(1000 + Math.random() * 9000)}`, ...payload } as Institution, ...institutionsList]);
      }
    } catch {
      setInstitutionsList([{ id: `NIR-${Math.floor(1000 + Math.random() * 9000)}`, ...payload } as Institution, ...institutionsList]);
    } finally {
      setIsSaving(false);
      setShowAddModal(false);
      setNewName('');
      setNewLocation('');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Institutions</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
              {filtered.length} Active Records
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage and monitor compliance across all registered facilities with ground-truth auditing.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              const csvContent =
                'data:text/csv;charset=utf-8,' +
                'ID,Name,Type,District,RiskScore,Reported,Verified,Gap\n' +
                institutionsList
                  .map(
                    (i) =>
                      `"${i.id}","${i.name}","${i.type}","${i.district}",${i.riskScore},${i.reportedCompliance}%,${i.verifiedCompliance}%,${i.realityGap}%`
                  )
                  .join('\n');
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement('a');
              link.setAttribute('href', encodedUri);
              link.setAttribute('download', 'nirikshan_institutions_export.csv');
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Add Institution</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search box */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">
              search
            </span>
            <input
              type="text"
              placeholder="Search by name, ID or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:border-slate-800 transition-colors"
            />
          </div>

          {/* Type dropdown */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full py-2 px-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:bg-white focus:outline-none focus:border-slate-800"
            >
              <option value="All">All Facility Types</option>
              <option value="Welfare">Welfare &amp; Shelter</option>
              <option value="Education">Education &amp; Schools</option>
              <option value="Healthcare">Healthcare &amp; Clinics</option>
              <option value="Infrastructure">Infrastructure &amp; Utilities</option>
            </select>
          </div>

          {/* Risk dropdown */}
          <div>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full py-2 px-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:bg-white focus:outline-none focus:border-slate-800"
            >
              <option value="All">All Risk Categories</option>
              <option value="Critical">Critical Risk (Score &gt; 70)</option>
              <option value="Warning">Warning (Score 40 - 70)</option>
              <option value="Stable">Stable Low Risk (&lt; 40)</option>
            </select>
          </div>

          {/* Clear button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('All');
                setSelectedRisk('All');
              }}
              className="w-full py-2 px-3 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium flex items-center justify-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">filter_alt_off</span>
              <span>Clear Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Institution Name &amp; ID</th>
                <th className="py-3.5 px-4">Location &amp; Type</th>
                <th className="py-3.5 px-4">Risk Score</th>
                <th className="py-3.5 px-4 min-w-[220px]">Reported vs Verified Compliance</th>
                <th className="py-3.5 px-4">Reality Gap</th>
                <th className="py-3.5 px-4">Last Audit</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                    No institutions matching the selected filters.
                  </td>
                </tr>
              ) : (
                filtered.map((inst) => (
                  <tr
                    key={inst.id}
                    onClick={() => {
                      onSelectInstitution(inst);
                      onNavigate('institution-detail');
                    }}
                    className="hover:bg-slate-50/90 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                          <span className="material-symbols-outlined text-[18px]">
                            {inst.type === 'Healthcare'
                              ? 'local_hospital'
                              : inst.type === 'Education'
                              ? 'school'
                              : inst.type === 'Infrastructure'
                              ? 'water_damage'
                              : 'home_health'}
                          </span>
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 hover:text-blue-600 transition-colors">
                            {inst.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {inst.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{inst.type}</div>
                      <div className="text-[11px] text-slate-400">{inst.location}</div>
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
                        {inst.riskScore}
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
                      {inst.realityGap > 0 ? (
                        <span className="inline-block font-extrabold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded text-xs">
                          +{inst.realityGap}%
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">0%</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-700 font-medium">{inst.lastInspectionDate}</div>
                      <div className="text-[10px] text-slate-400">{inst.inspectionMethod}</div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectInstitution(inst);
                          onNavigate('institution-detail');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Inspect</span>
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer pagination info */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <strong>1 to {filtered.length}</strong> of <strong>1,248</strong> registered institutions
          </div>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 rounded border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed">
              Prev
            </button>
            <span className="px-2.5 py-1 rounded bg-slate-900 text-white font-bold">1</span>
            <button className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700">
              2
            </button>
            <button className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700">
              3
            </button>
            <button className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Institution Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Register New Institutional Entity</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddInstitution} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Institution Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Vidya Mandir Higher Secondary School"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Facility Category
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                  >
                    <option value="Welfare">Welfare &amp; Shelter</option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Infrastructure">Infrastructure</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Location / District
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Vashi, Navi Mumbai"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Self-Reported Staff
                  </label>
                  <input
                    type="number"
                    value={newStaffReported}
                    onChange={(e) => setNewStaffReported(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Claimed Beneficiaries
                  </label>
                  <input
                    type="number"
                    value={newBeneficiariesReported}
                    onChange={(e) => setNewBeneficiariesReported(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800"
                >
                  Register Entity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
