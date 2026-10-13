import puppeteer from 'puppeteer-core';

const BASE = 'http://127.0.0.1:8765/index.html';

const browser = await puppeteer.launch({
  executablePath: '/usr/local/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 60000 });

await page.evaluate(() => {
  localStorage.setItem('nursepath_user', JSON.stringify({ email: 'smoke@test.local' }));
  localStorage.setItem('nursepath_simulation_agreed', JSON.stringify({ agreed: true, expires: Date.now() + 86400000 }));
  localStorage.setItem('nursepath_usage_consent_v1', '1');
  localStorage.removeItem('nursepath_launch_mode_v1');
});

await page.reload({ waitUntil: 'networkidle2' });

await page.waitForSelector('#pnleLaunchOverlay', { visible: true, timeout: 15000 });
await page.click('#pnleLaunchStudy');
await page.waitForSelector('#pnleStudyRoot .pnle-topic-grid', { timeout: 10000 });

const count = await page.evaluate(() => window.NursePathPnleStudy.getReviewedCount());
console.log('reviewed_count', count);

await page.click('.pnle-topic-card[data-topic="oxygenation"]');
await page.click('#pnleStartSession');
await page.waitForSelector('.pnle-choice', { timeout: 8000 });
await page.click('.pnle-choice');
await page.click('#pnleRevealBtn');
await page.waitForSelector('.pnle-reasons.is-visible', { timeout: 5000 });

await page.screenshot({ path: '/workspace/assets/screenshots/pnle-study-smoke.png', fullPage: true });
console.log('screenshot_ok');

await page.click('#pnleSwitchDuty');
await page.waitForSelector('#tools-hub', { visible: true, timeout: 8000 });
const hubText = await page.$eval('#hubStudyBtn', (el) => el.textContent.trim());
console.log('hub_lesson_label', hubText);

await browser.close();
