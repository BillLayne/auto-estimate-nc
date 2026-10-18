import React, { useState } from 'react';
import { AppStep, VehicleInfo, CustomerInfo, EstimateResult, SimplifiedEstimateResult, ComparisonResult, HomeProjectInfo, HomeProjectMode, HomeEstimateResult } from './types';
import Layout from './components/Layout';
import ModeSelection from './components/ModeSelection';
import VehicleForm from './components/VehicleForm';
import DamageUpload from './components/DamageUpload';
import EstimateReport from './components/EstimateReport';
import SimplifiedReport from './components/SimplifiedReport';
import ComparisonReport from './components/ComparisonReport';
import ArchitectureDocs from './components/ArchitectureDocs';
import HomeLanding from './components/HomeLanding';
import HomeProjectForm from './components/HomeProjectForm';
import HomeEstimateReport from './components/HomeEstimateReport';
import { generateEstimate, analyzeExistingEstimate, compareEstimates, generateHomeEstimate } from './services/geminiService';
import { LEGAL } from './config';
import { getHomePhotoGuide } from './homePhotoGuides';

interface AppProps {
  /** 'auto' = / (car tools) · 'home' = /home/ (home repair & project estimates) */
  variant?: 'auto' | 'home';
}

const EMPTY_HOME_PROJECT: HomeProjectInfo = {
  mode: 'damage',
  category: '',
  description: '',
  approxSize: '',
  zip: '',
  deductible: ''
};

const App: React.FC<AppProps> = ({ variant = 'auto' }) => {
  const [step, setStepState] = useState<AppStep>(variant === 'home' ? AppStep.HomeLanding : AppStep.ModeSelection);
  const [apiError, setApiError] = useState<string | null>(null);

  const setStep = (nextStep: AppStep) => {
    setApiError(null);
    setStepState(nextStep);
  };

  // State for Flow A (New Estimate)
  const [vehicle, setVehicle] = useState<VehicleInfo>({
    vin: '',
    year: '',
    make: '',
    model: '',
    mileage: '',
    deductible: ''
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
  const [simpleFiles, setSimpleFiles] = useState<string[]>([]);
  const [simpleReport, setSimpleReport] = useState<SimplifiedEstimateResult | null>(null);

  // State for Flow C (Comparison)
  const [comparisonFilesA, setComparisonFilesA] = useState<string[]>([]);
  const [comparisonFilesB, setComparisonFilesB] = useState<string[]>([]);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);

  // State for Flow D (Home Estimate — /home/)
  const [homeProject, setHomeProject] = useState<HomeProjectInfo>(EMPTY_HOME_PROJECT);
  const [homeReport, setHomeReport] = useState<HomeEstimateResult | null>(null);

  const [loadingMsg, setLoadingMsg] = useState('Processing...');

  // Flow A Handler
  const handleStartAnalysis = async (imagesData: string[]) => {
    setCapturedImages(imagesData);
    setApiError(null);
    setStepState(AppStep.Processing);
    setLoadingMsg('Reviewing Vehicle Photos...');

    try {
      setTimeout(() => setLoadingMsg('Checking Multi-Angle Damage...'), 2000);
      setTimeout(() => setLoadingMsg('Checking NC Parts & Labor Benchmarks...'), 4000);
      setTimeout(() => setLoadingMsg('Preparing Preliminary Cost Guide...'), 6000);

      const result = await generateEstimate(vehicle, imagesData);

      const fullReport: EstimateResult = {
        ...result,
        customer: customer,
        // Keep the customer's inputs (incl. their deductible) over the AI's echo;
        // the deductible is compared client-side and never sent to the AI.
        vehicle: { ...vehicle, ...(result.vehicle || {}) }
      };

      setReport(fullReport);
      setStepState(AppStep.Report);
    } catch (error) {
      console.error(error);
      setApiError('We could not complete the cost guide right now. Your photos and vehicle details are saved below — please try again.');
      setStepState(AppStep.Analysis);
    }
  };

  // Flow B Handler
  const handleSimplification = async (filesData: string[]) => {
    setSimpleFiles(filesData);
    setApiError(null);
    setStepState(AppStep.ProcessingSimplification);
    setLoadingMsg('Reading Estimate Document...');

    try {
      setTimeout(() => setLoadingMsg('Translating Repair Terms...'), 2000);
      setTimeout(() => setLoadingMsg('Organizing Plain-English Breakdown...'), 3500);

      const result = await analyzeExistingEstimate(filesData);
      setSimpleReport(result);
      setStepState(AppStep.SimplifiedReport);
    } catch (error) {
      console.error(error);
      setApiError('We could not read that estimate right now. Your uploaded pages are saved below — please ensure the text is clear and try again.');
      setStepState(AppStep.UploadEstimate);
    }
  };

  // Flow C Handler (Comparison)
  const handleComparisonStep1 = (filesData: string[]) => {
    setComparisonFilesA(filesData);
    setApiError(null);
    setStepState(AppStep.UploadComparisonB);
  };

  const handleComparisonStep2 = async (filesDataB: string[]) => {
    setComparisonFilesB(filesDataB);
    setApiError(null);
    setStepState(AppStep.ProcessingComparison);
    setLoadingMsg('Comparing Both Estimates...');

    try {
      setTimeout(() => setLoadingMsg('Reviewing Parts, Labor & Scope Differences...'), 2000);
      setTimeout(() => setLoadingMsg('Preparing Side-by-Side Summary...'), 4000);

      const result = await compareEstimates(comparisonFilesA, filesDataB);
      setComparisonResult(result);
      setStepState(AppStep.ComparisonReport);
    } catch (error) {
      console.error(error);
      setApiError('We could not complete the comparison right now. Both uploaded estimates are saved — please try again.');
      setStepState(AppStep.UploadComparisonB);
    }
  };

  // Flow D Handlers (Home Estimate)
  const handleHomeStart = (mode: HomeProjectMode) => {
    setHomeProject({ ...EMPTY_HOME_PROJECT, mode });
    setCapturedImages([]);
    setHomeReport(null);
    setApiError(null);
    setStepState(AppStep.HomeIntake);
  };

  const handleHomeAnalysis = async (imagesData: string[]) => {
    setCapturedImages(imagesData);
    setApiError(null);
    setStepState(AppStep.ProcessingHome);
    setLoadingMsg('Reviewing Your Photos...');

    try {
      setTimeout(() => setLoadingMsg('Checking NC Material Prices...'), 2000);
      setTimeout(() => setLoadingMsg('Estimating Labor Hours...'), 4000);
      setTimeout(() => setLoadingMsg('Finalizing Your Cost Guide...'), 6000);

      const result = await generateHomeEstimate(homeProject, imagesData);
      setHomeReport(result);
      setStepState(AppStep.HomeReport);
    } catch (error) {
      console.error(error);
      setApiError('We could not generate the cost guide right now. Your photos and project details are saved below — please try again.');
      setStepState(AppStep.HomeAnalysis);
    }
  };

  const handleReset = () => {
    setVehicle({ vin: '', year: '', make: '', model: '', mileage: '', deductible: '' });
    setCustomer({ firstName: '', lastName: '', address: '', email: '' });
    setReport(null);
    setSimpleReport(null);
    setComparisonResult(null);
    setCapturedImages([]);
    setSimpleFiles([]);
    setComparisonFilesA([]);
    setComparisonFilesB([]);
    setHomeProject(EMPTY_HOME_PROJECT);
    setHomeReport(null);
    setApiError(null);
    setStepState(variant === 'home' ? AppStep.HomeLanding : AppStep.ModeSelection);
  };

  return (
    <Layout activeStep={step} setStep={setStep} variant={variant}>

      {/* MODE SELECTION SCREEN */}
      {step === AppStep.ModeSelection && (
        <ModeSelection setStep={setStep} />
      )}

      {/* FLOW D: HOME ESTIMATE (/home/) */}
      {step === AppStep.HomeLanding && (
        <HomeLanding onStart={handleHomeStart} />
      )}

      {step === AppStep.HomeIntake && (
        <HomeProjectForm
          project={homeProject}
          onChange={setHomeProject}
          onNext={() => setStep(AppStep.HomeAnalysis)}
          onBack={() => setStep(AppStep.HomeLanding)}
        />
      )}

      {step === AppStep.HomeAnalysis && (
        <DamageUpload
          mode="damage"
          customTitle={homeProject.mode === 'damage' ? 'Photos of the Damage' : 'Photos of the Project Area'}
          customSubtitle="Add multiple clear photos from different angles — iPhone photos work great."
          customButtonText="Get My Cost Guide"
          photoGuide={getHomePhotoGuide(homeProject)}
          consentText={LEGAL.homeConsent}
          initialImages={capturedImages}
          errorBanner={apiError}
          onImagesCaptured={handleHomeAnalysis}
          onBack={() => setStep(AppStep.HomeIntake)}
        />
      )}

      {step === AppStep.ProcessingHome && (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-16 h-16 border-4 border-[#0A1F44] border-t-[#E8B84B] rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-bold text-[#0A1F44] font-display text-center px-4">{loadingMsg}</h2>
          <p className="text-[#6B7280] mt-2 text-center max-w-sm px-4">
            Building your preliminary cost range from current NC material prices and contractor labor rates.
          </p>
        </div>
      )}

      {step === AppStep.HomeReport && homeReport && (
        <HomeEstimateReport
          report={homeReport}
          project={homeProject}
          reportImages={capturedImages}
          onReset={handleReset}
        />
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
          initialImages={capturedImages}
          errorBanner={apiError}
          onImagesCaptured={handleStartAnalysis}
          onBack={() => setStep(AppStep.Intake)}
        />
      )}

      {step === AppStep.Processing && (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-16 h-16 border-4 border-[#0A1F44] border-t-[#E8B84B] rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-bold text-[#0A1F44] font-display text-center px-4">{loadingMsg}</h2>
          <p className="text-[#6B7280] mt-2 text-center max-w-sm px-4">
            Reviewing your vehicle photos and preparing your preliminary repair-cost guide.
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
          customTitle="Explain a Repair Estimate"
          customSubtitle="Upload photos or a PDF of your shop estimate for a plain-English breakdown."
          initialImages={simpleFiles}
          errorBanner={apiError}
          onImagesCaptured={handleSimplification}
          onBack={() => setStep(AppStep.ModeSelection)}
        />
      )}

      {step === AppStep.ProcessingSimplification && (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-16 h-16 border-4 border-[#0A1F44] border-t-[#E8B84B] rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-bold text-[#0A1F44] font-display text-center px-4">{loadingMsg}</h2>
          <p className="text-[#6B7280] mt-2 text-center max-w-sm px-4">
            Reading your estimate document and translating repair terms into plain English.
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
          customTitle="Compare Two Estimates — First Estimate (Shop A)"
          customSubtitle="Take photos or choose the PDF for the first repair estimate."
          customButtonText="Next: Upload Second Estimate"
          initialImages={comparisonFilesA}
          errorBanner={apiError}
          onImagesCaptured={handleComparisonStep1}
          onBack={() => setStep(AppStep.ModeSelection)}
        />
      )}

      {step === AppStep.UploadComparisonB && (
        <DamageUpload
          mode="document"
          customTitle="Compare Two Estimates — Second Estimate (Shop B)"
          customSubtitle="Take photos or choose the PDF for the second repair estimate."
          customButtonText="Compare Both Estimates"
          initialImages={comparisonFilesB}
          errorBanner={apiError}
          onImagesCaptured={handleComparisonStep2}
          onBack={() => setStep(AppStep.UploadComparisonA)}
        />
      )}

      {step === AppStep.ProcessingComparison && (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-16 h-16 border-4 border-[#0A1F44] border-t-[#E8B84B] rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-bold text-[#0A1F44] font-display text-center px-4">{loadingMsg}</h2>
          <p className="text-[#6B7280] mt-2 text-center max-w-sm px-4">
            Reviewing differences in parts, labor, and repair scope between both estimates.
          </p>
        </div>
      )}

      {step === AppStep.ComparisonReport && comparisonResult && (
        <ComparisonReport
          data={comparisonResult}
          onReset={handleReset}
        />
      )}

      {/* SHARED: DOCS & PRIVACY */}
      {step === AppStep.Docs && (
        <ArchitectureDocs onBack={() => setStep(variant === 'home' ? AppStep.HomeLanding : AppStep.ModeSelection)} />
      )}
    </Layout>
  );
};

export default App;

