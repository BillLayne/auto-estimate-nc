
import React from 'react';
import { ComparisonResult } from '../types';
import { LEGAL } from '../config';

interface ComparisonReportProps {
  data: ComparisonResult;
  onReset: () => void;
}

const ComparisonReport: React.FC<ComparisonReportProps> = ({ data, onReset }) => {
  const handlePrint = () => {
    // Print logic similar to other reports
    const reportHtml = document.getElementById('comparison-letterhead')?.innerHTML;
    const printWindow = window.open('', '_blank', 'width=1000,height=900');
    if (printWindow) {
      printWindow.document.write(`
        <html><head><title>Comparison Print</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }</style>
        </head><body><div style="padding:40px; max-width:850px; margin:0 auto;">${reportHtml}</div>
        <script>setTimeout(() => { window.print(); }, 1000);</script></body></html>
      `);
      printWindow.document.close();
    }
  };

  const diff = data.priceDifference;
  const winner = data.shopA.total < data.shopB.total ? 'Shop A' : 'Shop B';
  const diffPercent = Math.abs(diff / Math.min(data.shopA.total, data.shopB.total) * 100).toFixed(1);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Action Bar */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/70 p-5 sm:p-6 flex flex-col md:flex-row justify-between items-center gap-4 no-print">
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold text-slate-800 font-display">Estimate Comparison</h2>
          <p className="text-slate-500 text-sm">Reviewing differences between {data.shopA.name} and {data.shopB.name}.</p>
        </div>
        <div className="flex gap-2.5 w-full md:w-auto">
          <button onClick={handlePrint} className="flex-1 md:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-colors">Save / Print</button>
          <button onClick={onReset} className="flex-1 md:flex-none px-5 py-2.5 bg-brand-navy hover:bg-brand-navy-dk text-white rounded-xl font-bold text-sm transition-colors active:scale-95">New Comparison</button>
        </div>
      </div>

      {/* Report Container */}
      <div id="comparison-letterhead" className="bg-white p-8 md:p-12 shadow-lg rounded-none md:rounded-2xl text-slate-900 mx-auto max-w-[850px]">
        
        {/* Header */}
        <div className="border-b-4 border-brand-navy pb-6 mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black text-slate-800">BILL LAYNE</h1>
            <h2 className="text-sm font-bold tracking-widest text-brand-navy uppercase">Insurance Agency Guide</h2>
            <div className="mt-2 text-xs text-slate-500 font-medium">
              <p>1283 N BRIDGE ST, ELKIN NC 28621</p>
              <p>336-835-1993</p>
            </div>
          </div>
          <div className="text-right">
             <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Price Difference</div>
             <div className="text-2xl font-black text-brand-navy">${Math.abs(diff).toLocaleString()}</div>
             <div className="text-xs text-brand-navy font-bold">{diffPercent}% Variance</div>
          </div>
        </div>

        {/* Head-to-Head Cards */}
        <div className="grid grid-cols-2 gap-6 mb-10">
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-400"></div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Estimate A</h3>
            <h4 className="text-lg font-bold text-slate-800 truncate mb-2">{data.shopA.name}</h4>
            <div className="text-3xl font-black text-slate-700">${data.shopA.total.toLocaleString()}</div>
          </div>
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-navy"></div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-navy mb-1">Estimate B</h3>
            <h4 className="text-lg font-bold text-brand-navy truncate mb-2">{data.shopB.name}</h4>
            <div className="text-3xl font-black text-brand-navy">${data.shopB.total.toLocaleString()}</div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mb-8">
          <h3 className="text-brand-navy font-bold text-sm uppercase tracking-wider mb-3 border-b border-blue-100 pb-2">
            Comparison Summary
          </h3>
          <p className="text-slate-700 leading-relaxed text-sm">
            {data.summary}
          </p>
        </div>

        {/* Detailed Comparison Table */}
        <div className="mb-10">
          <h3 className="text-brand-navy font-bold text-sm uppercase tracking-wider mb-3 border-b border-blue-100 pb-2">
            Key Differences
          </h3>
          <div className="w-full text-sm">
            <div className="grid grid-cols-12 gap-4 border-b border-slate-200 pb-2 mb-4 font-bold text-slate-500 text-xs uppercase tracking-wide">
              <div className="col-span-3">Category</div>
              <div className="col-span-3">Shop A</div>
              <div className="col-span-3">Shop B</div>
              <div className="col-span-3">Impact</div>
            </div>
            <div className="space-y-4">
              {data.differences.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-4 pb-4 border-b border-slate-100 last:border-0">
                  <div className="col-span-3 font-bold text-slate-800">{item.category}</div>
                  <div className="col-span-3 text-slate-600 text-xs">{item.shopA_Value}</div>
                  <div className="col-span-3 text-slate-600 text-xs">{item.shopB_Value}</div>
                  <div className="col-span-3 text-brand-navy text-xs italic bg-blue-50 p-2 rounded">{item.explanation}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Agency Recommendation */}
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg">
           <h3 className="text-brand-gold font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Agency Recommendation
           </h3>
           <p className="text-slate-200 text-sm leading-relaxed">
             {data.recommendation}
           </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 pt-6 border-t border-slate-100">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2 text-center">
            Legal Notice &amp; Disclaimer
          </p>
          <p className="text-[10px] text-slate-400 leading-relaxed max-w-2xl mx-auto">
            {LEGAL.full}
          </p>
        </div>

        <div className="mt-8 text-center">
           <p className="text-[10px] text-slate-400 uppercase tracking-widest">AI-Assisted Analysis • Bill Layne Insurance Agency</p>
        </div>
      </div>
    </div>
  );
};

export default ComparisonReport;
