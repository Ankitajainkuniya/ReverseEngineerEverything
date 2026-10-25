export type TargetType = 'apk' | 'elf' | 'js' | 'electron' | 'har' | 'pcap' | 'dll' | 'exe';
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type EvidenceType = 'code' | 'reference' | 'metadata' | 'config';

export interface Target {
  path: string;
  type: TargetType;
  metadata?: Record<string, any>;
}

export interface Evidence {
  type: EvidenceType;
  source: string;
  snippet: string;
  lineNo?: number;
  lineRange?: [number, number];
}

export interface Finding {
  id: string;
  severity: Severity;
  title: string;
  description: string;
  evidence: Evidence[];
  cwe?: string;
  cvss?: number;
  remediations?: string[];
  tags?: string[];
}

export interface AnalysisResult {
  analyzerId: string;
  targetPath: string;
  timestamp: Date;
  findings: Finding[];
  summary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
}

export interface AnalyzerConfig {
  [key: string]: any;
}

export abstract class BaseAnalyzer {
  abstract readonly name: string;
  abstract readonly version: string;

  abstract supports(target: Target): boolean;
  abstract analyze(target: Target, config?: AnalyzerConfig): Promise<AnalysisResult>;
}
