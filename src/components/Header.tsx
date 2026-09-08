import React, { useState } from 'react';
import { ScreenId } from '../types';

interface HeaderProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onOpenSidebar: () => void;
  unreadCount?: number;
  onTriggerInspectionModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  onOpenSidebar,
  unreadCount = 4,
  onTriggerInspectionModal,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label="Open sidebar"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        {/* Global Search Bar */}
        <div className="relative w-64 lg:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search institutions, NIR-ID, alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                onNavigate('institutions');
              }
            }}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg bg-slate-100/80 border border-transparent focus:border-slate-300 focus:bg-white focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Quick Trigger Button */}
        <button
          onClick={onTriggerInspectionModal}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors shadow-xs"
        >
          <span className="material-symbols-outlined text-[16px]">bolt</span>
          <span>Trigger Surprise Audit</span>
        </button>

        {/* Role & Backend Status badge */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold font-mono tracking-tight">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            REST API Live
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
            PMU Official
          </span>
        </div>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
            }}
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            title="Alerts and Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
            )}
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>

          {/* Notifications Flyout */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 text-left">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <div className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-red-600 text-sm">warning</span>
                  Recent High-Gap Alerts ({unreadCount})
                </div>
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigate('alerts');
                  }}
                  className="text-[11px] text-blue-600 hover:underline font-medium"
                >
                  View All Feed
                </button>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                <div
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigate('institution-detail');
                  }}
                  className="p-2.5 rounded-lg bg-red-50/60 border border-red-200 cursor-pointer hover:bg-red-50 transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-red-700 mb-1">
                    <span>ABC Welfare Centre (NIR-8821)</span>
                    <span>14:32 IST</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-snug">
                    Critical Reality Gap of <strong>28%</strong> detected during surprise physical verification.
                  </p>
                </div>
                <div
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigate('institutions');
                  }}
                  className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200 cursor-pointer hover:bg-amber-50 transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-amber-800 mb-1">
                    <span>St. Xavier's High School (SCH-0942)</span>
                    <span>11:15 IST</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-snug">
                    Ghost beneficiary pattern identified. 110 head count variance.
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 mt-2 text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigate('alerts');
                  }}
                  className="text-xs text-slate-600 font-medium hover:text-slate-900"
                >
                  Open Alerts & Feed Full View →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Switch Persona pill */}
        <button
          onClick={() => onNavigate('persona-select')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
          title="Switch Persona / Role"
        >
          <span className="material-symbols-outlined text-[16px]">switch_account</span>
          <span className="hidden sm:inline">Role</span>
        </button>
      </div>
    </header>
  );
};
