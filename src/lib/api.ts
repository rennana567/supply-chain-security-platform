// API 基础配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

// 通用请求函数
async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// SBOM API
export const sbomApi = {
  scan: (data: { repoUrl?: string; file?: File }) =>
    request('/sbom/scan', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getResult: (scanId: string) =>
    request(`/sbom/result?id=${scanId}`),
};

// License API
export const licenseApi = {
  scan: (data: { repoUrl?: string; file?: File }) =>
    request('/license/scan', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getResult: (scanId: string) =>
    request(`/license/result?id=${scanId}`),
};

// Vulnerability API
export const vulnApi = {
  scan: (data: { repoUrl?: string; sbomData?: any }) =>
    request('/vuln/scan', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getResult: (scanId: string) =>
    request(`/vuln/result?id=${scanId}`),
};

// Poison Detection API
export const poisonApi = {
  scan: (data: { repoUrl?: string; mode: 'ondemand' | 'continuous' }) =>
    request('/poison/scan', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getScan: (scanId: string) =>
    request(`/poison/scan/${scanId}`),
  
  getResult: (scanId: string) =>
    request(`/poison/result?scan=${scanId}`),
  
  getItem: (itemId: string) =>
    request(`/poison/item/${itemId}`),
};

// Developer API
export const developerApi = {
  analyze: (data: { userId: string; platform: 'github' | 'gitee' }) =>
    request('/developer/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getProfile: (userId: string) =>
    request(`/developer/profile?id=${userId}`),
};

// 导出所有 API
export const api = {
  sbom: sbomApi,
  license: licenseApi,
  vuln: vulnApi,
  poison: poisonApi,
  developer: developerApi,
};

