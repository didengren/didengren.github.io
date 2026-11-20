import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const base = process.env.BASE_URL ?? 'http://127.0.0.1:4321/sam-xu-site';
const outDir = 'shots';

const targets = [
  ['home', '/'],
  ['work', '/work/'],
  ['case-pv', '/work/pv-entry-platform/'],
  ['case-ai', '/work/ai-work-entry/'],
  ['case-agent', '/work/agent-app/'],
  ['case-crm', '/work/solar-crm/'],
  ['case-los', '/work/warehouse-logistics/'],
  ['experience', '/experience/'],
  ['about', '/about/'],
  ['contact', '/contact/'],
  ['404', '/404.html'],
];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();

for (const width of [1440, 375]) {
  const context = await browser.newContext({
    viewport: { width, height: width === 1440 ? 900 : 812 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  for (const [name, path] of targets) {
    await page.goto(base + path, { waitUntil: 'networkidle' });
    if (path === '/') {
      await page.evaluate(() => window.scrollTo(0, 0));
    }
    await page.screenshot({ path: `${outDir}/${name}-${width}.png`, fullPage: true });
  }

  if (width === 375) {
    await page.goto(base + '/', { waitUntil: 'networkidle' });
    await page.click('[data-menu-btn]');
    await page.waitForTimeout(250);
    await page.screenshot({ path: `${outDir}/home-menu-375.png` });
  }

  await context.close();
}

await browser.close();
console.log(`screenshots written to ${outDir}/`);
