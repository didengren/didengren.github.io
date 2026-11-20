# 徐念祖 · 个人作品集网站

面向产品经理岗位的静态作品集：Astro 5 + Tailwind CSS 4 + TypeScript strict，内容用 Markdown / JSON 管理，零后端。

- 线上地址：`https://didengren.github.io/`（GitHub Pages 用户站）
- 仓库：`https://github.com/didengren/didengren.github.io`
- 设计系统：[`DESIGN.md`](./DESIGN.md)
- 需求与文案：vault 内 `个人材料/简历/静态个人网站/`

## 本地运行

```bash
export PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH"
pnpm install
pnpm dev          # http://localhost:4321/
```

> 站点配置为用户站：`site: 'https://didengren.github.io'`、`base: '/'`。站内链接统一走 `src/utils/path.ts` 的 `withBase()`；以后若迁到自定义域名，只改 `astro.config.mjs` 的 `site` / `base` 和 `public/robots.txt` 即可。

Node **24.14.0**，pnpm **10.30.3**；版本见 `.nvmrc` 与 `package.json`。首次安装如提示 `Ignored build scripts`，执行 `pnpm approve-builds` 并允许 `sharp`、`esbuild`（本仓库已在 `pnpm.onlyBuiltDependencies` 中声明）。

## 命令

| 命令 | 作用 |
|---|---|
| `pnpm dev` | 本地开发 |
| `pnpm check` | Astro / TypeScript 诊断，0 error |
| `pnpm build` | 静态构建到 `dist/` |
| `pnpm preview` | 预览 `dist/` |
| `pnpm check:layout` | 1440 / 1024 / 768 / 375 横向溢出、console error、按钮对比度检查 |
| `pnpm shots` | 输出 `shots/` 全页截图（1440 / 375）与移动菜单态 |
| `pnpm lint:links` | 死链检查（需先 `pnpm add -D linkinator`） |
| `pnpm lighthouse` | Lighthouse CI（需先 `pnpm add -D @lhci/cli`） |

> `check:layout` 与 `shots` 需要先在另一个终端启动 `pnpm preview`（默认 `http://127.0.0.1:4321/`）；可用 `BASE_URL` 环境变量指向其他地址。

## 目录

```
src/
  content.config.ts        # Zod schema：projects / experience
  content/projects/*.md    # 5 个案例，一文件一页
  content/experience/*.md  # 4 段经历（含更早经历）
  data/profile.json        # 姓名 / 定位 / 联系方式 / 教育 / SEO
  data/impact.json         # 首页 4 个 KPI
  data/skills.json         # 技能矩阵
  data/open-source.json    # 开源项目
  data/resumes.json        # 简历版本与文件状态
  components/              # TopBar / Hero 组件 / SystemMap / CaseDiagram ...
  pages/                   # / /work /work/[slug] /experience /about /contact /404
  styles/global.css        # @theme token + 版式 + 响应式 + 打印
public/                    # favicon / robots.txt（简历 PDF 放 public/resume/）
```

## 内容维护

- **加案例**：复制 `src/content/projects/` 下任一文件，补 frontmatter，正文按「背景—问题—角色—方案—取舍—结果—复盘—材料」写。`order` 控制顺序，`featured` 控制首页精选，`diagram` 选 `converge | flow | layers | funnel | loop`。
- **改经历**：`src/content/experience/*.md`，`order` 排序，`projects` 里填案例 slug 以生成「相关案例」。
- **改首页数字**：`src/data/impact.json`；每个数字保留 `source` 字段，发布前对照事实底稿。
- **改联系方式**：`src/data/profile.json`。
- **简历 PDF**：导出后放到 `public/resume/`，把 `src/data/resumes.json` 里对应条目的 `file` 改为 `/resume/文件名.pdf`；页面会自动从「邮件索取」切换为「下载 PDF」。

> 页面切换由 `astro:transitions` 的 `ClientRouter` 接管：主内容做 340ms 淡入，顶栏与页脚保持稳定。布局内交互统一挂在 `astro:page-load` 上，并在每次触发时重新查询 DOM、清理旧监听；新增组件脚本不要假设只执行一次。

内容硬约束：

- 对外只称「产品经理」；不出现 TPM / Technical Product Manager / 技术产品经理。
- 项目标题与 URL 只用业务描述，不用内部代号。
- 不放内部截图、客户名、接口地址、权限规则表、明细数据。
- 地点统一「常州和周边城市」；手机号不公开。
- 没有可公开口径的结果，写机制 / 行为变化，不补数字。

## 部署（GitHub Pages）

仓库：`https://github.com/didengren/didengren.github.io`（用户站，仓库名必须是 `didengren.github.io`）。不要把 vault 根目录推到 Pages。

1. 仓库 Settings → Pages → Source 选 **GitHub Actions**。
2. push 到 `main` 触发 `.github/workflows/deploy.yml`：`pnpm check` → `pnpm build` → 部署 `dist/`。
3. 线上地址：`https://didengren.github.io/`。
4. 若启用 Umami，在仓库 Settings → Secrets and variables → Actions → Variables 里配置：
   - `PUBLIC_UMAMI_SRC`（例：`https://cloud.umami.is/script.js`）
   - `PUBLIC_UMAMI_WEBSITE_ID`
   两个都为空时不加载统计脚本。

`astro.config.mjs` 已设 `site: 'https://didengren.github.io'`、`base: '/'`、`output: 'static'`，并生成 `sitemap-index.xml`。站内链接统一用 `withBase()`，不要在组件里手写根路径。

> 从项目站迁到用户站时：仓库改名为 `didengren.github.io`，`base` 改为 `'/'`，同步 `public/robots.txt` 的 sitemap 地址；其余内链会自动跟随。若换自定义域名，则改 `site` 为域名、`base` 保持 `'/'`，并在 `public/` 放 `CNAME`。

## 上线前待办

- [ ] T-13 / T-14：导出 `徐念祖-产品经理.pdf` 与 `徐念祖-前端经理.pdf`，放入 `public/resume/`，切换下载 CTA。
- [x] 仓库已改名 `didengren.github.io`，Pages Source 为 GitHub Actions，根域名部署通过。
- [ ] 关于页照片为儿童出镜的展项照片，公开前确认授权与隐私边界；如需替换，改 `src/assets/photo.jpg` 与 `about.astro` 的 alt / caption。
- [ ] 生成 OG 分享图（1200×630），补 `og:image` / `twitter:image`。
- [ ] 跑 `linkinator` 与 Lighthouse，确认 0 死链、四项 ≥ 90。
- [ ] 全站搜索 `TPM`、`技术产品经理`、内部代号，结果必须为 0。
