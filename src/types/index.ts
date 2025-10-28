// SBOM Types
export interface Component {
  name: string;
  version: string;
  license: string;
  manager: string;
}

export interface SBOMResult {
  components: Component[];
  summary: {
    total: number;
    npm: number;
    pip: number;
    go: number;
    other: number;
  };
}

// License Types
export interface License {
  name: string;
  compatible: boolean;
  declared: boolean;
  count: number;
}

export interface LicenseResult {
  licenses: License[];
  summary: {
    compatible: number;
    conflict: number;
    undeclared: number;
  };
}

// Vulnerability Types
export type Severity = 'high' | 'medium' | 'low';

export interface Vulnerability {
  package: string;
  version: string;
  severity: Severity;
  cveId: string;
  fixVersion: string;
  description: string;
}

export interface VulnerabilityResult {
  vulnerabilities: Vulnerability[];
  summary: {
    high: number;
    medium: number;
    low: number;
  };
}

// Poison Detection Types
export type TaskStatus = 'running' | 'completed' | 'failed';
export type RiskLevel = 'high' | 'medium' | 'low' | 'none';

export interface PoisonTask {
  id: string;
  name: string;
  status: TaskStatus;
  progress: number;
  riskLevel: RiskLevel;
  startTime: string;
  malicious: number;
  benign: number;
}

export interface PoisonResult {
  tasks: PoisonTask[];
  summary: {
    malicious: number;
    benign: number;
    avgTime: number;
  };
}

// Developer Types
export interface Developer {
  id: string;
  name: string;
  avatar: string;
  org: string;
  location: string;
  profileUrl: string;
  commits: number;
  prs: number;
  reviews: number;
  rank: number;
}

export interface DeveloperProfile {
  info: {
    name: string;
    org: string;
    location: string;
    profileUrl: string;
  };
  stats: {
    commits: number;
    prs: number;
    reviews: number;
  };
  skills: Record<string, number>;
  activity: Array<{
    date: string;
    commits: number;
  }>;
}

// Scan Types
export interface ScanResult {
  totalComponents: number;
  licensedComponents: number;
  vulnerabilities: number;
  riskLevel: string;
  overallScore: number;
  sbomSummary: {
    total: number;
    npm: number;
    pip: number;
    other: number;
  };
  vulnerabilitySummary: {
    high: number;
    medium: number;
    low: number;
  };
  contributors: number;
}

