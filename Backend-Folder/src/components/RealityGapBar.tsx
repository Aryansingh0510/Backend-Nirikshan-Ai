import React from 'react';

interface RealityGapBarProps {
  reported: number;
  verified: number;
  height?: string;
  showLabels?: boolean;
  className?: string;
}

export const RealityGapBar: React.FC<RealityGapBarProps> = ({
  reported,
  verified,
  height = 'h-2.5',
  showLabels = true,
  className = '',
}) => {
  const gap = Math.max(0, reported - verified);
  const gapPercent = Math.round(((reported - verified) / (reported || 1)) * 100);

  return (
    <div className={`w-full ${className}`}>
      {showLabels && (
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-slate-900 inline-block"></span>
              Verified: <strong className="text-slate-900">{verified}%</strong>
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
              Reported: <strong>{reported}%</strong>
            </span>
          </div>
          {gap > 0 && (
            <span className="text-red-700 font-semibold bg-red-50 px-1.5 py-0.5 rounded text-[11px] border border-red-200">
              Gap: -{gap}% ({gapPercent}%)
            </span>
          )}
        </div>
      )}

      {/* Bar container */}
      <div className={`w-full ${height} bg-slate-100 rounded-full overflow-hidden flex relative`}>
        {/* Verified segment */}
        <div
          style={{ width: `${Math.min(verified, 100)}%` }}
          className="bg-slate-900 h-full transition-all duration-500 rounded-l-full"
          title={`Verified: ${verified}%`}
        />
        {/* Reality Gap (Discrepancy) segment */}
        {gap > 0 && (
          <div
            style={{ width: `${Math.min(gap, 100 - verified)}%` }}
            className="bg-red-500 h-full relative transition-all duration-500"
            title={`Reality Gap: ${gap}%`}
          >
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.25)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.25)_50%,rgba(255,255,255,0.25)_75%,transparent_75%,transparent)] bg-[length:8px_8px] opacity-60" />
          </div>
        )}
      </div>
    </div>
  );
};
