
import React from 'react';
import { AppStep } from '../types';
import { IMAGES } from '../config';

interface ModeSelectionProps {
  setStep: (step: AppStep) => void;
}

interface ToolCard {
  step: AppStep;
  num: string;
  title: string;
  desc: string;
  cta: string;
  icon: React.ReactNode;
}

const ModeSelection: React.FC<ModeSelectionProps> = ({ setStep }) => {
  const cards: ToolCard[] = [
    {
      step: AppStep.Intake,
      num: '1',
      title: 'Get a Repair Estimate',
      desc: 'Snap photos of the damage and get a preliminary repair-cost guide in about a minute.',
      cta: 'Start with photos',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
      ),
    },
    {
      step: AppStep.UploadEstimate,
      num: '2',
      title: 'Explain My Estimate',
      desc: 'Already have a body-shop estimate? We translate the confusing jargon into plain English.',
      cta: 'Translate an estimate',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
      ),
    },
    {
      step: AppStep.UploadComparisonA,
      num: '3',
      title: 'Compare Two Estimates',
      desc: 'Got quotes from two shops? See exactly why the prices differ, side by side.',
      cta: 'Compare prices',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
      ),
    },
  ];

  return (
    <div className="animate-fadeIn">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl shadow-card-lg mb-8 bg-brand-navy-deep md:min-h-[500px] md:flex md:items-center">
        {/* MOBILE: purpose-built 3:2 scene as an image band on top (full image, no crop) */}
        <div
          className="md:hidden aspect-[3/2] bg-cover bg-no-repeat bg-center"
          style={{ backgroundImage: `url("${IMAGES.heroSceneMobile}")` }}
          role="img"
          aria-label="A phone photographing a dented car, with an instant repair estimate of $1,248"
        />
        {/* DESKTOP: scene as a full-bleed background */}
        <div
          className="hidden md:block absolute inset-0 bg-no-repeat bg-cover bg-[position:right_22%]"
          style={{ backgroundImage: `url("${IMAGES.heroScene}")` }}
        />
        {/* DESKTOP: left-to-right navy gradient keeps the headline readable over the photo */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-brand-navy-deep via-brand-navy-deep/45 to-transparent" />
        {/* gold glow accent */}
        <div className="absolute -top-12 -right-10 w-72 h-72 rounded-full bg-brand-gold/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full p-6 sm:p-9 md:p-10">
          <div className="max-w-md text-center md:text-left mx-auto md:mx-0">
            <span className="inline-flex items-center gap-2 bg-brand-gold/20 border border-brand-gold/40 text-brand-gold-lt text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" /> Free AI Tool · No login
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-white leading-[1.1] font-display drop-shadow-[0_2px_14px_rgba(0,0,0,0.55)]">
              Wrecked or dinged?<br className="hidden sm:block" />
              <span className="text-brand-gold-lt">Know the cost</span> before you call.
            </h2>
            <p className="text-blue-50 mt-4 text-base sm:text-lg max-w-md mx-auto md:mx-0 drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
              Snap a few photos and get a friendly, preliminary repair estimate — so you can decide whether it's worth filing a claim.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <button
                onClick={() => setStep(AppStep.Intake)}
                className="px-6 py-4 rounded-2xl bg-gold-grad text-brand-navy-deep font-bold text-base hover:bg-gold-grad-hover active:scale-[0.98] transition-all shadow-glow-gold flex items-center justify-center gap-2"
              >
                Start My Free Estimate
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
            </div>
            {/* trust chips */}
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 justify-center md:justify-start text-xs text-blue-100 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
              <span className="flex items-center gap-1.5"><Check /> Takes ~2 minutes</span>
              <span className="flex items-center gap-1.5"><Check /> NC market pricing</span>
              <span className="flex items-center gap-1.5"><Check /> 100% private</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── TOOL CARDS ───────────────────────────────────── */}
      <div className="text-center mb-5">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 font-display">What would you like to do?</h3>
        <p className="text-slate-500 text-sm mt-1">Pick the option that fits your situation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {cards.map((c) => (
          <button
            key={c.step}
            onClick={() => setStep(c.step)}
            className="group relative text-left bg-white p-6 rounded-2xl shadow-sm ring-1 ring-slate-200/70 hover:ring-brand-gold hover:shadow-xl active:scale-[0.99] transition-all flex flex-col"
          >
            <span className="absolute top-5 right-5 text-5xl font-extrabold text-slate-100 group-hover:text-brand-gold/25 transition-colors font-display leading-none select-none">{c.num}</span>
            <div className="w-14 h-14 rounded-2xl bg-brand-navy text-white flex items-center justify-center mb-4 group-hover:bg-brand-gold group-hover:text-brand-navy-deep transition-colors shadow-md">
              {c.icon}
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-1.5 font-display">{c.title}</h4>
            <p className="text-sm text-slate-500 mb-4 flex-grow">{c.desc}</p>
            <span className="text-brand-navy font-bold text-sm flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
              {c.cta}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </span>
          </button>
        ))}

        {/* NEW: Home repair & project estimates — separate landing page at /home/ */}
        <a
          href="/home/"
          className="group relative text-left bg-white p-6 rounded-2xl shadow-sm ring-1 ring-slate-200/70 hover:ring-brand-gold hover:shadow-xl active:scale-[0.99] transition-all flex flex-col"
        >
          <span className="absolute top-5 right-5 text-5xl font-extrabold text-slate-100 group-hover:text-brand-gold/25 transition-colors font-display leading-none select-none">4</span>
          <span className="absolute top-4 left-4 bg-brand-gold/15 border border-brand-gold/40 text-[9px] font-bold uppercase tracking-wider text-brand-navy px-2 py-0.5 rounded-full">New</span>
          <div className="w-14 h-14 rounded-2xl bg-brand-navy text-white flex items-center justify-center mb-4 mt-3 group-hover:bg-brand-gold group-hover:text-brand-navy-deep transition-colors shadow-md">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          </div>
          <h4 className="text-lg font-bold text-slate-800 mb-1.5 font-display">Home Repair &amp; Project Estimates</h4>
          <p className="text-sm text-slate-500 mb-4 flex-grow">Storm damage or planning an upgrade? Photo your roof, deck, or siding for an instant NC cost guide.</p>
          <span className="text-brand-navy font-bold text-sm flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
            Estimate my home project
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </span>
        </a>
      </div>

      {/* ── reassurance strip ───────────────────────────── */}
      <div className="mt-8 bg-white/70 backdrop-blur rounded-2xl ring-1 ring-slate-200/70 p-5 flex items-center gap-4">
        <div className="w-11 h-11 shrink-0 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-slate-800">This is a free guide, not a sales pitch.</span> Use it to understand your options — then call Bill Layne Insurance any time at <a href="tel:+13368351993" className="text-brand-navy font-semibold underline underline-offset-2">(336) 835-1993</a>.
        </p>
      </div>
    </div>
  );
};

const Check: React.FC = () => (
  <svg className="w-4 h-4 text-brand-gold-lt" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
);

export default ModeSelection;
