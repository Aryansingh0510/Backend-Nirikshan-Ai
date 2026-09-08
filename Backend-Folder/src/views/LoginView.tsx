import React, { useState } from 'react';
import { ScreenId } from '../types';

interface LoginViewProps {
  onLoginSuccess: (screen: ScreenId) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState('GOV-4921-MH');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess('dashboard');
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-8 pb-6 border-b border-slate-100 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
            <span className="material-symbols-outlined text-2xl">verified</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center justify-center gap-2">
            NIRIKSHAN <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">AI</span>
          </h1>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
            Ground Reality Monitoring &amp; Verification
          </p>
          <div className="mt-3 text-xs text-slate-600 italic">
            &ldquo;Verify Reality. Strengthen Accountability.&rdquo;
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Official ID or Govt Email
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                badge
              </span>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g., GOV-1234-IN or officer@pmu.gov.in"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:border-slate-800 focus:bg-white transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Access Password
              </label>
              <button
                type="button"
                onClick={() => alert('Demo Mode: Use any password or click "ENTER DEMO" below.')}
                className="text-[11px] text-blue-600 hover:underline font-medium"
              >
                Reset Password
              </button>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                lock
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:border-slate-800 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span>Keep me signed in</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono">2FA Enforced</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 disabled:opacity-75"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Authenticating Officer...</span>
              </>
            ) : (
              <>
                <span>Secure Login</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* System Demonstration alternative card */}
        <div className="mx-8 mb-8 p-4 rounded-2xl bg-slate-50 border border-slate-200/90 text-center">
          <div className="text-xs font-bold text-slate-900 mb-1">
            System Demonstration Mode
          </div>
          <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
            Explore live ground verification features with anonymized institutional sample data.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onLoginSuccess('dashboard')}
              className="flex-1 py-2 px-3 rounded-lg bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <span className="material-symbols-outlined text-sm text-blue-600">dashboard</span>
              <span>PMU View</span>
            </button>
            <button
              onClick={() => onLoginSuccess('inspector-home')}
              className="flex-1 py-2 px-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <span className="material-symbols-outlined text-sm">smartphone</span>
              <span>Field App</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-100/70 border-t border-slate-100 text-center text-[10px] text-slate-400 font-mono flex items-center justify-center gap-3">
          <span>v2.4.1-b</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Govt Portal Secure
          </span>
          <span>•</span>
          <span>TLS 1.3</span>
        </div>
      </div>
    </div>
  );
};
