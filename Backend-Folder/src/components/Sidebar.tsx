import React from 'react';
import { ScreenId } from '../types';

interface SidebarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  unreadAlertsCount?: number;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  unreadAlertsCount = 4,
  isOpen = true,
  onClose,
}) => {
  const navGroups = [
    {
      label: 'OVERVIEW',
      items: [
        { id: 'dashboard' as ScreenId, label: 'Dashboard', icon: 'dashboard' },
        { id: 'institutions' as ScreenId, label: 'Institutions', icon: 'domain' },
        { id: 'inspections' as ScreenId, label: 'Inspections', icon: 'fact_check' },
        { id: 'live-monitoring' as ScreenId, label: 'Live Monitoring', icon: 'sensors' },
      ],
    },
    {
      label: 'INTELLIGENCE',
      items: [
        { id: 'reality-gap-analytics' as ScreenId, label: 'Reality Gap Analytics', icon: 'analytics' },
        { id: 'ai-analytics' as ScreenId, label: 'AI Analytics', icon: 'psychology' },
        { id: 'reports' as ScreenId, label: 'Reports', icon: 'description' },
      ],
    },
    {
      label: 'ADMINISTRATION',
      items: [
        { id: 'alerts' as ScreenId, label: 'Alerts & Feed', icon: 'notifications', badge: unreadAlertsCount },
        { id: 'audit-trail' as ScreenId, label: 'Audit Trail', icon: 'history_edu' },
        { id: 'settings' as ScreenId, label: 'Settings', icon: 'settings' },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        id="sidebar-main-nav"
        className={`fixed top-0 bottom-0 left-0 z-40 w-[280px] bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate('dashboard')}
          >
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <span className="material-symbols-outlined text-[20px]">verified</span>
            </div>
            <div>
              <div className="font-bold text-base tracking-tight text-slate-900 flex items-center gap-1.5">
                NIRIKSHAN <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">AI</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                Ground Reality Platform
              </div>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 md:hidden"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 hide-scrollbar">
          {navGroups.map((group) => (
            <div key={group.label} className="space-y-1">
              <div className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {group.label}
              </div>
              {group.items.map((item) => {
                const isActive = currentScreen === item.id || (item.id === 'institutions' && currentScreen === 'institution-detail');
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => {
                      onNavigate(item.id);
                      if (onClose) onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`material-symbols-outlined text-[20px] ${
                          isActive ? 'text-white' : 'text-slate-500'
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && item.badge > 0 && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          isActive
                            ? 'bg-red-500 text-white'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {/* Quick Inspector Switcher Card in Sidebar */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 mb-1">
              <span className="material-symbols-outlined text-sm text-blue-600">smartphone</span>
              Field Inspector Mobile
            </div>
            <p className="text-[11px] text-slate-500 mb-2.5">
              Simulate on-ground verification, GPS geofencing & checklist.
            </p>
            <button
              onClick={() => onNavigate('inspector-home')}
              className="w-full py-1.5 px-3 rounded-lg text-xs font-medium bg-white text-slate-800 border border-slate-300 hover:bg-slate-100 flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Launch Field Mode</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Footer Profile & System Info */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-300 flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80"
                alt="S. Rameshwar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 truncate">
                S. Rameshwar
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                Director (PMU Maharashtra)
              </div>
            </div>
            <button
              title="Switch Persona / Logout"
              onClick={() => onNavigate('persona-select')}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>v2.4.1-b</span>
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Govt Net Online
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
