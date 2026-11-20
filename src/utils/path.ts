/**
 * 站点可能部署在根域名或项目子路径（GitHub Pages 项目站）。
 * 所有站内链接都经过 withBase()，切换部署方式时只改 astro.config.mjs。
 */
const base = import.meta.env.BASE_URL;

export function withBase(path = '/'): string {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(path)) return path;

  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${normalizedBase}${normalizedPath}`;
}
