import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';

const OUT = '/opt/cursor/artifacts/screenshots';
await mkdir(OUT, { recursive: true });

function seedStorage() {
  const sim = { agreed: true, expires: Date.now() + 30 * 24 * 60 * 60 * 1000 };
  localStorage.setItem('nursepath_simulation_agreed', JSON.stringify(sim));
  localStorage.setItem(
    'nursepath_user',
    JSON.stringify({ email: 'pilot@udd.test', sealedAt: new Date().toISOString(), lastSeenAt: new Date().toISOString() })
  );
  localStorage.setItem('nursepath_launch_mode_v1', 'study');
  localStorage.setItem('nursepath_pnle_level_v1', 'normal');
  localStorage.removeItem('nursepath_pnle_mistakes_v1');
  localStorage.removeItem('nursepath_pnle_progress_v1');
  localStorage.removeItem('nursepath_pnle_daily_count_v1');
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto('http://127.0.0.1:8765/index.html', { waitUntil: 'domcontentloaded' });
await page.evaluate(seedStorage);
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

await page.waitForSelector('#pnleStartPractice', { timeout: 20000 });
await page.screenshot({ path: `${OUT}/study-home-fresh.png`, fullPage: true });

await page.click('#pnleStartPractice');
await page.waitForSelector('.pnle-choice');
const nextVisibleBefore = await page.locator('#pnleNextBtn').isVisible();
if (nextVisibleBefore) throw new Error('Next visible before tap');

await page.screenshot({ path: `${OUT}/study-question-before-tap.png`, fullPage: true });

await page.evaluate(() => {
  document.querySelector('.pnle-choice[data-idx="0"]').click();
});
await page.waitForSelector('#pnleNextBtn:not([hidden])', { timeout: 5000 });
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/study-question-wrong-reveal.png`, fullPage: true });

await page.click('#pnleNextBtn');
await page.waitForSelector('.pnle-choice');

await page.evaluate(() => {
  const stem = document.querySelector('.pnle-question-stem').textContent;
  const item = window.NursePathPnleMedSurg.items.find((i) => i.stem === stem);
  const btn = document.querySelector(`.pnle-choice[data-idx="${item.correctIndex}"]`);
  btn.click();
});
await page.waitForSelector('#pnleNextBtn:not([hidden])');
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/study-question-correct-reveal.png`, fullPage: true });

await browser.close();
console.log('OK', OUT);
