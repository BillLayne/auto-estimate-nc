
import React from 'react';

const ArchitectureDocs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <section className="bg-white rounded-2xl shadow-sm border p-8">
        <h2 className="text-3xl font-black text-slate-800 mb-6 tracking-tight flex items-center gap-3">
          <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
          AI-Driven Estimation Architecture
        </h2>
        
        <div className="prose prose-slate max-w-none space-y-6">
          <div className="bg-blue-900 text-white p-6 rounded-2xl shadow-inner border border-blue-800">
            <h3 className="text-blue-300 text-xs font-black uppercase tracking-widest mt-0 mb-4">Core API Config: Gemini 3 Engine</h3>
            <p className="text-sm font-medium leading-relaxed mb-4">
              The AutoEstimate NC backend leverages <strong>Gemini 3 Pro</strong> to transform visual vehicle data into grounded repair estimates.
            </p>
            <ul className="text-xs space-y-2 list-none p-0 opacity-90">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                <strong>Precision Intelligence:</strong> gemini-3-pro-preview ensures high-accuracy visual and market reasoning.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                <strong>Vision Grounding:</strong> The multimodal engine pairs damage analysis with live NC market search for parts.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                <strong>Zero-Fluff JSON:</strong> Strict <code>responseSchema</code> enforcement guarantees valid report data.
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="font-black text-slate-800 text-sm uppercase mb-3">NC Market Benchmarking</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                The AI is explicitly instructed to adhere to North Carolina labor averages ($85-$105/hr) and prioritize parts available through regional supply chains identified via Google Search grounding.
              </p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h4 className="font-black text-slate-800 text-sm uppercase mb-3">Contextual Injection</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bill Layne Agency location data (1283 N BRIDGE ST, ELKIN NC 28621) is hard-coded into the <strong>System Instruction</strong>, ensuring every estimate is tailored to the agency's specific operational context.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 overflow-hidden">
            <h4 className="text-blue-400 text-[10px] font-black uppercase mb-4 tracking-widest">System Intelligence Flow</h4>
            <pre className="text-slate-400 text-[10px] font-mono leading-relaxed bg-black/30 p-4 rounded-lg">
{`[IMAGE INTAKE] 
    -> [MULTIMODAL VISION ANALYSIS] 
    -> [GOOGLE SEARCH GROUNDING]
    -> [REPAIR LOGIC ENGINE]
        -> NC Labor Rate Calculation
        -> Live Parts Price Fetching
        -> Damage Severity Categorization
    -> [STRICT JSON PACKAGING]
        -> Output: Agency Repair Cost Guide`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArchitectureDocs;
