import React from 'react';
import { HomeEstimateResult, HomeProjectInfo } from '../types';
import { AGENCY, LEGAL } from '../config';

interface HomeEstimateReportProps {
  report: HomeEstimateResult;
  project: HomeProjectInfo;
  reportImages: string[];
  onReset: () => void;
}

const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;
const range = (low: number, high: number) => (low === high ? usd(high) : `${usd(low)} – ${usd(high)}`);

/** Client-side deductible comparison — the number never goes to the AI. */
type DeductibleVerdict =
  | { kind: 'below'; ded: number }
  | { kind: 'above'; ded: number }
  | { kind: 'straddles'; ded: number }
  | { kind: 'percent' }
  | { kind: 'unknown' };

function getDeductibleVerdict(project: HomeProjectInfo, report: HomeEstimateResult): DeductibleVerdict {
  if (project.deductible === 'percent') return { kind: 'percent' };
  if (!/^\d+$/.test(project.deductible)) return { kind: 'unknown' };
  const ded = parseInt(project.deductible, 10);
  if (report.totalHigh < ded) return { kind: 'below', ded };
  if (report.totalLow > ded) return { kind: 'above', ded };
  return { kind: 'straddles', ded };
}

const SEVERITY_STYLES: Record<string, string> = {
  Minor: 'bg-emerald-100 text-emerald-700',
  Moderate: 'bg-amber-100 text-amber-700',
  Severe: 'bg-red-100 text-red-700',
};

const HomeEstimateReport: React.FC<HomeEstimateReportProps> = ({ report, project, reportImages, onReset }) => {
  const isDamage = project.mode === 'damage';
  const verdict = getDeductibleVerdict(project, report);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Visual Header */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/70 p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print">
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-brand-navy mb-2">
            Preliminary Cost Guide
          </span>
          {isDamage && report.severity && (
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ml-2 mb-2 ${SEVERITY_STYLES[report.severity] || 'bg-slate-100 text-slate-600'}`}>
              {report.severity} damage
            </span>
          )}
          <h2 className="text-3xl sm:text-[2.6rem] leading-tight font-extrabold text-brand-navy tracking-tight font-display">
            {range(report.totalLow, report.totalHigh)}
          </h2>
          <p className="text-slate-500 font-medium mt-1">{report.projectTitle}</p>
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

      {/* Deductible comparison — damage mode only */}
      {isDamage && (
        <div className="bg-gradient-to-br from-brand-navy-deep via-brand-navy to-brand-navy-dk rounded-2xl shadow-lg p-6 sm:p-7 no-print">
          <h3 className="text-white font-bold text-lg font-display flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-gold-lt" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            Thinking about filing a claim?
          </h3>

          {(verdict.kind === 'below' || verdict.kind === 'above' || verdict.kind === 'straddles') && (
            <div className="mt-4 bg-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-6 text-center">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-blue-200 font-bold">Estimated repairs</p>
                  <p className="text-white font-extrabold text-lg font-display">{range(report.totalLow, report.totalHigh)}</p>
                </div>
                <span className="text-blue-200 text-xl font-light">vs</span>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-blue-200 font-bold">Your deductible</p>
                  <p className="text-brand-gold-lt font-extrabold text-lg font-display">{usd(verdict.ded)}</p>
                </div>
              </div>
              <p className="text-blue-50 text-sm sm:border-l sm:border-white/20 sm:pl-4">
                {verdict.kind === 'below' && 'This estimate falls below your deductible — something many homeowners weigh before filing. Every situation is different, though.'}
                {verdict.kind === 'above' && 'This estimate runs above your deductible — a claim may be worth discussing. Every situation is different, though.'}
                {verdict.kind === 'straddles' && "This estimate lands right around your deductible — a genuinely close call, and exactly the kind worth talking through."}
              </p>
            </div>
          )}

          {verdict.kind === 'percent' && (
            <p className="mt-3 text-blue-50 text-sm">
              Your wind/hail deductible is a <b>percentage of your dwelling coverage</b> — for example, 1% of a $250,000
              dwelling limit is $2,500. Let's figure out your exact dollar amount together, then compare.
            </p>
          )}

          {verdict.kind === 'unknown' && (
            <p className="mt-3 text-blue-50 text-sm">
              Compare this range against your policy deductible — that's the first number most homeowners weigh.
              Not sure what your deductible is? We can look it up in about a minute.
            </p>
          )}

          {report.claimConsiderations && (
            <p className="mt-3 text-blue-100/90 text-sm leading-relaxed">{report.claimConsiderations}</p>
          )}

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
            Nothing here files a claim or contacts your insurance company. Deciding whether to file is always your call —
            we're just here to help you make it with real numbers.
          </p>
        </div>
      )}

      {/* Upgrade-mode conversion CTA */}
      {!isDamage && (
        <div className="bg-gradient-to-br from-brand-navy-deep via-brand-navy to-brand-navy-dk rounded-2xl shadow-lg p-6 sm:p-7 no-print flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="flex-grow">
            <h3 className="text-white font-bold text-lg font-display">Planning this project? One more smart call.</h3>
            <p className="text-blue-100 text-sm mt-1">
              A new deck, roof, or remodel can change your home's replacement cost — Bill can make sure your
              coverage keeps up, and that your contractor's insurance protects you too. Quick, free, no pressure.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto shrink-0">
            <a href={AGENCY.phoneHref} className="px-5 py-3 rounded-xl bg-gold-grad text-brand-navy-deep font-bold text-sm hover:bg-gold-grad-hover transition-all shadow-glow-gold flex items-center justify-center gap-2 whitespace-nowrap">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79a15.53 15.53 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.56 1 1 0 01-.24 1.01l-2.2 2.22z"/></svg>
              {AGENCY.phone}
            </a>
            <a href={AGENCY.emailHref} className="px-5 py-3 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-colors flex items-center justify-center whitespace-nowrap">
              Email Bill
            </a>
          </div>
        </div>
      )}

      {/* Main Content */}
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

          {/* Cost breakdown */}
          <section className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Cost Guide Breakdown</h3>
              <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded uppercase tracking-tighter">NC Market Rates</span>
            </div>
            <div className="divide-y">
              {report.lineItems.map((item, idx) => (
                <div key={idx} className={`p-4 flex justify-between items-center gap-3 ${item.category === 'Labor' ? 'bg-blue-50/20' : ''}`}>
                  <div className="text-sm min-w-0">
                    <p className={`font-bold ${item.category === 'Labor' ? 'text-blue-900' : 'text-slate-800'}`}>{item.description}</p>
                    {(item.category !== 'Other' || item.note) && (
                      <p className={`text-[10px] font-bold uppercase ${item.category === 'Labor' ? 'text-blue-500' : 'text-slate-400'}`}>
                        {item.category !== 'Other' ? item.category : null}
                        {item.note ? <span className="normal-case font-medium text-slate-500 italic">{item.category !== 'Other' ? ' · ' : ''}{item.note}</span> : null}
                      </p>
                    )}
                  </div>
                  <p className={`font-mono font-bold whitespace-nowrap ${item.category === 'Labor' ? 'text-blue-900' : 'text-slate-900'}`}>
                    {range(item.lowCost, item.highCost)}
                  </p>
                </div>
              ))}
              <div className="p-4 flex justify-between items-center bg-slate-50">
                <p className="font-black text-slate-800 text-sm uppercase">Estimated Total Range</p>
                <p className="font-mono font-black text-brand-navy text-lg">{range(report.totalLow, report.totalHigh)}</p>
              </div>
            </div>
          </section>

          {/* Repair vs Replace */}
          {report.repairVsReplace && (
            <section className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Repair vs. Replace</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200 p-4 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Repair</p>
                  <p className="text-brand-navy font-extrabold text-lg font-display">{range(report.repairVsReplace.repairLow, report.repairVsReplace.repairHigh)}</p>
                </div>
                <div className="rounded-xl bg-blue-50 ring-1 ring-blue-100 p-4 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-blue-400 font-bold">Replace</p>
                  <p className="text-brand-navy font-extrabold text-lg font-display">{range(report.repairVsReplace.replaceLow, report.repairVsReplace.replaceHigh)}</p>
                </div>
              </div>
              {report.repairVsReplace.guidance && (
                <p className="text-sm text-slate-600 leading-relaxed">{report.repairVsReplace.guidance}</p>
              )}
            </section>
          )}

          {/* Summary */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">What We Saw</h3>
            <p className="text-slate-700 leading-relaxed">{report.scopeSummary}</p>
            {report.observedIssues.length > 0 && (
              <ul className="mt-4 space-y-2">
                {report.observedIssues.map((issue, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-[7px]" />
                    {issue}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Budget tips */}
          {report.budgetTips.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Smart Next Steps</h3>
              <ul className="space-y-2.5">
                {report.budgetTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

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

        {/* Sidebar */}
        <div className="space-y-6">
          <section className="bg-white rounded-2xl shadow-sm border p-6">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mb-4">Project Details</h4>
            <div className="space-y-3">
              <div>
                <p className="text-[9px] text-slate-400 uppercase font-bold">Type</p>
                <p className="text-xs font-bold text-slate-700">{isDamage ? 'Damage repair' : 'Upgrade / replacement'}</p>
              </div>
              <div>
                <p className="text-[9px] text-slate-400 uppercase font-bold">Category</p>
                <p className="text-xs font-bold text-slate-700">{project.category}</p>
              </div>
              {project.approxSize && (
                <div>
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Approx. size</p>
                  <p className="text-xs font-bold text-slate-700">{project.approxSize}</p>
                </div>
              )}
              {project.zip && (
                <div>
                  <p className="text-[9px] text-slate-400 uppercase font-bold">ZIP</p>
                  <p className="text-xs font-bold text-slate-700">{project.zip}</p>
                </div>
              )}
            </div>
          </section>

          {reportImages.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100">
                {reportImages.map((src, i) => (
                  <img key={i} src={src} alt={`Photo ${i + 1}`} className="w-full aspect-square object-cover rounded-sm" />
                ))}
              </div>
              <div className="p-3 bg-slate-50 text-[10px] text-center font-bold text-slate-400 uppercase">Analysis Reference Photos ({reportImages.length})</div>
            </div>
          )}

          <section className="bg-white rounded-2xl shadow-sm border p-6 text-center">
            <p className="text-xs text-slate-500 leading-relaxed">
              Questions about this guide or your coverage?
            </p>
            <a href={AGENCY.phoneHref} className="mt-3 inline-flex px-5 py-2.5 rounded-xl bg-brand-navy text-white font-bold text-sm hover:bg-brand-navy-dk transition-all shadow-md">
              {AGENCY.phone}
            </a>
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
            <p className="text-sm font-bold text-slate-800 uppercase italic">Preliminary Home Cost Guide</p>
            <p className="text-xs text-slate-500">Report ID: BL-{Math.floor(Math.random() * 90000 + 10000)}</p>
            <p className="text-xs text-slate-500">Issued: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-12">
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase mb-3 border-b tracking-widest">Project Information</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr><td className="font-bold py-1 w-28 text-slate-500">Type:</td><td>{isDamage ? 'Damage repair' : 'Upgrade / replacement'}</td></tr>
                <tr><td className="font-bold py-1 text-slate-500">Category:</td><td>{project.category}</td></tr>
                {project.approxSize && <tr><td className="font-bold py-1 text-slate-500">Approx. size:</td><td>{project.approxSize}</td></tr>}
                {project.zip && <tr><td className="font-bold py-1 text-slate-500">ZIP:</td><td>{project.zip}</td></tr>}
                {isDamage && report.severity && <tr><td className="font-bold py-1 text-slate-500">Severity:</td><td>{report.severity}</td></tr>}
              </tbody>
            </table>
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase mb-3 border-b tracking-widest">Description</h3>
            <p className="text-sm text-slate-700 leading-relaxed">{project.description}</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xs font-black text-slate-400 uppercase mb-3 border-b tracking-widest">Estimated Breakdown (NC Market)</h3>
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200">
                <th className="py-3 px-3">Description</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-right">Estimated Range</th>
              </tr>
            </thead>
            <tbody>
              {report.lineItems.map((item, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-3 px-3 font-medium">{item.description}</td>
                  <td className="py-3 px-3 text-slate-500 text-xs italic">{item.category}</td>
                  <td className="py-3 px-3 text-right font-mono">{range(item.lowCost, item.highCost)}</td>
                </tr>
              ))}
              <tr className="bg-blue-50/50 font-black">
                <td className="py-4 px-3" colSpan={2}>PRELIMINARY GUIDE TOTAL:</td>
                <td className="py-4 px-3 text-right text-xl text-blue-900 border-t-2 border-blue-900 whitespace-nowrap">{range(report.totalLow, report.totalHigh)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-10">
          <h3 className="text-xs font-black text-slate-400 uppercase mb-3 border-b tracking-widest">Guide Summary</h3>
          <p className="text-sm leading-relaxed text-slate-700 bg-slate-50 p-4 rounded border border-slate-200">{report.scopeSummary}</p>
        </div>

        {reportImages.length > 0 && (
          <div className="mb-10 print-block">
            <h3 className="text-xs font-black text-slate-400 uppercase mb-3 border-b tracking-widest">Photo References</h3>
            <div className="flex flex-wrap gap-4 mt-4 print-photos">
              {reportImages.map((src, i) => (
                <div key={i} className="border rounded p-1 bg-white shadow-sm">
                  <img src={src} className="h-32 w-32 object-cover rounded" alt={`Photo ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 p-6 bg-slate-50 rounded border-2 border-slate-200 text-xs leading-relaxed text-slate-600 print-block">
          <p className="mb-2 font-bold text-slate-800 uppercase tracking-wider underline">Legal Notice &amp; Disclaimer:</p>
          {LEGAL.full}
        </div>

        <div className="mt-12 border-t pt-8 text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
          Informational Report • Bill Layne Agency Elkin NC
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

export default HomeEstimateReport;
