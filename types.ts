
export interface ExtractedData {
  brand: string;
  generic_name: string;
  manufacturer: string;
  manufacturer_address: string;
  batch: string;
  license: string;
  mfg_date: string;
  exp_date: string;
}

export interface VisualForensics {
  findings: string[];
  red_flags: string[];
  assets: {
    logo_analysis: string;
    font_analysis: string;
    qr_present: boolean;
  };
}

export interface GroundingCheck {
  manufacturer_verified: boolean;
  batch_valid: boolean;
  alerts_found: string[];
  sources: Array<{ title: string; uri: string }>;
}

export interface ForensicReport {
  authenticity_score: number;
  status: 'Verified' | 'Suspect' | 'Counterfeit';
  extracted_data: ExtractedData;
  visual_forensics: VisualForensics;
  grounding_check: GroundingCheck;
  recommendation: string;
  reasoning_summary: string;
}

export enum AnalysisStep {
  IDLE = 'IDLE',
  EXTRACTING = 'EXTRACTING',
  VERIFYING = 'VERIFYING',
  REASONING = 'REASONING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
