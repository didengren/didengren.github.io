import { chromium } from 'playwright';

const base = process.env.BASE_URL ?? 'http://127.0.0.1:4321/sam-xu-site';
const pages = ['/', '/work/', '/work/pv-entry-platform/', '/work/ai-work-entry/', '/work/agent-app/', '/work/solar-crm/', '/work/warehouse-logistics/', '/experience/', '/about/', '/contact/', '/404.html'];

const browser = await chromium.launch();
const issues = [];

for (const width of [1440, 1024, 768, 375]) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(String(err)));

  for (const path of pages) {
    await page.goto(base + path, { waitUntil: 'networkidle' });
    const metrics = await page.evaluate(() => {
      const doc = document.documentElement;
      const btn = document.querySelector('.btn');
      const btnColor = btn ? getComputedStyle(btn).color : null;
      const btnBg = btn ? getComputedStyle(btn).backgroundColor : null;
      return {
        scrollWidth: doc.scrollWidth,
        innerWidth: window.innerWidth,
        btnColor,
        btnBg,
        title: document.title,
      };
    });
    if (metrics.scrollWidth > metrics.innerWidth + 1) {
      issues.push(`${width} ${path}: horizontal overflow ${metrics.scrollWidth} > ${metrics.innerWidth}`);
    }
    if (metrics.btnColor && metrics.btnColor !== 'rgb(255, 255, 255)') {
      issues.push(`${width} ${path}: .btn color ${metrics.btnColor} on ${metrics.btnBg}`);
    }
    if (errors.length) {
      issues.push(`${width} ${path}: console ${errors.join(' | ')}`);
      errors.length = 0;
    }
  }

  await context.close();
}

await browser.close();

console.log(issues.length ? issues.join('\n') : 'NO ISSUES');
