import React from 'react';
import { HomeProjectInfo, HomeProjectMode } from '../types';
import StepIndicator from './StepIndicator';

interface HomeProjectFormProps {
  project: HomeProjectInfo;
  onChange: (project: HomeProjectInfo) => void;
  onNext: () => void;
  onBack: () => void;
}

const CATEGORIES = [
  'Roof', 'Siding & Gutters', 'Deck & Porch', 'Fence', 'Windows & Doors',
  'Water Damage', 'Drywall & Paint', 'Flooring', 'Kitchen', 'Bathroom', 'Other',
];

const DEDUCTIBLES: Array<{ value: string; label: string }> = [
  { value: '', label: "Skip — I'm not sure" },
  { value: '500', label: '$500' },
  { value: '1000', label: '$1,000' },
  { value: '1500', label: '$1,500' },
  { value: '2000', label: '$2,000' },
  { value: '2500', label: '$2,500' },
  { value: '5000', label: '$5,000' },
  { value: 'percent', label: 'A percentage (1%–2% of dwelling)' },
];

const HomeProjectForm: React.FC<HomeProjectFormProps> = ({ project, onChange, onNext, onBack }) => {
  const set = (patch: Partial<HomeProjectInfo>) => onChange({ ...project, ...patch });
  const canContinue = project.category !== '' && project.description.trim().length >= 8;

  return (
    <>
      <StepIndicator current={1} />
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/70 p-5 sm:p-8 max-w-2xl mx-auto animate-fadeIn">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 font-display">Tell us about the project</h2>
            <p className="text-slate-500 mt-1">A few quick details make the cost guide much more accurate.</p>
          </div>
          <button onClick={onBack} aria-label="Go back" className="shrink-0 text-slate-400 hover:text-brand-navy p-2 -mr-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>

        {/* Mode toggle */}
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">What's the situation?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <ModeCard
            active={project.mode === 'damage'}
            onClick={() => set({ mode: 'damage' })}
            title="Damage to repair"
            desc="Storm, fallen tree, water, or accident damage"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
          />
          <ModeCard
            active={project.mode === 'upgrade'}
            onClick={() => set({ mode: 'upgrade', deductible: '' })}
            title="Upgrade or replace"
            desc="New deck, roof, floors, remodel — planned work"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>}
          />
        </div>

        {/* Category chips */}
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">What part of the home?</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => set({ category: c })}
              className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-[0.97] ${
                project.category === c
                  ? 'bg-brand-navy text-white shadow-md ring-2 ring-brand-navy/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-brand-navy ring-1 ring-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Description */}
        <label className="block mb-6">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Describe it in a sentence or two</span>
          <textarea
            value={project.description}
            onChange={(e) => set({ description: e.target.value })}
            rows={3}
            placeholder={project.mode === 'damage'
              ? 'e.g. "Wind pulled shingles off the back side of the roof and there\'s a water stain on the bedroom ceiling."'
              : 'e.g. "Want to replace our old 12x16 wood deck with composite decking and new railings."'}
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy"
          />
        </label>

        {/* Optional details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <label className="block">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Approximate size <span className="text-slate-400 font-semibold normal-case">(optional)</span></span>
            <input
              type="text"
              value={project.approxSize}
              onChange={(e) => set({ approxSize: e.target.value })}
              placeholder='e.g. "12x16 deck" or "1,800 sq ft roof"'
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy"
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">ZIP code <span className="text-slate-400 font-semibold normal-case">(optional)</span></span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={5}
              value={project.zip}
              onChange={(e) => set({ zip: e.target.value.replace(/\D/g, '').slice(0, 5) })}
              placeholder="e.g. 28621"
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy"
            />
          </label>
        </div>

        {/* Deductible — damage mode only */}
        {project.mode === 'damage' && (
          <div className="mb-6 rounded-xl bg-blue-50/70 ring-1 ring-blue-100 p-4">
            <label className="block">
              <span className="text-xs font-bold text-brand-navy uppercase tracking-wide">Your deductible <span className="text-slate-500 font-semibold normal-case">(optional — helps us compare)</span></span>
              <select
                value={project.deductible}
                onChange={(e) => set({ deductible: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy"
              >
                {DEDUCTIBLES.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </label>
            <p className="text-xs text-slate-500 mt-2">
              If you share it, your report shows how the estimated repair range compares to your deductible.
              It stays on your device — it's never sent to the AI and nothing is filed.
            </p>
          </div>
        )}

        <button
          onClick={onNext}
          disabled={!canContinue}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
            canContinue ? 'bg-brand-navy hover:bg-brand-navy-dk active:scale-[0.98]' : 'bg-slate-300 cursor-not-allowed'
          }`}
        >
          Next: Add Photos
          {canContinue && <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>}
        </button>
        {!canContinue && (
          <p className="text-center text-xs text-slate-400 mt-3">Pick a category and add a short description to continue.</p>
        )}
      </div>
    </>
  );
};

const ModeCard: React.FC<{ active: boolean; onClick: () => void; title: string; desc: string; icon: React.ReactNode }> = ({ active, onClick, title, desc, icon }) => (
  <button
    onClick={onClick}
    className={`text-left p-4 rounded-2xl transition-all active:scale-[0.99] flex items-start gap-3 ${
      active
        ? 'bg-blue-50 ring-2 ring-brand-navy shadow-md'
        : 'bg-slate-50 ring-1 ring-slate-200 hover:ring-brand-navy/40'
    }`}
  >
    <div className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center transition-colors ${active ? 'bg-brand-navy text-white' : 'bg-slate-200 text-slate-500'}`}>
      {icon}
    </div>
    <span>
      <span className={`block font-bold text-sm ${active ? 'text-brand-navy' : 'text-slate-700'}`}>{title}</span>
      <span className="block text-xs text-slate-500 mt-0.5">{desc}</span>
    </span>
  </button>
);

export default HomeProjectForm;
