
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
  ComparisonReport = 'comparison_report'
}
