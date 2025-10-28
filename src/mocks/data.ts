import { SBOMResult, LicenseResult, VulnerabilityResult, PoisonResult, DeveloperProfile } from '@/types';

// Mock SBOM Data
export const mockSBOMData: SBOMResult = {
  components: [
    { name: 'react', version: '18.2.0', license: 'MIT', manager: 'npm' },
    { name: 'next', version: '14.0.0', license: 'MIT', manager: 'npm' },
    { name: 'tailwindcss', version: '3.3.0', license: 'MIT', manager: 'npm' },
    { name: 'recharts', version: '2.10.0', license: 'MIT', manager: 'npm' },
    { name: 'zustand', version: '4.4.0', license: 'MIT', manager: 'npm' },
    { name: 'django', version: '4.2.0', license: 'BSD', manager: 'pip' },
    { name: 'flask', version: '2.3.0', license: 'BSD', manager: 'pip' },
    { name: 'requests', version: '2.31.0', license: 'Apache-2.0', manager: 'pip' },
    { name: 'numpy', version: '1.24.0', license: 'BSD', manager: 'pip' },
    { name: 'pandas', version: '2.0.0', license: 'BSD', manager: 'pip' },
    { name: 'gin', version: '1.9.0', license: 'MIT', manager: 'go' },
    { name: 'gorm', version: '1.25.0', license: 'MIT', manager: 'go' },
  ],
  summary: { total: 123, npm: 80, pip: 30, go: 10, other: 3 },
};

// Mock License Data
export const mockLicenseData: LicenseResult = {
  licenses: [
    { name: 'MIT', compatible: true, declared: true, count: 45 },
    { name: 'Apache-2.0', compatible: true, declared: true, count: 23 },
    { name: 'BSD-3-Clause', compatible: true, declared: true, count: 18 },
    { name: 'ISC', compatible: true, declared: true, count: 12 },
    { name: 'GPL-3.0', compatible: false, declared: true, count: 8 },
    { name: 'LGPL-2.1', compatible: false, declared: true, count: 5 },
    { name: 'Unknown', compatible: false, declared: false, count: 12 },
  ],
  summary: { compatible: 98, conflict: 13, undeclared: 12 },
};

// Mock Vulnerability Data
export const mockVulnerabilityData: VulnerabilityResult = {
  vulnerabilities: [
    {
      package: 'lodash',
      version: '4.17.15',
      severity: 'high',
      cveId: 'CVE-2021-23337',
      fixVersion: '4.17.21',
      description: 'Command injection vulnerability in lodash',
    },
    {
      package: 'axios',
      version: '0.21.0',
      severity: 'medium',
      cveId: 'CVE-2021-3749',
      fixVersion: '0.21.2',
      description: 'Regular expression denial of service (ReDoS)',
    },
    {
      package: 'minimist',
      version: '1.2.5',
      severity: 'medium',
      cveId: 'CVE-2021-44906',
      fixVersion: '1.2.6',
      description: 'Prototype pollution vulnerability',
    },
    {
      package: 'node-fetch',
      version: '2.6.1',
      severity: 'low',
      cveId: 'CVE-2022-0235',
      fixVersion: '2.6.7',
      description: 'Exposure of sensitive information',
    },
    {
      package: 'trim',
      version: '0.0.1',
      severity: 'low',
      cveId: 'CVE-2020-7753',
      fixVersion: '0.0.3',
      description: 'Regular expression denial of service',
    },
  ],
  summary: { high: 3, medium: 5, low: 10 },
};

// Mock Poison Detection Data
export const mockPoisonData: PoisonResult = {
  tasks: [
    {
      id: '1',
      name: '依赖包扫描 #1',
      status: 'completed',
      progress: 100,
      riskLevel: 'medium',
      startTime: '2024-01-15 10:30:00',
      malicious: 3,
      benign: 97,
    },
    {
      id: '2',
      name: '依赖包扫描 #2',
      status: 'running',
      progress: 65,
      riskLevel: 'low',
      startTime: '2024-01-15 14:20:00',
      malicious: 1,
      benign: 64,
    },
    {
      id: '3',
      name: '依赖包扫描 #3',
      status: 'completed',
      progress: 100,
      riskLevel: 'high',
      startTime: '2024-01-14 09:15:00',
      malicious: 8,
      benign: 92,
    },
  ],
  summary: { malicious: 6, benign: 119, avgTime: 1.2 },
};

// Mock Developer Data
export const mockDeveloperData: DeveloperProfile = {
  info: {
    name: 'Zhang San',
    org: 'TechCorp',
    location: 'Beijing, China',
    profileUrl: 'https://github.com/zhangsan',
  },
  stats: {
    commits: 320,
    prs: 45,
    reviews: 12,
  },
  skills: {
    JavaScript: 60,
    Python: 30,
    Go: 10,
  },
  activity: [
    { date: '01-01', commits: 5 },
    { date: '01-02', commits: 8 },
    { date: '01-03', commits: 3 },
    { date: '01-04', commits: 12 },
    { date: '01-05', commits: 7 },
    { date: '01-06', commits: 15 },
    { date: '01-07', commits: 10 },
  ],
};

