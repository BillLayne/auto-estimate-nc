import React, { useEffect, useState } from 'react';
import { AppStep } from '../types';
import { AGENCY, IMAGES } from '../config';

interface LayoutProps {
  children: React.ReactNode;
  activeStep: AppStep;
  setStep: (step: AppStep) => void;
  /** 'auto' = / (car tools) · 'home' = /home/ (home repair & project estimates) */
  variant?: 'auto' | 'home';
}

interface MenuLinkItem {
  label: string;
  href: string;
  badge?: string;
}

const INSURANCE_LINKS: MenuLinkItem[] = [
  { label: 'Home', href: 'https://www.billlayneinsurance.com/' },
  { label: 'Auto Insurance', href: 'https://www.billlayneinsurance.com/auto-center/' },
  { label: 'Home Insurance', href: 'https://www.billlayneinsurance.com/home-insurance/' },
  { label: 'Motorcycle & ATV', href: 'https://www.billlayneinsurance.com/motorcycle-insurance/' },
  { label: 'Boat & PWC', href: 'https://www.billlayneinsurance.com/boat-insurance/' },
  { label: 'Renters Insurance', href: 'https://www.billlayneinsurance.com/renters-insurance/' },
  { label: 'Business Insurance', href: 'https://www.billlayneinsurance.com/business-insurance/?src=autoestimate_menu' },
];

const CARRIER_LINKS: MenuLinkItem[] = [
  { label: 'All Insurance Carriers', href: 'https://www.billlayneinsurance.com/about/carriers/' },
  { label: 'NC Grange Mutual (Home & Farm)', href: 'https://www.billlayneinsurance.com/home-insurance/nc-grange-mutual/' },
  { label: 'Alamance Farmers Mutual', href: 'https://www.billlayneinsurance.com/home-insurance/alamance-farmers-mutual/' },
  { label: 'Foremost (Mobile Home, RV & Boat)', href: 'https://www.billlayneinsurance.com/auto-center/carriers/foremost-north-carolina' },
  { label: 'Progressive', href: 'https://www.billlayneinsurance.com/auto-center/carriers/progressive-north-carolina' },
  { label: 'Nationwide', href: 'https://www.billlayneinsurance.com/auto-center/carriers/nationwide-north-carolina' },
  { label: 'Travelers', href: 'https://www.billlayneinsurance.com/auto-center/carriers/travelers-north-carolina' },
  { label: 'National General', href: 'https://www.billlayneinsurance.com/auto-center/carriers/national-general-north-carolina' },
  { label: 'The General', href: 'https://www.billlayneinsurance.com/auto-center/carriers/the-general-north-carolina' },
  { label: 'Hagerty (Classic & Collector)', href: 'https://www.billlayneinsurance.com/auto-center/carriers/hagerty-north-carolina' },
];

const POLICY_AND_EXPLORE_LINKS: MenuLinkItem[] = [
  { label: 'Claims Center', href: 'https://www.billlayneinsurance.com/claims-center/' },
  { label: 'Service Center', href: 'https://www.billlayneinsurance.com/service-center' },
  { label: 'Client Hub', href: 'https://www.billlayneinsurance.com/clients/' },
  { label: 'Areas We Serve', href: 'https://www.billlayneinsurance.com/areas-we-serve' },
  { label: 'Resources & Free Tools', href: 'https://www.billlayneinsurance.com/resources/' },
  { label: 'Blog', href: 'https://www.billlayneinsurance.com/blog/' },
  { label: 'Videos', href: 'https://www.billlayneinsurance.com/videos/' },
  { label: 'Community', href: 'https://www.billlayneinsurance.com/community/' },
  { label: 'About Bill', href: 'https://www.billlayneinsurance.com/about/' },
  { label: 'Contact Us', href: 'https://www.billlayneinsurance.com/contact-us/' },
  { label: 'Español', href: 'https://www.billlayneinsurance.com/espanol/' },
];

const Layout: React.FC<LayoutProps> = ({ children, activeStep, setStep, variant = 'auto' }) => {
  const isHome = variant === 'home';
  const isAutoLanding = !isHome && activeStep === AppStep.ModeSelection;
  const [menuOpen, setMenuOpen] = useState(false);
  const [carriersExpanded, setCarriersExpanded] = useState(true);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const handleHowItWorksClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHome) return;
    e.preventDefault();
    setMenuOpen(false);
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
    setMenuOpen(false);
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
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 h-[62px] md:h-[76px] flex items-center justify-between gap-2.5 sm:gap-4">
          {/* Left: Agency Logo (links to billlayneinsurance.com) + Divider + AutoEstimate NC (returns to tool start) */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <a
              href={AGENCY.website}
              aria-label="Visit Bill Layne Insurance Agency website (billlayneinsurance.com)"
              className="inline-flex items-center min-h-[44px] shrink-0 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44]"
            >
              <img
                src={IMAGES.agencyLogo}
                alt="Bill Layne Insurance Agency"
                width={784}
                height={248}
                decoding="async"
                className="h-7 sm:h-8 md:h-9 w-auto shrink-0"
              />
            </a>
            <span className="h-6 md:h-7 w-px bg-[#E2E8F0] shrink-0" aria-hidden="true" />
            <button
              type="button"
              className="inline-flex items-center gap-2 cursor-pointer text-left min-h-[44px] rounded-lg px-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44]"
              onClick={() => {
                setStep(isHome ? AppStep.HomeLanding : AppStep.ModeSelection);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-label="AutoEstimate NC — return to start"
            >
              <span className="font-display font-bold text-[17px] sm:text-[19px] md:text-[22px] tracking-tight text-[#0A1F44] leading-none whitespace-nowrap">
                AutoEstimate <span className="text-[#E8B84B]">NC</span>
              </span>
              {isHome && (
                <span className="hidden sm:inline-flex items-center bg-[#FFF8E8] border border-[#E8B84B] text-[#0A1F44] text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  Home
                </span>
              )}
            </button>
          </div>

          {/* Right: Desktop Navigation + Phone + Menu Button */}
          <div className="flex items-center gap-1.5 sm:gap-3 md:gap-5">
            {!isHome ? (
              <a
                href="#how-it-works"
                onClick={handleHowItWorksClick}
                className="hidden md:inline-flex min-h-[44px] items-center text-[16px] font-semibold text-[#1B2432] hover:text-[#0A1F44] transition-colors rounded-lg px-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44]"
              >
                How it works
              </a>
            ) : (
              <a
                href="/"
                className="hidden md:inline-flex min-h-[44px] items-center text-[16px] font-semibold text-[#1B2432] hover:text-[#0A1F44] transition-colors rounded-lg px-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44]"
              >
                Auto estimates
              </a>
            )}

            {/* Desktop Phone Link */}
            <a
              href={AGENCY.phoneHref}
              className="hidden md:inline-flex min-h-[44px] items-center gap-2 text-[16px] font-bold text-[#0A1F44] hover:text-[#122A52] transition-colors rounded-lg px-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44]"
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

            {/* Mobile Phone Icon Button */}
            <a
              href={AGENCY.phoneHref}
              aria-label={`Call Bill Layne Insurance at ${AGENCY.phoneDisplay}`}
              className="md:hidden w-11 h-11 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-[10px] text-[#D4A93C] hover:bg-[#FFF8E8] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44]"
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

            {/* Site Menu Button (Desktop + Mobile) */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="bli-site-menu-drawer"
              aria-label="Open Bill Layne Insurance site menu"
              className="min-w-[44px] min-h-[44px] px-2.5 md:px-3.5 py-2 rounded-[10px] border border-[#E2E8F0] hover:border-[#0A1F44] bg-white hover:bg-[#FAF7F0] text-[#0A1F44] font-semibold text-[15px] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44]"
            >
              <svg
                className="w-5 h-5 text-[#0A1F44] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
              <span className="hidden md:inline">Menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Slide-Over Site Menu Drawer ────────────────────── */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[100] flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-labelledby="bli-drawer-title"
          id="bli-site-menu-drawer"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#0A1F44]/50 backdrop-blur-[2px] transition-opacity"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative z-10 w-full max-w-[390px] bg-white h-full shadow-2xl border-l border-[#E2E8F0] flex flex-col justify-between overflow-hidden">
            {/* Drawer Header */}
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-3 bg-white">
              <a
                href={AGENCY.website}
                aria-label="Bill Layne Insurance Agency Home"
                className="inline-flex items-center min-h-[44px] rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44]"
              >
                <img
                  src={IMAGES.agencyLogo}
                  alt="Bill Layne Insurance Agency"
                  width={784}
                  height={248}
                  decoding="async"
                  className="h-8 w-auto"
                />
              </a>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-[10px] border border-[#E2E8F0] hover:border-[#0A1F44] text-[#0A1F44] inline-flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            {/* Scrollable Navigation Links */}
            <nav aria-label="Bill Layne Insurance website navigation" className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
              <h2 id="bli-drawer-title" className="sr-only">
                Bill Layne Insurance Site Menu
              </h2>

              {/* Estimate Tools */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#6B7280] mb-2 px-2">
                  Estimate Tools
                </p>
                <ul className="space-y-1">
                  <li>
                    <a
                      href="/"
                      onClick={(e) => {
                        if (!isHome) {
                          e.preventDefault();
                          setStep(AppStep.ModeSelection);
                          setMenuOpen(false);
                        }
                      }}
                      className="min-h-[44px] px-3 py-2 rounded-[10px] bg-[#FFF8E8] border border-[#E8B84B] text-[#0A1F44] font-semibold text-[15px] flex items-center justify-between transition-colors"
                    >
                      <span>AutoEstimate NC (Vehicle Damage)</span>
                      <span className="text-xs font-bold text-[#0A1F44]">→</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/home/"
                      className="min-h-[44px] px-3 py-2 rounded-[10px] hover:bg-[#FAF7F0] text-[#0A1F44] font-semibold text-[15px] flex items-center justify-between transition-colors"
                    >
                      <span>Home Repair &amp; Project Estimator</span>
                      <span className="text-[#6B7280]">→</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Insurance Landing Pages */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#6B7280] mb-2 px-2">
                  Insurance Coverage
                </p>
                <ul className="space-y-0.5">
                  {INSURANCE_LINKS.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className="min-h-[44px] px-3 py-2 rounded-[10px] hover:bg-[#FAF7F0] text-[#0A1F44] font-semibold text-[15px] flex items-center justify-between transition-colors"
                      >
                        <span>{item.label}</span>
                        <svg className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Carrier Landing Pages */}
              <div>
                <button
                  type="button"
                  onClick={() => setCarriersExpanded((prev) => !prev)}
                  aria-expanded={carriersExpanded}
                  className="w-full px-2 py-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.08em] text-[#6B7280] hover:text-[#0A1F44]"
                >
                  <span>Carrier Landing Pages</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${carriersExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {carriersExpanded && (
                  <ul className="mt-1.5 space-y-0.5">
                    {CARRIER_LINKS.map((item) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          className="min-h-[42px] px-3 py-1.5 rounded-[10px] hover:bg-[#FAF7F0] text-[#1B2432] hover:text-[#0A1F44] font-medium text-[14px] flex items-center justify-between transition-colors"
                        >
                          <span>{item.label}</span>
                          <svg className="w-4 h-4 text-[#6B7280] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Manage Policy & Explore */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#6B7280] mb-2 px-2">
                  Manage Policy &amp; Explore
                </p>
                <ul className="space-y-0.5">
                  {POLICY_AND_EXPLORE_LINKS.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className="min-h-[42px] px-3 py-1.5 rounded-[10px] hover:bg-[#FAF7F0] text-[#0A1F44] font-semibold text-[15px] flex items-center justify-between transition-colors"
                      >
                        <span>{item.label}</span>
                        <svg className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            {/* Drawer Footer CTA */}
            <div className="p-4 border-t border-[#E2E8F0] bg-[#FAF7F0] space-y-2.5">
              <p className="text-[12px] font-semibold text-[#0A1F44] text-center">
                Local help in Elkin, NC · Mon–Fri 9 AM–5 PM
              </p>
              <div className="grid grid-cols-1 gap-2">
                <a
                  href="https://www.billlayneinsurance.com/get-quote?src=autoestimate_menu"
                  className="min-h-[48px] px-4 py-2.5 rounded-[10px] bg-[#E8B84B] hover:bg-[#D4A93C] text-[#0A1F44] font-bold text-[15px] flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Compare My Insurance Options</span>
                  <span aria-hidden="true">→</span>
                </a>
                <a
                  href={AGENCY.phoneHref}
                  className="min-h-[46px] px-4 py-2 rounded-[10px] bg-[#0A1F44] hover:bg-[#122A52] text-white font-bold text-[15px] flex items-center justify-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4 text-[#E8B84B]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" />
                  </svg>
                  <span>Call {AGENCY.phoneDisplay}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  <a href={AGENCY.website} className="hover:underline">
                    {AGENCY.name}
                  </a>
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
                  className="min-h-[44px] inline-flex items-center hover:underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44] rounded"
                >
                  Agency website
                </a>
                <button
                  type="button"
                  onClick={() => setMenuOpen(true)}
                  className="min-h-[44px] inline-flex items-center hover:underline underline-offset-4 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44] rounded"
                >
                  All pages menu
                </button>
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


