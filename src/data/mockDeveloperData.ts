// 模拟开发者数据 - 基于chart项目的数据格式

export const MOCK_DEVELOPER_CHART_DATA = {
  commitTrend: {
    metric: "developer_commit_trend",
    projects: ["zhangsan"],
    chart: "line" as const,
    time_unit: "month",
    data: {
      totals: { "zhangsan": 1250 },
      buckets: [
        { "bucket": "2024-01", "zhangsan": 45 },
        { "bucket": "2024-02", "zhangsan": 52 },
        { "bucket": "2024-03", "zhangsan": 38 },
        { "bucket": "2024-04", "zhangsan": 67 },
        { "bucket": "2024-05", "zhangsan": 89 },
        { "bucket": "2024-06", "zhangsan": 76 },
        { "bucket": "2024-07", "zhangsan": 94 },
        { "bucket": "2024-08", "zhangsan": 82 },
        { "bucket": "2024-09", "zhangsan": 105 },
        { "bucket": "2024-10", "zhangsan": 98 },
        { "bucket": "2024-11", "zhangsan": 112 },
        { "bucket": "2024-12", "zhangsan": 87 },
        { "bucket": "2025-01", "zhangsan": 95 },
        { "bucket": "2025-02", "zhangsan": 78 },
        { "bucket": "2025-03", "zhangsan": 121 },
        { "bucket": "2025-04", "zhangsan": 108 },
        { "bucket": "2025-05", "zhangsan": 92 },
        { "bucket": "2025-06", "zhangsan": 134 },
        { "bucket": "2025-07", "zhangsan": 116 },
        { "bucket": "2025-08", "zhangsan": 102 },
        { "bucket": "2025-09", "zhangsan": 145 },
        { "bucket": "2025-10", "zhangsan": 128 }
      ]
    },
    meta: {
      presentation: {
        title: "开发者提交趋势",
        description: "开发者月度提交数量变化趋势",
        y_label: "提交次数",
        unit: "count"
      }
    }
  },
  prActivity: {
    metric: "developer_pr_activity",
    projects: ["zhangsan"],
    chart: "line" as const,
    time_unit: "month",
    data: {
      totals: { "zhangsan": 156 },
      buckets: [
        { "bucket": "2024-01", "zhangsan": 8 },
        { "bucket": "2024-02", "zhangsan": 12 },
        { "bucket": "2024-03", "zhangsan": 6 },
        { "bucket": "2024-04", "zhangsan": 14 },
        { "bucket": "2024-05", "zhangsan": 18 },
        { "bucket": "2024-06", "zhangsan": 11 },
        { "bucket": "2024-07", "zhangsan": 16 },
        { "bucket": "2024-08", "zhangsan": 13 },
        { "bucket": "2024-09", "zhangsan": 19 },
        { "bucket": "2024-10", "zhangsan": 15 },
        { "bucket": "2024-11", "zhangsan": 21 },
        { "bucket": "2024-12", "zhangsan": 9 },
        { "bucket": "2025-01", "zhangsan": 17 },
        { "bucket": "2025-02", "zhangsan": 10 },
        { "bucket": "2025-03", "zhangsan": 22 }
      ]
    },
    meta: {
      presentation: {
        title: "PR活动趋势",
        description: "开发者月度PR创建和合并数量",
        y_label: "PR数量",
        unit: "count"
      }
    }
  }
};

export const MOCK_COMMUNITY_CHART_DATA = {
  commitTrend: {
    metric: "community_commit_trend",
    projects: ["pytorch/pytorch", "tensorflow/tensorflow"],
    chart: "line" as const,
    time_unit: "month",
    data: {
      totals: { "pytorch/pytorch": 93863, "tensorflow/tensorflow": 185232 },
      buckets: [
        { "bucket": "2024-01", "pytorch/pytorch": 1129, "tensorflow/tensorflow": 1344 },
        { "bucket": "2024-02", "pytorch/pytorch": 1098, "tensorflow/tensorflow": 1769 },
        { "bucket": "2024-03", "pytorch/pytorch": 1147, "tensorflow/tensorflow": 1355 },
        { "bucket": "2024-04", "pytorch/pytorch": 1255, "tensorflow/tensorflow": 1361 },
        { "bucket": "2024-05", "pytorch/pytorch": 1288, "tensorflow/tensorflow": 1534 },
        { "bucket": "2024-06", "pytorch/pytorch": 1255, "tensorflow/tensorflow": 1146 },
        { "bucket": "2024-07", "pytorch/pytorch": 1438, "tensorflow/tensorflow": 1368 },
        { "bucket": "2024-08", "pytorch/pytorch": 1473, "tensorflow/tensorflow": 1338 },
        { "bucket": "2024-09", "pytorch/pytorch": 1045, "tensorflow/tensorflow": 1215 },
        { "bucket": "2024-10", "pytorch/pytorch": 1358, "tensorflow/tensorflow": 1411 },
        { "bucket": "2024-11", "pytorch/pytorch": 1258, "tensorflow/tensorflow": 1115 },
        { "bucket": "2024-12", "pytorch/pytorch": 1151, "tensorflow/tensorflow": 1242 }
      ]
    },
    meta: {
      presentation: {
        title: "社区提交趋势对比",
        description: "多个仓库的月度提交数量对比",
        y_label: "提交次数",
        unit: "count"
      }
    }
  },
  growthRate: {
    metric: "community_growth_rate",
    projects: ["pytorch/pytorch", "tensorflow/tensorflow"],
    chart: "line" as const,
    time_unit: "quarter",
    data: {
      buckets: [
        { "bucket": "Q1 2024", "pytorch/pytorch": 0.12, "tensorflow/tensorflow": 0.08 },
        { "bucket": "Q2 2024", "pytorch/pytorch": 0.15, "tensorflow/tensorflow": 0.11 },
        { "bucket": "Q3 2024", "pytorch/pytorch": 0.18, "tensorflow/tensorflow": 0.09 },
        { "bucket": "Q4 2024", "pytorch/pytorch": 0.14, "tensorflow/tensorflow": 0.13 }
      ]
    },
    meta: {
      presentation: {
        title: "社区增长率对比",
        description: "多个仓库的季度增长率对比",
        y_label: "增长率",
        unit: "percentage"
      }
    }
  }
};