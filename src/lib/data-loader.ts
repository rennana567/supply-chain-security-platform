// 数据加载工具 - 从 v1/profile 目录加载实际数据

interface LicenseDetail {
  license: string;
  license_name: string;
  license_type: string;
  license_path: string;
  license_match: number;
  SPDX_check: boolean;
  SPDX_source: string;
}

interface LicenseData {
  license_anaylize: {
    license_details: LicenseDetail[];
    conflict_details: unknown[];
  };
}

interface PoisonData {
  name: string;
  files_num: string;
  result: string;
  files: unknown[];
}

interface VulnerabilityData {
  vuln_analyze: {
    summary: {
      total_components: number;
      total_vulnerabilities: number;
      components_affected: unknown[];
    };
    component_vulnerabilities: unknown[];
  };
}

// 仓库ID到文件名的映射
const REPO_FILE_MAP: Record<string, { license: string; poison: string; vuln: string }> = {
  'repo-kafka-python': {
    license: 'dpkp#kafka-python.json',
    poison: 'dpkp#kafka-python.json',
    vuln: 'dpkp#kafka-python.json'
  },
  'repo-xiangtian-workbench': {
    license: 'FxRayHughes#xiangtian-workbench.json',
    poison: 'FxRayHughes#xiangtian-workbench.json',
    vuln: 'FxRayHughes#xiangtian-workbench.json'
  },
  'repo-wumei-smart': {
    license: 'kerwincui#wumei-smart.json',
    poison: 'kerwincui#wumei-smart.json',
    vuln: 'kerwincui#wumei-smart.json'
  },
  'repo-probabilistic-forecasts': {
    license: 'eth-sri#probabilistic-forecasts-attacks.json',
    poison: 'eth-sri#probabilistic-forecasts-attacks.json',
    vuln: 'eth-sri#probabilistic-forecasts-attacks.json'
  },
  'repo-vue-django-bookshop': {
    license: 'mtianyan#VueDjangoAntdProBookShop.json',
    poison: 'mtianyan#VueDjangoAntdProBookShop.json',
    vuln: 'mtianyan#VueDjangoAntdProBookShop.json'
  },
  'repo-pytorch': {
    license: 'pytorch#pytorch.json',
    poison: 'pytorch#pytorch.json',
    vuln: 'pytorch#pytorch.json'
  },
  'repo-tensorflow': {
    license: 'tensorflow#tensorflow.json',
    poison: 'tensorflow#tensorflow.json',
    vuln: 'tensorflow#tensorflow.json'
  },
  'repo-deepseek-v3': {
    license: 'deepseek-ai#DeepSeek-V3.json',
    poison: 'deepseek-ai#DeepSeek-V3.json',
    vuln: 'deepseek-ai#DeepSeek-V3.json'
  },
  'repo-llama': {
    license: 'meta-llama#llama.json',
    poison: 'meta-llama#llama.json',
    vuln: 'meta-llama#llama.json'
  },
  'repo-mistral-inference': {
    license: 'mistralai#mistral-inference.json',
    poison: 'mistralai#mistral-inference.json',
    vuln: 'mistralai#mistral-inference.json'
  }
};

// 加载许可证数据
export async function loadLicenseData(repoId: string): Promise<{
  licenses: Array<{
    name: string;
    version: string;
    license: string;
    compatibility: 'compatible' | 'conflict' | 'undeclared';
    description: string;
  }>;
  summary: {
    total: number;
    compatible: number;
    conflict: number;
    undeclared: number;
  };
} | null> {
  try {
    const fileInfo = REPO_FILE_MAP[repoId];
    if (!fileInfo) {
      console.warn(`未找到仓库文件映射: ${repoId}`);
      return null;
    }

    const response = await fetch(`/api/profile-data?type=license&file=${encodeURIComponent(fileInfo.license)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch license data: ${response.statusText}`);
    }

    const data: LicenseData = await response.json();

    // 转换数据格式以匹配前端界面
    const licenseDetails = data.license_anaylize.license_details;
    const licenses = licenseDetails.map(detail => ({
      name: detail.license_name,
      version: '1.0', // 实际数据中没有版本信息，使用默认值
      license: detail.license_name,
      compatibility: detail.SPDX_check ? 'compatible' as const : 'undeclared' as const,
      description: `${detail.license_type} 许可证 - 匹配度: ${detail.license_match}%`
    }));

    // 计算统计摘要
    const total = licenses.length;
    const compatible = licenses.filter(l => l.compatibility === 'compatible').length;
    const conflict = licenses.filter(l => l.compatibility === 'conflict').length;
    const undeclared = licenses.filter(l => l.compatibility === 'undeclared').length;

    return {
      licenses,
      summary: { total, compatible, conflict, undeclared }
    };
  } catch (error) {
    console.error('Error loading license data:', error);
    return null;
  }
}

// 加载投毒数据
export async function loadPoisonData(repoId: string): Promise<{
  name: string;
  files_num: string;
  result: string;
  files: unknown[];
} | null> {
  try {
    const fileInfo = REPO_FILE_MAP[repoId];
    if (!fileInfo) {
      console.warn(`未找到仓库文件映射: ${repoId}`);
      return null;
    }

    const response = await fetch(`/api/profile-data?type=poison&file=${encodeURIComponent(fileInfo.poison)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch poison data: ${response.statusText}`);
    }

    const data: PoisonData = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading poison data:', error);
    return null;
  }
}

// 加载漏洞数据
export async function loadVulnerabilityData(repoId: string): Promise<{
  summary: {
    total_components: number;
    total_vulnerabilities: number;
    components_affected: unknown[];
  };
  component_vulnerabilities: unknown[];
} | null> {
  try {
    const fileInfo = REPO_FILE_MAP[repoId];
    if (!fileInfo) {
      console.warn(`未找到仓库文件映射: ${repoId}`);
      return null;
    }

    const response = await fetch(`/api/profile-data?type=vuln&file=${encodeURIComponent(fileInfo.vuln)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch vulnerability data: ${response.statusText}`);
    }

    const data: VulnerabilityData = await response.json();
    return data.vuln_analyze;
  } catch (error) {
    console.error('Error loading vulnerability data:', error);
    return null;
  }
}