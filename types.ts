export interface MemeAnalysisRequest {
  name: string;
  contractAddress: string;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface AnalysisResult {
  markdown: string;
  sources: GroundingSource[];
}

export enum AnalysisState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}