import crypto from 'crypto';

export interface InstitutionRecord {
  id: string;
  name: string;
  location: string;
  state: string;
  district: string;
  type: 'Healthcare' | 'Education' | 'Infrastructure' | 'Welfare' | 'Govt Office';
  riskScore: number;
  reportedCompliance: number;
  verifiedCompliance: number;
  realityGap: number;
  lastInspectionDate: string;
  inspectionMethod: 'AI Monitored' | 'Field Agent' | 'Drone Survey';
  status: 'Critical' | 'Warning' | 'Stable';
  activeStaffReported: number;
  activeStaffVerified: number;
  beneficiariesReported: number;
  beneficiariesVerified: number;
  facilityStatusReported: string;
  facilityStatusObserved: string;
  facilityNotes?: string;
  zone: string;
  latitude: number;
  longitude: number;
  geofenceRadiusMeters: number;
}

export interface AlertRecord {
  id: string;
  title: string;
  institutionName: string;
  institutionId: string;
  severity: 'Critical' | 'Warning' | 'Info';
  time: string;
  date: string;
  description: string;
  discrepancyPercent?: number;
  component?: string;
  reportedVal?: number;
  verifiedVal?: number;
  assignedTo?: string;
  acknowledged?: boolean;
}

export interface AuditLogRecord {
  id: string;
  action: string;
  target: string;
  user: string;
  time: string;
  status: string;
  hash: string;
  prevHash: string;
  details: string;
}

export interface InspectorTelemetryRecord {
  inspectorId: string;
  name: string;
  avatar: string;
  currentLat: number;
  currentLng: number;
  accuracyMeters: number;
  assignedInstitutionId?: string;
  assignedInstitutionName?: string;
  status: 'In Transit' | 'On Site' | 'Checklist in Progress' | 'Completed' | 'Idle';
  etaMinutes?: number;
  distanceKm?: number;
  distanceToPerimeterMeters: number;
  isWithinGeofence: boolean;
  batteryLevel: number;
  lastPingTime: string;
}

export interface InspectionSubmission {
  institutionId: string;
  inspectorId: string;
  inspectorName: string;
  observedStaff: number;
  observedBeneficiaries?: number;
  facilityObservedStatus?: string;
  notes: string;
  evidencePhotoUrls: string[];
  inspectorLat: number;
  inspectorLng: number;
}

// Initial Data
const initialInstitutions: InstitutionRecord[] = [
  {
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
    latitude: 19.0330,
    longitude: 73.0297,
    geofenceRadiusMeters: 50,
  },
  {
    id: 'SCH-0942',
    name: "St. Xavier's High School",
    location: 'Sector 4, Vashi, Mumbai Suburban',
    state: 'Maharashtra',
    district: 'Mumbai Suburban',
    type: 'Education',
    riskScore: 85,
    reportedCompliance: 98,
    verifiedCompliance: 71,
    realityGap: 27,
    lastInspectionDate: '12 Oct 2023',
    inspectionMethod: 'Field Agent',
    status: 'Critical',
    activeStaffReported: 34,
    activeStaffVerified: 24,
    beneficiariesReported: 420,
    beneficiariesVerified: 310,
    facilityStatusReported: 'Operational (Full)',
    facilityStatusObserved: 'Partial - Labs Non-functional',
    facilityNotes: 'Computer lab equipment stored in boxes. Mid-day meal kitchen hygiene concerns.',
    zone: 'Urban Zone A',
    latitude: 19.0760,
    longitude: 72.8777,
    geofenceRadiusMeters: 75,
  },
  {
    id: 'HOS-4819',
    name: 'District General Hospital - Sub Unit',
    location: 'Shivajinagar, Pune',
    state: 'Maharashtra',
    district: 'Pune',
    type: 'Healthcare',
    riskScore: 52,
    reportedCompliance: 88,
    verifiedCompliance: 72,
    realityGap: 16,
    lastInspectionDate: '08 Oct 2023',
    inspectionMethod: 'AI Monitored',
    status: 'Warning',
    activeStaffReported: 28,
    activeStaffVerified: 22,
    beneficiariesReported: 160,
    beneficiariesVerified: 135,
    facilityStatusReported: 'Operational (Full)',
    facilityStatusObserved: 'Operational - High Wait Time',
    facilityNotes: 'Emergency duty doctor log verified with slight delay in triage shift rotation.',
    zone: 'Urban Zone B',
    latitude: 18.5204,
    longitude: 73.8567,
    geofenceRadiusMeters: 100,
  },
  {
    id: 'CIV-1102',
    name: 'PWD Water Works Unit 4',
    location: 'Gangapur Road, Nashik',
    state: 'Maharashtra',
    district: 'Nashik',
    type: 'Infrastructure',
    riskScore: 12,
    reportedCompliance: 95,
    verifiedCompliance: 92,
    realityGap: 3,
    lastInspectionDate: 'Yesterday',
    inspectionMethod: 'Drone Survey',
    status: 'Stable',
    activeStaffReported: 15,
    activeStaffVerified: 15,
    beneficiariesReported: 1200,
    beneficiariesVerified: 1180,
    facilityStatusReported: 'Operational (Full)',
    facilityStatusObserved: 'Operational (Full)',
    facilityNotes: 'Turbidity and flow logs closely match telemetry readings.',
    zone: 'Semi-Urban Zone D',
    latitude: 19.9975,
    longitude: 73.7898,
    geofenceRadiusMeters: 120,
  },
  {
    id: 'WEL-3391',
    name: 'Apeksha Orphanage & Shelter',
    location: 'Ghodbunder Road, Thane',
    state: 'Maharashtra',
    district: 'Thane',
    type: 'Welfare',
    riskScore: 74,
    reportedCompliance: 85,
    verifiedCompliance: 61,
    realityGap: 24,
    lastInspectionDate: '03 Oct 2023',
    inspectionMethod: 'Field Agent',
    status: 'Critical',
    activeStaffReported: 18,
    activeStaffVerified: 11,
    beneficiariesReported: 64,
    beneficiariesVerified: 42,
    facilityStatusReported: 'Operational (Full)',
    facilityStatusObserved: 'Partially Operational',
    facilityNotes: 'Dormitory capacity inflated in quarterly grant requisition.',
    zone: 'Suburban Zone E',
    latitude: 19.2183,
    longitude: 72.9781,
    geofenceRadiusMeters: 60,
  },
  {
    id: 'SCH-5510',
    name: 'Sunrise Public School',
    location: 'Sitabuldi, Nagpur',
    state: 'Maharashtra',
    district: 'Nagpur',
    type: 'Education',
    riskScore: 41,
    reportedCompliance: 90,
    verifiedCompliance: 82,
    realityGap: 8,
    lastInspectionDate: '28 Sep 2023',
    inspectionMethod: 'AI Monitored',
    status: 'Warning',
    activeStaffReported: 22,
    activeStaffVerified: 19,
    beneficiariesReported: 280,
    beneficiariesVerified: 255,
    facilityStatusReported: 'Operational (Full)',
    facilityStatusObserved: 'Operational (Full)',
    facilityNotes: 'Minor discrepancy in science teacher substitution schedule.',
    zone: 'Central Zone A',
    latitude: 21.1458,
    longitude: 79.0882,
    geofenceRadiusMeters: 80,
  },
  {
    id: 'CIV-9012',
    name: 'Regional Electrical Substation',
    location: 'MIDC Chikalthana, Aurangabad',
    state: 'Maharashtra',
    district: 'Aurangabad',
    type: 'Infrastructure',
    riskScore: 8,
    reportedCompliance: 99,
    verifiedCompliance: 98,
    realityGap: 1,
    lastInspectionDate: '15 Sep 2023',
    inspectionMethod: 'Drone Survey',
    status: 'Stable',
    activeStaffReported: 10,
    activeStaffVerified: 10,
    beneficiariesReported: 5000,
    beneficiariesVerified: 4990,
    facilityStatusReported: 'Operational (Full)',
    facilityStatusObserved: 'Operational (Full)',
    facilityNotes: 'All transformers and switchgear logs validated with SCADA.',
    zone: 'Industrial Zone B',
    latitude: 19.8762,
    longitude: 75.3433,
    geofenceRadiusMeters: 100,
  },
];

const initialAlerts: AlertRecord[] = [
  {
    id: 'ALT-1092',
    title: 'HIGH REALITY GAP DETECTED',
    institutionName: 'ABC Welfare Centre',
    institutionId: 'NIR-8821',
    severity: 'Critical',
    time: '14:32 IST',
    date: 'Today',
    description: 'Ground inspection revealed severe discrepancy in Staff Presence (7 verified vs 12 reported) and Beneficiaries (51 verified vs 85 reported). Overall gap calculated at 28%.',
    discrepancyPercent: 28,
    component: 'Staff & Beneficiaries',
    reportedVal: 91,
    verifiedVal: 63,
    assignedTo: 'Inspector INSP-492',
    acknowledged: false,
  },
  {
    id: 'ALT-1088',
    title: 'GHOST BENEFICIARY PATTERN FLAGGED',
    institutionName: "St. Xavier's High School",
    institutionId: 'SCH-0942',
    severity: 'Critical',
    time: '11:15 IST',
    date: 'Today',
    description: 'AI discrepancy model identified 110 head count difference between biometrics and mid-day meal grant claims.',
    discrepancyPercent: 27,
    component: 'Student Attendance',
    reportedVal: 98,
    verifiedVal: 71,
    assignedTo: 'Field Team Beta',
    acknowledged: false,
  },
  {
    id: 'ALT-1081',
    title: 'UNRESOLVED REPEAT VARIANCE',
    institutionName: 'Apeksha Orphanage & Shelter',
    institutionId: 'WEL-3391',
    severity: 'Warning',
    time: '09:40 IST',
    date: 'Yesterday',
    description: 'Third consecutive audit cycle exhibiting >20% gap in resident beneficiary count. Escalated to District Welfare Officer.',
    discrepancyPercent: 24,
    component: 'Resident Headcount',
    reportedVal: 85,
    verifiedVal: 61,
    assignedTo: 'District Officer R. Patil',
    acknowledged: true,
  },
  {
    id: 'ALT-1075',
    title: 'ROUTINE SURPRISE INSPECTION COMPLETED',
    institutionName: 'District General Hospital - Sub Unit',
    institutionId: 'HOS-4819',
    severity: 'Info',
    time: '16:05 IST',
    date: '08 Oct 2023',
    description: 'Physical audit completed by Dr. S. Kulkarni. Pharmacological supply verified against central repository.',
    discrepancyPercent: 16,
    component: 'Equipment & Pharmacy',
    reportedVal: 88,
    verifiedVal: 72,
    assignedTo: 'Health Audit PMU',
    acknowledged: true,
  },
];

const initialAuditLogs: AuditLogRecord[] = [
  {
    id: 'TX-901824',
    action: 'SURPRISE INSPECTION SUBMITTED',
    target: 'ABC Welfare Centre (NIR-8821)',
    user: 'Inspector Priya Nair (INSP-492)',
    time: '14-Oct-2023 11:24:18 IST',
    status: 'VERIFIED',
    hash: 'sha256:8a9f2ce8d9f1092a8310c34e81b39e1029471ab20938f928410293481234abcd',
    prevHash: 'sha256:3d1f04aa8123984012938491823901928491029348129038491209348123bcde',
    details: 'Staff headcount: 7 verified vs 12 reported (-41.6% Reality Gap). Evidence attached with GPS lock at 18m.',
  },
  {
    id: 'TX-901799',
    action: 'SURPRISE AUDIT AUTHORIZED',
    target: 'ABC Welfare Centre (NIR-8821)',
    user: 'Director S. Rameshwar (PMU-DIR)',
    time: '14-Oct-2023 10:42:05 IST',
    status: 'DISPATCHED',
    hash: 'sha256:3d1f04aa8123984012938491823901928491029348129038491209348123bcde',
    prevHash: 'sha256:7c9e12bf8123984012938491823901928491029348129038491209348123cdef',
    details: 'Triggered by automated anomaly alert ALT-1092 following quarterly variance spike.',
  },
  {
    id: 'TX-901740',
    action: 'AI ANOMALY DETECTION FLAGGED',
    target: "St. Xavier's High School (SCH-0942)",
    user: 'AI Discrepancy Model v4.1',
    time: '14-Oct-2023 09:15:30 IST',
    status: 'ALERTED',
    hash: 'sha256:7c9e12bf8123984012938491823901928491029348129038491209348123cdef',
    prevHash: 'sha256:55bf89aa8123984012938491823901928491029348129038491209348123def0',
    details: '110 student headcount delta flagged between mid-day meal grant and biometric register.',
  },
  {
    id: 'TX-901680',
    action: 'INSTITUTIONAL REPORT SUBMITTED',
    target: 'District General Hospital (HOS-4819)',
    user: 'Admin Dr. V. Joshi (INST-ADM)',
    time: '13-Oct-2023 17:30:00 IST',
    status: 'RECORDED',
    hash: 'sha256:55bf89aa8123984012938491823901928491029348129038491209348123def0',
    prevHash: 'sha256:0000000000000000000000000000000000000000000000000000000000000000',
    details: 'Self-reported compliance log for Q3 submitted via NGO/Institution portal.',
  },
];

const initialTelemetry: InspectorTelemetryRecord[] = [
  {
    inspectorId: 'INSP-492',
    name: 'Inspector Priya Nair',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    currentLat: 19.0331,
    currentLng: 73.0298,
    accuracyMeters: 4.2,
    assignedInstitutionId: 'NIR-8821',
    assignedInstitutionName: 'ABC Welfare Centre',
    status: 'Checklist in Progress',
    etaMinutes: 0,
    distanceKm: 0.018,
    distanceToPerimeterMeters: 18,
    isWithinGeofence: true,
    batteryLevel: 88,
    lastPingTime: 'Just now',
  },
  {
    inspectorId: 'INSP-811',
    name: 'Inspector Rajesh Mane',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    currentLat: 19.0790,
    currentLng: 72.8790,
    accuracyMeters: 6.1,
    assignedInstitutionId: 'SCH-0942',
    assignedInstitutionName: "St. Xavier's High School",
    status: 'In Transit',
    etaMinutes: 8,
    distanceKm: 2.4,
    distanceToPerimeterMeters: 2400,
    isWithinGeofence: false,
    batteryLevel: 74,
    lastPingTime: '2 mins ago',
  },
  {
    inspectorId: 'SQ-10',
    name: 'Flying Squad Alpha (Team Lead Maneesh)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
    currentLat: 19.2150,
    currentLng: 72.9750,
    accuracyMeters: 5.5,
    assignedInstitutionId: 'WEL-3391',
    assignedInstitutionName: 'Apeksha Orphanage',
    status: 'In Transit',
    etaMinutes: 14,
    distanceKm: 4.8,
    distanceToPerimeterMeters: 4800,
    isWithinGeofence: false,
    batteryLevel: 92,
    lastPingTime: '1 min ago',
  },
];

// Distance calculation using Haversine formula
function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// In-Memory Database Controller
class InMemoryDatabase {
  private institutions: InstitutionRecord[] = [...initialInstitutions];
  private alerts: AlertRecord[] = [...initialAlerts];
  private auditLogs: AuditLogRecord[] = [...initialAuditLogs];
  private telemetry: InspectorTelemetryRecord[] = [...initialTelemetry];

  // Institutions
  getInstitutions(query?: { search?: string; type?: string; status?: string; zone?: string }): InstitutionRecord[] {
    let result = [...this.institutions];
    if (query?.search) {
      const q = query.search.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q) ||
          i.district.toLowerCase().includes(q)
      );
    }
    if (query?.type && query.type !== 'All') {
      result = result.filter((i) => i.type === query.type);
    }
    if (query?.status && query.status !== 'All') {
      result = result.filter((i) => i.status === query.status);
    }
    if (query?.zone && query.zone !== 'All') {
      result = result.filter((i) => i.zone === query.zone);
    }
    return result;
  }

  getInstitutionById(id: string): InstitutionRecord | undefined {
    return this.institutions.find((i) => i.id === id);
  }

  createInstitution(data: Partial<InstitutionRecord>): InstitutionRecord {
    const id = data.id || `NIR-${Math.floor(1000 + Math.random() * 9000)}`;
    const repCompliance = data.reportedCompliance ?? 90;
    const verCompliance = data.verifiedCompliance ?? 75;
    const realityGap = Math.max(0, repCompliance - verCompliance);

    const newInst: InstitutionRecord = {
      id,
      name: data.name || 'New Facility',
      location: data.location || 'Maharashtra',
      state: data.state || 'Maharashtra',
      district: data.district || 'Thane',
      type: data.type || 'Welfare',
      riskScore: data.riskScore ?? (realityGap > 20 ? 75 : realityGap > 10 ? 45 : 15),
      reportedCompliance: repCompliance,
      verifiedCompliance: verCompliance,
      realityGap,
      lastInspectionDate: 'Just Registered',
      inspectionMethod: data.inspectionMethod || 'Field Agent',
      status: realityGap >= 20 ? 'Critical' : realityGap >= 10 ? 'Warning' : 'Stable',
      activeStaffReported: data.activeStaffReported ?? 15,
      activeStaffVerified: data.activeStaffVerified ?? 12,
      beneficiariesReported: data.beneficiariesReported ?? 100,
      beneficiariesVerified: data.beneficiariesVerified ?? 80,
      facilityStatusReported: data.facilityStatusReported || 'Operational (Full)',
      facilityStatusObserved: data.facilityStatusObserved || 'Under Evaluation',
      facilityNotes: data.facilityNotes || 'Registered into Nirikshan central repository.',
      zone: data.zone || 'Urban Zone C',
      latitude: data.latitude ?? 19.033,
      longitude: data.longitude ?? 73.029,
      geofenceRadiusMeters: data.geofenceRadiusMeters ?? 50,
    };

    this.institutions.unshift(newInst);

    this.addAuditLog({
      action: 'INSTITUTION REGISTERED',
      target: `${newInst.name} (${newInst.id})`,
      user: 'PMU Registry Desk',
      details: `New entity added to registry in ${newInst.district}, ${newInst.zone}. Reported capacity: ${newInst.activeStaffReported} staff.`,
    });

    return newInst;
  }

  updateInstitution(id: string, updates: Partial<InstitutionRecord>): InstitutionRecord | null {
    const index = this.institutions.findIndex((i) => i.id === id);
    if (index === -1) return null;

    const current = this.institutions[index];
    const updated = { ...current, ...updates };

    // Recompute reality gap if compliance changed
    if (updates.reportedCompliance !== undefined || updates.verifiedCompliance !== undefined) {
      updated.realityGap = Math.max(0, updated.reportedCompliance - updated.verifiedCompliance);
      updated.status = updated.realityGap >= 20 ? 'Critical' : updated.realityGap >= 10 ? 'Warning' : 'Stable';
    }

    this.institutions[index] = updated;
    return updated;
  }

  // Alerts
  getAlerts(severity?: string): AlertRecord[] {
    if (!severity || severity === 'all') return [...this.alerts];
    return this.alerts.filter((a) => a.severity.toLowerCase() === severity.toLowerCase());
  }

  acknowledgeAlert(id: string): AlertRecord | null {
    const alert = this.alerts.find((a) => a.id === id);
    if (!alert) return null;
    alert.acknowledged = true;

    this.addAuditLog({
      action: 'ALERT ACKNOWLEDGED',
      target: `${alert.institutionName} [${alert.id}]`,
      user: 'PMU Duty Director',
      details: `Alert ${alert.id} (${alert.title}) acknowledged and logged into PMU oversight record.`,
    });

    return alert;
  }

  createAlert(data: Omit<AlertRecord, 'id' | 'time' | 'date'>): AlertRecord {
    const id = `ALT-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} IST`;
    const newAlert: AlertRecord = {
      ...data,
      id,
      time,
      date: 'Today',
      acknowledged: false,
    };
    this.alerts.unshift(newAlert);
    return newAlert;
  }

  // Audits & Inspections
  dispatchSurpriseInspection(instId: string, inspectorName: string, urgency: string): { success: boolean; log: AuditLogRecord; institution: InstitutionRecord } {
    const inst = this.getInstitutionById(instId);
    if (!inst) throw new Error('Institution not found');

    const log = this.addAuditLog({
      action: 'SURPRISE AUDIT AUTHORIZED',
      target: `${inst.name} (${inst.id})`,
      user: 'Director S. Rameshwar (PMU-DIR)',
      details: `Surprise inspection dispatched with urgency level '${urgency}' assigned to ${inspectorName}.`,
    });

    // Update telemetry for inspector if available
    const tele = this.telemetry.find((t) => t.inspectorId === 'INSP-492' || t.name.includes('Priya'));
    if (tele) {
      tele.assignedInstitutionId = inst.id;
      tele.assignedInstitutionName = inst.name;
      tele.status = 'In Transit';
    }

    return { success: true, log, institution: inst };
  }

  submitInspection(submission: InspectionSubmission): { success: boolean; institution: InstitutionRecord; gap: number; alertCreated?: AlertRecord; log: AuditLogRecord } {
    const inst = this.getInstitutionById(submission.institutionId);
    if (!inst) throw new Error('Institution not found');

    // Calculate staff variance
    const staffReported = inst.activeStaffReported;
    const staffVerified = submission.observedStaff;
    inst.activeStaffVerified = staffVerified;

    if (submission.observedBeneficiaries !== undefined) {
      inst.beneficiariesVerified = submission.observedBeneficiaries;
    }
    if (submission.facilityObservedStatus) {
      inst.facilityStatusObserved = submission.facilityObservedStatus;
    }
    if (submission.notes) {
      inst.facilityNotes = submission.notes;
    }

    // Recalculate verified compliance score
    // Staff attendance score (weight 50%) + beneficiaries (weight 30%) + facility (weight 20%)
    const staffRatio = Math.min(1, staffVerified / (staffReported || 1));
    const benRatio = Math.min(1, inst.beneficiariesVerified / (inst.beneficiariesReported || 1));
    const newVerifiedCompliance = Math.round((staffRatio * 50) + (benRatio * 30) + 15);
    inst.verifiedCompliance = newVerifiedCompliance;
    inst.realityGap = Math.max(0, inst.reportedCompliance - newVerifiedCompliance);
    inst.lastInspectionDate = 'Today';
    inst.status = inst.realityGap >= 20 ? 'Critical' : inst.realityGap >= 10 ? 'Warning' : 'Stable';
    inst.riskScore = Math.min(100, Math.round(inst.realityGap * 2.5 + 10));

    // Create Audit Trail Entry
    const log = this.addAuditLog({
      action: 'SURPRISE INSPECTION SUBMITTED',
      target: `${inst.name} (${inst.id})`,
      user: `${submission.inspectorName} (${submission.inspectorId})`,
      details: `Ground audit completed: ${staffVerified} staff observed vs ${staffReported} reported. Reality Gap: ${inst.realityGap}%. ${submission.evidencePhotoUrls.length} geo-stamped evidence photos logged.`,
    });

    // If Reality Gap > 15%, auto-trigger Critical Alert
    let alertCreated: AlertRecord | undefined;
    if (inst.realityGap >= 15) {
      alertCreated = this.createAlert({
        title: `HIGH REALITY GAP DETECTED (${inst.realityGap}%)`,
        institutionName: inst.name,
        institutionId: inst.id,
        severity: inst.realityGap >= 25 ? 'Critical' : 'Warning',
        description: `Field inspection by ${submission.inspectorName} confirmed significant discrepancy. Staff Headcount observed ${staffVerified}/${staffReported}. Notes: ${submission.notes}`,
        discrepancyPercent: inst.realityGap,
        component: 'Staff & Physical Presence',
        reportedVal: inst.reportedCompliance,
        verifiedVal: inst.verifiedCompliance,
        assignedTo: submission.inspectorName,
      });
    }

    return {
      success: true,
      institution: inst,
      gap: inst.realityGap,
      alertCreated,
      log,
    };
  }

  // Telemetry & Geofence
  getTelemetry(): InspectorTelemetryRecord[] {
    return this.telemetry;
  }

  pingTelemetry(inspectorId: string, lat: number, lng: number, accuracyMeters?: number): InspectorTelemetryRecord | null {
    const record = this.telemetry.find((t) => t.inspectorId === inspectorId);
    if (!record) return null;

    record.currentLat = lat;
    record.currentLng = lng;
    if (accuracyMeters) record.accuracyMeters = accuracyMeters;

    // Check geofence if assigned to an institution
    if (record.assignedInstitutionId) {
      const target = this.getInstitutionById(record.assignedInstitutionId);
      if (target) {
        const dist = calculateDistanceMeters(lat, lng, target.latitude, target.longitude);
        record.distanceToPerimeterMeters = dist;
        record.isWithinGeofence = dist <= target.geofenceRadiusMeters;
      }
    }

    record.lastPingTime = 'Just now';
    return record;
  }

  // Cryptographic Audit Ledger
  getAuditLogs(): AuditLogRecord[] {
    return this.auditLogs;
  }

  addAuditLog(entry: { action: string; target: string; user: string; details: string; status?: string }): AuditLogRecord {
    const id = `TX-${Math.floor(900000 + Math.random() * 100000)}`;
    const now = new Date();
    const time = `${now.getDate()}-${now.toLocaleString('default', { month: 'short' })}-${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} IST`;
    
    const prevHash = this.auditLogs.length > 0 ? this.auditLogs[0].hash : '0000000000000000000000000000000000000000000000000000000000000000';
    
    const payload = `${id}|${entry.action}|${entry.target}|${entry.user}|${time}|${entry.details}|${prevHash}`;
    const hash = 'sha256:' + crypto.createHash('sha256').update(payload).digest('hex');

    const newRecord: AuditLogRecord = {
      id,
      action: entry.action,
      target: entry.target,
      user: entry.user,
      time,
      status: entry.status || 'VERIFIED',
      hash,
      prevHash,
      details: entry.details,
    };

    this.auditLogs.unshift(newRecord);
    return newRecord;
  }

  // Aggregated Analytics
  getOverviewStats() {
    const total = this.institutions.length;
    const criticalCount = this.institutions.filter((i) => i.status === 'Critical').length;
    const warningCount = this.institutions.filter((i) => i.status === 'Warning').length;
    
    const totalReported = this.institutions.reduce((acc, i) => acc + i.reportedCompliance, 0);
    const totalVerified = this.institutions.reduce((acc, i) => acc + i.verifiedCompliance, 0);
    const avgReported = Math.round(totalReported / (total || 1));
    const avgVerified = Math.round(totalVerified / (total || 1));
    const avgRealityGap = Math.round(avgReported - avgVerified);

    return {
      totalInstitutions: 1248, // State-wide figure
      trackedInSystem: total,
      auditsThisMonth: 142,
      criticalEntities: criticalCount,
      warningEntities: warningCount,
      reportedComplianceAvg: avgReported,
      verifiedComplianceAvg: avgVerified,
      avgRealityGap,
      pendingFollowUps: 18,
      activeInspectors: this.telemetry.length,
      activeAlertsCount: this.alerts.filter((a) => !a.acknowledged).length,
    };
  }
}

export const db = new InMemoryDatabase();
