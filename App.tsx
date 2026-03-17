
import React, { useState } from 'react';
import { AppStep, VehicleInfo, CustomerInfo, EstimateResult, SimplifiedEstimateResult, ComparisonResult } from './types';
import Layout from './components/Layout';
import VehicleForm from './components/VehicleForm';
import DamageUpload from './components/DamageUpload';
import EstimateReport from './components/EstimateReport';
import SimplifiedReport from './components/SimplifiedReport';
import ComparisonReport from './components/ComparisonReport';
import ArchitectureDocs from './components/ArchitectureDocs';
import { generateEstimate, analyzeExistingEstimate, compareEstimates } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.ModeSelection);
  
  // State for Flow A (New Estimate)
  const [vehicle, setVehicle] = useState<VehicleInfo>({
    vin: '',
    year: '',
    make: '',
    model: '',
    mileage: ''
  });
  const [customer, setCustomer] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    address: '',
    email: ''
  });
  const [report, setReport] = useState<EstimateResult | null>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  
  // State for Flow B (Simplification)
  const [simpleReport, setSimpleReport] = useState<SimplifiedEstimateResult | null>(null);

  // State for Flow C (Comparison)
  const [comparisonFilesA, setComparisonFilesA] = useState<string[]>([]);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  
  const [loadingMsg, setLoadingMsg] = useState('Processing...');

  // Flow A Handler
  const handleStartAnalysis = async (imagesData: string[]) => {
    setCapturedImages(imagesData);
    setStep(AppStep.Processing);
    setLoadingMsg('Scanning Multi-Angle Damage...');
    
    try {
      setTimeout(() => setLoadingMsg('Cross-Referencing Angles...'), 2000);
      setTimeout(() => setLoadingMsg('Fetching NC Market Data...'), 4000);
      setTimeout(() => setLoadingMsg('Finalizing Preliminary Guide...'), 6000);

      const result = await generateEstimate(vehicle, imagesData);
      
      const fullReport: EstimateResult = {
        ...result,
        customer: customer
      };
      
      setReport(fullReport);
      setStep(AppStep.Report);
    } catch (error) {
      alert("Failed to generate guide. Please check your network and try again.");
      setStep(AppStep.Analysis);
    }
  };

  // Flow B Handler
  const handleSimplification = async (filesData: string[]) => {
    setCapturedImages(filesData); // Store specifically for preview if needed, though mostly doc scan
    setStep(AppStep.ProcessingSimplification);
    setLoadingMsg('Reading Estimate Document...');

    try {
      setTimeout(() => setLoadingMsg('Translating Body Shop Jargon...'), 2000);
      setTimeout(() => setLoadingMsg('Simplifying Line Items...'), 3500);
      
      const result = await analyzeExistingEstimate(filesData);
      setSimpleReport(result);
      setStep(AppStep.SimplifiedReport);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze the document. Please ensure the image is clear.");
      setStep(AppStep.UploadEstimate);
    }
  };

  // Flow C Handler (Comparison)
  const handleComparisonStep1 = (filesData: string[]) => {
    setComparisonFilesA(filesData);
    setStep(AppStep.UploadComparisonB);
  };

  const handleComparisonStep2 = async (filesDataB: string[]) => {
    setStep(AppStep.ProcessingComparison);
    setLoadingMsg('Comparing Estimate Data...');

    try {
      setTimeout(() => setLoadingMsg('Analyzing Line Item Differences...'), 2000);
      setTimeout(() => setLoadingMsg('Generating Review...'), 4000);

      const result = await compareEstimates(comparisonFilesA, filesDataB);
      setComparisonResult(result);
      setStep(AppStep.ComparisonReport);
    } catch (error) {
      console.error(error);
      alert("Failed to compare estimates. Please try again.");
      setStep(AppStep.ModeSelection);
    }
  };

  const handleReset = () => {
    setVehicle({ vin: '', year: '', make: '', model: '', mileage: '' });
    setCustomer({ firstName: '', lastName: '', address: '', email: '' });
    setReport(null);
    setSimpleReport(null);
    setComparisonResult(null);
    setCapturedImages([]);
    setComparisonFilesA([]);
    setStep(AppStep.ModeSelection);
  };

  return (
    <Layout activeStep={step} setStep={setStep}>
      
      {/* MODE SELECTION SCREEN */}
      {step === AppStep.ModeSelection && (
        <div className="max-w-4xl mx-auto py-8 animate-fadeIn">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-800 mb-2">Welcome to Bill Layne Insurance Agency</h2>
            <p className="text-slate-500">How can our AI Assistant help you today?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Option 1: New Estimate */}
            <div 
              onClick={() => setStep(AppStep.Intake)}
              className="bg-white p-6 rounded-2xl shadow-md border-2 border-transparent hover:border-blue-500 cursor-pointer transition-all group hover:shadow-xl"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                <svg className="w-7 h-7 text-blue-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Start New Estimate</h3>
              <p className="text-xs text-slate-500 mb-4 h-12">I have vehicle damage and need a preliminary repair cost guide based on photos.</p>
              <span className="text-blue-600 font-bold text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                Get Started <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </span>
            </div>

            {/* Option 2: Translate Estimate */}
            <div 
              onClick={() => setStep(AppStep.UploadEstimate)}
              className="bg-white p-6 rounded-2xl shadow-md border-2 border-transparent hover:border-emerald-500 cursor-pointer transition-all group hover:shadow-xl"
            >
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-colors">
                <svg className="w-7 h-7 text-emerald-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Explain My Estimate</h3>
              <p className="text-xs text-slate-500 mb-4 h-12">I have one repair estimate and I need help understanding the jargon.</p>
              <span className="text-emerald-600 font-bold text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                Translate Estimate <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </span>
            </div>

            {/* Option 3: Compare Estimates */}
            <div 
              onClick={() => setStep(AppStep.UploadComparisonA)}
              className="bg-white p-6 rounded-2xl shadow-md border-2 border-transparent hover:border-indigo-500 cursor-pointer transition-all group hover:shadow-xl"
            >
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
                <svg className="w-7 h-7 text-indigo-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Compare Estimates</h3>
              <p className="text-xs text-slate-500 mb-4 h-12">I have two different estimates (e.g. Shop A vs Shop B) and I want to see why they differ.</p>
              <span className="text-indigo-600 font-bold text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                Compare Prices <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* FLOW A: NEW ESTIMATE */}
      {step === AppStep.Intake && (
        <VehicleForm 
          vehicleData={vehicle}
          customerData={customer}
          onVehicleChange={setVehicle}
          onCustomerChange={setCustomer}
          onNext={() => setStep(AppStep.Analysis)} 
        />
      )}

      {step === AppStep.Analysis && (
        <DamageUpload 
          mode="damage"
          onImagesCaptured={handleStartAnalysis} 
          onBack={() => setStep(AppStep.Intake)} 
        />
      )}

      {step === AppStep.Processing && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] animate-pulse">
          <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-bold text-slate-800">{loadingMsg}</h2>
          <p className="text-slate-500 mt-2 text-center max-w-sm">
            Searching for regional NC part prices and building your personalized guide.
          </p>
        </div>
      )}

      {step === AppStep.Report && report && (
        <EstimateReport 
          report={report} 
          reportImages={capturedImages}
          onReset={handleReset} 
        />
      )}

      {/* FLOW B: ESTIMATE TRANSLATOR */}
      {step === AppStep.UploadEstimate && (
        <DamageUpload 
          mode="document"
          onImagesCaptured={handleSimplification}
          onBack={() => setStep(AppStep.ModeSelection)}
        />
      )}

      {step === AppStep.ProcessingSimplification && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] animate-pulse">
          <div className="w-20 h-20 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-bold text-slate-800">{loadingMsg}</h2>
          <p className="text-slate-500 mt-2 text-center max-w-sm">
            Our AI is reading the PDF/Image and translating technical terms into plain English.
          </p>
        </div>
      )}

      {step === AppStep.SimplifiedReport && simpleReport && (
        <SimplifiedReport 
          data={simpleReport}
          onReset={handleReset}
        />
      )}

      {/* FLOW C: COMPARISON */}
      {step === AppStep.UploadComparisonA && (
        <DamageUpload
          mode="document"
          customTitle="Upload First Estimate (Shop A)"
          customSubtitle="Take photos or upload the PDF for the first estimate."
          customButtonText="Next: Upload Second Estimate"
          onImagesCaptured={handleComparisonStep1}
          onBack={() => setStep(AppStep.ModeSelection)}
        />
      )}

      {step === AppStep.UploadComparisonB && (
        <DamageUpload
          mode="document"
          customTitle="Upload Second Estimate (Shop B)"
          customSubtitle="Take photos or upload the PDF for the second estimate."
          customButtonText="Compare Both Estimates"
          onImagesCaptured={handleComparisonStep2}
          onBack={() => setStep(AppStep.UploadComparisonA)}
        />
      )}

      {step === AppStep.ProcessingComparison && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] animate-pulse">
          <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-bold text-slate-800">{loadingMsg}</h2>
          <p className="text-slate-500 mt-2 text-center max-w-sm">
            Our AI is analyzing line-by-line differences between the two shops.
          </p>
        </div>
      )}

      {step === AppStep.ComparisonReport && comparisonResult && (
        <ComparisonReport 
          data={comparisonResult}
          onReset={handleReset}
        />
      )}

      {/* SHARED: DOCS */}
      {step === AppStep.Docs && (
        <ArchitectureDocs />
      )}
    </Layout>
  );
};

export default App;
