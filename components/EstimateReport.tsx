
import React from 'react';
import { EstimateResult } from '../types';
import { AGENCY, LEGAL } from '../config';

interface EstimateReportProps {
  report: EstimateResult;
  reportImages: string[];
  onReset: () => void;
}

const EstimateReport: React.FC<EstimateReportProps> = ({ report, reportImages, onReset }) => {
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

      {/* Talk-to-Bill conversion CTA */}
      <div className="bg-gradient-to-br from-brand-navy-deep via-brand-navy to-brand-navy-dk rounded-2xl shadow-lg p-6 sm:p-7 no-print flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
        <div className="flex-grow">
          <h3 className="text-white font-bold text-lg font-display">Questions about this estimate?</h3>
          <p className="text-blue-100 text-sm mt-1">Bill can tell you whether it's worth filing a claim, and what it might do to your rate. No pressure — just a quick, honest answer.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto shrink-0">
          <a href={AGENCY.phoneHref} className="px-5 py-3 rounded-xl bg-gold-grad text-brand-navy-deep font-bold text-sm hover:bg-gold-grad-hover transition-all shadow-glow-gold flex items-center justify-center gap-2 whitespace-nowrap">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79a15.53 15.53 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.56 1 1 0 01-.24 1.01l-2.2 2.22z"/></svg>
            {AGENCY.phone}
          </a>
          <a href={AGENCY.emailHref} className="px-5 py-3 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
            Email Bill
          </a>
        </div>
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

      {/* HIDDEN PRINT LAYOUT (LETTERHEAD) */}
      <div id="letterhead-report" className="hidden print:block bg-white p-12 text-slate-900" style={{ minHeight: '1000px' }}>
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

        <div className="mb-10">
          <h3 className="text-xs font-black text-slate-400 uppercase mb-3 border-b tracking-widest">Adjuster Summary</h3>
          <p className="text-sm leading-relaxed text-slate-700 bg-slate-50 p-4 rounded border border-slate-200">{report.summary}</p>
        </div>

        <div className="mb-10">
          <h3 className="text-xs font-black text-slate-400 uppercase mb-3 border-b tracking-widest">Damage Visual References</h3>
          <div className="flex flex-wrap gap-4 mt-4">
            {reportImages.map((src, i) => (
              <div key={i} className="border rounded p-1 bg-white shadow-sm">
                <img src={src} className="h-32 w-32 object-cover rounded" alt={`Angle ${i + 1}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 p-6 bg-slate-50 rounded border-2 border-slate-200 text-xs leading-relaxed text-slate-600">
          <p className="mb-2 font-bold text-slate-800 uppercase tracking-wider underline">Legal Notice &amp; Disclaimer:</p>
          {LEGAL.full}
        </div>

        <div className="mt-12 border-t pt-8 text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
          Informational Report Powered by Gemini 3 Pro AI • Bill Layne Agency Elkin NC
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; }
          #letterhead-report, #letterhead-report * { visibility: visible; }
          #letterhead-report { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 40px; }
        }
      `}} />
    </div>
  );
};

export default EstimateReport;
