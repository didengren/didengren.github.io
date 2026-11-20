# DESIGN.md · 站点实现规范

> 方向：**D2 系统蓝图 × D3 黑红**。完整设计决策与依据见 vault 内 `个人材料/简历/静态个人网站/DESIGN.md`；本文件是站内实现口径。

## 1. 一句话

用系统图讲收敛，用黑红两色讲判断：页面像一张被排印过的系统蓝图，信息密度高，但每屏只回答一个问题。

## 2. 设计原则

1. **证据先行**：先定位与系统图，再数字；不写「经验丰富」。
2. **结构可见**：线、网格、编号、系统图，让「收敛」被看见。
3. **黑红克制**：黑是结构，红是信号。红只出现在年份、终点、CTA、KPI 小条、联系区。
4. **直角与细线**：无圆角、无阴影、无渐变、无玻璃拟态。
5. **一屏一个主张**：Hero / KPI / 案例 / 经历 / 方法 / 联系，每段只做一件事。
6. **中文优先**：正文 16-17px，行高 1.7-1.85。

## 3. Tokens

定义在 `src/styles/global.css` 的 `@theme`：

| Token | 值 | 用途 |
|---|---|---|
| `--color-paper` | `#FFFFFF` | 页面底色 |
| `--color-ink` | `#0A0A0A` | 正文 / 标题 / 黑底 |
| `--color-red` | `#D6381F` | 信号色 |
| `--color-muted` | `#666666` | 次要文字 / 图注 |
| `--color-line` | `#DADADA` | 细线 |
| `--color-line-dark` | `#B8B8B8` | 标签边框 |
| `--color-panel` | `#F7F7F7` | 系统图底板 |
| `--color-on-dark-muted` | `#A6A6A6` | 黑底次要文字 |
| `--font-sans` | Helvetica Neue / PingFang SC / Hiragino Sans GB / Arial | 标题 / 正文 / UI |
| `--font-mono` | SF Mono / JetBrains Mono / Menlo | 标签 / 年份 / 数据 |

字号（按 DESIGN.md）：

- display：`clamp(42px, 4.7vw, 64px)`；移动 `clamp(36px, 9vw, 46px)`
- h2：22px；h3：`clamp(24px, 2.2vw, 30px)`
- body：17px / 1.7；移动 16px
- 标签：10-11.5px（仅索引、图注、页脚；正文与可点击文字 ≥ 14px）

间距：`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96`；区块纵向 44-56px（移动 28-38px）；左右留白 80 / 52 / 18px。

形状与动效：`radius: 0`；`border: 1px` 细线、`2px` 主分隔、`6px` 顶部红条；`motion 150-200ms ease-out`；载入编排 650-700ms，只做一次。

## 4. 布局

- 12 栏，最大宽度 1320px。
- 首屏：左 5 / 右 7，系统图在右。
- KPI：4 等分黑底；移动 2×2。
- 案例行：`110px / 1fr / 260px`；移动单列。
- 经历行（首页）：`170px / 1fr / 300px`；经历页完整版：`150px / 280px / 1fr`。
- 方法：3 等分；移动单列。
- 断点：`>1040` 完整；`761-1040` 压缩；`≤760` 单列。

## 5. 组件

| 组件 | 文件 | 要点 |
|---|---|---|
| TopBar | `components/TopBar.astro` | 6px 红条在 `body` 顶部；2px 黑底线；移动菜单 `aria-expanded` / `aria-controls` |
| Hero | `pages/index.astro` | kicker + H1（第二行红）+ lead + 2 CTA |
| SystemMap | `components/SystemMap.astro` | 92 点 14×7，3 条入口，1 个红点；服务端生成 SVG；移动隐藏小字 |
| KpiBand | `components/KpiBand.astro` | 黑底 4 等分，数字 300 字重，28×2px 红条 |
| CaseRow | `components/CaseRow.astro` | 文件行，不是卡片；hover 反黑；右侧 260px 微缩图 |
| ExperienceRow | `components/ExperienceRow.astro` | 时间红字 / 公司角色 / 摘要或 bullet；完整版带相关案例 |
| Methods | `components/Methods.astro` | 收 / 判 / 界，三栏 + 小 SVG |
| CaseDiagram | `components/CaseDiagram.astro` | 5 种案例图；移动横向滚动 + 提示 |
| ContactBlock | `components/ContactBlock.astro` | 整幅朱红；白字；黑字「聊聊？」；复制邮箱 |
| ResumeCards | `components/ResumeCards.astro` | 2 个版本；无 PDF 时降级为邮件索取 |
| SEO | `components/SEO.astro` | title / description / canonical / OG / Person JSON-LD |
| Footer | `components/Footer.astro` | 版权 + 最后更新 + 域名 |

## 6. 交互

- 移动菜单：原生 TS，Escape / 点击外部 / 点击链接关闭。
- 复制邮箱：`navigator.clipboard`，失败降级 `mailto`。
- 案例目录：IntersectionObserver scroll spy；移动隐藏 TOC。
- 系统图：CSS `stroke-dashoffset` 绘制一次；`prefers-reduced-motion` 下关闭。
- 不使用 React；MVP 首屏 JS 只有菜单 + 复制（< 2KB）。

## 7. 可访问性

- skip link、`aria-current`、语义标题层级、图片 alt、SVG `role="img"` + `aria-label`。
- 对比度：正文 / 标签 ≥ 4.5:1；红底统一用白字（`#D6381F` 对白 4.72:1）；黑字只用于红底大字号。
- 红底上的 focus ring 改为白色。
- 触控目标：菜单按钮 44px；移动菜单项 44px；复制按钮 ≥ 40px。
- 尊重 `prefers-reduced-motion`。

## 8. 内容规则

- 只称「产品经理」；不出现 TPM / Technical Product Manager / 技术产品经理。
- 公开名：户用光伏统一入口平台 / 跨系统 AI 工作入口 / 代理商移动作业 App / 分布式光伏 CRM / 仓配物流系统。
- 内部代号不进入 HTML、URL、SEO、OG。
- 数字只用已确认口径；没有口径就写机制 / 行为变化。
- 地点「常州和周边城市」；手机号不公开；照片最多 1 张，只在关于页。
- 不编造推荐语、客户评价、logo 墙。

## 9. 不要做

- 暖纸底、宋体大标题、书脊。
- 70vw 巨字、红圆盘、斜线。
- 圆角卡片、阴影、渐变、玻璃拟态。
- 每个标题上都堆全大写英文小标签。
- 01/02/03 装饰编号（`CASE 01` 是真实顺序，可用）。
- 内部代号做 URL / 标题 / SEO。
- 「常州 · 可远程」。

## 10. 验收

- 1440 / 1024 / 768 / 375 无横向滚动。
- 0 console error；0 broken link。
- 键盘可走完导航 → 案例 → 联系；移动菜单可开合。
- 全站搜索 TPM / 技术产品经理 = 0；内部代号 = 0。
- 所有数字可追溯；目标 / 测算有标注。
- Lighthouse Performance / A11y / SEO / Best Practices ≥ 90。
