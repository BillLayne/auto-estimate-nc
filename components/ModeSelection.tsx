
import React from 'react';
import { AppStep } from '../types';
import { IMAGES } from '../config';

interface ModeSelectionProps {
  setStep: (step: AppStep) => void;
}

/* ── Fallback hero graphic (used until Bill's transparent PNG is added) ── */
const HeroArtFallback: React.FC = () => (
  <svg viewBox="0 0 320 280" className="w-full h-full drop-shadow-2xl" role="img" aria-label="Phone scanning car damage to produce a repair estimate">
    <defs>
      <linearGradient id="card" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff"/><stop offset="100%" stopColor="#eef2f8"/>
      </linearGradient>
      <linearGradient id="phone" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#012a5e"/><stop offset="100%" stopColor="#003f87"/>
      </linearGradient>
    </defs>
    {/* car silhouette */}
    <g opacity="0.95">
      <path d="M40 168c0-10 14-30 30-34 18-4 70-6 92 0 14 4 30 16 46 20 16 4 22 10 22 22v10a6 6 0 01-6 6H46a6 6 0 01-6-6z" fill="#C8A84E"/>
      <path d="M78 134c10-2 56-3 78 0 8 1 16 8 22 16H66c4-7 6-14 12-16z" fill="#E0C878"/>
      <circle cx="86" cy="192" r="16" fill="#001a3d"/><circle cx="86" cy="192" r="7" fill="#5b7aa6"/>
      <circle cx="198" cy="192" r="16" fill="#001a3d"/><circle cx="198" cy="192" r="7" fill="#5b7aa6"/>
      {/* dent / damage marks */}
      <path d="M150 150l8 8m0-8l-8 8" stroke="#dc2626" strokeWidth="4" strokeLinecap="round"/>
    </g>
    {/* phone */}
    <g transform="rotate(-8 230 120)">
      <rect x="196" y="44" width="74" height="150" rx="14" fill="url(#phone)" stroke="#C8A84E" strokeWidth="2"/>
      <rect x="206" y="60" width="54" height="92" rx="6" fill="#0b1f3f"/>
      <rect x="214" y="70" width="38" height="26" rx="3" fill="#C8A84E" opacity="0.85"/>
      <path d="M222 84l5 5 9-10" stroke="#001a3d" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    {/* floating estimate card */}
    <g className="animate-floaty">
      <rect x="20" y="36" width="150" height="70" rx="14" fill="url(#card)" stroke="#C8A84E" strokeWidth="2"/>
      <circle cx="46" cy="62" r="12" fill="#16a34a"/>
      <path d="M40 62l5 5 8-9" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="66" y="58" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="11" fontWeight="700" fill="#012a5e">Estimate Ready</text>
      <text x="66" y="80" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="20" fontWeight="800" fill="#003f87">$2,450</text>
    </g>
  </svg>
);

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

  const heroBgStyle = IMAGES.heroBackground
    ? { backgroundImage: `url("${IMAGES.heroBackground}")`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : undefined;

  return (
    <div className="animate-fadeIn">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl shadow-xl mb-8">
        {/* background image layer */}
        <div className="absolute inset-0 bg-brand-navy" style={heroBgStyle} />
        {/* navy gradient overlay keeps text readable over any photo */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy-deep/95 via-brand-navy/85 to-brand-navy-dk/80" />
        {/* gold glow accent */}
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-brand-gold/20 blur-3xl" />

        <div className="relative grid md:grid-cols-2 gap-6 items-center p-6 sm:p-10">
          {/* copy */}
          <div className="text-center md:text-left">
            <span className="inline-flex items-center gap-2 bg-brand-gold/20 border border-brand-gold/40 text-brand-gold-lt text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" /> Free AI Tool · No login
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-white leading-[1.1] font-display">
              Wrecked or dinged?<br className="hidden sm:block" />
              <span className="text-brand-gold-lt">Know the cost</span> before you call.
            </h2>
            <p className="text-blue-100 mt-4 text-base sm:text-lg max-w-md mx-auto md:mx-0">
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
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 justify-center md:justify-start text-xs text-blue-200">
              <span className="flex items-center gap-1.5"><Check /> Takes ~2 minutes</span>
              <span className="flex items-center gap-1.5"><Check /> NC market pricing</span>
              <span className="flex items-center gap-1.5"><Check /> 100% private</span>
            </div>
          </div>

          {/* hero art */}
          <div className="order-first md:order-last">
            <div className="w-56 sm:w-72 md:w-full max-w-sm mx-auto">
              {IMAGES.heroForeground
                ? <img src={IMAGES.heroForeground} alt="Get an instant auto repair estimate" className="w-full h-auto drop-shadow-2xl animate-floaty" />
                : <HeroArtFallback />}
            </div>
          </div>
        </div>
      </section>

      {/* ── TOOL CARDS ───────────────────────────────────── */}
      <div className="text-center mb-5">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 font-display">What would you like to do?</h3>
        <p className="text-slate-500 text-sm mt-1">Pick the option that fits your situation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
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
