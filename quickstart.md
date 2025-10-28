# 软件供应链安全分析平台 - 运行说明

## 项目概述

本项目是一个基于 React + Next.js + Tailwind CSS 的 AI 驱动的软件供应链安全分析平台前端应用。项目已集成 3D 饼图（使用 `@react-three/fiber`）和首页评分图（使用 ECharts），提供了丰富的数据可视化和交互体验。

## 环境要求

*   **Node.js:** 版本 18.x 或更高
*   **包管理器:** pnpm（推荐）或 npm

## 安装步骤

1.  **解压项目文件**

    将 `supply-chain-security-platform-updated.zip` 解压到您的工作目录。

    ```bash
    unzip supply-chain-security-platform-updated.zip
    cd supply-chain-security-platform
    ```

2.  **安装依赖**

    使用 pnpm 安装项目依赖（推荐）：

    ```bash
    pnpm install
    ```

    或者使用 npm：

    ```bash
    npm install
    ```

    **重要提示：** 安装依赖时可能会看到关于 `echarts-for-react` 的 peer dependency 警告，这是因为 `echarts-for-react` 官方支持的是 ECharts 5.x，而我们使用的是 ECharts 6.x。这个警告不会影响项目的正常运行，可以忽略。

3.  **启动开发服务器**

    ```bash
    pnpm dev
    ```

    或者使用 npm：

    ```bash
    npm run dev
    ```

4.  **访问应用**

    在浏览器中打开 `http://localhost:3000`，即可查看应用。

## 主要功能页面

*   **首页 (`/`)**: 输入仓库 URL 或上传压缩包，启动扫描任务，展示安全总览（包含 ECharts 评分图）和五个模块入口卡片。
*   **SBOM 清单 (`/sbom`)**: 显示依赖清单表格，展示包管理器占比 3D 饼图，支持导出 CSV/JSON。
*   **许可证合规性检测 (`/license`)**: 检测许可证冲突与未声明，展示 3D 饼图与筛选结果表，支持导出 CSV 报告。
*   **漏洞检测 (`/vulnerability`)**: 基于 SBOM 数据检测组件漏洞，展示漏洞列表和严重程度分布。
*   **投毒风险检测 (`/poison`)**: 支持按需扫描和持续监测，展示任务状态和风险变化趋势。
*   **开发者画像 (`/developer`)**: 输入 GitHub/Gitee 用户 ID，展示开发者活跃度热力图、技能分布、贡献趋势。

## 关键组件说明

*   **`PieChart3D` (`src/components/PieChart3D.tsx`)**: 可 360° 旋转且具有层次落差的 3D 饼图组件，基于 `@react-three/fiber` 和 `three.js` 实现。
    *   **使用方法**: `<PieChart3D data={pieData} width={350} height={250} />`
    *   **数据格式**: `pieData` 是一个数组，每个元素包含 `{ name: string, value: number, color: string }`。
    *   **交互**: 支持鼠标拖拽旋转和滚轮缩放。

*   **`ScoreGauge` (`src/components/ScoreGauge.tsx`)**: 首页评分图组件，基于 ECharts 实现，完全复刻了您提供的设计。
    *   **使用方法**: `<ScoreGauge score={82} title="综合评分" width={350} height={350} />`
    *   **参数**: `score` 为 0-100 的数字，`title` 为可选的标题文本。

## 数据说明

当前所有页面均使用 Mock 数据进行展示。在 `src/mocks/data.ts` 中定义了各模块的模拟数据。

**替换为真实 API 的步骤：**

1.  在 `.env.local` 文件中设置 `NEXT_PUBLIC_API_BASE_URL` 环境变量，指向您的后端 API 地址。
2.  修改 `src/lib/api.ts` 中的 `request` 函数，确保能够正确地向您的后端发送请求并处理响应。
3.  在每个页面的 `useEffect` 钩子中，将使用 `mockData` 的部分替换为对 `src/lib/api.ts` 中封装的 `api` 对象的调用。

详细的 API 设计请参考 `API_DESIGN.md` 文档。

## 常见问题

**Q: 3D 饼图或评分图未显示？**

A: 请确保：
1.  您已经正确安装了所有依赖（`pnpm install` 或 `npm install`）。
2.  开发服务器正在运行（`pnpm dev` 或 `npm run dev`）。
3.  浏览器控制台没有报错信息。如果有报错，请检查是否是依赖安装不完整或版本冲突。
4.  您使用的是最新解压的项目代码，而不是之前的旧版本。

**Q: 看到 `echarts-for-react` 的 peer dependency 警告？**

A: 这是正常的，因为 `echarts-for-react` 官方支持的是 ECharts 5.x，而我们使用的是 ECharts 6.x。这个警告不会影响项目的正常运行，可以忽略。如果您希望消除警告，可以考虑使用 `--legacy-peer-deps` 标志进行安装，或者直接在代码中使用 ECharts 而不通过 `echarts-for-react`。

**Q: 如何查看 3D 饼图的交互效果？**

A: 在 SBOM 清单页或许可证合规性检测页，找到右侧的 3D 饼图卡片。您可以：
*   **拖拽鼠标**: 旋转 3D 饼图。
*   **滚轮滚动**: 缩放 3D 饼图。
*   **观察层次落差**: 数据值越大的扇形，高度越高。

## 技术栈

*   **前端框架**: React 18, Next.js 15
*   **样式**: Tailwind CSS
*   **图表库**: Recharts, ECharts, @react-three/fiber, @react-three/drei, three.js
*   **状态管理**: Zustand
*   **语言**: TypeScript

## 联系方式

如有任何问题或建议,请随时联系开发团队。

