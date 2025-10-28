# SBOM 实现指南与规范文档

## 概述

本文档详细说明了软件供应链安全平台的 SBOM（Software Bill of Materials）功能实现规范，包括输入格式、输出格式、API 设计和功能增强方案。

## 1. 输入格式支持

### 1.1 Docker 形式
- **Docker 镜像名**：前端输入字符串，后端通过 `docker pull` 获取镜像
  - 示例：`registry.example.com/myapp:v1.0.0`
- **Docker image TAR/SIF 文件**：前端输入文件路径，后端直接读取
  - 支持格式：`.tar`, `.tar.gz`, `.sif`

### 1.2 文件系统形式
- **文件夹路径**：后端直接读取用户上传的文件
  - 支持扫描项目根目录下的依赖文件
- **压缩包文件路径**：前端输入字符串，后端解压后分析
  - 支持格式：`.zip`, `.tar.gz`, `.rar`

### 1.3 参数配置
- **软件名称**：手动指定被分析软件的名称
- **软件版本**：手动指定被分析软件的版本
- **Docker Registry**：手动指定 Docker 镜像的 registry（安全风险提示）

## 2. 输出格式规范

### 2.1 支持的 SBOM 格式
- **CycloneDX JSON (1.6)**：标准格式，支持完整的组件信息
- **SPDX JSON (2.3)**：标准格式，前端使用 SPDX 2.3 兼容模式

### 2.2 输出文件命名
后端在输出时指定唯一文件名路径，格式：
```
{sbom_type}_{timestamp}_{uuid}.{format}
```
示例：`spdx_20250101_123456_abcdef.json`

### 2.3 SPDX JSON 输出结构

```json
{
  "spdxVersion": "SPDX-2.3",
  "dataLicense": "CC0-1.0",
  "SPDXID": "SPDXRef-DOCUMENT",
  "name": "被分析软件名称",
  "creationInfo": {
    "licenseListVersion": "3.27",
    "creators": [
      "Organization: 供应链安全平台",
      "Tool: syft-1.33.0"
    ],
    "created": "2025-01-01T00:00:00Z"
  },
  "packages": [
    {
      "name": "组件名称",
      "SPDXID": "SPDXRef-Package-{type}-{name}-{hash}",
      "versionInfo": "组件版本",
      "sourceInfo": "组件来源信息",
      "externalRefs": [
        {
          "referenceCategory": "SECURITY",
          "referenceType": "cpe23Type",
          "referenceLocator": "cpe:2.3:a:vendor:package:version:*:*:*:*:*:*:*"
        },
        {
          "referenceCategory": "PACKAGE-MANAGER",
          "referenceType": "purl",
          "referenceLocator": "pkg:{type}/{vendor}/{package}@{version}"
        }
      ]
    }
  ],
  "relationships": [
    {
      "spdxElementId": "SPDXRef-DocumentRoot-Directory-{hash}",
      "relatedSpdxElement": "SPDXRef-Package-{type}-{name}-{hash}",
      "relationshipType": "CONTAINS"
    },
    {
      "spdxElementId": "SPDXRef-DOCUMENT",
      "relatedSpdxElement": "SPDXRef-DocumentRoot-Directory-{hash}",
      "relationshipType": "DESCRIBES"
    },
    {
      "spdxElementId": "SPDXRef-Package-parent",
      "relatedSpdxElement": "SPDXRef-Package-child",
      "relationshipType": "DEPENDENCY_OF"
    }
  ]
}
```

## 3. 功能增强方案

### 3.1 包管理器文件扫描增强
支持以下包管理器配置文件：
- **Node.js**: `package.json`, `package-lock.json`, `yarn.lock`
- **Python**: `requirements.txt`, `Pipfile`, `Pipfile.lock`, `pyproject.toml`
- **Go**: `go.mod`, `go.sum`
- **Java**: `pom.xml`, `build.gradle`, `build.gradle.kts`
- **Rust**: `Cargo.toml`, `Cargo.lock`
- **PHP**: `composer.json`, `composer.lock`

### 3.2 许可证信息增强
- **与源图交互**：通过 API 接口补充许可证信息
- **自动检测**：扫描源代码中的许可证声明
- **冲突检测**：识别许可证兼容性问题

### 3.3 漏洞信息集成
- **OSV.dev 集成**：与 osv.dev 交互获取漏洞信息
- **动态更新**：构建可动态更新的漏洞库
- **CVE 映射**：将组件与 CVE 漏洞关联

### 3.4 传递依赖分析
- **层级依赖图**：构建完整的依赖关系图
- **传递依赖识别**：识别间接依赖组件
- **依赖冲突检测**：发现版本冲突问题

## 4. API 设计规范

### 4.1 SBOM 扫描 API

#### POST /api/sbom/scan
**请求体：**
```json
{
  "inputType": "docker|folder|archive",
  "inputValue": "镜像名/文件夹路径/压缩包路径",
  "softwareName": "可选软件名称",
  "softwareVersion": "可选软件版本",
  "outputFormats": ["spdx-json", "cyclonedx-json"],
  "options": {
    "includeTransitiveDeps": true,
    "scanLicenses": true,
    "scanVulnerabilities": true
  }
}
```

**响应体：**
```json
{
  "scanId": "唯一扫描ID",
  "status": "pending|running|completed|failed",
  "estimatedTime": "预估完成时间"
}
```

#### GET /api/sbom/result?id={scanId}
**响应体：**
```json
{
  "scanId": "扫描ID",
  "status": "扫描状态",
  "results": {
    "spdx": "SPDX格式SBOM文件路径",
    "cyclonedx": "CycloneDX格式SBOM文件路径"
  },
  "summary": {
    "totalComponents": 123,
    "directDependencies": 45,
    "transitiveDependencies": 78,
    "packageManagers": ["npm", "pip", "go"],
    "licensesFound": 15,
    "vulnerabilitiesFound": 3
  },
  "components": [
    {
      "name": "组件名",
      "version": "版本",
      "purl": "Package URL",
      "ecosystem": "生态系统",
      "level": "direct|transitive",
      "license": "许可证",
      "vulnerabilities": ["CVE-2023-12345"],
      "filePath": "文件路径"
    }
  ]
}
```

## 5. 后端实现建议

### 5.1 技术栈选择
- **SBOM 生成工具**：Syft、Trivy、Dependency-Track
- **容器分析**：Docker SDK、Podman
- **包管理器解析**：各语言专用解析器
- **漏洞数据库**：OSV.dev、NVD、GitHub Advisory

### 5.2 架构设计
```
前端 → API Gateway → SBOM 服务 → 包管理器解析器 → 漏洞扫描器 → 许可证检测器
```

### 5.3 性能优化
- **异步处理**：长时间扫描任务使用异步队列
- **缓存机制**：缓存常用组件的漏洞信息
- **增量扫描**：支持增量更新 SBOM
- **并行处理**：多包管理器并行扫描

## 6. 安全考虑

### 6.1 输入验证
- **路径遍历防护**：验证文件路径安全性
- **文件类型检查**：限制可上传文件类型
- **大小限制**：设置文件大小上限

### 6.2 权限控制
- **Docker Registry 访问**：限制外部 registry 访问
- **文件系统访问**：限制扫描目录范围
- **API 访问控制**：实现认证和授权

### 6.3 数据保护
- **敏感信息过滤**：过滤配置文件中的敏感信息
- **临时文件清理**：扫描完成后清理临时文件
- **日志脱敏**：日志中不记录敏感路径

## 7. 部署要求

### 7.1 环境依赖
- **Docker 运行时**：用于容器镜像分析
- **各语言运行时**：用于包管理器解析
- **存储空间**：足够的磁盘空间存储 SBOM 文件
- **网络访问**：访问外部漏洞数据库

### 7.2 监控指标
- **扫描成功率**：成功扫描的比例
- **扫描时间**：平均扫描耗时
- **组件数量**：平均每个项目的组件数
- **漏洞发现率**：发现漏洞的比例

## 8. 交付物要求

### 8.1 必须交付
- **源代码**：完整的后端实现代码
- **API 文档**：详细的 API 接口文档
- **部署指南**：环境配置和部署说明
- **测试用例**：功能测试和集成测试

### 8.2 可选交付
- **Docker 镜像**：预构建的容器镜像
- **CI/CD 流水线**：自动化部署配置
- **监控配置**：Prometheus/Grafana 配置
- **备份策略**：数据备份和恢复方案

## 9. 问题与解决方案

### 9.1 常见问题
1. **许可证检测不准确**：结合多种检测方法提高准确性
2. **传递依赖分析复杂**：使用成熟的依赖解析工具
3. **漏洞信息滞后**：定期同步外部漏洞数据库
4. **性能瓶颈**：优化扫描算法和并行处理

### 9.2 质量保证
- **格式验证**：验证生成的 SBOM 格式正确性
- **完整性检查**：确保所有依赖项都被识别
- **一致性验证**：不同格式的 SBOM 内容一致
- **回归测试**：确保新功能不影响现有功能