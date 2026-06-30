
import React from 'react';
import { AGENCY } from '../config';

const STEPS = [
  {
    n: '1',
    title: 'Tell us a little about your car',
    body: 'Your name and the year, make, model and mileage. Have the VIN handy? Scan or type it and we fill in the rest automatically.',
  },
  {
    n: '2',
    title: 'Snap a few photos of the damage',
    body: 'A wide shot, a close-up, and a different angle work best. Use your phone camera right here — iPhone HEIC photos are fine too.',
  },
  {
    n: '3',
    title: 'Get your preliminary estimate',
    body: 'In about a minute you get a friendly, plain-English repair-cost guide using current North Carolina parts and labor rates — so you can decide your next step.',
  },
];

const FAQ = [
  {
    q: 'Is this an official insurance estimate?',
    a: 'No — it\'s a free, preliminary guide to help you understand likely costs before you file a claim. Your final repair cost is set by a licensed body shop and your insurance adjuster.',
  },
  {
    q: 'Will using this raise my rates or start a claim?',
    a: 'Not at all. Nothing here files a claim or contacts your insurance company. It\'s just information for you. When you\'re ready, you decide whether to call us.',
  },
  {
    q: 'Do I need an account?',
    a: 'Nope. No login, no sign-up. It\'s free to use as many times as you like.',
  },
  {
    q: 'What if I already have a body-shop estimate?',
    a: 'Use the "Explain My Estimate" tool to translate the jargon into plain English, or "Compare Two Estimates" to see why two shops priced it differently.',
  },
];

const ArchitectureDocs: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Intro */}
      <section className="relative overflow-hidden rounded-3xl shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy-deep via-brand-navy to-brand-navy-dk" />
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-brand-gold/20 blur-3xl" />
        <div className="relative p-6 sm:p-9 text-center">
          <span className="inline-block bg-brand-gold/20 border border-brand-gold/40 text-brand-gold-lt text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-3">
            How it works
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">Your estimate in 3 easy steps</h2>
          <p className="text-blue-100 mt-2 max-w-md mx-auto text-sm sm:text-base">
            Free, fast, and private. No account, no pressure — just a clear picture of what a repair might cost.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="space-y-4">
        {STEPS.map((s) => (
          <div key={s.n} className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/70 p-5 sm:p-6 flex gap-4 items-start">
            <span className="shrink-0 w-11 h-11 rounded-2xl bg-brand-navy text-white font-extrabold text-lg flex items-center justify-center font-display shadow-md">
              {s.n}
            </span>
            <div>
              <h3 className="font-bold text-slate-800 font-display text-lg">{s.title}</h3>
              <p className="text-slate-600 text-sm mt-1 leading-relaxed">{s.body}</p>
            </div>
          </div>
        ))}
      </section>

      {/* FAQ */}
      <section className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/70 p-5 sm:p-7">
        <h3 className="font-bold text-slate-800 font-display text-lg mb-3">Common questions</h3>
        <div className="divide-y divide-slate-100">
          {FAQ.map((f, i) => (
            <details key={i} className="group py-3">
              <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-slate-700 text-sm">
                {f.q}
                <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0 ml-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </summary>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-brand-navy-deep via-brand-navy to-brand-navy-dk rounded-2xl shadow-lg p-6 sm:p-7 text-center">
        <h3 className="text-white font-bold text-lg font-display">Rather just talk to a person?</h3>
        <p className="text-blue-100 text-sm mt-1 mb-4">Bill Layne Insurance has served all 100 NC counties since 2005. Call or email any time.</p>
        <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
          <a href={AGENCY.phoneHref} className="px-6 py-3 rounded-xl bg-brand-gold text-brand-navy-deep font-bold text-sm hover:bg-brand-gold-lt transition-colors">
            Call {AGENCY.phone}
          </a>
          <a href={AGENCY.emailHref} className="px-6 py-3 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-colors">
            Email Us
          </a>
        </div>
      </section>
    </div>
  );
};

export default ArchitectureDocs;
