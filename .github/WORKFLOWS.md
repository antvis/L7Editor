## L7Editor GitHub Actions 工作流说明与常见问题

本文档汇总了仓库中位于 `.github/workflows/` 下的工作流、所需的 Secrets、如何生成并配置 PAT（Personal Access Token）、常见故障排查步骤与本地复现命令（Windows PowerShell 示例）。目标是帮助维护者快速理解并排查 CI/CD 相关问题。

---

## 包含的工作流（文件）

- `release.yml`：当 GitHub Release 创建或编辑时触发。会运行 `yarn ci`（构建/测试）并构建 docs（`yarn docs:build`），将 `docs-dist` 部署到 GitHub Pages（当前使用强制 push 到 `gh-pages` 分支）。
- `release-notify.yml`：在 Release 发布/编辑或手动触发 (`workflow_dispatch`) 时，向钉钉发送发布通知（使用第三方 action）。
- `release-label.yml`：当 PR 打开或编辑（`pull_request_target`）时，为 PR 自动打基于 conventional commit 的标签（feat/fix/docs 等）。
- `preview.yml`：当 PR 创建/更新时，构建 docs 并使用 Surge 生成预览页面（`SURGE_TOKEN` 需要配置）。
- `lint.yml`：在 `push` 或 `pull_request` 时运行仓库的 CI（`yarn ci`），用于 lint、类型检查与测试。

---

## 必要的 Secrets（与作用）

- `GITHUB_TOKEN`：由 GitHub 自动注入，用于常规的 API 访问与动作。无需手动配置。
- `SURGE_TOKEN`：用于 `preview.yml` 将 `docs-dist` 上传到 Surge 生成 preview（在仓库 Settings → Secrets 新增）。
- `DING_TALK_TOKENS`：用于 `release-notify.yml` 向钉钉机器人发送通知（在仓库 Settings → Secrets 新增）。
- 可选 `GH_PAGES_TOKEN`（或 `GH_PAGES_PAT`）：如果仓库策略或 branch protection 阻止 `GITHUB_TOKEN` 直接推送到 `gh-pages`，可以使用拥有 repo 写权限的 PAT 替代（保存为仓库 secret 并在 workflow 中引用）。

安全建议：仅给 PAT 最小必要权限（一般 `repo` 作用于私有仓库或 `public_repo` 对于公开仓库），并限制该 secret 的访问范围（仅仓库级别或特定环境）。

---

## 如何生成 PAT（Personal Access Token）

1. 通过 GitHub Web UI：
   - 登录 GitHub → 右上角 Avatar → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token (classic)。
   - 选择合适作用域：若用于推送 `gh-pages`，至少勾选 `repo`（或 `public_repo` 对于公开仓库）。填写说明并生成。复制 token（只显示一次）。

2. 通过 GitHub CLI（gh）：
   - 使用 `gh auth login` 登录后可以在 Web UI 生成 token；目前 gh CLI 也支持交互生成，具体参见 `gh` 文档。

3. 将生成的 PAT 加入仓库 Secrets：
   - 仓库页面 → Settings → Secrets → Actions → New repository secret → 填写 Name（例如 `GH_PAGES_TOKEN`）和 Value（粘贴 PAT）→ Add secret。

注意：不要把 PAT 写在代码或公开文档中。

---

## 如何添加/检查 Secrets

仓库管理员可以在 GitHub 仓库页面：Settings → Secrets and variables → Actions → New repository secret。

确认点：
- Secrets 名称必须与 workflow 中引用的名称一致（注意大小写）。
- 添加后可以在 Actions 运行中被引用，但无法在日志中打印其明文。

---

## 环境要求

- Node.js: >= 20.0.0
- npm: >= 9.0.0
- yarn: 推荐使用最新的稳定版

> **重要**: 本项目从 2025-10-26 起要求 Node.js 20+，这是为了支持新的依赖要求和性能优化。

## 常见错误与排查步骤（按场景）

场景 A：`yarn docs:build` 在 Actions 中失败
- 常见日志：TypeScript 错误、模块未找到、构建脚本异常。
- 排查步骤：
  1. 在本地复现：
     ```powershell
     yarn
     yarn ci
     yarn docs:build
     ```
  2. 若本地能复现，按日志修复代码/依赖；若仅在 CI 失败，检查 Node 版本（Actions 使用 Node 18），或是否存在环境变量依赖。

场景 B：部署 `gh-pages` 推送失败（403/Protected branch）
- 常见日志：`Protected branch update failed`；`failed to push some refs`。
- 排查步骤：
  1. 在仓库 Settings → Branches 检查 `gh-pages` 的保护规则（是否要求 PR review、status checks）。
  2. 若保护规则阻止直接推送，推荐使用 GitHub 官方 Pages 部署流程（见下方“推荐迁移”），或使用有写权限的 PAT（保存为 secret 并在 workflow 中替换 `GITHUB_TOKEN`）。

场景 C：Surge 预览失败或无 URL
- 常见日志：Authentication failed、No files were found at 'docs-dist'。
- 排查步骤：
  1. 确认 `SURGE_TOKEN` 是否存在并有效。  
  2. 确认 `yarn docs:build` 成功并且 `docs-dist` 有文件（`index.html` 等）。

场景 D：钉钉通知未收到
- 排查步骤：
  1. 查看 `release-notify` 的 Actions 日志，确认第三方 action 的 HTTP 响应。  
  2. 确认 `DING_TALK_TOKENS` 已正确配置且机器人允许接收消息。

场景 E：`release-label.yml` 未为 PR 打标签
- 原因：commit message 不符合 Conventional Commit，或该 action 在 fork PR 上没有正确获取信息。
- 排查步骤：检查 PR 的 commit message 是否包含 `feat:`/`fix:` 等前缀；检查 Actions 运行日志。

---

## 本地复现与手动触发（PowerShell 示例）

- 安装依赖并运行 CI：
```powershell
yarn
yarn ci
```

- 构建 docs 并查看输出：
```powershell
yarn docs:build
# 查看目录
ls .\docs-dist
```

- 使用 Surge CLI 手动发布（模拟 preview）：
```powershell
npm i -g surge
surge .\docs-dist your-preview-domain.surge.sh
# 或者交互式运行 surge 并登录
```

- 使用 GitHub CLI 创建 Release（触发 `release.yml`）：
```powershell
# 安装并登录 gh（如果未安装）
# gh auth login
gh release create v1.2.3 --title "v1.2.3" --notes "Release notes..."
```

- 手动触发 `release-notify.yml`（在 Actions 页面）或在 workflow 文件中保留 `workflow_dispatch` 后在 Actions 页面点击 Run workflow。

---

## 最近更新说明（2025-10-26）

已实施主要改进：

1. 迁移到 GitHub Pages 官方部署流程：
   - `release.yml` 现在使用 `actions/upload-pages-artifact@v1` + `actions/deploy-pages@v1`
   - 需要新的权限配置：
     ```yaml
     permissions:
       pages: write
       id-token: write
     ```
   - 好处：不再需要 PAT，更好的权限控制，支持 Pages 审计日志

2. CI 优化与缓存：
   - `lint.yml` 添加了依赖缓存：
     ```yaml
     - uses: actions/cache@v3
       with:
         path: |
           **/node_modules
           ~/.cache/yarn
           ~/.npm
         key: ${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}
     ```
   - 使用 `yarn --frozen-lockfile` 确保安装确定性

3. PR 预览增强：
   - `preview.yml` 现在自动在 PR 中添加 Surge 预览链接
   - 通过 `actions/github-script` 实现更好的预览体验

## 如何验证新功能

### 1. Pages 部署（release.yml）
```powershell
# 本地构建测试
yarn
yarn docs:build
ls docs-dist  # 确认输出

# 创建测试 release 触发部署
gh release create v0.0.1-test --notes "Test Pages deployment" --prerelease
```
然后在 Actions 标签页观察：
1. publish-site job 上传 artifact
2. deploy-pages job 部署到 Pages
3. 在 Settings → Pages 确认部署状态

### 2. 依赖缓存（lint.yml）
push 一个小改动，观察两次 Actions 运行：
- 第一次：正常安装依赖
- 第二次：应该看到 "Cache hit" 信息，安装时间显著减少

### 3. PR 预览功能（preview.yml）
1. 创建测试分支：
   ```powershell
   git checkout -b test/preview-comment
   # 做一些改动
   git commit -am "test: verify preview comment"
   git push origin test/preview-comment
   gh pr create
   ```
2. 等待 Actions 运行，检查：
   - PR 页面是否出现预览链接评论
   - 预览链接是否可访问

## 故障排除完整指南

### Pages 部署问题
1. 权限错误：
   ```
   Error: Failed to deploy Pages
   ```
   解决：访问 repo Settings → Pages → Build and deployment → Source，选择 "GitHub Actions"

2. Artifact 上传失败：
   ```
   Error: No such directory 'docs-dist'
   ```
   检查：
   - `yarn docs:build` 是否成功
   - 构建输出目录是否正确
   - Node 版本是否匹配（应为 18.x）

### 缓存问题
1. 缓存未命中：
   - 检查 cache key 是否包含所有相关文件
   - 确认 runner OS 是否一致
   - 可以在 Actions 页面手动清除缓存重试

### Node.js 版本问题
1. 错误信息：
   ```
   error @utoo/pack@0.0.1-alpha.55: The engine "node" is incompatible with this module. Expected version ">= 20"
   ```
   解决方案：
   ```powershell
   # 检查当前 Node.js 版本
   node -v
   
   # Windows 下安装/升级到 Node.js 20
   winget install OpenJS.NodeJS.LTS
   
   # 或使用 nvm for Windows
   nvm install 20.9.0
   nvm use 20.9.0
   ```

2. CI 环境中的版本问题：
   - workflow 文件已配置使用 Node.js 20
   - 如遇构建失败，检查 workflow 中的 `node-version` 设置

### 依赖安装仍然很慢：
   ```powershell
   # 本地测试安装速度
   yarn --frozen-lockfile --network-timeout 100000
   ```

### 预览功能问题
1. Surge token 无效：
   ```
   Error: Failed to deploy to Surge
   ```
   解决：在 Settings → Secrets → Actions 更新 `SURGE_TOKEN`

2. 评论功能失败：
   - 确认 workflow 有正确的 permissions
   - 检查 `github-token` 配置
   - 验证 PR 事件触发器正确

## 安全最佳实践

1. Workflow 权限
   - 使用精确的 permissions 声明
   - 避免 `GITHUB_TOKEN` 过度权限
   - 定期审查 workflow 文件变更

2. Secrets 管理
   - 使用仓库级别的 secrets
   - 避免在 workflow 中打印敏感信息
   - 定期轮换 tokens 和 secrets

3. PR 安全
   - 使用 `pull_request_target` 时须谨慎
   - 不在不可信 PR 中运行未经审核的代码
   - 使用 status checks 保护关键分支

---



文档最后更新：2025-10-26
