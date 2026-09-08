import React, { useState } from 'react';
import { ScreenId, Institution } from './types';
import { mockInstitutions } from './data/mockData';
import { api } from './lib/api';

// Components
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { QuickScreenNav } from './components/QuickScreenNav';
import { SurpriseInspectionModal } from './components/SurpriseInspectionModal';

// Views
import { PersonaSelectView } from './views/PersonaSelectView';
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { InstitutionsView } from './views/InstitutionsView';
import { InstitutionDetailView } from './views/InstitutionDetailView';
import { RealityGapAnalyticsView } from './views/RealityGapAnalyticsView';
import { AlertsView } from './views/AlertsView';
import { LiveMonitoringView } from './views/LiveMonitoringView';
import { AuditTrailView } from './views/AuditTrailView';
import { InspectorHomeView } from './views/InspectorHomeView';
import { InspectorLocationView } from './views/InspectorLocationView';
import { InspectorChecklistView } from './views/InspectorChecklistView';

export function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('persona-select');
  const [selectedInstitution, setSelectedInstitution] = useState<Institution>(mockInstitutions[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSurpriseModalOpen, setIsSurpriseModalOpen] = useState(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setNotificationToast(message);
    setTimeout(() => setNotificationToast(null), 4000);
  };

  const handleNavigate = (screen: ScreenId) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPersona = (
    persona: 'official' | 'inspector' | 'institution',
    screenId: ScreenId
  ) => {
    setCurrentScreen(screenId);
    if (persona === 'inspector') {
      showToast('Switched to Field Inspector Tactical Interface');
    } else {
      showToast('Switched to PMU Director Management Interface');
    }
  };

  const handleDispatchSurpriseAudit = async (
    instId: string,
    inspectorName: string,
    goToInspectorApp: boolean
  ) => {
    setIsSurpriseModalOpen(false);
    const targetInst = mockInstitutions.find((i) => i.id === instId) || mockInstitutions[0];
    setSelectedInstitution(targetInst);

    try {
      await api.dispatchSurpriseInspection({
        institutionId: instId,
        inspectorName,
        priority: 'HIGH',
        reason: 'Automated discrepancy spike exceeding tolerance threshold',
      });
    } catch (err) {
      console.warn('Dispatch API fallback:', err);
    }

    if (goToInspectorApp) {
      showToast(`Surprise audit dispatched! Launching Field Inspector App for ${targetInst.name}...`);
      setTimeout(() => {
        setCurrentScreen('inspector-gps');
      }, 500);
    } else {
      showToast(`Surprise inspection order dispatched to ${inspectorName} for ${targetInst.name}.`);
    }
  };

  const handleInspectionCompleted = () => {
    showToast('Ground Inspection submitted! Discrepancy (28% Reality Gap) synchronized to PMU Director.');
    setCurrentScreen('institution-detail');
  };

  // Full-screen non-sidebar views
  if (currentScreen === 'persona-select') {
    return (
      <div className="min-h-screen bg-[#f7f9fb]">
        <PersonaSelectView onSelectPersona={handleSelectPersona} />
        <QuickScreenNav currentScreen={currentScreen} onNavigate={handleNavigate} />
        {notificationToast && (
          <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in">
            <span className="material-symbols-outlined text-emerald-400 text-sm">info</span>
            <span>{notificationToast}</span>
          </div>
        )}
      </div>
    );
  }

  if (currentScreen === 'login') {
    return (
      <div className="min-h-screen bg-[#f7f9fb]">
        <LoginView onLoginSuccess={handleNavigate} />
        <QuickScreenNav currentScreen={currentScreen} onNavigate={handleNavigate} />
        {notificationToast && (
          <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in">
            <span className="material-symbols-outlined text-emerald-400 text-sm">info</span>
            <span>{notificationToast}</span>
          </div>
        )}
      </div>
    );
  }

  // Field Inspector Mobile Views
  const isInspectorView =
    currentScreen === 'inspector-home' ||
    currentScreen === 'inspector-gps' ||
    currentScreen === 'inspector-checklist';

  if (isInspectorView) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center sm:p-4">
        <div className="w-full max-w-md min-h-screen sm:min-h-[850px] bg-slate-900 shadow-2xl relative overflow-hidden sm:rounded-3xl sm:border sm:border-slate-800">
          {currentScreen === 'inspector-home' && (
            <InspectorHomeView onNavigate={handleNavigate} />
          )}
          {currentScreen === 'inspector-gps' && (
            <InspectorLocationView onNavigate={handleNavigate} />
          )}
          {currentScreen === 'inspector-checklist' && (
            <InspectorChecklistView
              onNavigate={handleNavigate}
              onSubmitComplete={handleInspectionCompleted}
            />
          )}
        </div>

        <QuickScreenNav currentScreen={currentScreen} onNavigate={handleNavigate} />

        {notificationToast && (
          <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in">
            <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
            <span>{notificationToast}</span>
          </div>
        )}
      </div>
    );
  }

  // Standard Government Official / PMU Desktop App Layout
  return (
    <div className="min-h-screen bg-[#f7f9fb] flex">
      {/* 280px Desktop Sidebar */}
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        unreadAlertsCount={4}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-[280px]">
        {/* Top Header */}
        <Header
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          unreadCount={4}
          onTriggerInspectionModal={() => setIsSurpriseModalOpen(true)}
        />

        {/* View Page Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {currentScreen === 'dashboard' && (
            <DashboardView
              onNavigate={handleNavigate}
              onSelectInstitution={(inst) => setSelectedInstitution(inst)}
              onTriggerSurpriseModal={() => setIsSurpriseModalOpen(true)}
            />
          )}

          {currentScreen === 'institutions' && (
            <InstitutionsView
              onNavigate={handleNavigate}
              onSelectInstitution={(inst) => setSelectedInstitution(inst)}
            />
          )}

          {currentScreen === 'institution-detail' && (
            <InstitutionDetailView
              institution={selectedInstitution}
              onNavigate={handleNavigate}
              onTriggerSurpriseModal={() => setIsSurpriseModalOpen(true)}
            />
          )}

          {(currentScreen === 'reality-gap-analytics' || currentScreen === 'ai-analytics') && (
            <RealityGapAnalyticsView onNavigate={handleNavigate} />
          )}

          {currentScreen === 'alerts' && <AlertsView onNavigate={handleNavigate} />}

          {(currentScreen === 'live-monitoring' || currentScreen === 'inspections') && (
            <LiveMonitoringView onNavigate={handleNavigate} />
          )}

          {(currentScreen === 'audit-trail' || currentScreen === 'reports' || currentScreen === 'settings') && (
            <AuditTrailView onNavigate={handleNavigate} />
          )}
        </main>
      </div>

      {/* Surprise Inspection Action Modal */}
      <SurpriseInspectionModal
        isOpen={isSurpriseModalOpen}
        onClose={() => setIsSurpriseModalOpen(false)}
        onDispatch={handleDispatchSurpriseAudit}
        onNavigate={handleNavigate}
      />

      {/* Quick Screen Switcher Pill */}
      <QuickScreenNav currentScreen={currentScreen} onNavigate={handleNavigate} />

      {/* Global Toast Notification */}
      {notificationToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in">
          <span className="material-symbols-outlined text-emerald-400 text-sm">info</span>
          <span>{notificationToast}</span>
        </div>
      )}
    </div>
  );
}

export default App;
