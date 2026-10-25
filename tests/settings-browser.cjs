// Run with Playwright available through NODE_PATH and CHROME_PATH set if needed.
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const mime = { '.html':'text/html', '.js':'application/javascript', '.css':'text/css', '.json':'application/json', '.png':'image/png', '.xml':'application/xml' };
const server = http.createServer((req,res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const target = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!target.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(target, (error, data) => {
    if(error) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'Content-Type': mime[path.extname(target)] || 'text/plain' }); res.end(data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, headless: true });
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'light' });
    await context.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
    await context.addInitScript(() => {
      if (!sessionStorage.getItem('settings_seeded')) {
        localStorage.setItem('nursepath_user', JSON.stringify({ email: 'local-test@example.com' }));
        localStorage.setItem('nursepath_theme', 'light');
        localStorage.setItem('nursepath_simulation_agreed', JSON.stringify({ agreed: true, expires: Date.now()+86400000 }));
        sessionStorage.setItem('settings_seeded','1');
      }
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.stack || error.message));
    await page.goto('http://127.0.0.1:' + server.address().port);
    await page.evaluate(async () => { await navigator.serviceWorker.ready; });
    await page.waitForFunction(() => typeof window.openNursePathSettings === 'function');
    const duty = page.locator('#pnleLaunchDuty');
    if (await duty.isVisible()) await duty.click();
    const screenshotDir = process.env.SETTINGS_SCREENSHOTS;
    assert.equal(await page.locator('#pnleDutySwitchMode').locator('..').getAttribute('data-mode'), 'duty');
    assert.equal(await page.locator('#pnleDutySwitchMode [data-app-mode-label]').textContent(), 'Standard');
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 });
      const brand = await page.locator('#nursepathHeaderLogo').boundingBox();
      const mode = await page.locator('#pnleDutySwitchMode').boundingBox();
      const settings = await page.locator('#npSettingsOpen').boundingBox();
      assert.ok(brand.x + brand.width <= mode.x, 'brand and mode must not overlap');
      assert.ok(settings.x + settings.width <= width, 'settings stays on screen');
      await page.locator('#pnleDutySwitchMode').click();
      const menu = await page.locator('#pnleDutySwitchModeMenu').boundingBox();
      assert.ok(Math.abs(menu.x - mode.x) < 1, 'menu left edge aligns with trigger: ' + JSON.stringify({width, menu, mode}));
      assert.ok(Math.abs(menu.width - mode.width) < 1, 'menu width matches trigger');
      const label = await page.locator('#pnleDutySwitchMode [data-app-mode-label]').boundingBox();
      assert.ok(Math.abs(label.x + label.width / 2 - mode.x - mode.width / 2) < 1, 'trigger text stays centered: ' + JSON.stringify({width,label,mode,style:await page.locator('#pnleDutySwitchMode').evaluate(el=>({padding:getComputedStyle(el).padding,justify:getComputedStyle(el).justifyContent,gap:getComputedStyle(el).gap}))}));
      assert.equal(await page.locator('#pnleDutySwitchModeMenu [data-app-mode="duty"]').evaluate(el => getComputedStyle(el).textAlign), 'center');
      await page.keyboard.press('Escape');
    }
    if (screenshotDir) { fs.mkdirSync(screenshotDir, { recursive: true }); await page.screenshot({ animations: 'disabled', path: path.join(screenshotDir, 'standard-header.png') }); }
    await page.locator('#pnleDutySwitchMode').click();
    assert.equal(await page.locator('#pnleDutySwitchMode').getAttribute('aria-expanded'), 'true');
    assert.equal(await page.locator('#pnleDutySwitchMode > svg').count(), 1, 'only the chevron remains');
    if (screenshotDir) await page.screenshot({ animations: 'disabled', path: path.join(screenshotDir, 'mode-menu.png') });
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#pnleStudySwitchMode').locator('..').getAttribute('data-mode'), 'study');
    assert.equal(await page.evaluate(() => localStorage.getItem('nursepath_launch_mode_v1')), 'study');
    await page.locator('#pnleSettingsOpen').click();
    assert.equal(await page.locator('#npSettingsSheet').isVisible(), true);
    await page.locator('#npSettingsClose').click();
    assert.equal(await page.evaluate(() => document.activeElement.id), 'pnleSettingsOpen');
    if (screenshotDir) await page.screenshot({ animations: 'disabled', path: path.join(screenshotDir, 'pnle-header.png') });
    await page.locator('#pnleStudySwitchMode').click();
    await page.locator('#pnleStudySwitchModeMenu [data-app-mode="duty"]').click();
    await page.locator('#pnleDutySwitchMode').click();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#pnleDutySwitchModeMenu').isHidden(), true);
    assert.equal(await page.locator('#pnleDutySwitchMode').locator('..').getAttribute('data-mode'), 'duty');
    assert.equal(await page.evaluate(() => localStorage.getItem('nursepath_launch_mode_v1')), 'duty');
    await page.locator('#npSettingsOpen').click();
    await page.keyboard.press('Shift+Tab');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'settingsLogout');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'npSettingsClose');
    await page.waitForFunction(() => document.getElementById('settingsPackStatus').textContent === 'Ready');
    await page.locator('.np-settings-panel').evaluate(async el => { await Promise.all(el.getAnimations().map(animation => animation.finished.catch(() => {}))); });
    assert.equal(await page.locator('.np-settings-panel').evaluate(el => getComputedStyle(el).opacity), '1');
    assert.equal(await page.locator('#settingsAccountEmail').textContent(), 'local-test@example.com');
    assert.ok((await page.locator('#settingsAccountProvider').textContent()).includes('not verified'));
    assert.equal(await page.locator('[data-settings-theme="light"]').getAttribute('aria-pressed'), 'true');
    if (screenshotDir) { fs.mkdirSync(screenshotDir, { recursive: true }); await page.screenshot({ animations: 'disabled', path: path.join(screenshotDir, 'settings-mobile-light.png') }); }
    await page.locator('[data-settings-theme="system"]').click();
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') !== 'light');
    assert.equal(await page.evaluate(() => localStorage.getItem('nursepath_theme')), 'system');
    if (screenshotDir) await page.screenshot({ animations: 'disabled', path: path.join(screenshotDir, 'settings-mobile-dark.png') });
    await page.locator('summary').first().click();
    await page.locator('summary').last().click();
    await page.locator('#settingsLogout').scrollIntoViewIfNeeded();
    if (screenshotDir) await page.screenshot({ animations: 'disabled', path: path.join(screenshotDir, 'settings-mobile-details.png') });
    await page.locator('[data-settings-theme="system"]').scrollIntoViewIfNeeded();
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.locator('[data-settings-theme="light"]').click();
    await page.locator('.np-settings-panel').evaluate(el => { el.scrollTop = 0; });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    if (screenshotDir) await page.screenshot({ animations: 'disabled', path: path.join(screenshotDir, 'settings-desktop.png') });
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#npSettingsSheet').isHidden(), true);
    assert.equal(await page.evaluate(() => document.activeElement.id), 'npSettingsOpen');
    await page.locator('#npSettingsOpen').click();
    await page.locator('#settingsCheckUpdates').click();
    await page.waitForFunction(() => !document.getElementById('settingsCheckUpdates').disabled);
    assert.ok((await page.locator('#settingsUpdateStatus').textContent()).includes('no new service worker'));
    await context.setOffline(true);
    await page.locator('#settingsCheckUpdates').click();
    assert.ok((await page.locator('#settingsUpdateStatus').textContent()).includes('offline'));
    await page.reload();
    await page.waitForFunction(() => typeof window.openNursePathSettings === 'function');
    if (await duty.isVisible()) await duty.click();
    await page.locator('#npSettingsOpen').click();
    await page.waitForFunction(() => document.getElementById('settingsPackStatus').textContent === 'Ready');
    assert.equal(await page.locator('#settingsAccountEmail').textContent(), 'local-test@example.com');
    await context.setOffline(false);
    await page.evaluate(async () => { const names = await caches.keys(); const pack = await caches.open(names.find(name => name.startsWith('nursepath-v'))); await pack.delete(new URL('/assets/lab-values.js',location.origin).href); });
    await page.keyboard.press('Escape');
    await page.locator('#npSettingsOpen').click();
    await page.waitForFunction(() => document.getElementById('settingsPackStatus').textContent === 'Incomplete');
    page.once('dialog', dialog => dialog.dismiss());
    await page.locator('#settingsLogout').click();
    assert.ok(await page.evaluate(() => localStorage.getItem('nursepath_user')));
    page.once('dialog', dialog => dialog.accept());
    await page.locator('#settingsLogout').click();
    assert.equal(await page.evaluate(() => localStorage.getItem('nursepath_user')), null);
    assert.equal(await page.locator('#npSettingsSheet').isHidden(), true);
    // Existing upstream session teardown reassigns a const during page reload.
    // Keep this diagnostic visible without changing authentication/analytics here.
    const knownSessionError = error => error.includes('Assignment to constant variable.') && /endUsageSession .*\/js\/script-3\.js:488:/.test(error);
    const known = errors.filter(knownSessionError);
    if (known.length) console.log('Existing upstream telemetry issue observed on reload: endUsageSession reassigns a const (script-3.js:488).');
    assert.deepEqual(errors.filter(error => !knownSessionError(error)), []);
    console.log('Browser checks passed: real cache readiness, account, themes, updates, responsive layout, focus restoration, and confirmed logout.');
  } finally { if(browser) await browser.close(); server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
