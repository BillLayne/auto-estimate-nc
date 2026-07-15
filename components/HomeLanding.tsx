import React from 'react';
import { HomeProjectMode } from '../types';
import { AGENCY, IMAGES } from '../config';

interface HomeLandingProps {
  onStart: (mode: HomeProjectMode) => void;
}

const CATEGORIES = [
  'Roof', 'Siding & Gutters', 'Deck & Porch', 'Fence', 'Windows & Doors',
  'Water Damage', 'Drywall & Paint', 'Flooring', 'Kitchen', 'Bathroom',
];

const HomeLanding: React.FC<HomeLandingProps> = ({ onStart }) => {
  return (
    <div className="animate-fadeIn">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl shadow-lg mb-8 bg-brand-navy-deep md:min-h-[480px] md:flex md:items-center">
        {/* MOBILE: purpose-built 3:2 scene as a top band (full image, no crop) */}
        {IMAGES.homeHeroMobile && (
          <div
            className="md:hidden aspect-[3/2] bg-cover bg-no-repeat bg-center"
            style={{ backgroundImage: `url("${IMAGES.homeHeroMobile}")` }}
            role="img"
            aria-label="A phone photographing a home, with an instant repair-cost estimate card"
          />
        )}
        {/* DESKTOP: optional full-bleed render (IMAGES.homeHero) — falls back to the on-brand gradient */}
        {IMAGES.homeHero ? (
          <div
            className="hidden md:block absolute inset-0 bg-no-repeat bg-cover bg-[position:right_30%]"
            style={{ backgroundImage: `url("${IMAGES.homeHero}")` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-navy-deep via-brand-navy to-brand-navy-dk" />
        )}
        {IMAGES.homeHero && (
          <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-brand-navy-deep via-brand-navy-deep/45 to-transparent" />
        )}
        {/* gold glow accents */}
        <div className="absolute -top-12 -right-10 w-72 h-72 rounded-full bg-brand-gold/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-12 w-80 h-80 rounded-full bg-brand-navy/40 blur-3xl pointer-events-none" />

        {/* Decorative house illustration (desktop only, until Bill's render lands) */}
        {!IMAGES.homeHero && (
          <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none select-none" aria-hidden="true">
            <svg width="380" height="330" viewBox="0 0 380 330" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* house body */}
              <rect x="70" y="150" width="220" height="150" rx="8" fill="#012a5e" stroke="#1e4f9e" strokeWidth="2"/>
              {/* roof */}
              <path d="M50 160 L180 60 L310 160" stroke="#C8A84E" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M70 150 L180 66 L290 150 Z" fill="#0a3a78"/>
              {/* door */}
              <rect x="160" y="220" width="44" height="80" rx="4" fill="#C8A84E" opacity="0.9"/>
              {/* windows */}
              <rect x="96" y="180" width="42" height="42" rx="4" fill="#E0C878" opacity="0.55"/>
              <rect x="224" y="180" width="42" height="42" rx="4" fill="#E0C878" opacity="0.55"/>
              {/* floating estimate card */}
              <g className="animate-floaty">
                <rect x="236" y="70" width="132" height="66" rx="12" fill="#ffffff"/>
                <rect x="236" y="70" width="132" height="66" rx="12" stroke="#C8A84E" strokeWidth="2"/>
                <text x="302" y="98" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="600">ESTIMATED COST</text>
                <text x="302" y="121" textAnchor="middle" fill="#003f87" fontSize="17" fontFamily="Inter, sans-serif" fontWeight="800">$4,850–$7,200</text>
              </g>
              {/* sparkle */}
              <path d="M330 190 l6 14 14 6 -14 6 -6 14 -6 -14 -14 -6 14 -6 z" fill="#E0C878" opacity="0.8"/>
            </svg>
          </div>
        )}

        <div className="relative z-10 w-full p-6 sm:p-9 md:p-10">
          <div className="max-w-xl text-center md:text-left mx-auto md:mx-0">
            <span className="inline-flex items-center gap-2 bg-brand-gold/20 border border-brand-gold/40 text-brand-gold-lt text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" /> Free AI Tool · No login
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-white leading-[1.1] font-display">
              Storm damage or a big project?<br className="hidden sm:block" />{' '}
              <span className="text-brand-gold-lt">Know the cost</span> before the contractor calls back.
            </h2>
            <p className="text-blue-50 mt-4 text-base sm:text-lg max-w-lg mx-auto md:mx-0">
              Snap a few photos of your roof, deck, siding, or water damage and get a friendly,
              preliminary cost range at current NC contractor rates — in about two minutes.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <button
                onClick={() => onStart('damage')}
                className="px-6 py-4 rounded-2xl bg-gold-grad text-brand-navy-deep font-bold text-base hover:bg-gold-grad-hover active:scale-[0.98] transition-all shadow-glow-gold flex items-center justify-center gap-2"
              >
                Estimate Storm Damage
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
              <button
                onClick={() => onStart('upgrade')}
                className="px-6 py-4 rounded-2xl bg-white/10 ring-1 ring-white/30 text-white font-bold text-base hover:bg-white/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Price a Home Project
              </button>
            </div>
            {/* trust chips */}
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 justify-center md:justify-start text-xs text-blue-100">
              <span className="flex items-center gap-1.5"><Check /> Takes ~2 minutes</span>
              <span className="flex items-center gap-1.5"><Check /> NC contractor pricing</span>
              <span className="flex items-center gap-1.5"><Check /> 100% private — nothing is filed</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY HOMEOWNERS USE THIS ──────────────────────── */}
      <div className="text-center mb-5">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 font-display">Why homeowners use this</h3>
        <p className="text-slate-500 text-sm mt-1">Real answers, before you're stuck waiting on callbacks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-10">
        <WhyCard
          title="“Is it even worth a claim?”"
          desc="After a storm, the big question is whether the repair cost clears your deductible. Get a realistic range first — then decide with clear eyes. Nothing here files a claim."
          img={IMAGES.homeWhyClaim}
          imgAlt="Homeowner photographing storm damage on a shingle roof"
          icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
        />
        <WhyCard
          title="Budget before you call"
          desc="Replacing a deck, roof, or flooring? Know a fair NC price range before the first contractor visit — no more guessing whether a quote is high, low, or right on."
          img={IMAGES.homeWhyBudget}
          imgAlt="A brand-new composite deck at golden hour"
          icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
        />
        <WhyCard
          title="No waiting on contractors"
          desc="Contractors are booked out for weeks. Get your preliminary number today, so you can plan, save, and schedule with confidence — not in the dark."
          img={IMAGES.homeWhyWaiting}
          imgAlt="Homeowner on the porch checking an estimate on their phone"
          icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      {/* ── WHAT YOU CAN ESTIMATE ────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/70 p-6 sm:p-8 mb-10">
        <div className="text-center mb-5">
          <h3 className="text-xl font-bold text-slate-800 font-display">What can it estimate?</h3>
          <p className="text-slate-500 text-sm mt-1">Damage repairs and planned upgrades, inside and out.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2.5">
          {CATEGORIES.map((c) => (
            <span key={c} className="px-4 py-2 rounded-full bg-blue-50 ring-1 ring-blue-100 text-brand-navy text-sm font-semibold">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <div className="text-center mb-5">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 font-display">How it works</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-10">
        <StepCard num="1" title="Describe the project" desc="Damage repair or planned upgrade — pick a category and tell us a little about it." />
        <StepCard num="2" title="Snap a few photos" desc="A wide shot, a close-up, and a different angle. iPhone photos work great." />
        <StepCard num="3" title="Get your cost range" desc="A preliminary low-to-high guide built on current NC material prices and labor rates." />
      </div>

      {/* ── CTA BAND ─────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-brand-navy-deep via-brand-navy to-brand-navy-dk rounded-2xl shadow-lg p-6 sm:p-8 mb-10 text-center">
        <h3 className="text-white font-bold text-xl sm:text-2xl font-display">Ready to see your number?</h3>
        <p className="text-blue-100 text-sm mt-2 max-w-md mx-auto">Free, private, and takes about two minutes. No login, no claim filed, no pressure.</p>
        <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => onStart('damage')}
            className="px-6 py-3.5 rounded-2xl bg-gold-grad text-brand-navy-deep font-bold hover:bg-gold-grad-hover active:scale-[0.98] transition-all shadow-glow-gold"
          >
            Estimate Storm Damage
          </button>
          <button
            onClick={() => onStart('upgrade')}
            className="px-6 py-3.5 rounded-2xl bg-white/10 ring-1 ring-white/30 text-white font-bold hover:bg-white/20 active:scale-[0.98] transition-all"
          >
            Price a Home Project
          </button>
        </div>
      </div>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/70 p-6 sm:p-8 mb-8">
        <h3 className="text-xl font-bold text-slate-800 font-display text-center mb-5">Common questions</h3>
        <div className="space-y-4 max-w-2xl mx-auto">
          <Faq q="Is this an official insurance estimate or a contractor bid?"
               a="No — it's a free, preliminary cost guide based on your photos and current NC market rates. Actual costs are set by licensed contractors, and any claim decision is made with your insurance company." />
          <Faq q="Can it help me decide if my damage is worth a claim?"
               a="That's exactly what it's for. You'll get a repair-cost range you can weigh against your deductible — and nothing here files a claim or contacts your insurance company. When in doubt, call us and we'll talk it through." />
          <Faq q="Will using this raise my rates or start a claim?"
               a="Not at all. Nothing here files a claim or contacts your insurance company. It's just information for you." />
          <Faq q="Do I need an account?"
               a="No — there's no login and no sign-up. It's free to use as many times as you like." />
        </div>
      </div>

      {/* ── cross-link + reassurance strip ──────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a href="/" className="group bg-white/70 backdrop-blur rounded-2xl ring-1 ring-slate-200/70 p-5 flex items-center gap-4 hover:ring-brand-gold hover:shadow-xl transition-all">
          <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-100 text-brand-navy flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8m-8 5h8m-4 5h4M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16l-3.5-2-3.5 2-3.5-2L5 21z" /></svg>
          </div>
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-800">Car damage instead?</span> Try our free AI auto body estimate tools
            <span className="text-brand-navy font-bold ml-1 group-hover:ml-2 transition-all">→</span>
          </p>
        </a>
        <div className="bg-white/70 backdrop-blur rounded-2xl ring-1 ring-slate-200/70 p-5 flex items-center gap-4">
          <div className="w-11 h-11 shrink-0 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-800">This is a free guide, not a sales pitch.</span> Questions? Call Bill Layne Insurance at <a href={AGENCY.phoneHref} className="text-brand-navy font-semibold underline underline-offset-2">{AGENCY.phone}</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

const WhyCard: React.FC<{ title: string; desc: string; icon: React.ReactNode; img?: string; imgAlt?: string }> = ({ title, desc, icon, img, imgAlt }) => (
  <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/70 flex flex-col overflow-hidden">
    {/* Photo top (Bill's renders) — falls back to the icon block when '' */}
    {img ? (
      <div className="aspect-[16/10] bg-brand-navy-deep">
        <img src={img} alt={imgAlt || ''} className="w-full h-full object-cover" loading="lazy" />
      </div>
    ) : null}
    <div className="p-6 flex flex-col flex-grow">
      {!img && (
        <div className="w-14 h-14 rounded-2xl bg-brand-navy text-white flex items-center justify-center mb-4 shadow-md">
          {icon}
        </div>
      )}
      <h4 className="text-lg font-bold text-slate-800 mb-1.5 font-display">{title}</h4>
      <p className="text-sm text-slate-500">{desc}</p>
    </div>
  </div>
);

const StepCard: React.FC<{ num: string; title: string; desc: string }> = ({ num, title, desc }) => (
  <div className="relative bg-white p-6 rounded-2xl shadow-sm ring-1 ring-slate-200/70">
    <span className="absolute top-5 right-5 text-5xl font-extrabold text-slate-100 font-display leading-none select-none">{num}</span>
    <h4 className="text-base font-bold text-slate-800 mb-1.5 font-display">{title}</h4>
    <p className="text-sm text-slate-500 pr-8">{desc}</p>
  </div>
);

const Faq: React.FC<{ q: string; a: string }> = ({ q, a }) => (
  <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200 p-4">
    <p className="font-bold text-slate-800 text-sm">{q}</p>
    <p className="text-sm text-slate-600 mt-1.5">{a}</p>
  </div>
);

const Check: React.FC = () => (
  <svg className="w-4 h-4 text-brand-gold-lt" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
);

export default HomeLanding;
