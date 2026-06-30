
import React from 'react';

interface StepIndicatorProps {
  current: 1 | 2 | 3;
}

const STEPS = ['Your details', 'Add photos', 'Your estimate'];

const StepIndicator: React.FC<StepIndicatorProps> = ({ current }) => (
  <div className="max-w-2xl mx-auto mb-4 px-1">
    <div className="flex items-center">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <React.Fragment key={label}>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                ${done ? 'bg-emerald-500 text-white' : active ? 'bg-brand-navy text-white ring-4 ring-brand-navy/15' : 'bg-slate-200 text-slate-500'}`}
              >
                {done ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                ) : n}
              </span>
              <span className={`text-xs font-semibold hidden sm:inline ${active ? 'text-brand-navy' : 'text-slate-400'}`}>{label}</span>
            </div>
            {n < STEPS.length && (
              <div className={`flex-1 h-0.5 mx-2 rounded ${done ? 'bg-emerald-400' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
    {/* mobile: show only the active label below the dots */}
    <p className="sm:hidden text-center text-xs font-semibold text-brand-navy mt-2">
      Step {current} of 3 · {STEPS[current - 1]}
    </p>
  </div>
);

export default StepIndicator;
