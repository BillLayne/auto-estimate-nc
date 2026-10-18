import React from 'react';
import { AppStep } from '../types';
import { AGENCY, IMAGES } from '../config';

interface LayoutProps {
  children: React.ReactNode;
  activeStep: AppStep;
  setStep: (step: AppStep) => void;
  /** 'auto' = / (car tools) · 'home' = /home/ (home repair & project estimates) */
  variant?: 'auto' | 'home';
}

const Layout: React.FC<LayoutProps> = ({ children, activeStep, setStep, variant = 'auto' }) => {
  const isHome = variant === 'home';
  const isAutoLanding = !isHome && activeStep === AppStep.ModeSelection;

  const handleHowItWorksClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHome) return;
    e.preventDefault();
    if (activeStep !== AppStep.ModeSelection) {
      setStep(AppStep.ModeSelection);
      setTimeout(() => {
        const el = document.getElementById('how-it-works');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    } else {
      const el = document.getElementById('how-it-works');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePrivacyClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setStep(AppStep.Docs);
    setTimeout(() => {
      const el = document.getElementById('privacy');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 60);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1B2432]">
      {/* ── Header (Section 6) ─────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 h-[62px] md:h-[76px] flex items-center justify-between gap-3">
          <button
            type="button"
            className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer text-left min-h-[44px] rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44]"
            onClick={() => {
              setStep(isHome ? AppStep.HomeLanding : AppStep.ModeSelection);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label="AutoEstimate NC by Bill Layne Insurance — return to start"
          >
            <img
              src={IMAGES.agencyLogo}
              alt="Bill Layne Insurance Agency"
              width={784}
              height={248}
              decoding="async"
              className="h-7 sm:h-8 md:h-9 w-auto shrink-0"
            />
            <span className="h-6 md:h-7 w-px bg-[#E2E8F0] shrink-0" aria-hidden="true" />
            <span className="font-display font-bold text-[17px] sm:text-[19px] md:text-[22px] tracking-tight text-[#0A1F44] leading-none">
              AutoEstimate <span className="text-[#E8B84B]">NC</span>
            </span>
            {isHome && (
              <span className="hidden sm:inline-flex items-center bg-[#FFF8E8] border border-[#E8B84B] text-[#0A1F44] text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                Home
              </span>
            )}
          </button>

          {/* Desktop Right Navigation */}
          <div className="hidden md:flex items-center gap-7">
            {!isHome ? (
              <a
                href="#how-it-works"
                onClick={handleHowItWorksClick}
                className="min-h-[44px] inline-flex items-center text-[16px] font-semibold text-[#1B2432] hover:text-[#0A1F44] transition-colors rounded-lg px-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44]"
              >
                How it works
              </a>
            ) : (
              <a
                href="/"
                className="min-h-[44px] inline-flex items-center text-[16px] font-semibold text-[#1B2432] hover:text-[#0A1F44] transition-colors rounded-lg px-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44]"
              >
                Auto estimates
              </a>
            )}
            <a
              href={AGENCY.phoneHref}
              className="min-h-[44px] inline-flex items-center gap-2 text-[16px] font-bold text-[#0A1F44] hover:text-[#122A52] transition-colors rounded-lg px-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44]"
            >
              <svg
                className="w-5 h-5 text-[#E8B84B] shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" />
              </svg>
              <span>{AGENCY.phoneDisplay}</span>
            </a>
          </div>

          {/* Mobile Right Phone Icon */}
          <div className="flex md:hidden items-center">
            <a
              href={AGENCY.phoneHref}
              aria-label={`Call Bill Layne Insurance at ${AGENCY.phoneDisplay}`}
              className="w-11 h-11 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-xl text-[#D4A93C] hover:bg-[#FFF8E8] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44]"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────── */}
      {isAutoLanding ? (
        <main className="flex-grow w-full">{children}</main>
      ) : (
        <main className="flex-grow w-full max-w-[1200px] mx-auto px-5 md:px-10 py-6 md:py-10">
          {children}
        </main>
      )}

      {/* ── Footer (Section 16) ────────────────────────────── */}
      <footer className="bg-white border-t border-[#E2E8F0] text-[#1B2432] safe-b">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-7 md:py-9">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left: Agency Identity & NAP */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 sm:gap-5">
              <a
                href={AGENCY.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center shrink-0 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44]"
                aria-label="Bill Layne Insurance Agency website"
              >
                <img
                  src={IMAGES.agencyLogo}
                  alt="Bill Layne Insurance Agency"
                  width={784}
                  height={248}
                  loading="lazy"
                  decoding="async"
                  className="h-8 md:h-9 w-auto"
                />
              </a>
              <span className="hidden sm:block h-8 w-px bg-[#E2E8F0]" aria-hidden="true" />
              <div className="text-[13px] md:text-[14px] text-[#1B2432] leading-snug">
                <p className="font-display font-bold text-[#0A1F44] text-[14px] md:text-[15px]">
                  {AGENCY.name}
                </p>
                <p className="text-[#6B7280] mt-0.5">
                  {AGENCY.streetAddress}, {AGENCY.cityStateZip} ·{' '}
                  <a
                    href={AGENCY.phoneHref}
                    className="text-[#0A1F44] font-semibold hover:underline"
                  >
                    {AGENCY.phoneDisplay}
                  </a>{' '}
                  ·{' '}
                  <a
                    href={AGENCY.emailHref}
                    className="text-[#0A1F44] font-semibold hover:underline"
                  >
                    {AGENCY.email}
                  </a>
                </p>
              </div>
            </div>

            {/* Right: Working Links + Footer Statement */}
            <div className="flex flex-col lg:items-end gap-2">
              <nav
                aria-label="Footer navigation"
                className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] md:text-[14px] font-semibold text-[#0A1F44]"
              >
                <a
                  href="#privacy"
                  onClick={handlePrivacyClick}
                  className="min-h-[44px] inline-flex items-center hover:underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44] rounded"
                >
                  Privacy
                </a>
                <a
                  href={isHome ? '/#how-it-works' : '#how-it-works'}
                  onClick={isHome ? undefined : handleHowItWorksClick}
                  className="min-h-[44px] inline-flex items-center hover:underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44] rounded"
                >
                  How it works
                </a>
                <a
                  href="/home/"
                  className="min-h-[44px] inline-flex items-center hover:underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44] rounded"
                >
                  Home repair estimates
                </a>
                <a
                  href={AGENCY.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] inline-flex items-center hover:underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44] rounded"
                >
                  Agency website
                </a>
              </nav>
              <p className="text-[12px] md:text-[13px] text-[#6B7280] leading-normal max-w-md lg:text-right">
                AI-generated estimates are preliminary and do not determine coverage or claim payments.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

