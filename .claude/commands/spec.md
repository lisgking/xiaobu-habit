---
description: 从 intent.md 生成 spec.md（需求 + 设计 + concern owner）
argument-hint: <intent 路径，例如 intent/002-reminder/intent.md>
allowed-tools: Read, Write, Grep
---

读 `prompts/spec.md` 里的规范，并读取参数指定的 intent：`$ARGUMENTS`。

执行要求：
1. 结合当前代码库（`prototype/` 与已有 `spec.md`）写出可落地的设计；
2. 按仓库 spec 模板产出：Requirements（编号、可测试）、Design、Constraint mapping、Open questions、Areas of concern；
3. 每个 concern 必须给出 owner（角色或人名）；
4. 无法同时满足的冲突政策，单独列出，不要私自取舍；
5. 输出到 intent 同目录的 `spec.md`；
6. 最后列出「需要人拍板的问题」和「需要更新的设计稿」。
