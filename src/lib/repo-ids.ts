// 固定仓库的唯一标识符映射
export const REPOSITORY_IDS: Record<string, string> = {
  'https://github.com/meta-llama/llama': 'repo-llama-001',
  'https://github.com/pytorch/pytorch': 'repo-pytorch-002',
  'https://github.com/tensorflow/tensorflow': 'repo-tensorflow-003',
  'https://github.com/facebook/react': 'repo-react-004',
  'https://github.com/vuejs/vue': 'repo-vue-005',
  'https://github.com/angular/angular': 'repo-angular-006',
  'https://github.com/nodejs/node': 'repo-node-007',
  'https://github.com/kubernetes/kubernetes': 'repo-kubernetes-008',
  'https://github.com/docker/docker': 'repo-docker-009',
  'https://github.com/microsoft/vscode': 'repo-vscode-010'
};

// 仓库名称映射
export const REPOSITORY_NAMES: Record<string, string> = {
  'https://github.com/meta-llama/llama': 'Meta Llama',
  'https://github.com/pytorch/pytorch': 'PyTorch',
  'https://github.com/tensorflow/tensorflow': 'TensorFlow',
  'https://github.com/facebook/react': 'React',
  'https://github.com/vuejs/vue': 'Vue.js',
  'https://github.com/angular/angular': 'Angular',
  'https://github.com/nodejs/node': 'Node.js',
  'https://github.com/kubernetes/kubernetes': 'Kubernetes',
  'https://github.com/docker/docker': 'Docker',
  'https://github.com/microsoft/vscode': 'VS Code'
};

// 根据URL获取仓库ID
export function getRepositoryId(repoUrl: string): string {
  return REPOSITORY_IDS[repoUrl] || `repo-custom-${Date.now()}`;
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