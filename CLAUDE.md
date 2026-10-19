# 小步 · 习惯打卡

## Commands
- Test: `npm test`（Node test，必须全绿）
- Spec：`/spec intent/<编号>-<名称>/intent.md`（读取 `prompts/spec.md`）
- Run: `open prototype/index.html`
- Deploy: GitHub Actions `Deploy`（github-pages 环境需审批）

## Conventions
- 纯前端，无账号、无后端；数据只存 localStorage
- 每个需求有编号（R1…Rn），测试与 eval 引用编号
- 设计稿在 `design/`，Design 阶段与 spec 一起签核
- 不引入网络请求；不默认申请通知权限

## Architecture
- `prototype/`：可运行原型（index.html / app.js / streak.js / styles.css）
- `intent/`：intent → spec → plan 工件链
- `design/`：设计稿与交互说明
- `evals/`：回归用例；`tests/`：单测

## Things Claude gets wrong
- 不要用 UTC 计算连续天数（按本地时区）
- 不要改测试来让实现通过
- 不要在 Build 阶段偷偷改设计稿，回 Design 改 spec

## Verifying your work
- 报告完成前跑 `npm test` 并贴输出
- 涉及设计的改动，附截图与 `design/` 对比
