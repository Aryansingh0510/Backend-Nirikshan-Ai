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
                NIRIKSHAN <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-semibold">AI</span>
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
                    onClick={() => {
                      onNavigate(item.id);
                      if (onClose) onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-white' : 'text-slate-400'}`}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {/* Tactical Inspector Mode Callout Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 text-left">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-xs mb-1">
              <span className="material-symbols-outlined text-blue-600 text-base">smartphone</span>
              <span>Field Inspector Mobile</span>
            </div>
            <p className="text-[11px] text-blue-700/80 mb-3 leading-relaxed">
              Simulate on-ground verification, GPS geofencing &amp; checklist.
            </p>
            <button
              onClick={() => onNavigate('inspector-home')}
              className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <span>Launch Field Mode</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 overflow-hidden flex items-center justify-center font-bold text-slate-700">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                alt="S. Rameshwar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">S. Rameshwar</div>
              <div className="text-[10px] text-slate-500 font-medium">Director (PMU Maharashtra)</div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('login')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            title="Logout"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
