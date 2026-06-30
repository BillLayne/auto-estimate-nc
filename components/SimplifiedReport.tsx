
import React from 'react';
import { SimplifiedEstimateResult } from '../types';
import { LEGAL } from '../config';

interface SimplifiedReportProps {
  data: SimplifiedEstimateResult;
  onReset: () => void;
}

const SimplifiedReport: React.FC<SimplifiedReportProps> = ({ data, onReset }) => {
  const handlePrint = () => {
    const reportHtml = document.getElementById('simple-letterhead')?.innerHTML;
    if (!reportHtml) return;

    // Use a new window to bypass iframe sandbox restrictions on modals/printing
    const printWindow = window.open('', '_blank', 'width=1000,height=900');
    
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Estimate Explanation - Print View</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          </style>
        </head>
        <body>
          <div style="padding: 40px; max-width: 850px; margin: 0 auto;">
            ${reportHtml}
          </div>
          <script>
            // Wait briefly for styles to compute
            setTimeout(() => {
              window.print();
            }, 1000);
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      alert("Pop-up blocked. Please use the 'Save HTML' button to download the report.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Action Bar */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/70 p-5 sm:p-6 flex flex-col md:flex-row justify-between items-center gap-4 no-print">
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold text-slate-800 font-display">Estimate Explanation</h2>
          <p className="text-slate-500 text-sm">We've translated the shop's estimate into plain English.</p>
        </div>
        <div className="flex gap-2.5 w-full md:w-auto">
          <button
            onClick={handlePrint}
            className="flex-1 md:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Save / Print
          </button>
          <button
            onClick={onReset}
            className="flex-1 md:flex-none px-5 py-2.5 bg-brand-navy hover:bg-brand-navy-dk text-white rounded-xl font-bold text-sm transition-colors active:scale-95"
          >
            New Estimate
          </button>
        </div>
      </div>

      {/* Report Container */}
      <div id="simple-letterhead" className="bg-white p-8 md:p-12 shadow-lg rounded-none md:rounded-2xl text-slate-900 mx-auto max-w-[850px]">
        
        {/* Header */}
        <div className="border-b-4 border-brand-navy pb-6 mb-8 flex justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-navy font-display">BILL LAYNE</h1>
            <h2 className="text-xs sm:text-sm font-bold tracking-widest text-brand-gold uppercase">Insurance Agency Guide</h2>
            <div className="mt-2 text-xs text-slate-500 font-medium">
              <p>1283 N BRIDGE ST, ELKIN NC 28621</p>
              <p>336-835-1993</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="bg-blue-50 text-brand-navy px-4 py-2 rounded-lg border border-blue-100 inline-block text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/70">Estimate Total</p>
              <p className="text-2xl font-black">${data.grandTotal?.toLocaleString() || '0'}</p>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-wide">
              Ref: {data.vehicleStr || 'Vehicle Analysis'}
            </p>
          </div>
        </div>

        {/* Summary Box */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
          <h3 className="text-brand-navy font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Bill Layne's Take (Summary)
          </h3>
          <p className="text-slate-700 leading-relaxed font-medium">
            {data.simpleSummary}
          </p>
        </div>

        {/* Breakdown Sections */}
        <div className="space-y-8">
          {data.sections?.map((section, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between border-b-2 border-slate-100 pb-2 mb-4">
                <h4 className="font-black text-slate-700 text-lg">{section.title}</h4>
                <span className="text-sm font-mono font-bold text-slate-400">${section.sectionTotal?.toLocaleString()}</span>
              </div>
              
              <div className="space-y-4">
                {section.items?.map((item, itemIdx) => (
                  <div key={itemIdx} className="bg-white border border-slate-100 p-4 rounded-lg shadow-sm hover:border-brand-navy/20 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="block font-bold text-slate-800 text-base">{item.simpleName}</span>
                        <span className="block text-[10px] text-slate-400 font-mono uppercase tracking-tight">{item.technicalName}</span>
                      </div>
                      <span className="font-mono text-sm font-medium text-slate-600">${item.cost?.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-slate-600 italic bg-blue-50/50 p-2 rounded">
                      "{item.explanation}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-slate-100">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2 text-center">
            Legal Notice &amp; Disclaimer
          </p>
          <p className="text-[10px] text-slate-400 leading-relaxed max-w-2xl mx-auto">
            {LEGAL.full}
          </p>
        </div>

      </div>

      {/* Legacy print styles kept for robust fallback if native print works in some contexts */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; }
          #simple-letterhead, #simple-letterhead * { visibility: visible; }
          #simple-letterhead { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; }
          .no-print { display: none !important; }
        }
      `}} />
    </div>
  );
};

export default SimplifiedReport;
