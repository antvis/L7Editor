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

## 推荐迁移与改进（可作为 PR 实施）

1. 使用 GitHub 官方 Pages 部署流程替换当前对 `gh-pages` 的强制 push：
   - 在 `release.yml` 的 `publish-site` job 中，使用 `actions/upload-pages-artifact@v1` 上传 `docs-dist`，再用 `actions/deploy-pages@v1` 部署。这种方式与 GitHub Pages 的权限模型更兼容，不需要 PAT。

2. 在 `lint.yml` 中加入 `actions/cache` 来缓存依赖以加速 CI。将 lint、typecheck、unit tests 拆成并行 jobs 能提高反馈速度。

3. 在 `preview.yml` 中把 Surge 返回的预览 URL 自动回写到 PR 评论或 Check（部分 preview action 已内建此功能），便于 reviewer 使用。

---

## 安全注意事项

- 永远不要在仓库或日志中明文存放 token。  
- 对 PAT 使用最小权限原则并定期轮换。  
- 小心 `pull_request_target`：该事件会以目标仓库的权限运行（可访问 secrets），但不要在该 context 下检出并运行来自 fork 的不可信代码。

---

## 如果你希望我进一步帮助

- 我可以替你实现“迁移到官方 Pages 部署流程”（修改 `release.yml` 并提交 PR），或者优化 `lint.yml` 缓存与拆分 jobs。  
- 回复 `A` 我就开始修改并提交 PR；回复 `B` 我就优化 CI 缓存与 job 拆分；也可以选择同时做。

---

文档最后更新：2025-10-26
