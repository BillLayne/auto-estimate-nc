
import React, { useState } from 'react';
import { AppStep, VehicleInfo, CustomerInfo, EstimateResult, SimplifiedEstimateResult, ComparisonResult } from './types';
import Layout from './components/Layout';
import ModeSelection from './components/ModeSelection';
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
        <ModeSelection setStep={setStep} />
      )}

      {/* FLOW A: NEW ESTIMATE */}
      {step === AppStep.Intake && (
        <VehicleForm
          vehicleData={vehicle}
          customerData={customer}
          onVehicleChange={setVehicle}
          onCustomerChange={setCustomer}
          onNext={() => setStep(AppStep.Analysis)}
          onBack={() => setStep(AppStep.ModeSelection)}
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
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-20 h-20 border-4 border-brand-navy border-t-brand-gold rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-bold text-slate-800 font-display text-center px-4">{loadingMsg}</h2>
          <p className="text-slate-500 mt-2 text-center max-w-sm px-4">
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
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-20 h-20 border-4 border-brand-navy border-t-brand-gold rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-bold text-slate-800 font-display text-center px-4">{loadingMsg}</h2>
          <p className="text-slate-500 mt-2 text-center max-w-sm px-4">
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
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-20 h-20 border-4 border-brand-navy border-t-brand-gold rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-bold text-slate-800 font-display text-center px-4">{loadingMsg}</h2>
          <p className="text-slate-500 mt-2 text-center max-w-sm px-4">
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
