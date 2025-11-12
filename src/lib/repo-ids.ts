// 固定仓库的唯一标识符映射
export const REPOSITORY_IDS: Record<string, string> = {
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

// 仓库名称映射
export const REPOSITORY_NAMES: Record<string, string> = {
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

// 根据URL获取仓库ID
export function getRepositoryId(repoUrl: string): string {
  return REPOSITORY_IDS[repoUrl] || 'repo-pytorch'; // 默认使用PyTorch，避免自定义ID
}

// 根据URL获取仓库名称
export function getRepositoryName(repoUrl: string): string {
  return REPOSITORY_NAMES[repoUrl] || repoUrl;
}

// 根据ID获取仓库URL
export function getRepositoryUrlById(repoId: string): string | null {
  for (const [url, id] of Object.entries(REPOSITORY_IDS)) {
    if (id === repoId) {
      return url;
    }
  }
  return null;
}

// 检查是否为固定仓库
export function isFixedRepository(repoUrl: string): boolean {
  return repoUrl in REPOSITORY_IDS;
}

// 获取所有固定仓库列表
export function getFixedRepositories(): Array<{id: string, name: string, url: string}> {
  return Object.entries(REPOSITORY_NAMES).map(([url, name]) => ({
    id: REPOSITORY_IDS[url],
    name,
    url
  }));
}