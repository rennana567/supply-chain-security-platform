# 软件供应链安全分析平台 API 设计文档

本文档详细描述了 AI 驱动的软件供应链安全分析平台的前后端 API 接口设计，包括请求方法、URL 路径、请求参数和响应数据结构。前端代码中已使用 Mock 数据进行测试，实际开发时需替换为真实的 API 调用。

## 1. 概述

所有 API 均通过 `POST` 或 `GET` 方法访问，并遵循 RESTful 风格。请求和响应数据格式均为 JSON。

## 2. API 接口详情

### 2.1 SBOM 清单

**功能描述：** 用于扫描仓库或上传文件以生成 SBOM 清单，并获取扫描结果。

#### 2.1.1 启动 SBOM 扫描

*   **URL:** `/api/sbom/scan`
*   **方法:** `POST`
*   **请求体:**

    ```json
    {
      "repoUrl": "string", // 可选，GitHub/Gitee 仓库 URL
      "file": "File"       // 可选，上传的压缩包文件
    }
    ```

    *   `repoUrl` 和 `file` 至少提供一个。

*   **响应体:**

    ```json
    {
      "scanId": "string", // 扫描任务 ID
      "status": "string"  // 扫描状态，例如 "pending", "running"
    }
    ```

#### 2.1.2 获取 SBOM 扫描结果

*   **URL:** `/api/sbom/result?id={scanId}`
*   **方法:** `GET`
*   **查询参数:**
    *   `id`: `string` (必需) - 扫描任务 ID。
*   **响应体:**

    ```json
    {
      "components": [
        {
          "name": "string",    // 组件名称
          "version": "string", // 组件版本
          "purl": "string",    // Package URL
          "ecosystem": "string", // 生态系统 (npm, pypi, go等)
          "level": "string",   // 层级 (direct/transitive)
          "package": "string", // 包名
          "path": "string",    // 文件路径
          "license": "string", // 许可证
          "manager": "string"  // 包管理器 (npm, pip, go等)
        }
      ],
      "summary": {
        "total": "number", // 总组件数
        "npm": "number",   // npm 包数量
        "pip": "number",   // pip 包数量
        "go": "number",    // go 模块数量
        "other": "number"  // 其他包数量
      }
    }
    ```

### 2.2 许可证合规性检测

**功能描述：** 用于检测项目中的许可证冲突与未声明情况，并获取检测报告。

#### 2.2.1 启动许可证扫描

*   **URL:** `/api/license/scan`
*   **方法:** `POST`
*   **请求体:**

    ```json
    {
      "repoUrl": "string", // 可选，GitHub/Gitee 仓库 URL
      "file": "File"       // 可选，上传的压缩包文件
    }
    ```

*   **响应体:**

    ```json
    {
      "scanId": "string", // 扫描任务 ID
      "status": "string"  // 扫描状态
    }
    ```

#### 2.2.2 获取许可证扫描结果

*   **URL:** `/api/license/result?id={scanId}`
*   **方法:** `GET`
*   **查询参数:**
    *   `id`: `string` (必需) - 扫描任务 ID。
*   **响应体:**

    ```json
    {
      "compatibleLicenses": [
        {
          "license1": "string",    // 许可证1名称
          "license1Path": "string", // 许可证1文件路径
          "license2": "string",    // 许可证2名称
          "license2Path": "string", // 许可证2文件路径
          "conflictStatus": "string", // 冲突情况 (兼容/冲突)
          "compatibilityExplanation": "string" // 兼容性解释
        }
      ],
      "undeclaredLicenses": [
        {
          "name": "string",    // 组件名称
          "version": "string", // 组件版本
          "purl": "string",    // Package URL
          "ecosystem": "string", // 生态系统 (npm, pypi, go等)
          "level": "string",   // 层级 (direct/transitive)
          "package": "string", // 包名
          "manager": "string", // 包管理器
          "path": "string",    // 文件路径
          "license": "string"  // 许可证 (通常为 Unknown)
        }
      ],
      "summary": {
        "compatible": "number", // 兼容许可证数量
        "conflict": "number",   // 冲突许可证数量
        "undeclared": "number"  // 未声明许可证数量
      }
    }
    ```

### 2.3 漏洞检测

**功能描述：** 基于 SBOM 数据检测组件漏洞，并提供漏洞详情和修复建议。

#### 2.3.1 启动漏洞扫描

*   **URL:** `/api/vuln/scan`
*   **方法:** `POST`
*   **请求体:**

    ```json
    {
      "repoUrl": "string", // 可选，GitHub/Gitee 仓库 URL
      "sbomData": "object" // 可选，SBOM 数据，如果已生成 SBOM 可直接传入
    }
    ```

*   **响应体:**

    ```json
    {
      "scanId": "string", // 扫描任务 ID
      "status": "string"  // 扫描状态
    }
    ```

#### 2.3.2 获取漏洞扫描结果

*   **URL:** `/api/vuln/result?id={scanId}`
*   **方法:** `GET`
*   **查询参数:**
    *   `id`: `string` (必需) - 扫描任务 ID。
*   **响应体:**

    ```json
    {
      "vulnerabilities": [
        {
          "sequenceNumber": "number", // 序列号
          "description": "string",    // 漏洞描述
          "cweId": "string",      // CWE ID
          "filePath": "string",     // 文件路径
          "lineColumn": "string"    // 行:列
        }
      ],
      "summary": {
        "total": "number",    // 总漏洞数
        "high": "number",   // 高危漏洞数量
        "medium": "number", // 中危漏洞数量
        "low": "number"     // 低危漏洞数量
      }
    }
    ```

### 2.4 投毒风险检测

**功能描述：** 支持按需扫描和持续监测，展示任务状态和风险变化趋势。

#### 2.4.1 启动投毒风险扫描

*   **URL:** `/api/poison/scan`
*   **方法:** `POST`
*   **请求体:**

    ```json
    {
      "repoUrl": "string", // 可选，GitHub/Gitee 仓库 URL
      "mode": "string"     // 扫描模式 ("ondemand", "continuous")
    }
    ```

*   **响应体:**

    ```json
    {
      "taskId": "string", // 任务 ID
      "status": "string"  // 任务状态
    }
    ```

#### 2.4.2 获取投毒风险扫描任务状态

*   **URL:** `/api/poison/scan/:id`
*   **方法:** `GET`
*   **路径参数:**
    *   `id`: `string` (必需) - 任务 ID。
*   **响应体:**

    ```json
    {
      "id": "string",         // 任务 ID
      "status": "string",     // 任务状态 (running, completed, failed)
      "progress": "number",   // 任务进度 (0-100)
      "riskLevel": "string"   // 风险等级 (high, medium, low, none)
    }
    ```

#### 2.4.3 获取投毒风险扫描结果

*   **URL:** `/api/poison/result?scan={scanId}`
*   **方法:** `GET`
*   **查询参数:**
    *   `scan`: `string` (必需) - 扫描任务 ID。
*   **响应体:**

    ```json
    {
      "tasks": [
        {
          "id": "string",
          "status": "string",
          "progress": "number",
          "riskLevel": "string"
        }
      ],
      "summary": {
        "malicious": "number", // 恶意包数量
        "benign": "number",    // 正常包数量
        "avgTime": "number"    // 平均扫描耗时
      }
    }
    ```

#### 2.4.4 获取投毒风险项详情

*   **URL:** `/api/poison/item/:itemId`
*   **方法:** `GET`
*   **路径参数:**
    *   `itemId`: `string` (必需) - 风险项 ID。
*   **响应体:**

    ```json
    {
      "id": "string",
      "packageName": "string",
      "version": "string",
      "riskScore": "number",
      "details": "string" // 详细风险描述
    }
    ```

### 2.5 开发者画像

**功能描述：** 用于分析 GitHub/Gitee 开发者，生成开发者画像和开源简历。

#### 2.5.1 启动开发者分析

*   **URL:** `/api/developer/analyze`
*   **方法:** `POST`
*   **请求体:**

    ```json
    {
      "userId": "string",    // GitHub/Gitee 用户 ID
      "platform": "string" // 平台 (github, gitee)
    }
    ```

*   **响应体:**

    ```json
    {
      "analysisId": "string", // 分析任务 ID
      "status": "string"    // 分析状态
    }
    ```

#### 2.5.2 获取开发者画像

*   **URL:** `/api/developer/profile?id={userId}`
*   **方法:** `GET`
*   **查询参数:**
    *   `id`: `string` (必需) - 用户 ID。
*   **响应体:**

    ```json
    {
      "info": {
        "name": "string",      // 开发者姓名/昵称
        "org": "string",       // 所属组织
        "location": "string",  // 所在地
        "profileUrl": "string" // 个人主页 URL
      },
      "stats": {
        "commits": "number", // 提交数
        "prs": "number",     // Pull Request 数
        "reviews": "number"  // 代码评审数
      },
      "skills": {
        "language1": "number", // 技能分布 (百分比)
        "language2": "number"
      },
      "activity": [
        {
          "date": "string",    // 日期
          "commits": "number"  // 当天提交数
        }
      ]
    }
    ```

## 3. 前端 Mock 数据使用说明

在 `src/mocks/data.ts` 文件中，我们定义了所有模块的 Mock 数据。这些数据被前端页面用于展示，以便在后端 API 未准备好时进行开发和测试。

**关于 3D 饼图和首页评分图的数据结构：**

*   **3D 饼图 (`PieChart3D`)**：该组件接收一个 `data` 数组，其结构为 `[{ name: string, value: number, color: string }]`。后端 API 返回的 `summary` 对象（例如 SBOM 的 `summary` 或许可证的 `summary`）已经包含了 `name` 和 `value`（数量）信息，前端会根据这些数据自行构造 `PieData` 数组并分配颜色，因此后端 API 无需额外修改。
*   **首页评分图 (`ScoreGauge`)**：该组件接收 `score: number` 和 `title?: string`。首页的 `scanResult.overallScore` 字段已直接提供所需的分数，后端 API 无需额外修改。

**替换为真实 API 的步骤：**

1.  **配置 API 基础 URL:** 在 `.env.local` 文件中设置 `NEXT_PUBLIC_API_BASE_URL` 环境变量，指向您的后端 API 地址。
    ```
    NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
    ```
2.  **修改 `src/lib/api.ts`:** 确保 `request` 函数能够正确地向您的后端发送请求并处理响应。
3.  **更新页面组件:** 在每个页面的 `useEffect` 钩子中，将模拟的 `setTimeout` 或直接使用 `mockData` 的部分替换为对 `src/lib/api.ts` 中封装的 `api` 对象的调用。

    **示例 (以 SBOM 页面为例):**

    **Mock 数据部分 (需要替换):**
    ```typescript
    useEffect(() => {
      const mockData = { /* ... */ };
      setComponents(mockData.components);
      setSummary(mockData.summary);
    }, []);
    ```

    **替换为真实 API 调用:**
    ```typescript
    import { api } from "@/lib/api";

    useEffect(() => {
      const fetchSbomResult = async () => {
        try {
          // 假设您有一个 scanId，或者需要先调用 scan API 获取
          const result = await api.sbom.getResult("your-scan-id"); 
          setComponents(result.components);
          setSummary(result.summary);
        } catch (error) {
          console.error("Failed to fetch SBOM data:", error);
        }
      };
      fetchSbomResult();
    }, []);
    ```

请根据您的后端实现，调整 `api` 调用的参数和处理逻辑。

