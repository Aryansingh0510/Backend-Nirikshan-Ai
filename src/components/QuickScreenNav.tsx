import React, { useState } from 'react';
import { ScreenId } from '../types';

interface QuickScreenNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

export const QuickScreenNav: React.FC<QuickScreenNavProps> = ({
  currentScreen,
  onNavigate,
}) => {
  const [collapsed, setCollapsed] = useState(true);

  const screens: { id: ScreenId; label: string; icon: string; category: string }[] = [
    { id: 'persona-select', label: 'Persona Select', icon: 'badge', category: 'Auth / Flow' },
    { id: 'login', label: 'Login Screen', icon: 'login', category: 'Auth / Flow' },
    { id: 'dashboard', label: 'Executive Dashboard', icon: 'dashboard', category: 'Govt Official' },
    { id: 'institutions', label: 'Institutions List', icon: 'domain', category: 'Govt Official' },
    { id: 'institution-detail', label: 'ABC Welfare (Reality Gap)', icon: 'compare_arrows', category: 'Govt Official' },
    { id: 'reality-gap-analytics', label: 'Gap Analytics & Heatmap', icon: 'analytics', category: 'Govt Official' },
    { id: 'alerts', label: 'Alerts & Feed', icon: 'notifications', category: 'Govt Official' },
    { id: 'inspector-home', label: 'Inspector Home', icon: 'phone_android', category: 'Field Inspector' },
    { id: 'inspector-gps', label: 'GPS Location Lock', icon: 'pin_drop', category: 'Field Inspector' },
    { id: 'inspector-checklist', label: 'Adaptive Checklist', icon: 'checklist', category: 'Field Inspector' },
  ];

  return (
    <aside aria-label="Screen Switcher Navigation" className="fixed bottom-3 right-3 z-50 flex flex-col items-end print:hidden">
      {!collapsed && (
        <div className="mb-2 p-3 bg-slate-900/95 text-white backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl w-80 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
              <span className="material-symbols-outlined text-sm text-blue-400">preview</span>
              Prototype Screen Switcher
            </div>
            <button
              onClick={() => setCollapsed(true)}
              className="text-slate-400 hover:text-white p-1 rounded-md text-xs"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {['Auth / Flow', 'Govt Official', 'Field Inspector'].map((cat) => (
              <div key={cat}>
                <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1 px-1 tracking-wider">
                  {cat}
                </div>
                <div className="space-y-1">
                  {screens
                    .filter((s) => s.category === cat)
                    .map((s) => {
                      const isActive = currentScreen === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => {
                            onNavigate(s.id);
                            setCollapsed(true);
                          }}
                          className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                            isActive
                              ? 'bg-blue-600 text-white font-medium shadow-xs'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px] opacity-80">
                            {s.icon}
                          </span>
                          <span className="truncate">{s.label}</span>
                          {isActive && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          )}
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Nirikshan AI Design System</span>
            <button
              onClick={() => onNavigate('persona-select')}
              className="text-blue-400 hover:underline"
            >
              Restart Tour
            </button>
          </div>
        </div>
      )}

      {/* Floating trigger pill */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 border border-slate-700 transition-transform active:scale-95 text-xs font-medium"
        title="Quick jump to any prototype screen"
      >
        <span className="material-symbols-outlined text-[18px] text-blue-400">
          auto_awesome_motion
        </span>
        <span>Screens ({screens.length})</span>
        <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded-full font-mono">
          {currentScreen}
        </span>
      </button>
    </aside>
  );
};
