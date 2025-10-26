## L7Editor — 面向 AI 编码代理的快速指引（中文）

本仓库是基于 AntV L7 的地理数据编辑器组件库（React + TypeScript）。下面是让自动化编码代理快速上手的要点。

1) 高层架构概览
- 库入口：`src/index.tsx` 导出公共 API（`L7Editor`、各组件、类型）。
- 页面：`src/pages/*` 包含编辑器页面和页面级组件。
- 组件：可复用组件在 `src/components/*`，地图控制类组件集中在 `src/components/map-control-group/`。
- 全局状态：使用 Recoil，相关 atoms/selectors 在 `src/recoil/`（对行为改动请使用这些状态接口）。
- 工具方法：`src/utils/` 包含解析、转换、上传等通用工具函数。

2) 开发 / 构建 / 文档（精确命令）
- 安装依赖：
```powershell
npm install
```
- 本地文档 / 开发（带 Demo）：
```powershell
npm run start    # dumi dev
```
- 构建库（输出 `lib` / `es`）：
```powershell
npm run build    # father build
```
- 文档静态构建：
```powershell
npm run docs:build
```
- 部署文档：
```powershell
npm run docs:deploy
# 或
npm run deploy
```
- 其他常用脚本：`npm run lint`、`npm run prettier`、`npm run i18n:collect`（kiwi 提取）等。

3) 项目特有约定与模式
- 组件目录通常包含 `index.tsx` 与 `styles.ts`。例如 `src/components/app-header/` 或 `src/components/map-control-group/draw-control/`。
- 新增地图控制时：在 `map-control-group` 下新建目录，导出默认组件（`index.tsx`），样式放 `styles.ts`，并在 `src/components/index.ts` 或 `src/index.tsx` 中添加导出（若需公开）。
- 修改全局/共享状态必须通过 `src/recoil/*` 的 atoms/selectors，不要直接修改全局变量或使用非受控方式。
- i18n：翻译文件在 `src/locales/langs/*.ts`，使用 `kiwi-intl`；新增 key 后运行 `npm run i18n:collect`。
- TypeScript：仓库启用了 `strict: true`（见 `tsconfig.json`），请保证类型完整。

4) 关键集成点 & 依赖
- 运行时依赖：`@antv/l7`（渲染）、`@antv/l7-draw`（绘制工具）、`@antv/larkmap`、`recoil`、`monaco-editor`（WKT/代码编辑）、`onnxruntime-web`（可选 ML 推理）。
- 当修改地图渲染或绘制行为时，优先查看 `src/app-map/` 与 `src/geojson-editor/editortool.ts`。
- 文档站基于 `dumi`，页面与 demo 在 `docs/` 下。

5) 小合同 & 成功准则（修改验证）
- 输入：组件 props 与 Recoil 状态切片（参见 `src/types` 和 `src/recoil/*`）。
- 输出：UI 渲染与触发的事件/状态更新（组件不可直接改写全局状态）。
- 验证：关键变更后应能通过 `npm run build`，并在本地用 `npm run start` 手动复现关键路径。

6) 快速定位示例（参考位置）
- 添加地图控制示例：`src/components/map-control-group/draw-control/`、`clear-control/`。
- 中央导出点：`src/index.tsx`、`src/components/index.ts`。
- 状态模式：`src/recoil/atomState.ts`、`src/recoil/feature.ts`。
- GeoJSON 编辑流程：`src/geojson-editor/editortool.ts`、`src/geojson-editor/index.tsx`。

7) 给 AI 代理的编辑与 PR 指南
- 保持文件组织与 TypeScript 类型签名；不要随意改变公共 API。
- 主要修改后运行：
```powershell
npm run lint
npm run build
```
确保没有类型或 lint 回归。
- 若增加对外导出，别忘了在 `src/index.tsx` 中添加导出以包含到构建产物。

8) 常用搜索路径（自动化脚本友好）
- 地图控制：`src/components/map-control-group/**/index.tsx`
- Recoil 状态：`src/recoil/*.ts`
- 本地化文件：`src/locales/langs/*.ts`

如需我把其中某一节扩展为「一步步示例（添加新地图控件）」或加入 PR 模板、CI 说明，请告诉我想要的细节，我会继续完善。

***
（已从英文说明机译并按本项目习惯适配，如需更口语化或更详细示例请指示）
