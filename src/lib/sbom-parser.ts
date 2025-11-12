// SBOM数据解析工具

interface SPDXPackage {
  name: string;
  SPDXID: string;
  versionInfo: string | null;
  externalRefs?: Array<{
    referenceCategory: string;
    referenceType: string;
    referenceLocator: string;
  }>;
}

interface SPDXDocument {
  spdxVersion: string;
  dataLicense: string;
  SPDXID: string;
  name: string;
  creationInfo: {
    licenseListVersion: string;
    creators: string[];
    created: string;
  };
  packages: SPDXPackage[];
}

export interface Component {
  name: string;
  version: string;
  purl: string;
  ecosystem: string;
  level: 'direct' | 'transitive';
  package: string;
  path: string;
  license: string;
  manager: string;
}

export interface SBOMSummary {
  total: number;
  packages: number;
  managers: number;
  licenses: number;
}

export interface PieData {
  name: string;
  value: number;
  color: string;
}

// 包管理器颜色映射
const MANAGER_COLORS: Record<string, string> = {
  'npm': '#5b8def',
  'pip': '#8b5cf6',
  'go': '#10b981',
  'maven': '#f59e0b',
  'nuget': '#ef4444',
  'cargo': '#8b5cf6',
  'composer': '#06b6d4',
  'gem': '#dc2626',
  'pypi': '#8b5cf6',
  'unknown': '#6b7280'
};

interface ExternalRef {
  referenceType?: string;
  referenceLocator?: string;
}

// 根据包名推断包管理器
function inferPackageManager(packageName: string, externalRefs?: ExternalRef[]): string {
  // 从externalRefs中提取信息
  if (externalRefs) {
    for (const ref of externalRefs) {
      if (ref.referenceType === 'purl') {
        const purl = ref.referenceLocator;
        if (purl && purl.startsWith('pkg:npm/')) return 'npm';
        if (purl && purl.startsWith('pkg:pypi/')) return 'pip';
        if (purl && purl.startsWith('pkg:golang/')) return 'go';
        if (purl && purl.startsWith('pkg:maven/')) return 'maven';
        if (purl && purl.startsWith('pkg:nuget/')) return 'nuget';
        if (purl && purl.startsWith('pkg:cargo/')) return 'cargo';
        if (purl && purl.startsWith('pkg:composer/')) return 'composer';
        if (purl && purl.startsWith('pkg:gem/')) return 'gem';
      }
    }
  }

  // 根据包名特征推断
  if (packageName.includes('/') && !packageName.startsWith('./')) {
    return 'npm';
  }
  if (packageName.includes('.') && !packageName.startsWith('./')) {
    return 'pip';
  }
  if (packageName.includes('github.com/')) {
    return 'go';
  }

  return 'unknown';
}

// 根据包管理器推断生态系统
function inferEcosystem(manager: string): string {
  const ecosystemMap: Record<string, string> = {
    'npm': 'npm',
    'pip': 'pypi',
    'pypi': 'pypi',
    'go': 'golang',
    'maven': 'maven',
    'nuget': 'nuget',
    'cargo': 'cargo',
    'composer': 'composer',
    'gem': 'gem'
  };
  return ecosystemMap[manager] || 'unknown';
}

// 生成PURL
function generatePurl(packageName: string, version: string, manager: string): string {
  const ecosystem = inferEcosystem(manager);
  return `pkg:${ecosystem}/${packageName}@${version}`;
}

// 解析SPDX数据
function parseSPDXData(spdxData: SPDXDocument): {
  components: Component[];
  summary: SBOMSummary;
  pieData: PieData[];
} {
  const components: Component[] = [];
  const managerCounts: Record<string, number> = {};
  const licenseSet = new Set<string>();

  spdxData.packages.forEach((pkg, index) => {
    // 跳过根目录和无效包
    if (pkg.name.includes('/mnt/repos/') || pkg.name === spdxData.name) {
      return;
    }

    const manager = inferPackageManager(pkg.name, pkg.externalRefs);
    const version = pkg.versionInfo || 'UNKNOWN';
    const ecosystem = inferEcosystem(manager);

    // 推断层级（简化逻辑，实际应该根据依赖关系判断）
    const level: 'direct' | 'transitive' = index < 10 ? 'direct' : 'transitive';

    const component: Component = {
      name: pkg.name.split('/').pop() || pkg.name,
      version,
      purl: generatePurl(pkg.name, version, manager),
      ecosystem,
      level,
      package: pkg.name,
      path: pkg.name,
      license: 'UNKNOWN', // 实际应该从licenseDeclared字段获取
      manager
    };

    components.push(component);

    // 统计包管理器
    managerCounts[manager] = (managerCounts[manager] || 0) + 1;

    // 统计许可证
    licenseSet.add('UNKNOWN');
  });

  // 生成饼图数据
  const pieData: PieData[] = Object.entries(managerCounts)
    .map(([name, value]) => ({
      name,
      value,
      color: MANAGER_COLORS[name] || MANAGER_COLORS.unknown
    }))
    .sort((a, b) => b.value - a.value);

  // 生成统计摘要
  const summary: SBOMSummary = {
    total: components.length,
    packages: components.length,
    managers: Object.keys(managerCounts).length,
    licenses: licenseSet.size
  };

  return { components, summary, pieData };
}

// 获取SBOM数据文件路径
function getSBOMFilePath(repoUrl: string): string | null {
  const repoPathMap: Record<string, string> = {
    'https://github.com/dpkp/kafka-python': 'cleaned_spdx#iscas-sbomtool#github#dpkp#kafka-python.json',
    'https://github.com/FxRayHughes/xiangtian-workbench': 'cleaned_spdx#iscas-sbomtool#github#FxRayHughes#xiangtian-workbench.json',
    'https://github.com/kerwincui/wumei-smart': 'cleaned_spdx#iscas-sbomtool#github#kerwincui#wumei-smart.json',
    'https://github.com/eth-sri/probabilistic-forecasts-attacks': 'cleaned_spdx#iscas-sbomtool#github#eth-sri#probabilistic-forecasts-attacks.json',
    'https://github.com/mtianyan/VueDjangoAntdProBookShop': 'cleaned_spdx#iscas-sbomtool#github#mtianyan#VueDjangoAntdProBookShop.json',
    'https://github.com/pytorch/pytorch': 'cleaned_spdx#iscas-sbomtool#github#pytorch#pytorch.json',
    'https://github.com/tensorflow/tensorflow': 'cleaned_spdx#iscas-sbomtool#github#tensorflow#tensorflow.json',
    'https://github.com/deepseek-ai/DeepSeek-V3': 'cleaned_spdx#iscas-sbomtool#github#deepseek-ai#DeepSeek-V3.json',
    'https://github.com/meta-llama/llama': 'cleaned_spdx#iscas-sbomtool#github#meta-llama#llama.json',
    'https://github.com/mistralai/mistral-inference': 'cleaned_spdx#iscas-sbomtool#github#mistralai#mistral-inference.json'
  };

  return repoPathMap[repoUrl] || null;
}

// 主函数：获取SBOM数据
export async function getSBOMData(repoId: string): Promise<{
  components: Component[];
  summary: SBOMSummary;
  pieData: PieData[];
  name: string;
} | null> {
  try {
    // 根据repoId获取仓库URL
    const repoUrl = getRepositoryUrlById(repoId);
    if (!repoUrl) {
      console.warn(`未找到仓库URL对应repoId: ${repoId}`);
      return null;
    }

    // 获取SBOM文件路径
    const sbomFilePath = getSBOMFilePath(repoUrl);
    if (!sbomFilePath) {
      console.warn(`未找到SBOM数据文件对应仓库: ${repoUrl}`);
      return null;
    }

    // 读取SBOM数据文件
    const response = await fetch(`/api/sbom-data?file=${encodeURIComponent(sbomFilePath)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch SBOM data: ${response.statusText}`);
    }

    const spdxData: SPDXDocument = await response.json();

    // 解析数据
    const { components, summary, pieData } = parseSPDXData(spdxData);

    // 获取仓库名称
    const name = getRepositoryName(repoUrl);

    return {
      components,
      summary,
      pieData,
      name
    };
  } catch (error) {
    console.error('Error loading SBOM data:', error);
    return null;
  }
}

// 辅助函数：从repo-ids.ts导入
function getRepositoryUrlById(repoId: string): string | null {
  const REPOSITORY_IDS: Record<string, string> = {
    'https://github.com/dpkp/kafka-python': 'repo-kafka-python',
    'https://github.com/FxRayHughes/xiangtian-workbench': 'repo-xiangtian-workbench',
    'https://github.com/kerwincui/wumei-smart': 'repo-wumei-smart',
    'https://github.com/eth-sri/probabilistic-forecasts-attacks': 'repo-probabilistic-forecasts',
    'https://github.com/mtianyan/VueDjangoAntdProBookShop': 'repo-vue-django-bookshop',
    'https://github.com/pytorch/pytorch': 'repo-pytorch',
    'https://github.com/tensorflow/tensorflow': 'repo-tensorflow',
    'https://github.com/deepseek-ai/DeepSeek-V3': 'repo-deepseek-v3',
    'https://github.com/meta-llama/llama': 'repo-llama',
    'https://github.com/mistralai/mistral-inference': 'repo-mistral-inference'
  };

  for (const [url, id] of Object.entries(REPOSITORY_IDS)) {
    if (id === repoId) {
      return url;
    }
  }
  return null;
}

function getRepositoryName(repoUrl: string): string {
  const REPOSITORY_NAMES: Record<string, string> = {
    'https://github.com/dpkp/kafka-python': 'Kafka Python',
    'https://github.com/FxRayHughes/xiangtian-workbench': 'Xiangtian Workbench',
    'https://github.com/kerwincui/wumei-smart': 'Wumei Smart',
    'https://github.com/eth-sri/probabilistic-forecasts-attacks': 'Probabilistic Forecasts Attacks',
    'https://github.com/mtianyan/VueDjangoAntdProBookShop': 'Vue Django BookShop',
    'https://github.com/pytorch/pytorch': 'PyTorch',
    'https://github.com/tensorflow/tensorflow': 'TensorFlow',
    'https://github.com/deepseek-ai/DeepSeek-V3': 'DeepSeek V3',
    'https://github.com/meta-llama/llama': 'Meta Llama',
    'https://github.com/mistralai/mistral-inference': 'Mistral Inference'
  };

  return REPOSITORY_NAMES[repoUrl] || repoUrl;
}