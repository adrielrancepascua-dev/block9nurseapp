const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const http = require('node:http');
// Isolated test server; this suite must not depend on a local preview launcher.
function createTestServer() {
  const root = path.resolve(__dirname, '..');
  const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' };
  return http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const target = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!target.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    fs.readFile(target, (error, data) => {
      if (error) { res.writeHead(404).end(); return; }
      res.writeHead(200, { 'Content-Type': mime[path.extname(target)] || 'application/octet-stream' }).end(data);
    });
  });
}
const counters = page => page.evaluate(() => ['nursepath_pnle_mistakes_v1', 'nursepath_pnle_progress_v1', 'nursepath_pnle_daily_count_v1'].map(key => localStorage.getItem(key)));
const screenshotDir = process.env.UI_REVIEW_SCREENSHOTS;
(async () => {
  const server = createTestServer(); await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, headless: true });
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'light', serviceWorkers: 'block' });
    await context.addInitScript(() => {
      localStorage.setItem('nursepath_user', JSON.stringify({ email: 'ui-test@example.invalid' }));
      localStorage.setItem('nursepath_usage_consent_v1', '0');
      if (!localStorage.getItem('nursepath_theme')) localStorage.setItem('nursepath_theme', 'light');
    });
    await context.route('**/*', route => new URL(route.request().url()).hostname.endsWith('.supabase.co') ? route.abort() : route.continue());
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    await page.locator('#simulationModeOverlay button').click();
    await page.locator('#pnleLaunchDuty').click();
    await page.locator('#pnleLaunchGate').waitFor({ state: 'hidden' });
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      const settings = await page.locator('#npSettingsOpen').boundingBox();
      assert.ok(settings.width >= 44 && settings.height >= 44, 'settings has a 44px hit target');
      assert.equal(await page.locator('#tools-hub').evaluate(el => el.scrollWidth <= el.clientWidth), true);
    }
    assert.equal(await page.locator('#tools-hub .tools-hub-grid').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length), 2, 'desktop tools use two columns');
    await page.evaluate(() => openHubTool('iv'));
    const missing = await page.locator('#tools-detail :is(input,select)').evaluateAll(fields => fields.filter(el => !el.labels.length && !el.getAttribute('aria-label')).map(el => el.id));
    assert.deepEqual(missing, [], 'all static clinical inputs have accessible names');
    for (const theme of ['light', 'dark']) {
      await page.evaluate(theme => window.setNursePathTheme(theme), theme);
      assert.ok(await page.locator('label[for="vol"]').evaluate(el => parseFloat(getComputedStyle(el).fontSize)) >= 14);
      assert.ok(await page.locator('#vol').evaluate(el => parseFloat(getComputedStyle(el).fontSize)) >= 16);
      const contrast = await page.locator('label[for="vol"]').evaluate(el => {
        const luminance = color => {
          const channels = color.match(/[\d.]+/g).slice(0, 3).map(Number).map(value => { value /= 255; return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4; });
          return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
        };
        let node = el;
        while (node.parentElement && getComputedStyle(node).backgroundColor === 'rgba(0, 0, 0, 0)') node = node.parentElement;
        const ink = luminance(getComputedStyle(el).color), background = luminance(getComputedStyle(node).backgroundColor);
        return (Math.max(ink, background) + .05) / (Math.min(ink, background) + .05);
      });
      assert.ok(contrast >= 4.5, 'clinical labels meet normal-text contrast in ' + theme);
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      assert.equal(await page.locator('.tool-panel.is-active').evaluate(el => getComputedStyle(el).animationName), 'none');
      await page.locator('#vol').fill('1000'); await page.locator('#hours').fill('8');
      await page.locator('label[for="vol"]').click();
      assert.equal(await page.evaluate(() => document.activeElement.id), 'vol');
      if (screenshotDir) { fs.mkdirSync(screenshotDir, { recursive: true }); await page.screenshot({ path: path.join(screenshotDir, `calculator-${theme}.png`) }); }
    }
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    assert.equal(await page.locator('#tools-detail').evaluate(el => el.scrollWidth <= el.clientWidth), true, 'clinical form fits with 200% root text scaling');
    assert.ok(await page.locator('label[for="vol"]').evaluate(el => parseFloat(getComputedStyle(el).fontSize)) >= 28);
    await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
    await page.evaluate(() => backToToolsHub());
    await page.locator('#pnleDutySwitchMode').click();
    await page.locator('#pnleDutySwitchModeMenu [data-app-mode="study"]').click();
    assert.match(await page.locator('#pnleStartPractice').textContent(), /10 questions/);
    await page.locator('#pnleStartPractice').click();
    assert.match(await page.locator('.pnle-q-progress').textContent(), /1 of 10/);
    await page.locator('.pnle-choice').first().click();
    const recorded = await counters(page);
    const snapshot = JSON.parse(await page.evaluate(() => localStorage.getItem('nursepath_pnle_session_v1')));
    assert.equal(snapshot.locked, true);
    await page.reload();
    await page.locator('#pnleResumePractice').click();
    assert.match(await page.locator('.pnle-q-progress').textContent(), /1 of 10/);
    assert.equal(await page.locator('#pnleNextBtn').isEnabled(), true);
    assert.deepEqual(await counters(page), recorded, 'restoring feedback must never record another answer');
    await page.locator('#pnleNextBtn').click();
    await page.locator('[data-study-tab="progress"]').click();
    await page.locator('[data-study-tab="practice"]').click();
    await page.locator('#pnleResumePractice').click();
    assert.match(await page.locator('.pnle-q-progress').textContent(), /2 of 10/);
    await page.locator('#pnleStudySwitchMode').click();
    await page.locator('#pnleStudySwitchModeMenu [data-app-mode="duty"]').click();
    await page.locator('#pnleDutySwitchMode').click();
    await page.locator('#pnleDutySwitchModeMenu [data-app-mode="study"]').click();
    await page.locator('#pnleResumePractice').click();
    assert.match(await page.locator('.pnle-q-progress').textContent(), /2 of 10/, 'changing app modes preserves the current practice session');
    await page.locator('#pnleHistoryBtn').click();
    await page.locator('[data-study-tab="practice"]').click();
    await page.locator('#pnleResumePractice').click();
    assert.match(await page.locator('.pnle-q-progress').textContent(), /2 of 10/);
    page.once('dialog', dialog => dialog.dismiss());
    await page.locator('#pnleQuitSession').click();
    assert.equal(await page.locator('.pnle-question-card').isVisible(), true, 'cancelling End keeps the session');
    page.once('dialog', dialog => dialog.accept());
    await page.locator('#pnleQuitSession').click();
    assert.equal(await page.evaluate(() => localStorage.getItem('nursepath_pnle_session_v1')), null);
    await page.locator('#pnleStartFullPractice').click();
    assert.match(await page.locator('.pnle-q-progress').textContent(), /1 of 98/);
    page.once('dialog', dialog => dialog.accept()); await page.locator('#pnleQuitSession').click();
    // A daily session really ends at ten locked answers.
    await page.locator('#pnleStartPractice').click();
    for (let i = 0; i < 10; i += 1) { await page.locator('.pnle-choice').first().click(); await page.locator('#pnleNextBtn').click(); }
    assert.equal(await page.locator('#pnleDoneHome').isVisible(), true);
    assert.equal(await page.evaluate(() => localStorage.getItem('nursepath_pnle_session_v1')), null);
    await page.locator('#pnleDoneHome').click();
    await page.locator('[data-level="hard"]').click();
    // Put an existing SATA item first through the actual shuffled full-bank flow.
    await page.evaluate(() => {
      const pool = window.NursePathPnleMedSurg.items.filter(item => (item.examStyle || item.level === 'hard') && !/\b(handout|sheet|reviewer|per\s+the)\b/i.test(item.stem || ''));
      const target = pool.findIndex((item, index) => index > 1 && item.format === 'sata');
      let i = pool.length - 1; window.__savedRandom = Math.random;
      Math.random = () => { const index = i--; return index === 1 ? 0 : index === target ? 1.1 / (index + 1) : .99999; };
    });
    await page.locator('#pnleStartFullPractice').click();
    await page.evaluate(() => { Math.random = window.__savedRandom; delete window.__savedRandom; });
    const sataItem = await page.locator('.pnle-question-stem').evaluate(el => window.NursePathPnleMedSurg.items.find(item => item.stem === el.textContent));
    assert.equal(sataItem.format, 'sata');
    for (const index of sataItem.correctIndices) await page.locator('.pnle-choice').nth(index).click();
    const beforeSata = await counters(page);
    await page.reload(); await page.locator('#pnleResumePractice').click();
    assert.equal(await page.locator('.pnle-choice[aria-pressed="true"]').count(), sataItem.correctIndices.length, 'unfinished SATA selections survive refresh');
    assert.deepEqual(await counters(page), beforeSata, 'unsubmitted selections do not count as answers');
    await page.locator('#pnleSataSubmit').click();
    const afterSata = await counters(page);
    await page.reload(); await page.locator('#pnleResumePractice').click();
    assert.equal(await page.locator('.pnle-choice.is-correct').count(), sataItem.correctIndices.length);
    assert.deepEqual(await counters(page), afterSata, 'restored SATA feedback does not count twice');
    await page.locator('[data-study-tab="practice"]').click();
    page.once('dialog', dialog => dialog.dismiss()); await page.locator('#pnleStartPractice').click();
    assert.equal(JSON.parse(await page.evaluate(() => localStorage.getItem('nursepath_pnle_session_v1'))).ids.length, 100, 'cancelling a replacement preserves the full-bank session');
    if (screenshotDir) await page.screenshot({ path: path.join(screenshotDir, 'pnle-resume.png') });
    await page.locator('#pnleResumePractice').click();
    page.once('dialog', dialog => dialog.accept()); await page.locator('#pnleQuitSession').click();
    await page.evaluate(() => window.setNursePathTheme('light'));
    if (screenshotDir) await page.screenshot({ path: path.join(screenshotDir, 'pnle-practice.png') });
    console.log('UI refinement browser checks passed: labels, layout, themes, reduced motion, Daily10/full bank, resume without duplicate scoring, confirmation and completion.');
  } finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
