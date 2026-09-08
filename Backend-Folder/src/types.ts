export type Persona = 'official' | 'inspector' | 'institution';

export type ScreenId =
  | 'persona-select'
  | 'login'
  | 'dashboard'
  | 'workers'
  | 'attendance'
  | 'factory-overview'
  | 'cameras'
  | 'ai-monitoring'
  | 'institutions'
  | 'institution-detail'
  | 'inspections'
  | 'live-monitoring'
  | 'reality-gap-analytics'
  | 'ai-analytics'
  | 'reports'
  | 'alerts'
  | 'audit-trail'
  | 'settings'
  | 'help'
  | 'inspector-home'
  | 'inspector-gps'
  | 'inspector-checklist';

export interface Institution {
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
}

export interface AlertItem {
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
