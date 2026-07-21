
import React from 'react';
import { EstimateResult } from '../types';
import { AGENCY, LEGAL } from '../config';

interface EstimateReportProps {
  report: EstimateResult;
  reportImages: string[];
  onReset: () => void;
}

const SDIP_URL = 'https://www.billlayneinsurance.com/auto-center/sdip-points-calculator/';

/** Client-side "should I file a claim?" verdict — the deductible never goes to the AI. */
type ClaimVerdict =
  | { kind: 'below'; ded: number }
  | { kind: 'close'; ded: number }
  | { kind: 'above'; ded: number }
  | { kind: 'unknown' };

function getClaimVerdict(deductible: string | undefined, total: number): ClaimVerdict {
  if (!deductible || !/^\d+$/.test(deductible)) return { kind: 'unknown' };
  const ded = parseInt(deductible, 10);
  if (total < ded) return { kind: 'below', ded };
  if (total < ded * 1.5) return { kind: 'close', ded };
  return { kind: 'above', ded };
}

const EstimateReport: React.FC<EstimateReportProps> = ({ report, reportImages, onReset }) => {
  const verdict = getClaimVerdict(report.vehicle.deductible, report.totalEstimate);
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Visual Header */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/70 p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print">
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-brand-navy mb-2">
            Preliminary Estimate Guide
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-brand-navy tracking-tight font-display">
            ${report.totalEstimate.toLocaleString()}
          </h2>
          <p className="text-slate-500 font-medium mt-1">Estimated repair cost for {report.customer?.firstName} {report.customer?.lastName}</p>
        </div>
        <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
          <button
            onClick={() => window.print()}
            className="flex-1 md:flex-none px-5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Save / Print
          </button>
          <button
            onClick={onReset}
            className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-brand-navy font-bold text-white hover:bg-brand-navy-dk transition-all shadow-md active:scale-95"
          >
            New Estimate
          </button>
        </div>
      </div>

      {/* Should you file a claim? — deductible-aware verdict (computed client-side) */}
      <div className="bg-gradient-to-br from-brand-navy-deep via-brand-navy to-brand-navy-dk rounded-2xl shadow-lg p-6 sm:p-7 no-print">
        <h3 className="text-white font-bold text-lg font-display flex items-center gap-2">
          <svg className="w-5 h-5 text-brand-gold-lt" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          Should you file a claim?
        </h3>

        {(verdict.kind === 'below' || verdict.kind === 'close' || verdict.kind === 'above') && (
          <div className="mt-4 bg-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-6 text-center">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-blue-200 font-bold">Estimated repairs</p>
                <p className="text-white font-extrabold text-lg font-display">${report.totalEstimate.toLocaleString()}</p>
              </div>
              <span className="text-blue-200 text-xl font-light">vs</span>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-blue-200 font-bold">Your deductible</p>
                <p className="text-brand-gold-lt font-extrabold text-lg font-display">${verdict.ded.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-blue-50 text-sm sm:border-l sm:border-white/20 sm:pl-4">
              {verdict.kind === 'below' && "This estimate is below your deductible — you'd pay for the repair yourself either way, so many drivers handle one like this out of pocket rather than file. Every situation is different, though."}
              {verdict.kind === 'close' && "This estimate is only a little above your deductible — after you pay the deductible, the claim check would be small, and an at-fault claim can raise your rate for years. A genuinely close call worth talking through."}
              {verdict.kind === 'above' && "This estimate runs well above your deductible — a claim may be worth filing. Just remember an at-fault claim can affect your rate, so it's worth a quick look first."}
            </p>
          </div>
        )}

        {verdict.kind === 'unknown' && (
          <p className="mt-3 text-blue-50 text-sm">
            Compare this estimate against your <b>collision deductible</b> — that's the first number to weigh before filing.
            Not sure what yours is? We can look it up in about a minute.
          </p>
        )}

        <p className="mt-3 text-blue-100/90 text-sm leading-relaxed">
          Heads up: an at-fault accident can raise your premium for years. See roughly how much with our free{' '}
          <a href={SDIP_URL} target="_blank" rel="noopener noreferrer" className="text-brand-gold-lt font-bold underline hover:text-white">SDIP Points Calculator</a>.
        </p>

        <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
          <a href={AGENCY.phoneHref} className="px-5 py-3 rounded-xl bg-gold-grad text-brand-navy-deep font-bold text-sm hover:bg-gold-grad-hover transition-all shadow-glow-gold flex items-center justify-center gap-2 whitespace-nowrap">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79a15.53 15.53 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.56 1 1 0 01-.24 1.01l-2.2 2.22z"/></svg>
            Call Bill first — {AGENCY.phone}
          </a>
          <a href={AGENCY.emailHref} className="px-5 py-3 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-colors flex items-center justify-center whitespace-nowrap">
            Email Us
          </a>
        </div>
        <p className="text-[11px] text-blue-200/70 mt-3">
          Nothing here files a claim or contacts your insurance company. Deciding whether to file is always your call — we're just here to help you make it with real numbers.
        </p>
      </div>

      {/* Main Content (Dashboard) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-r-xl">
            <h4 className="text-orange-800 font-bold text-sm uppercase flex items-center gap-2 mb-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Legal Notice &amp; Disclaimer
            </h4>
            <p className="text-xs text-orange-900 leading-relaxed">
              {LEGAL.full}
            </p>
          </div>

          <section className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Repair Cost Guide</h3>
              <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded uppercase tracking-tighter">NC Market Rates</span>
            </div>
            <div className="divide-y">
              {report.partsBreakdown.map((part, idx) => (
                <div key={idx} className="p-4 flex justify-between items-center">
                  <div className="text-sm">
                    <p className="font-bold text-slate-800">{part.name}</p>
                    <p className="text-slate-500 text-xs italic">{part.condition}</p>
                  </div>
                  <p className="font-mono font-bold text-slate-900">${part.estimatedPrice.toFixed(2)}</p>
                </div>
              ))}
              {report.laborBreakdown.map((labor, idx) => (
                <div key={idx} className="p-4 flex justify-between items-center bg-blue-50/20 text-sm">
                  <div>
                    <p className="font-bold text-blue-900">{labor.description}</p>
                    <p className="text-blue-500 text-[10px] font-bold">{labor.hours} HRS @ ${labor.rate}/HR (NC AVG)</p>
                  </div>
                  <p className="font-mono font-bold text-blue-900">${labor.total.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Guide Summary</h3>
            <p className="text-slate-700 leading-relaxed">{report.summary}</p>
          </div>

          {report.groundingSources && report.groundingSources.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                Market Reference Sources
              </h3>
              <ul className="space-y-2">
                {report.groundingSources.map((source, idx) => (
                  <li key={idx}>
                    <a 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      {source.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-2xl shadow-sm border p-6">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mb-4">Customer Details</h4>
            <div className="space-y-3">
              <div>
                <p className="text-[9px] text-slate-400 uppercase font-bold">Name</p>
                <p className="text-xs font-bold text-slate-700">{report.customer?.firstName} {report.customer?.lastName}</p>
              </div>
              {report.customer?.email && (
                <div>
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Email</p>
                  <p className="text-xs font-bold text-slate-700">{report.customer.email}</p>
                </div>
              )}
              {report.customer?.address && (
                <div>
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Address</p>
                  <p className="text-xs font-bold text-slate-700">{report.customer.address}</p>
                </div>
              )}
            </div>
          </section>

          {reportImages.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100">
                {reportImages.map((src, i) => (
                   <img key={i} src={src} alt={`Angle ${i + 1}`} className="w-full aspect-square object-cover rounded-sm" />
                ))}
              </div>
              <div className="p-3 bg-slate-50 text-[10px] text-center font-bold text-slate-400 uppercase">Analysis Reference Images ({reportImages.length})</div>
            </div>
          )}

          <section className="bg-white rounded-2xl shadow-sm border p-6">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mb-4">Vehicle Identity</h4>
            <div className="space-y-4">
              <div>
                <p className="text-[9px] text-slate-400 uppercase font-bold mb-0.5">VIN</p>
                <p className="font-mono text-xs font-bold text-slate-700 uppercase">{report.vehicle.vin || 'Not Provided'}</p>
              </div>
              <div>
                <p className="text-[9px] text-slate-400 uppercase font-bold mb-0.5">Vehicle</p>
                <p className="text-xs font-bold text-slate-700">{report.vehicle.year} {report.vehicle.make} {report.vehicle.model}</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* HIDDEN PRINT LAYOUT (US Letter letterhead) */}
      <div id="letterhead-report" className="hidden print:block bg-white text-slate-900">
        <div className="border-b-4 border-blue-900 pb-6 mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-blue-900">BILL LAYNE</h1>
            <h2 className="text-sm font-bold tracking-widest text-slate-600 uppercase">Insurance Agency Guide</h2>
            <p className="text-xs text-slate-400 mt-1">1283 N BRIDGE ST, ELKIN NC 28621 | 336-835-1993</p>
            <p className="text-[10px] text-blue-800 font-bold uppercase tracking-tighter">SAVE@BILLLAYNEINSURANCE.COM | WWW.BILLLAYNEINSURANCE.COM</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-800 uppercase italic">Preliminary Repair Cost Guide</p>
            <p className="text-xs text-slate-500">Report ID: BL-{Math.floor(Math.random() * 90000 + 10000)}</p>
            <p className="text-xs text-slate-500">Issued: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-12">
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase mb-3 border-b tracking-widest">Customer Information</h3>
            <div className="space-y-1 text-sm">
              <p className="font-bold text-slate-900 text-base">{report.customer?.firstName} {report.customer?.lastName}</p>
              <p className="text-slate-600">{report.customer?.address || 'Address Not Provided'}</p>
              <p className="text-slate-600">{report.customer?.email || 'Email Not Provided'}</p>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase mb-3 border-b tracking-widest">Vehicle Information</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr><td className="font-bold py-1 w-24 text-slate-500">Make/Model:</td><td>{report.vehicle.year} {report.vehicle.make} {report.vehicle.model}</td></tr>
                <tr><td className="font-bold py-1 text-slate-500">VIN:</td><td className="font-mono">{report.vehicle.vin || 'N/A'}</td></tr>
                <tr><td className="font-bold py-1 text-slate-500">Mileage:</td><td>{report.vehicle.mileage}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xs font-black text-slate-400 uppercase mb-3 border-b tracking-widest">Estimated Breakdown (NC Market)</h3>
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200">
                <th className="py-3 px-3">Description</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-right">Estimated Amount</th>
              </tr>
            </thead>
            <tbody>
              {report.partsBreakdown.map((p, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-3 px-3 font-medium">{p.name}</td>
                  <td className="py-3 px-3 text-slate-500 text-xs italic">Part ({p.condition})</td>
                  <td className="py-3 px-3 text-right font-mono">${p.estimatedPrice.toFixed(2)}</td>
                </tr>
              ))}
              {report.laborBreakdown.map((l, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-3 px-3 font-medium">{l.description}</td>
                  <td className="py-3 px-3 text-slate-500 text-xs italic">Labor ({l.hours} hrs)</td>
                  <td className="py-3 px-3 text-right font-mono">${l.total.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="bg-blue-50/50 font-black">
                <td className="py-4 px-3" colSpan={2}>PRELIMINARY GUIDE TOTAL:</td>
                <td className="py-4 px-3 text-right text-xl text-blue-900 border-t-2 border-blue-900">${report.totalEstimate.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-10 print-block">
          <h3 className="text-xs font-black text-slate-400 uppercase mb-3 border-b tracking-widest">Adjuster Summary</h3>
          <p className="text-sm leading-relaxed text-slate-700 bg-slate-50 p-4 rounded border border-slate-200">{report.summary}</p>
        </div>

        <div className="mb-10 print-block">
          <h3 className="text-xs font-black text-slate-400 uppercase mb-3 border-b tracking-widest">Damage Visual References</h3>
          <div className="flex flex-wrap gap-4 mt-4 print-photos">
            {reportImages.map((src, i) => (
              <div key={i} className="border rounded p-1 bg-white shadow-sm">
                <img src={src} className="h-32 w-32 object-cover rounded" alt={`Angle ${i + 1}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 p-6 bg-slate-50 rounded border-2 border-slate-200 text-xs leading-relaxed text-slate-600 print-block">
          <p className="mb-2 font-bold text-slate-800 uppercase tracking-wider underline">Legal Notice &amp; Disclaimer:</p>
          {LEGAL.full}
        </div>

        <div className="mt-12 border-t pt-8 text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
          Informational Report Powered by Gemini 3 Pro AI • Bill Layne Agency Elkin NC
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Fit US Letter (8.5x11) — page margins do the framing, not padding */
          @page { size: letter portrait; margin: 0.5in; }
          html, body { background: #fff !important; }
          body * { visibility: hidden; }
          #letterhead-report, #letterhead-report * { visibility: visible; }
          #letterhead-report {
            position: absolute; left: 0; top: 0; width: 100%;
            margin: 0; padding: 0 !important; min-height: 0 !important;
            -webkit-print-color-adjust: exact; print-color-adjust: exact;
            font-size: 12px;
          }
          /* Never split a table row or key block across pages */
          #letterhead-report tr { page-break-inside: avoid; }
          #letterhead-report h3 { page-break-after: avoid; }
          #letterhead-report .print-block { page-break-inside: avoid; }
          /* Keep photo references compact so they share a page */
          #letterhead-report .print-photos img { height: 1.35in !important; width: 1.35in !important; }
        }
      `}} />
    </div>
  );
};

export default EstimateReport;
