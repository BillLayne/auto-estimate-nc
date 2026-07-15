/**
 * Central site config — brand + imagery.
 *
 * 👉 TO ADD BILL'S IMAGES: paste the imgur URLs below. Leave a value as ''
 *    (empty string) and the page falls back to an on-brand navy/gold gradient,
 *    so nothing ever looks broken while you wait on the artwork.
 */

/** Vite serves /public at the app's base path ('/auto-estimate-nc/'). */
const asset = (file: string) => `${import.meta.env.BASE_URL}${file}`;

export const IMAGES = {
  /**
   * Full-bleed hero scene (Bill's render i.imgur.com/lKjehnp.png): pearl-white car
   * + phone + glowing $1,248 card on a SOLID deep-navy background with dark
   * negative space on the left for the headline. Used as the hero's background
   * image — no cut-out needed; the navy blends into the hero. '' = gradient only.
   */
  heroScene: asset('hero-scene.webp'),
  /** Purpose-built 3:2 mobile hero (Bill's render i.imgur.com/LDkHokN.png):
   * centered white car + phone + $1,248 card on navy, designed for the stacked
   * mobile band (no cropping needed). */
  heroSceneMobile: asset('hero-mobile.webp'),
  /** Legacy transparent foreground (kept for the old layout / fallback). */
  heroForeground: asset('hero-foreground.webp'),
  /**
   * /home/ landing hero scene — waiting on Bill's render (same trick as the car:
   * generate on SOLID deep navy #001a3d, e.g. a house + phone + glowing repair-cost
   * card). '' = on-brand navy/gold gradient fallback, nothing looks broken.
   */
  homeHero: '',
};

/** Agency contact details — single source of truth for header/footer. */
export const AGENCY = {
  name: 'Bill Layne Insurance Agency',
  phone: '(336) 835-1993',
  phoneHref: 'tel:+13368351993',
  email: 'Save@BillLayneInsurance.com',
  emailHref: 'mailto:Save@BillLayneInsurance.com',
  address: '1283 N Bridge St, Elkin, NC 28621',
  website: 'https://www.billlayneinsurance.com',
  websiteLabel: 'BillLayneInsurance.com',
  year: 2026,
};

/**
 * ⚖️ LEGAL / LIABILITY DISCLAIMERS — single source of truth.
 *
 * NOTE: This is strong, plain-language protective wording, but it is NOT a
 * substitute for legal advice. Have a NC attorney review before relying on it.
 * Edit these strings here and they update everywhere in the app.
 */
export const LEGAL = {
  /** One-liner shown near the action buttons / upload screens. */
  short:
    'Free AI estimate for general information only — not a quote, appraisal, or guarantee. ' +
    'Actual repair costs may be significantly higher or lower, and photos cannot reveal hidden damage. ' +
    'Always get a written estimate from a licensed repair shop and confirm coverage with your insurer.',

  /** Active-consent line for the required checkbox before generating results. */
  consent:
    'I understand this is AI-generated information for general guidance only — not a quote, appraisal, ' +
    'guarantee, or professional advice — and that the results may be incomplete or inaccurate.',

  /** Home-flow consent line (upload screen checkbox on /home/). */
  homeConsent:
    'I understand this is a free AI cost guide for general information only — not a contractor bid, ' +
    'appraisal, or guarantee. Actual costs may be higher or lower, photos can’t reveal hidden damage ' +
    'behind walls or under surfaces, and I’ll get written estimates from licensed contractors and confirm ' +
    'any coverage or claim decision with my insurer.',

  /** Full disclaimer shown on every result/report. */
  full:
    'IMPORTANT — PLEASE READ. This tool provides an automated, AI-generated estimate for general ' +
    'informational and educational purposes only. It is NOT a professional damage appraisal, a repair ' +
    'quote or final cost, an offer or guarantee of insurance coverage, a promise to pay any claim, or ' +
    'legal, financial, or professional advice. Estimates are produced by artificial intelligence from the ' +
    'photos and details you provide; they may be incomplete or inaccurate, and your actual repair cost may ' +
    'be significantly higher or lower. Photos cannot reveal hidden or structural damage. Always obtain a ' +
    'written estimate from a licensed repair facility or licensed contractor and confirm any coverage, ' +
    'deductible, or claim decision directly with your insurance company. Using this tool does not file a claim, create an ' +
    'insurance policy, or create an agent, professional, or fiduciary relationship. This tool is provided ' +
    '"AS IS" and "AS AVAILABLE," without warranties of any kind, express or implied. To the fullest extent ' +
    'permitted by law, Bill Layne Insurance Agency and its owners, agents, and employees disclaim all ' +
    'liability for any loss, damage, or decision arising from your use of, or reliance on, this tool or its ' +
    'estimates. By using this tool, you acknowledge and agree to these terms.',
};
