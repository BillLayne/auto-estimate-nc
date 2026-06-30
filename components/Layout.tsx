
import React from 'react';
import { AppStep } from '../types';
import { AGENCY } from '../config';

interface LayoutProps {
  children: React.ReactNode;
  activeStep: AppStep;
  setStep: (step: AppStep) => void;
}

const LOGO_WHITE = 'https://i.imgur.com/lxu9nfT.png'; // agency logo, white-on-dark

const Layout: React.FC<LayoutProps> = ({ children, setStep }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-brand-navy-deep via-brand-navy to-brand-navy-dk text-white shadow-lg border-b-2 border-brand-gold">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center">
          <button
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setStep(AppStep.ModeSelection)}
            aria-label="AutoEstimate NC — go to home"
          >
            <img src={LOGO_WHITE} alt="Bill Layne Insurance" className="h-10 w-auto shrink-0" />
            <h1 className="text-lg sm:text-xl font-bold tracking-tight font-display">AutoEstimate NC</h1>
          </button>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────── */}
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 py-6 sm:py-8">
        {children}
      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="bg-brand-navy-deep text-white mt-10 safe-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src={LOGO_WHITE} alt="Bill Layne Insurance" className="h-10 w-auto" />
              <div className="leading-tight">
                <p className="font-bold font-display">{AGENCY.name}</p>
                <p className="text-xs text-blue-200">{AGENCY.address}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <a href={AGENCY.phoneHref} className="px-4 py-2.5 rounded-xl bg-brand-gold text-brand-navy-deep font-bold text-sm hover:bg-brand-gold-lt transition-colors">
                {AGENCY.phone}
              </a>
              <a href={AGENCY.emailHref} className="px-4 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-colors">
                Email Us
              </a>
              <a href={AGENCY.website} target="_blank" rel="noopener" className="px-4 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-colors">
                Website
              </a>
            </div>
          </div>
          <div className="border-t border-white/10 mt-6 pt-5 text-center">
            <p className="text-xs text-blue-200">© {AGENCY.year} {AGENCY.name}. All Rights Reserved.</p>
            <p className="text-[11px] text-blue-300/70 mt-1.5 max-w-2xl mx-auto">
              Estimates are a preliminary AI guide based on photos and NC market averages — not a professional appraisal.
              Final repair costs are set by a licensed body shop and your insurance adjuster.
            </p>
            <button onClick={() => setStep(AppStep.Docs)} className="text-[11px] text-blue-300/50 hover:text-blue-200 mt-3 underline underline-offset-2">
              How it works
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
