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
  localStorage.setItem('nursepath_pnle_level_v1', 'hard');
  localStorage.removeItem('nursepath_pnle_mistakes_v1');
  localStorage.removeItem('nursepath_pnle_progress_v1');
  localStorage.removeItem('nursepath_pnle_daily_count_v1');
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto('http://127.0.0.1:8765/index.html', { waitUntil: 'domcontentloaded' });
await page.evaluate(seedStorage);
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
await page.click('#pnleStartPractice');
await page.waitForSelector('.pnle-choice');
const hard = await page.evaluate(() => {
  const items = window.NursePathPnleMedSurg.items.filter((i) => i.level === 'hard' && i.reviewed);
  const stem = document.querySelector('.pnle-question-stem')?.textContent;
  const cur = items.find((i) => i.stem === stem);
  if (!cur) return null;
  document.querySelector(`.pnle-choice[data-idx="${cur.correctIndex}"]`)?.click();
  return cur.id;
});
if (!hard) {
  await page.evaluate(() => document.querySelector('.pnle-choice[data-idx="1"]').click());
}
await page.waitForSelector('#pnleNextBtn:not([hidden])');
await page.evaluate(() => document.querySelector('.pnle-question-card')?.scrollIntoView({ block: 'end' }));
await page.waitForTimeout(250);
await page.screenshot({ path: `${OUT}/study-hard-correct-reveal.png`, fullPage: true });
await browser.close();
console.log('hard item', hard);
