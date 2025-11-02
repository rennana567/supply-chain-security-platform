// 模拟仓库数据 - 用于前端展示
// TODO: 后续需要替换为真实的后端API调用

export interface RepoMetric {
  metric: string;
  projects: string[];
  chart: 'line' | 'bar' | 'pie';
  time_unit: string;
  data: {
    totals?: Record<string, number>;
    buckets: Array<{
      bucket: string;
      [key: string]: number | string | null;
    }>;
  };
  meta?: {
    presentation: {
      title: string;
      description: string;
      y_label: string;
      unit: string;
    };
  };
}

export interface RepoAnalysisData {
  repoUrl: string;
  repoName: string;
  metrics: {
    commitTrend: RepoMetric;
    growthRate: RepoMetric;
    contributorActivity: RepoMetric;
    languageDistribution: RepoMetric;
  };
  summary: {
    totalCommits: number;
    totalContributors: number;
    mainLanguage: string;
    lastUpdated: string;
    healthScore: number;
  };
}

// 生成模拟的提交趋势数据
const generateCommitTrendData = (repoName: string, baseCommits: number): RepoMetric => {
  const months = ['2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06',
                 '2023-07', '2023-08', '2023-09', '2023-10', '2023-11', '2023-12'];

  const buckets = months.map(month => {
    // 生成一些随机波动
    const variation = Math.random() * 0.4 - 0.2; // -20% 到 +20%
    const commits = Math.floor(baseCommits * (1 + variation));

    return {
      bucket: month,
      [repoName]: commits
    };
  });

  return {
    metric: 'project_commit_count_compare',
    projects: [repoName],
    chart: 'line',
    time_unit: 'month',
    data: {
      totals: { [repoName]: baseCommits * 12 },
      buckets
    },
    meta: {
      presentation: {
        title: `${repoName} 提交趋势`,
        description: `${repoName} 仓库的月度提交数量变化趋势`,
        y_label: '提交次数',
        unit: 'count'
      }
    }
  };
};

// 生成模拟的增长率数据
const generateGrowthRateData = (repoName: string): RepoMetric => {
  const periods = ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023'];

  const buckets = periods.map(period => ({
    bucket: period,
    [repoName]: (Math.random() * 0.3 - 0.1).toFixed(4) // -10% 到 +20%
  }));

  return {
    metric: 'project_commit_growth_rate_compare',
    projects: [repoName],
    chart: 'line',
    time_unit: 'period',
    data: {
      buckets
    },
    meta: {
      presentation: {
        title: `${repoName} 增长率趋势`,
        description: `${repoName} 仓库的季度增长率变化`,
        y_label: '增长率',
        unit: 'percentage'
      }
    }
  };
};

// 生成模拟的贡献者活动数据
const generateContributorActivity = (repoName: string, baseContributors: number): RepoMetric => {
  const months = ['2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06'];

  const buckets = months.map(month => ({
    bucket: month,
    [repoName]: Math.floor(baseContributors * (0.8 + Math.random() * 0.4))
  }));

  return {
    metric: 'contributor_activity',
    projects: [repoName],
    chart: 'bar',
    time_unit: 'month',
    data: {
      buckets
    },
    meta: {
      presentation: {
        title: `${repoName} 贡献者活跃度`,
        description: `${repoName} 仓库的月度活跃贡献者数量`,
        y_label: '活跃贡献者',
        unit: 'count'
      }
    }
  };
};

// 生成模拟的语言分布数据
const generateLanguageDistribution = (repoName: string, languages: string[]): RepoMetric => {
  const total = 100;
  const distribution: Record<string, number> = {};
  let remaining = total;

  // 随机分配百分比
  languages.forEach((lang, index) => {
    if (index === languages.length - 1) {
      distribution[lang] = remaining;
    } else {
      const percent = Math.floor(Math.random() * (remaining / 2)) + 10;
      distribution[lang] = percent;
      remaining -= percent;
    }
  });

  const buckets = Object.entries(distribution).map(([language, percentage]) => ({
    bucket: language,
    [repoName]: percentage
  }));

  return {
    metric: 'language_distribution',
    projects: [repoName],
    chart: 'pie',
    time_unit: 'static',
    data: {
      buckets
    },
    meta: {
      presentation: {
        title: `${repoName} 语言分布`,
        description: `${repoName} 仓库的编程语言使用比例`,
        y_label: '使用比例',
        unit: 'percentage'
      }
    }
  };
};

// 10个目标仓库的模拟数据
export const MOCK_REPO_DATA: Record<string, RepoAnalysisData> = {
  'https://github.com/dpkp/kafka-python': {
    repoUrl: 'https://github.com/dpkp/kafka-python',
    repoName: 'dpkp/kafka-python',
    metrics: {
      commitTrend: generateCommitTrendData('dpkp/kafka-python', 150),
      growthRate: generateGrowthRateData('dpkp/kafka-python'),
      contributorActivity: generateContributorActivity('dpkp/kafka-python', 25),
      languageDistribution: generateLanguageDistribution('dpkp/kafka-python', ['Python', 'Shell', 'Dockerfile'])
    },
    summary: {
      totalCommits: 1800,
      totalContributors: 150,
      mainLanguage: 'Python',
      lastUpdated: '2024-01-15',
      healthScore: 85
    }
  },
  'https://github.com/FxRayHughes/xiangtian-workbench': {
    repoUrl: 'https://github.com/FxRayHughes/xiangtian-workbench',
    repoName: 'FxRayHughes/xiangtian-workbench',
    metrics: {
      commitTrend: generateCommitTrendData('FxRayHughes/xiangtian-workbench', 80),
      growthRate: generateGrowthRateData('FxRayHughes/xiangtian-workbench'),
      contributorActivity: generateContributorActivity('FxRayHughes/xiangtian-workbench', 8),
      languageDistribution: generateLanguageDistribution('FxRayHughes/xiangtian-workbench', ['Python', 'JavaScript', 'CSS'])
    },
    summary: {
      totalCommits: 960,
      totalContributors: 12,
      mainLanguage: 'Python',
      lastUpdated: '2024-01-10',
      healthScore: 72
    }
  },
  'https://github.com/kerwincui/wumei-smart': {
    repoUrl: 'https://github.com/kerwincui/wumei-smart',
    repoName: 'kerwincui/wumei-smart',
    metrics: {
      commitTrend: generateCommitTrendData('kerwincui/wumei-smart', 120),
      growthRate: generateGrowthRateData('kerwincui/wumei-smart'),
      contributorActivity: generateContributorActivity('kerwincui/wumei-smart', 15),
      languageDistribution: generateLanguageDistribution('kerwincui/wumei-smart', ['Java', 'HTML', 'JavaScript'])
    },
    summary: {
      totalCommits: 1440,
      totalContributors: 18,
      mainLanguage: 'Java',
      lastUpdated: '2024-01-12',
      healthScore: 78
    }
  },
  'https://github.com/eth-sri/probabilistic-forecasts-attacks': {
    repoUrl: 'https://github.com/eth-sri/probabilistic-forecasts-attacks',
    repoName: 'eth-sri/probabilistic-forecasts-attacks',
    metrics: {
      commitTrend: generateCommitTrendData('eth-sri/probabilistic-forecasts-attacks', 60),
      growthRate: generateGrowthRateData('eth-sri/probabilistic-forecasts-attacks'),
      contributorActivity: generateContributorActivity('eth-sri/probabilistic-forecasts-attacks', 6),
      languageDistribution: generateLanguageDistribution('eth-sri/probabilistic-forecasts-attacks', ['Python', 'Jupyter Notebook'])
    },
    summary: {
      totalCommits: 720,
      totalContributors: 8,
      mainLanguage: 'Python',
      lastUpdated: '2024-01-08',
      healthScore: 68
    }
  },
  'https://github.com/mtianyan/VueDjangoAntdProBookShop': {
    repoUrl: 'https://github.com/mtianyan/VueDjangoAntdProBookShop',
    repoName: 'mtianyan/VueDjangoAntdProBookShop',
    metrics: {
      commitTrend: generateCommitTrendData('mtianyan/VueDjangoAntdProBookShop', 100),
      growthRate: generateGrowthRateData('mtianyan/VueDjangoAntdProBookShop'),
      contributorActivity: generateContributorActivity('mtianyan/VueDjangoAntdProBookShop', 10),
      languageDistribution: generateLanguageDistribution('mtianyan/VueDjangoAntdProBookShop', ['Vue', 'Python', 'JavaScript', 'CSS'])
    },
    summary: {
      totalCommits: 1200,
      totalContributors: 15,
      mainLanguage: 'Vue',
      lastUpdated: '2024-01-14',
      healthScore: 75
    }
  },
  'https://github.com/pytorch/pytorch': {
    repoUrl: 'https://github.com/pytorch/pytorch',
    repoName: 'pytorch/pytorch',
    metrics: {
      commitTrend: generateCommitTrendData('pytorch/pytorch', 800),
      growthRate: generateGrowthRateData('pytorch/pytorch'),
      contributorActivity: generateContributorActivity('pytorch/pytorch', 120),
      languageDistribution: generateLanguageDistribution('pytorch/pytorch', ['C++', 'Python', 'CUDA', 'CMake'])
    },
    summary: {
      totalCommits: 9600,
      totalContributors: 1500,
      mainLanguage: 'C++',
      lastUpdated: '2024-01-20',
      healthScore: 92
    }
  },
  'https://github.com/tensorflow/tensorflow': {
    repoUrl: 'https://github.com/tensorflow/tensorflow',
    repoName: 'tensorflow/tensorflow',
    metrics: {
      commitTrend: generateCommitTrendData('tensorflow/tensorflow', 700),
      growthRate: generateGrowthRateData('tensorflow/tensorflow'),
      contributorActivity: generateContributorActivity('tensorflow/tensorflow', 100),
      languageDistribution: generateLanguageDistribution('tensorflow/tensorflow', ['C++', 'Python', 'Starlark', 'Java'])
    },
    summary: {
      totalCommits: 8400,
      totalContributors: 3200,
      mainLanguage: 'C++',
      lastUpdated: '2024-01-18',
      healthScore: 90
    }
  },
  'https://github.com/deepseek-ai/DeepSeek-V3': {
    repoUrl: 'https://github.com/deepseek-ai/DeepSeek-V3',
    repoName: 'deepseek-ai/DeepSeek-V3',
    metrics: {
      commitTrend: generateCommitTrendData('deepseek-ai/DeepSeek-V3', 200),
      growthRate: generateGrowthRateData('deepseek-ai/DeepSeek-V3'),
      contributorActivity: generateContributorActivity('deepseek-ai/DeepSeek-V3', 30),
      languageDistribution: generateLanguageDistribution('deepseek-ai/DeepSeek-V3', ['Python', 'C++', 'Shell', 'Dockerfile'])
    },
    summary: {
      totalCommits: 2400,
      totalContributors: 45,
      mainLanguage: 'Python',
      lastUpdated: '2024-01-16',
      healthScore: 82
    }
  },
  'https://github.com/meta-llama/llama': {
    repoUrl: 'https://github.com/meta-llama/llama',
    repoName: 'meta-llama/llama',
    metrics: {
      commitTrend: generateCommitTrendData('meta-llama/llama', 300),
      growthRate: generateGrowthRateData('meta-llama/llama'),
      contributorActivity: generateContributorActivity('meta-llama/llama', 40),
      languageDistribution: generateLanguageDistribution('meta-llama/llama', ['Python', 'C++', 'Markdown', 'Shell'])
    },
    summary: {
      totalCommits: 3600,
      totalContributors: 80,
      mainLanguage: 'Python',
      lastUpdated: '2024-01-19',
      healthScore: 88
    }
  },
  'https://github.com/mistralai/mistral-inference': {
    repoUrl: 'https://github.com/mistralai/mistral-inference',
    repoName: 'mistralai/mistral-inference',
    metrics: {
      commitTrend: generateCommitTrendData('mistralai/mistral-inference', 250),
      growthRate: generateGrowthRateData('mistralai/mistral-inference'),
      contributorActivity: generateContributorActivity('mistralai/mistral-inference', 35),
      languageDistribution: generateLanguageDistribution('mistralai/mistral-inference', ['Python', 'C++', 'Rust', 'Shell'])
    },
    summary: {
      totalCommits: 3000,
      totalContributors: 60,
      mainLanguage: 'Python',
      lastUpdated: '2024-01-17',
      healthScore: 86
    }
  }
};

// 获取仓库数据的函数
export const getRepoData = (repoUrl: string): RepoAnalysisData | null => {
  return MOCK_REPO_DATA[repoUrl] || null;
};

// 获取所有仓库列表
export const getAllRepos = () => {
  return Object.values(MOCK_REPO_DATA).map(data => ({
    url: data.repoUrl,
    name: data.repoName,
    summary: data.summary
  }));
};