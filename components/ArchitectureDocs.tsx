import React from 'react';
import { AGENCY } from '../config';

interface ArchitectureDocsProps {
  onBack?: () => void;
}

const STEPS = [
  {
    n: '1',
    title: 'Upload your photos',
    body: 'Share clear photos of the damage to your vehicle (or upload your existing repair estimate PDF/photos).',
  },
  {
    n: '2',
    title: 'Review the cost guide',
    body: 'Review preliminary repair-cost guidance or plain-English line-item explanations based on your uploads.',
  },
  {
    n: '3',
    title: 'Choose your next step',
    body: 'Use the results to prepare questions for your repair shop, compare two estimates, or talk with our agency.',
  },
];

const PRIVACY_ITEMS = [
  {
    title: 'How uploaded photos and estimates are processed',
    body: 'When you submit vehicle photos or repair-estimate documents, your browser resizes image files locally and transmits them over encrypted HTTPS through our Cloudflare Worker service to Google’s Gemini AI API solely to generate your on-screen cost guide or estimate breakdown.',
  },
  {
    title: 'Contact details and deductible stay in your browser',
    body: 'Any customer name, address, email, or collision deductible you enter on the vehicle form is kept in your browser session to format your printable report and compare against your deductible. Those fields are not sent to the AI model or stored in an agency database.',
  },
  {
    title: 'Session retention',
    body: 'Uploaded images and generated reports remain in your browser memory while your tab stays open so you can review or print your results, or retry if a connection error occurs. Resetting the tool or closing the browser tab clears them from browser memory.',
  },
  {
    title: 'No automatic claim filing',
    body: 'Using AutoEstimate NC does not submit an insurance claim, notify any insurance company, or alter your policy. If you want help with a claim or coverage question, contact your insurer or Bill Layne Insurance directly.',
  },
];

const ArchitectureDocs: React.FC<ArchitectureDocsProps> = ({ onBack }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {onBack && (
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0A1F44] hover:underline min-h-[44px] px-1 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to estimate tools</span>
          </button>
        </div>
      )}

      {/* Privacy & Data Handling */}
      <section
        id="privacy"
        aria-labelledby="privacy-heading"
        className="bg-white rounded-[20px] border border-[#E2E8F0] shadow-[0_8px_24px_rgba(10,31,68,0.06)] p-6 sm:p-8 scroll-mt-24"
      >
        <span className="inline-block bg-[#FAF7F0] border border-[#E2E8F0] text-[#0A1F44] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md mb-3">
          Privacy &amp; Data Handling
        </span>
        <h1 id="privacy-heading" className="font-display font-bold text-[26px] sm:text-[30px] text-[#0A1F44] leading-[1.2]">
          How AutoEstimate NC handles your uploads
        </h1>
        <p className="text-[#6B7280] text-[16px] mt-2 leading-[1.55]">
          AutoEstimate NC is designed to give you preliminary repair-cost guidance without requiring an account or submitting a claim.
        </p>

        <div className="mt-6 space-y-4">
          {PRIVACY_ITEMS.map((item) => (
            <div key={item.title} className="rounded-[12px] bg-[#FAF7F0] border border-[#E2E8F0] p-4 sm:p-5">
              <h2 className="font-display font-bold text-[18px] text-[#0A1F44]">{item.title}</h2>
              <p className="text-[15px] text-[#1B2432] mt-1 leading-[1.55]">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section
        aria-labelledby="how-it-works-docs-heading"
        className="bg-white rounded-[20px] border border-[#E2E8F0] shadow-[0_8px_24px_rgba(10,31,68,0.06)] p-6 sm:p-8"
      >
        <h2 id="how-it-works-docs-heading" className="font-display font-bold text-[22px] sm:text-[26px] text-[#0A1F44] mb-4">
          From photos to a clearer picture
        </h2>
        <div className="space-y-4">
          {STEPS.map((s) => (
            <div key={s.n} className="flex gap-4 items-start">
              <span className="shrink-0 w-10 h-10 rounded-full bg-[#E8B84B] text-[#0A1F44] font-display font-extrabold text-[18px] flex items-center justify-center">
                {s.n}
              </span>
              <div>
                <h3 className="font-display font-bold text-[18px] text-[#0A1F44]">{s.title}</h3>
                <p className="text-[#6B7280] text-[15px] mt-0.5 leading-[1.55]">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-[#0A1F44] rounded-[20px] p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-white font-bold text-[20px] sm:text-[22px] font-display">
            Questions about your policy or deductible?
          </h2>
          <p className="text-white/85 text-[15px] mt-1">
            Talk with {AGENCY.name} in Elkin, NC.
          </p>
        </div>
        <a
          href={AGENCY.phoneHref}
          className="min-h-[52px] px-6 py-3.5 rounded-[12px] bg-[#E8B84B] hover:bg-[#D4A93C] text-[#0A1F44] font-bold text-[16px] inline-flex items-center justify-center gap-2 transition-colors shrink-0"
        >
          Call {AGENCY.phoneDisplay}
        </a>
      </section>
    </div>
  );
};

export default ArchitectureDocs;

