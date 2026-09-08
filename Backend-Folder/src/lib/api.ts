import { Institution, AlertItem } from '../types';

export interface AuditRecord {
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

export type AuditLogItem = AuditRecord;

export interface InspectorTelemetry {
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

export interface AnalyticsOverview {
  totalInstitutions: number;
  trackedInSystem: number;
  auditsThisMonth: number;
  criticalEntities: number;
  warningEntities: number;
  reportedComplianceAvg: number;
  verifiedComplianceAvg: number;
  avgRealityGap: number;
  pendingFollowUps: number;
  activeInspectors: number;
  activeAlertsCount: number;
}

export interface AIDiscrepancyAnalysis {
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  executiveSummary: string;
  rootCauses: string[];
  financialRiskEstimate: string;
  targetedAuditChecklist: string[];
  recommendedAction: string;
  formalInquiryDraft: string;
}

const BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8000';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    let msg = `HTTP error ${res.status}`;
    try {
      const parsed = JSON.parse(text);
      if (parsed.error) msg = parsed.error;
    } catch {
      if (text) msg = text;
    }
    throw new Error(msg);
  }
  return res.json();
}

export const api = {
  // Health
  async getHealth(): Promise<{ status: string; service: string; version: string; uptimeSeconds: number }> {
    const res = await fetch(`${BASE_URL}/api/health`);
    return handleResponse(res);
  },

  // Auth
  async loginUser(email: string, password: string): Promise<{ access_token: string; token_type: string; user: { id: string; name: string; email: string; role: string } }> {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async registerUser(payload: { name: string; email: string; password: string; role: string }): Promise<{ access_token: string; token_type: string; user: { id: string; name: string; email: string; role: string } }> {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  // Institutions
  async getInstitutions(params?: { search?: string; type?: string; status?: string; zone?: string }): Promise<{ data: Institution[]; count: number }> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.type && params.type !== 'All') query.set('type', params.type);
    if (params?.status && params.status !== 'All') query.set('status', params.status);
    if (params?.zone && params.zone !== 'All') query.set('zone', params.zone);

    const url = `${BASE_URL}/api/institutions${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url);
    return handleResponse(res);
  },

  async getInstitutionById(id: string): Promise<{ data: Institution }> {
    const res = await fetch(`${BASE_URL}/api/institutions/${encodeURIComponent(id)}`);
    return handleResponse(res);
  },

  async createInstitution(data: Partial<Institution>): Promise<{ data: Institution }> {
    const res = await fetch(`${BASE_URL}/api/institutions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateInstitution(id: string, updates: Partial<Institution>): Promise<{ data: Institution }> {
    const res = await fetch(`${BASE_URL}/api/institutions/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse(res);
  },

  // Alerts
  async getAlerts(severity?: string): Promise<{ data: AlertItem[]; count: number }> {
    const url = severity && severity !== 'all' ? `${BASE_URL}/api/alerts?severity=${encodeURIComponent(severity)}` : `${BASE_URL}/api/alerts`;
    const res = await fetch(url);
    return handleResponse(res);
  },

  async acknowledgeAlert(id: string): Promise<{ data: AlertItem }> {
    const res = await fetch(`${BASE_URL}/api/alerts/${encodeURIComponent(id)}/acknowledge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(res);
  },

  // Inspections
  async dispatchSurpriseInspection(
    param1: string | { institutionId: string; inspectorName?: string; priority?: string; urgency?: string; reason?: string },
    inspectorName?: string,
    urgency?: string
  ): Promise<{ success: boolean; message: string; data: { institution: Institution; log: AuditRecord } }> {
    const body = typeof param1 === 'string'
      ? { institutionId: param1, inspectorName, urgency }
      : { institutionId: param1.institutionId, inspectorName: param1.inspectorName, urgency: param1.priority || param1.urgency };

    const res = await fetch(`${BASE_URL}/api/inspections/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  async submitInspection(payload: {
    institutionId: string;
    inspectorId: string;
    inspectorName: string;
    observedStaff?: number;
    verifiedStaff?: number;
    observedBeneficiaries?: number;
    verifiedBeneficiaries?: number;
    facilityObservedStatus?: string;
    facilityStatusObserved?: string;
    notes: string;
    evidencePhotoUrls?: string[];
    evidencePhotos?: string[];
    inspectorLat?: number;
    inspectorLng?: number;
    latitude?: number;
    longitude?: number;
  }): Promise<{ success: boolean; data: { institution: Institution; gap: number; alertCreated?: AlertItem; log: AuditRecord } }> {
    const body = {
      institutionId: payload.institutionId,
      inspectorId: payload.inspectorId,
      inspectorName: payload.inspectorName,
      observedStaff: payload.observedStaff ?? payload.verifiedStaff ?? 0,
      observedBeneficiaries: payload.observedBeneficiaries ?? payload.verifiedBeneficiaries ?? 0,
      facilityObservedStatus: payload.facilityObservedStatus ?? payload.facilityStatusObserved,
      notes: payload.notes,
      evidencePhotoUrls: payload.evidencePhotoUrls ?? payload.evidencePhotos ?? [],
      inspectorLat: payload.inspectorLat ?? payload.latitude,
      inspectorLng: payload.inspectorLng ?? payload.longitude,
    };

    const res = await fetch(`${BASE_URL}/api/inspections/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  // Analytics
  async getAnalyticsOverview(): Promise<{ data: AnalyticsOverview }> {
    const res = await fetch(`${BASE_URL}/api/analytics/overview`);
    return handleResponse(res);
  },

  async getAnalyticsTrends(): Promise<{ data: Array<{ month: string; reported: number; verified: number; realityGap: number }> }> {
    const res = await fetch(`${BASE_URL}/api/analytics/trends`);
    return handleResponse(res);
  },

  // Telemetry
  async getTelemetryInspectors(): Promise<{ data: InspectorTelemetry[]; count: number }> {
    const res = await fetch(`${BASE_URL}/api/telemetry/inspectors`);
    return handleResponse(res);
  },

  async getTelemetry(): Promise<{ data: InspectorTelemetry[]; count: number }> {
    return this.getTelemetryInspectors();
  },

  async pingTelemetry(
    param1: string | { inspectorId: string; inspectorName?: string; targetInstitutionId?: string; latitude?: number; longitude?: number; lat?: number; lng?: number; accuracyMeters?: number },
    lat?: number,
    lng?: number,
    accuracyMeters?: number
  ): Promise<{ data: InspectorTelemetry }> {
    const body = typeof param1 === 'string'
      ? { inspectorId: param1, lat, lng, accuracyMeters }
      : {
          inspectorId: param1.inspectorId,
          lat: param1.latitude ?? param1.lat,
          lng: param1.longitude ?? param1.lng,
          accuracyMeters: param1.accuracyMeters,
        };

    const res = await fetch(`${BASE_URL}/api/telemetry/ping`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  // Audit
  async getAuditTrail(): Promise<{ data: AuditRecord[]; count: number }> {
    const res = await fetch(`${BASE_URL}/api/audit-trail`);
    return handleResponse(res);
  },

  async getAuditLogs(): Promise<{ data: AuditRecord[]; count: number }> {
    return this.getAuditTrail();
  },

  async verifyAuditLedger(): Promise<{ success: boolean; verified: boolean; totalBlocks: number; latestBlockHash: string }> {
    const res = await fetch(`${BASE_URL}/api/audit-trail/verify`, { method: 'POST' });
    return handleResponse(res);
  },

  // AI Discrepancy Engine (Gemini Server-Side Route)
  async analyzeDiscrepancyAI(payload: {
    institutionId?: string;
    name?: string;
    type?: string;
    location?: string;
    reportedCompliance?: number;
    verifiedCompliance?: number;
    realityGap?: number;
    staffReported?: number;
    staffVerified?: number;
    beneficiariesReported?: number;
    beneficiariesVerified?: number;
    facilityNotes?: string;
  }): Promise<{ success: boolean; source: string; data: AIDiscrepancyAnalysis }> {
    const res = await fetch(`${BASE_URL}/api/ai/analyze-discrepancy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },
};
