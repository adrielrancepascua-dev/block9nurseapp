const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const { createPreviewServer } = require('../tools/mobile-preview.cjs');
(async () => {
  const server = createPreviewServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH });
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await context.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
    const page = await context.newPage();
    const backendRequests = [];
    page.on('request', req => { if (new URL(req.url()).hostname.endsWith('.supabase.co')) backendRequests.push(req.url()); });
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    await page.waitForFunction(() => window.__nursepathAuthState && window.__nursepathAuthState.authenticated);
    assert.equal(await page.locator('#authOverlay').isVisible(), false);
    assert.equal(await page.evaluate(() => localStorage.getItem('nursepath_usage_consent_v1')), '0');
    await page.evaluate(() => {
      // Explicitly accept the existing agreement for this automated UI check.
      const button = document.querySelector('#simulationModeOverlay button');
      if (button) button.click();
    });
    await page.waitForFunction(() => typeof window.openNursePathSettings === 'function');
    const standard = page.locator('#pnleLaunchDuty');
    await standard.waitFor({ state: 'visible' });
    await standard.click();
    await page.locator('#pnleLaunchGate').waitFor({ state: 'hidden' });
    await page.locator('#pnleDutySwitchMode').click();
    await page.locator('#pnleDutySwitchModeMenu [data-app-mode="study"]').click();
    await page.locator('[data-study-tab="progress"]').click();
    assert.equal(await page.locator('.pnle-progress-dashboard').isVisible(), true);
    await page.reload();
    await page.waitForFunction(() => window.__nursepathAuthState && window.__nursepathAuthState.authenticated);
    assert.equal(await page.locator('#authOverlay').isVisible(), false);
    assert.equal(backendRequests.length, 0, 'UI preview must not call the production backend');
    console.log('Mobile preview opens Standard and PNLE without OAuth; refresh stays signed in; no backend requests.');
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
