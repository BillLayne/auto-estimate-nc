
import React from 'react';
import { AppStep } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeStep: AppStep;
  setStep: (step: AppStep) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeStep, setStep }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => setStep(AppStep.ModeSelection)}
          >
            <div className="bg-white p-1.5 rounded-lg">
              <svg className="w-8 h-8 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">AutoEstimate NC</h1>
              <p className="text-xs text-blue-200">Bill Layne Insurance Agency</p>
            </div>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <button 
              onClick={() => setStep(AppStep.ModeSelection)}
              className={`text-sm font-medium transition-colors ${(activeStep === AppStep.Intake || activeStep === AppStep.ModeSelection) ? 'text-white border-b-2 border-white' : 'text-blue-200 hover:text-white'}`}
            >
              New Estimate
            </button>
            <button 
              onClick={() => setStep(AppStep.Docs)}
              className={`text-sm font-medium transition-colors ${activeStep === AppStep.Docs ? 'text-white border-b-2 border-white' : 'text-blue-200 hover:text-white'}`}
            >
              System Docs
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-grow container max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-slate-100 border-t py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">© 2024 Bill Layne Insurance Agency. All Rights Reserved.</p>
          <p className="text-slate-400 text-xs mt-1">Estimates are provided for informational purposes based on AI analysis of market trends and NC labor averages.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
