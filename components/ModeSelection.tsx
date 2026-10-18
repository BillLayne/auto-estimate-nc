import React, { useState } from 'react';
import { AppStep } from '../types';
import { AGENCY, IMAGES } from '../config';

interface ModeSelectionProps {
  setStep: (step: AppStep) => void;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const STEPS = [
  {
    num: '1',
    title: 'Upload your photos',
    copy: 'Share clear photos of the damage to your vehicle.',
  },
  {
    num: '2',
    title: 'Review the cost guide',
    copy: 'Review preliminary repair-cost guidance based on your photos.',
  },
  {
    num: '3',
    title: 'Choose your next step',
    copy: 'Use the results to prepare questions or compare with a shop estimate.',
  },
];

const BENEFITS = [
  {
    title: 'Understand parts & labor',
    description: 'Get plain-English explanations of common repair terms.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    title: 'Spot differences between estimates',
    description: 'Review how parts, labor, and repair scope differ.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: 'Prepare questions for your repair shop',
    description: 'Go into the conversation with clearer questions.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
];

const FAQS: FaqItem[] = [
  {
    id: 'faq-photos',
    question: 'What photos should I upload?',
    answer:
      'Take clear photos of the damaged area from several angles, including a wider view of the vehicle and close-ups. Follow the upload instructions shown in the tool.',
  },
  {
    id: 'faq-all-damage',
    question: 'Can photos show all damage?',
    answer:
      'No. Damage behind panels or inside components may not be visible. A repair shop’s inspection can identify additional work.',
  },
  {
    id: 'faq-claim',
    question: 'Does this submit an insurance claim?',
    answer:
      'Using this estimate tool does not submit an insurance claim. Contact your insurer or our agency if you want help with the claims process.',
  },
];

const ModeSelection: React.FC<ModeSelectionProps> = ({ setStep }) => {
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-photos');

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-white text-[#1B2432]">
      {/* ── Sections 7, 8, 9, 10: Opening Layout (Hero + Task Selection) ── */}
      <section aria-labelledby="ae-main-heading" className="bg-white">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 pt-4 pb-8 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-[48fr_52fr] md:gap-x-6 md:gap-y-0 items-stretch">
            {/* Grid Item 1: Deep Navy Headline Block (Left top on desktop, First on mobile) */}
            <div className="md:col-start-1 md:row-start-1 bg-[#0A1F44] text-white rounded-t-[18px] md:rounded-t-[20px] md:rounded-b-none px-5 pt-6 pb-8 md:px-8 md:pt-8 md:pb-6">
              <span className="inline-block bg-white/10 border border-white/15 text-white/90 text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.08em] px-3 py-1.5 rounded-md mb-3.5 md:mb-4">
                FREE PHOTO-BASED ESTIMATE GUIDE
              </span>
              <h1
                id="ae-main-heading"
                className="font-display font-extrabold text-[32px] sm:text-[36px] md:text-[46px] lg:text-[52px] leading-[1.1] tracking-[-0.02em]"
              >
                <span className="block text-white">Car damage?</span>
                <span className="block text-[#E8B84B] mt-1">Get a clearer starting point.</span>
              </h1>
              {/* Desktop supporting copy */}
              <p className="hidden md:block text-[17px] leading-[1.55] text-white/90 mt-4 max-w-[46ch]">
                Upload photos for a preliminary repair-cost guide—or get help understanding a shop estimate.
              </p>
              {/* Mobile short supporting copy */}
              <p className="md:hidden text-[16px] leading-[1.5] text-white/90 mt-3">
                Upload photos, understand a shop estimate, or compare two.
              </p>
            </div>

            {/* Grid Item 2: White Task-Selection Panel (Right column on desktop, Second on mobile BEFORE the photo) */}
            <div className="md:col-start-2 md:row-start-1 md:row-span-2 bg-white border border-[#E2E8F0] rounded-[18px] md:rounded-[20px] -mt-4 md:mt-0 relative z-10 p-4 sm:p-5 md:p-7 lg:p-8 shadow-[0_8px_24px_rgba(10,31,68,0.06)] flex flex-col justify-between">
              <div>
                <h2 className="font-display font-bold text-[22px] sm:text-[24px] md:text-[28px] lg:text-[30px] text-[#0A1F44] leading-[1.2] mb-4 md:mb-5">
                  What would you like help with?
                </h2>

                <div className="flex flex-col gap-3" role="group" aria-label="Estimate tools">
                  {/* Action 1: Estimate damage from photos (Highlighted Primary Row) */}
                  <button
                    type="button"
                    onClick={() => setStep(AppStep.Intake)}
                    aria-label="Estimate damage from photos — Start with photos of your vehicle"
                    className="w-full min-h-[84px] text-left bg-[#FFF8E8] hover:bg-[#FDF3D7] border-[1.5px] border-[#E8B84B] hover:border-[#D4A93C] rounded-[12px] px-4 py-3.5 md:px-5 md:py-4 flex items-center gap-3.5 md:gap-4 transition-all group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44]"
                  >
                    <span className="w-7 h-7 shrink-0 text-[#D4A93C] flex items-center justify-center" aria-hidden="true">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 17h14M6 11l1.5-4.5A2 2 0 019.4 5h5.2a2 2 0 011.9 1.37L18 11m-14 0h16a1 1 0 011 1v4a1 1 0 01-1 1h-1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1H8v1a1 1 0 01-1 1H6a1 1 0 01-1-1v-1H4a1 1 0 01-1-1v-4a1 1 0 011-1zm3 3h.01M17 14h.01" />
                      </svg>
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-display font-bold text-[17px] sm:text-[18px] md:text-[20px] text-[#0A1F44] leading-snug">
                        Estimate damage from photos
                      </span>
                      <span className="block text-[14px] sm:text-[15px] text-[#1B2432]/85 mt-0.5 leading-snug">
                        Start with photos of your vehicle.
                      </span>
                    </span>
                    <span className="w-5 h-5 shrink-0 text-[#0A1F44] group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
                      </svg>
                    </span>
                  </button>

                  {/* Action 2: Explain a repair estimate */}
                  <button
                    type="button"
                    onClick={() => setStep(AppStep.UploadEstimate)}
                    aria-label="Explain a repair estimate — Get a plain-English breakdown"
                    className="w-full min-h-[84px] text-left bg-white hover:bg-[#FAF7F0]/60 border border-[#E2E8F0] hover:border-[#0A1F44]/40 rounded-[12px] px-4 py-3.5 md:px-5 md:py-4 flex items-center gap-3.5 md:gap-4 transition-all group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44]"
                  >
                    <span className="w-7 h-7 shrink-0 text-[#0A1F44] flex items-center justify-center" aria-hidden="true">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-display font-bold text-[17px] sm:text-[18px] md:text-[20px] text-[#0A1F44] leading-snug">
                        Explain a repair estimate
                      </span>
                      <span className="block text-[14px] sm:text-[15px] text-[#6B7280] mt-0.5 leading-snug">
                        Get a plain-English breakdown.
                      </span>
                    </span>
                    <span className="w-5 h-5 shrink-0 text-[#0A1F44] group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
                      </svg>
                    </span>
                  </button>

                  {/* Action 3: Compare two estimates */}
                  <button
                    type="button"
                    onClick={() => setStep(AppStep.UploadComparisonA)}
                    aria-label="Compare two estimates — Review differences in parts, labor, and scope"
                    className="w-full min-h-[84px] text-left bg-white hover:bg-[#FAF7F0]/60 border border-[#E2E8F0] hover:border-[#0A1F44]/40 rounded-[12px] px-4 py-3.5 md:px-5 md:py-4 flex items-center gap-3.5 md:gap-4 transition-all group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44]"
                  >
                    <span className="w-7 h-7 shrink-0 text-[#0A1F44] flex items-center justify-center" aria-hidden="true">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m-7 0h14M5 7l14 0M6 7l-3 6h6l-3-6zm12 0l-3 6h6l-3-6z" />
                      </svg>
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-display font-bold text-[17px] sm:text-[18px] md:text-[20px] text-[#0A1F44] leading-snug">
                        Compare two estimates
                      </span>
                      <span className="block text-[14px] sm:text-[15px] text-[#6B7280] mt-0.5 leading-snug">
                        Review differences in parts, labor, and scope.
                      </span>
                    </span>
                    <span className="w-5 h-5 shrink-0 text-[#0A1F44] group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
                      </svg>
                    </span>
                  </button>

                  {/* Action 4: Home repair & projects (Warm cream row with extra space above) */}
                  <a
                    href="/home/"
                    aria-label="Home repair and projects — Explore the home-estimate tool"
                    className="mt-1 w-full min-h-[84px] text-left bg-[#FAF7F0] hover:bg-[#F3EFE4] border border-[#E2E8F0] hover:border-[#0A1F44]/40 rounded-[12px] px-4 py-3.5 md:px-5 md:py-4 flex items-center gap-3.5 md:gap-4 transition-all group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44]"
                  >
                    <span className="w-7 h-7 shrink-0 text-[#0A1F44] flex items-center justify-center" aria-hidden="true">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5L12 3l9 7.5M5 9v10a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1V9" />
                      </svg>
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-display font-bold text-[17px] sm:text-[18px] md:text-[20px] text-[#0A1F44] leading-snug">
                        Home repair &amp; projects
                      </span>
                      <span className="block text-[14px] sm:text-[15px] text-[#6B7280] mt-0.5 leading-snug">
                        Explore the home-estimate tool.
                      </span>
                    </span>
                    <span className="w-5 h-5 shrink-0 text-[#0A1F44] group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
                      </svg>
                    </span>
                  </a>
                </div>
              </div>

              {/* Desktop Primary Button (omitted on mobile per Section 9) + Supporting Note */}
              <div className="mt-4 md:mt-5">
                <button
                  type="button"
                  onClick={() => setStep(AppStep.Intake)}
                  className="hidden md:inline-flex w-full min-h-[54px] px-6 py-3.5 rounded-[12px] bg-[#E8B84B] hover:bg-[#D4A93C] text-[#0A1F44] font-bold text-[16px] items-center justify-center gap-2 transition-colors shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44]"
                >
                  <span>Start with vehicle photos</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
                  </svg>
                </button>
                <p className="text-[13px] md:text-[14px] text-[#6B7280] text-center mt-2 md:mt-3">
                  Preliminary guidance. Final costs require inspection.
                </p>
              </div>
            </div>

            {/* Grid Item 3: Vehicle-Damage Photo (Left bottom on desktop, Third on mobile AFTER the choices) */}
            <div className="md:col-start-1 md:row-start-2 mt-4 md:mt-0 md:bg-[#0A1F44] md:px-7 md:pb-7 md:rounded-b-[20px] flex flex-col">
              <picture className="block w-full flex-1">
                <source
                  media="(min-width: 768px)"
                  srcSet={IMAGES.heroDesktop}
                  width={1600}
                  height={900}
                />
                <img
                  src={IMAGES.heroMobile}
                  width={1122}
                  height={1402}
                  alt="Smartphone capturing minor front fender damage on a silver SUV"
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-[270px] sm:h-[320px] md:h-full md:min-h-[250px] object-cover object-center rounded-[16px] md:rounded-[12px] border border-[#E2E8F0] md:border-white/10 block"
                />
              </picture>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 11: Three-Step Explanation (#how-it-works) ── */}
      <section
        id="how-it-works"
        aria-labelledby="ae-steps-heading"
        className="bg-[#FAF7F0] border-y border-[#E2E8F0] scroll-mt-20"
      >
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-9 md:py-13">
          <h2
            id="ae-steps-heading"
            className="font-display font-bold text-[24px] sm:text-[26px] md:text-[32px] text-[#0A1F44] leading-[1.2] mb-6 md:mb-8"
          >
            From photos to a clearer picture.
          </h2>

          <ol className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {STEPS.map((step, index) => (
              <li
                key={step.num}
                className="relative flex items-start gap-4 md:pr-6"
              >
                <span
                  className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#E8B84B] text-[#0A1F44] font-display font-extrabold text-[18px] md:text-[20px] flex items-center justify-center shrink-0 mt-0.5"
                  aria-hidden="true"
                >
                  {step.num}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-[18px] md:text-[20px] text-[#0A1F44] leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-[15px] md:text-[16px] text-[#1B2432]/85 mt-1 leading-[1.55]">
                    {step.copy}
                  </p>
                </div>
                {index < STEPS.length - 1 && (
                  <span
                    className="hidden md:flex items-center justify-center text-[#6B7280]/60 self-center ml-1"
                    aria-hidden="true"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
                    </svg>
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Sections 12 & 13: Repair-Estimate Explanation + Info Panel ── */}
      <section aria-labelledby="ae-explain-heading" className="bg-white">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-9 md:py-14">
          {/* Desktop: Photo Left (col 1) | Heading + Benefits Right (col 2)
              Mobile: Heading (1) -> Photo (2) -> Benefits (3) */}
          <div className="grid grid-cols-1 md:grid-cols-[48fr_52fr] md:gap-x-8 lg:gap-x-10 items-center">
            {/* Heading */}
            <div className="md:col-start-2 md:row-start-1 mb-4 md:mb-5">
              <h2
                id="ae-explain-heading"
                className="font-display font-bold text-[24px] sm:text-[26px] md:text-[32px] lg:text-[34px] text-[#0A1F44] leading-[1.2]"
              >
                <span className="md:hidden">Understand your shop estimate.</span>
                <span className="hidden md:inline">Know what your estimate is telling you.</span>
              </h2>
            </div>

            {/* Estimate Sheet Photo */}
            <div className="md:col-start-1 md:row-start-1 md:row-span-2 mb-5 md:mb-0">
              <img
                src={IMAGES.estimateSheet}
                width={1536}
                height={1024}
                loading="lazy"
                decoding="async"
                alt="Body shop estimate sheet with vehicle key fob and pen on a wooden desk"
                className="w-full aspect-[3/2] object-cover rounded-[16px] border border-[#E2E8F0] shadow-[0_6px_20px_rgba(10,31,68,0.05)] block"
              />
            </div>

            {/* Three Benefit Rows */}
            <div className="md:col-start-2 md:row-start-2 divide-y divide-[#E2E8F0]">
              {BENEFITS.map((item) => (
                <div key={item.title} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3.5">
                  <span className="w-11 h-11 rounded-[10px] border border-[#E2E8F0] bg-[#FAF7F0]/60 text-[#0A1F44] flex items-center justify-center shrink-0 mt-0.5">
                    {item.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-[17px] md:text-[19px] text-[#0A1F44] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[15px] md:text-[16px] text-[#6B7280] mt-0.5 leading-[1.5]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 13: Preliminary-Estimate Information Panel */}
          <div
            role="note"
            aria-labelledby="ae-info-heading"
            className="mt-8 md:mt-10 bg-[#EFF6FC] border border-[#B8D4EE] rounded-[14px] px-4 py-4 sm:px-5 md:px-6 md:py-5 flex items-start sm:items-center gap-3.5 md:gap-4"
          >
            <span className="w-9 h-9 rounded-full border-2 border-[#0A1F44] text-[#0A1F44] font-display font-extrabold text-[17px] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0" aria-hidden="true">
              i
            </span>
            <div className="flex-1 min-w-0">
              <h2
                id="ae-info-heading"
                className="font-display font-bold text-[17px] md:text-[19px] text-[#0A1F44] leading-snug"
              >
                A starting point—not a final repair quote.
              </h2>
              <p className="text-[15px] md:text-[16px] text-[#1B2432] mt-0.5 leading-[1.5]">
                Hidden damage, repair methods, and parts availability can change the final cost. A repair professional must inspect the vehicle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 14: FAQs ── */}
      <section
        id="faqs"
        aria-labelledby="ae-faq-heading"
        className="bg-[#FAF7F0] border-t border-[#E2E8F0]"
      >
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-9 md:py-13">
          <h2
            id="ae-faq-heading"
            className="font-display font-bold text-[24px] sm:text-[26px] md:text-[30px] text-[#0A1F44] leading-[1.2] mb-5 md:mb-6"
          >
            Helpful answers
          </h2>

          <div className="space-y-3">
            {FAQS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              const panelId = `${faq.id}-panel`;
              const buttonId = `${faq.id}-button`;
              return (
                <div
                  key={faq.id}
                  className="bg-white border border-[#E2E8F0] rounded-[12px] overflow-hidden"
                >
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full min-h-[54px] px-4 sm:px-5 py-3.5 text-left flex items-center justify-between gap-4 font-semibold text-[16px] md:text-[17px] text-[#0A1F44] hover:bg-[#FAF7F0]/50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0A1F44]"
                    >
                      <span>{faq.question}</span>
                      <svg
                        className={`w-5 h-5 text-[#0A1F44] shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    hidden={!isOpen}
                    className="px-4 sm:px-5 pb-4 pt-0.5 text-[15px] md:text-[16px] text-[#1B2432] leading-[1.6] border-t border-[#E2E8F0]/60"
                  >
                    {faq.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section 15: Local-Help Section ── */}
      <section aria-labelledby="ae-local-help-heading" className="bg-[#0A1F44] text-white">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-6 md:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
          <div className="flex items-start sm:items-center gap-3.5">
            <span className="w-7 h-7 text-white shrink-0 mt-0.5 sm:mt-0" aria-hidden="true">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </span>
            <div>
              <h2
                id="ae-local-help-heading"
                className="font-display font-bold text-[20px] sm:text-[22px] md:text-[24px] text-white leading-snug"
              >
                Questions about your policy or deductible?
              </h2>
              <p className="text-[15px] md:text-[16px] text-white/85 mt-0.5">
                Talk with Bill Layne Insurance.
              </p>
            </div>
          </div>

          <a
            href={AGENCY.phoneHref}
            className="w-full md:w-auto min-h-[52px] px-6 py-3.5 rounded-[12px] bg-[#E8B84B] hover:bg-[#D4A93C] text-[#0A1F44] font-bold text-[16px] inline-flex items-center justify-center gap-2.5 transition-colors shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" />
            </svg>
            <span>Call {AGENCY.phoneDisplay}</span>
          </a>
        </div>
      </section>
    </div>
  );
};

export default ModeSelection;

