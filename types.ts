
export interface VehicleInfo {
  vin: string;
  year: string;
  make: string;
  model: string;
  mileage: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  address: string;
  email: string;
}

export interface EstimatedPart {
  name: string;
  condition: string;
  estimatedPrice: number;
  sourceUrl?: string;
}

export interface LaborLine {
  description: string;
  hours: number;
  rate: number;
  total: number;
}

export interface EstimateResult {
  vehicle: VehicleInfo;
  customer?: CustomerInfo;
  damagedComponents: string[];
  severity: 'Minor' | 'Moderate' | 'Severe';
  partsBreakdown: EstimatedPart[];
  laborBreakdown: LaborLine[];
  totalEstimate: number;
  summary: string;
  groundingSources: Array<{title: string, uri: string}>;
}

export interface SimplifiedLineItem {
  technicalName: string;
  simpleName: string;
  explanation: string;
  cost: number;
}

export interface SimplifiedSection {
  title: string;
  items: SimplifiedLineItem[];
  sectionTotal: number;
}

export interface SimplifiedEstimateResult {
  shopName?: string;
  grandTotal: number;
  customerName?: string;
  vehicleStr?: string;
  simpleSummary: string;
  sections: SimplifiedSection[];
}

// New Types for Comparison
export interface ComparisonPoint {
  category: string;
  shopA_Value: string;
  shopB_Value: string;
  explanation: string;
}

export interface ComparisonResult {
  shopA: { name: string; total: number };
  shopB: { name: string; total: number };
  priceDifference: number;
  summary: string;
  differences: ComparisonPoint[];
  recommendation: string;
}

// ─── Home Estimate (autoestimatenc.com/home/) ─────────────────

export type HomeProjectMode = 'damage' | 'upgrade';

export interface HomeProjectInfo {
  mode: HomeProjectMode;
  category: string;
  description: string;
  /** Optional free text: "12x16 deck", "about 1,800 sq ft roof" */
  approxSize: string;
  /** Optional NC ZIP for regional pricing flavor */
  zip: string;
  /** Optional deductible (damage mode only) — compared client-side, never sent to the AI */
  deductible: string;
}

export interface HomeLineItem {
  description: string;
  category: 'Materials' | 'Labor' | 'Other';
  lowCost: number;
  highCost: number;
  note?: string;
}

export interface HomeRepairVsReplace {
  repairLow: number;
  repairHigh: number;
  replaceLow: number;
  replaceHigh: number;
  guidance: string;
}

export interface HomeEstimateResult {
  projectTitle: string;
  scopeSummary: string;
  severity?: 'Minor' | 'Moderate' | 'Severe';
  observedIssues: string[];
  lineItems: HomeLineItem[];
  totalLow: number;
  totalHigh: number;
  repairVsReplace?: HomeRepairVsReplace | null;
  claimConsiderations?: string;
  budgetTips: string[];
  groundingSources: Array<{title: string, uri: string}>;
}

export enum AppStep {
  ModeSelection = 'mode_selection',
  Intake = 'intake',
  Analysis = 'analysis',
  Processing = 'processing',
  Report = 'report',
  Docs = 'docs',

  // Existing Flow Steps
  UploadEstimate = 'upload_estimate',
  ProcessingSimplification = 'processing_simplification',
  SimplifiedReport = 'simplified_report',

  // New Comparison Flow Steps
  UploadComparisonA = 'upload_comparison_a',
  UploadComparisonB = 'upload_comparison_b',
  ProcessingComparison = 'processing_comparison',
  ComparisonReport = 'comparison_report',

  // Home Estimate Flow (/home/ landing page)
  HomeLanding = 'home_landing',
  HomeIntake = 'home_intake',
  HomeAnalysis = 'home_analysis',
  ProcessingHome = 'processing_home',
  HomeReport = 'home_report'
}
