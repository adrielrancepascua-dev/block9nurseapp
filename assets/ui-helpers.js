// Shared non-clinical UI helpers for NursePath.

// ---------------------------------------------------------------------------
// NPRef: small shared toolkit for the reference pages (OTC, Labs, Abbr, Sizes).
// Search box with clear button, <select> filter, result count, inline icons.
// ---------------------------------------------------------------------------
(function () {
  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  const ICONS = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    clear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12l7 7 7-7"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    flask: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 3h6M10 3v6L4.5 19a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L14 9V3"/><path d="M7.5 15h9"/></svg>',
    target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/></svg>',
    pill: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.5 20.5a4.95 4.95 0 0 1-7-7l10-10a4.95 4.95 0 0 1 7 7z"/><path d="M8.5 8.5l7 7"/></svg>',
    stethoscope: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3v6a4 4 0 0 0 8 0V3"/><path d="M9 13v2a5 5 0 0 0 10 0v-1"/><circle cx="19" cy="12" r="2"/></svg>',
    needle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21l7-7"/><path d="M10.5 10.5l5-5 3 3-5 5z"/><path d="M15 6l3 3M18 3l3 3"/></svg>',
    syringe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 2l4 4M20 4l-3 3M15 5l4 4-8.5 8.5-4-4z"/><path d="M6.5 13.5L3 17M9 11l2 2M12 8l2 2"/><path d="M3 21l3-3"/></svg>',
    iv: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3V2h4v1"/><rect x="6" y="3" width="12" height="12" rx="3.5"/><path d="M12 15v4M12 19l-3 3"/></svg>',
    tube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6c6 0 4 12 10 12h6"/><path d="M4 6h0"/><circle cx="4" cy="6" r="1.5"/><path d="M20 15v6"/></svg>',
    abbr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7V5h16v2M12 5v14M9 19h6"/></svg>'
  };

  function icon(name) { return ICONS[name] || ''; }

  // Toolbar markup shared by every reference page.
  function toolbarHTML(opts) {
    return `
      <div class="rf-toolbar">
        <div class="rf-search">
          <span class="rf-search-icon">${ICONS.search}</span>
          <input id="${opts.inputId}" type="search" class="rf-search-input" placeholder="${esc(opts.placeholder)}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${esc(opts.label)}" />
          <button type="button" class="rf-search-clear" hidden aria-label="Clear search">${ICONS.clear}</button>
        </div>
        <div id="${opts.filterHostId}" class="rf-filter"></div>
      </div>
      <div class="rf-count" id="${opts.countId}" aria-live="polite"></div>`;
  }

  // Wire the clear (x) button for a search input. Safe to call repeatedly.
  function bindSearch(input) {
    if (!input || input.dataset.rfBound) return;
    input.dataset.rfBound = '1';
    const wrap = input.closest('.rf-search');
    const clear = wrap && wrap.querySelector('.rf-search-clear');
    if (!clear) return;
    const sync = () => { clear.hidden = !input.value; };
    input.addEventListener('input', sync);
    clear.addEventListener('click', () => {
      input.value = '';
      sync();
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
    });
    sync();
  }

  // Render (or refresh) a <select> filter inside host.
  // cfg: { id, label, options: [{ id, label, count? }], value, onChange(value) }
  function buildSelect(host, cfg) {
    if (!host) return;
    let sel = host.querySelector('select');
    if (!sel) {
      host.innerHTML = `
        <label class="rf-filter-label" for="${cfg.id}">${esc(cfg.label)}</label>
        <div class="rf-select-wrap">
          <select id="${cfg.id}" class="rf-select"></select>
          <span class="rf-select-chevron" aria-hidden="true">${ICONS.chevron}</span>
        </div>`;
      sel = host.querySelector('select');
      sel.addEventListener('change', () => {
        if (host.__rfOnChange) host.__rfOnChange(sel.value);
      });
    }
    host.__rfOnChange = cfg.onChange;
    sel.innerHTML = cfg.options.map((o) => {
      const label = o.count == null ? o.label : `${o.label} (${o.count})`;
      return `<option value="${esc(o.id)}"${o.id === cfg.value ? ' selected' : ''}>${esc(label)}</option>`;
    }).join('');
    sel.value = cfg.value;
    host.classList.toggle('is-filtered', cfg.value !== cfg.options[0].id);
  }

  function setCount(el, shown, total, noun, filtered) {
    if (!el) return;
    if (!total) { el.textContent = ''; return; }
    el.textContent = filtered
      ? `Showing ${shown} of ${total} ${noun}`
      : `${total} ${noun}`;
  }

  function placeholder(iconName, text) {
    return `<div class="rf-placeholder"><span class="rf-placeholder-ic">${ICONS[iconName] || ''}</span><span>${esc(text)}</span></div>`;
  }

  window.NPRef = { esc, icon, toolbarHTML, bindSearch, buildSelect, setCount, placeholder };
})();

(function () {
  function getTrackUsageSafe() {
    return typeof window.trackUsageSafe === 'function' ? window.trackUsageSafe : null;
  }

  function getRequestTelemetryFlush() {
    return typeof window.requestTelemetryFlush === 'function' ? window.requestTelemetryFlush : null;
  }

  function otcFact(label, value, tone) {
    if (!value) return '';
    const toneClass = tone ? ` is-${tone}` : '';
    return `<div class="rf-fact${toneClass}"><span class="rf-fact-k">${label}</span><span class="rf-fact-v">${value}</span></div>`;
  }

  function showOTCDetail(item, opts) {
    const trackUsageSafe = getTrackUsageSafe();
    if (trackUsageSafe) {
      trackUsageSafe('otc_ref', 'feature_open', { item_id: item.id || 'unknown' }, { minIntervalMs: 1000, rateKey: `otc_open_${item.id || 'unknown'}` });
    }

    const nursingCheck = (item.additionalInfo && item.additionalInfo.nursingConsiderations)
      ? String(item.additionalInfo.nursingConsiderations).split('.')[0]
      : 'Check duplicates, allergies, pregnancy, and organ impairment before you cite this as reference.';
    const nursingShort = String(nursingCheck).trim().slice(0, 180) + (String(nursingCheck).length > 180 ? '…' : '');

    const R = window.NPRef;
    const dutyStrip = `
      <div class="rf-quick">
        <div class="rf-quick-title">Duty quick take</div>
        <div class="rf-quick-row"><span class="rf-quick-ic is-use">${R.icon('check')}</span><div><b>Use</b><span>${item.uses}</span></div></div>
        <div class="rf-quick-row"><span class="rf-quick-ic is-warn">${R.icon('warn')}</span><div><b>Caution</b><span>${item.contraindications}</span></div></div>
        <div class="rf-quick-row"><span class="rf-quick-ic is-nurse">${R.icon('stethoscope')}</span><div><b>Nursing check</b><span>${nursingShort}</span></div></div>
        <div class="rf-quick-foot">Learning reference. Apply your own judgment and confirm with your CI or ward protocol.</div>
      </div>
    `;

    const tldrContent = `
      <div class="rf-facts">
        ${otcFact('Uses', item.uses)}
        ${otcFact('Origin', item.origin)}
        ${otcFact('When to give', item.whenToGive)}
        ${otcFact('Cautions', item.contraindications, 'warn')}
      </div>
    `;

    const hasAdditionalInfo = Boolean(item.additionalInfo);
    let additionalContent = '';
    if (hasAdditionalInfo) {
      const info = item.additionalInfo;
      additionalContent = `
        <div class="rf-facts">
          ${info.genericNames ? otcFact('Generics', info.genericNames.join(', ')) : ''}
          ${info.drugClass ? otcFact('Drug class', info.drugClass, 'amber') : ''}
          ${otcFact('Uses', info.usesExpanded || item.uses)}
          ${info.mechanismOfAction ? otcFact('Mechanism', info.mechanismOfAction) : ''}
          ${otcFact('Origin', info.originExpanded || item.origin)}
          ${info.pharmacokinetics ? otcFact('PK', info.pharmacokinetics) : ''}
          ${info.dosing ? otcFact('Dosing', info.dosing, 'amber') : ''}
          ${otcFact('When to give', info.whenToGiveExpanded || item.whenToGive)}
          ${info.sideEffects ? otcFact('Side effects', info.sideEffects) : ''}
          ${otcFact('Cautions', info.contraindicationsExpanded || item.contraindications, 'warn')}
          ${info.drugInteractions ? otcFact('Interactions', info.drugInteractions, 'warn') : ''}
          ${info.nursingConsiderations ? otcFact('Nursing', info.nursingConsiderations, 'green') : ''}
          ${info.patientEducation ? otcFact('Teach', info.patientEducation) : ''}
        </div>
      `;
    }

    const detailEl = document.getElementById('otc-detail');
    if (!detailEl) {
      return;
    }

    const brands = (item.ph_brands || []).map((b) => `<span class="rf-pill">${b}</span>`).join('');
    const klass = (typeof window.otcShortClass === 'function') ? window.otcShortClass(item) : null;
    const html = `
      <div class="rf-detail-head">
        <span class="rf-badge rf-badge--lg rf-badge--icon">${R.icon('pill')}</span>
        <div class="rf-detail-head-text">
          <div class="rf-kicker">${klass ? klass.label : 'OTC medicine'}</div>
          <h3 class="rf-title">${item.name}</h3>
        </div>
      </div>
      ${brands ? `<div class="rf-meta"><span class="rf-meta-label">PH brands</span>${brands}</div>` : ''}
      ${dutyStrip}
      <button type="button" onclick="copyOTCReference()" class="rf-btn">${R.icon('copy')}<span>Copy quick reference</span></button>
      ${hasAdditionalInfo ? `
        <div class="rf-tabs" role="tablist">
          <button type="button" id="tldr-tab" onclick="switchOTCTab('tldr')" class="rf-tab is-active">TLDR</button>
          <button type="button" id="additional-tab" onclick="switchOTCTab('additional')" class="rf-tab">Study deeper</button>
        </div>
        <div id="tldr-content">${tldrContent}</div>
        <div id="additional-content" style="display: none;">${additionalContent}</div>
      ` : tldrContent}
    `;

    detailEl.innerHTML = html;
    window.__nursepathSelectedOtc = item;

    document.querySelectorAll('.otc-med-card').forEach((el) => {
      el.classList.toggle('is-active', Boolean(item.id) && el.dataset.otcId === String(item.id));
    });

    if (!(opts && opts.skipHistory) && typeof window.pushNursePathState === 'function') {
      window.pushNursePathState({ view: 'otc-detail', tab: 'otc', otcId: item.id || null });
    }

    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      const listContainer = document.getElementById('otc-list-container');
      const detailContainer = document.getElementById('otc-detail-container');
      window.__npListScroll = window.scrollY;
      if (listContainer) listContainer.classList.add('hidden');
      if (detailContainer) detailContainer.classList.remove('hidden');
      const otcHub = document.querySelector('.otc-hub');
      if (otcHub) otcHub.classList.add('is-detail');
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }

  function hideOTCDetail(opts) {
    const listContainer = document.getElementById('otc-list-container');
    const detailContainer = document.getElementById('otc-detail-container');
    if (listContainer) listContainer.classList.remove('hidden');
    if (detailContainer) detailContainer.classList.add('hidden');
    const otcHubEl = document.querySelector('.otc-hub');
    if (otcHubEl) otcHubEl.classList.remove('is-detail');
    const savedScroll = window.__npListScroll;
    window.__npListScroll = null;

    window.__nursepathSelectedOtc = null;
    document.querySelectorAll('.otc-med-card.is-active').forEach((el) => el.classList.remove('is-active'));

    const trackUsageSafe = getTrackUsageSafe();
    if (trackUsageSafe) {
      trackUsageSafe('otc_ref', 'feature_use', { action: 'back_to_list' }, { minIntervalMs: 1000, rateKey: 'otc_back_to_list' });
    }

    if (!(opts && opts.skipHistory)) {
      const cur = window.history.state;
      if (cur && cur.np === 1 && cur.view === 'otc-detail') window.history.back();
      else if (typeof window.pushNursePathState === 'function') window.pushNursePathState({ view: 'otc', tab: 'otc' });
    }
    if (window.innerWidth < 768 && typeof savedScroll === 'number') {
      const apply = () => window.scrollTo({ top: savedScroll, behavior: 'auto' });
      apply();
      requestAnimationFrame(apply);
    }
  }

  async function copyOTCReference() {
    const item = window.__nursepathSelectedOtc;
    if (!item) return;

    const info = item.additionalInfo || {};
    const payload = [
      `Medicine: ${item.name}`,
      `Brands: ${item.ph_brands.join(', ')}`,
      `Uses: ${item.uses}`,
      `When to Give: ${item.whenToGive}`,
      `Contraindications: ${item.contraindications}`,
      info.drugClass ? `Drug Class: ${info.drugClass}` : ''
    ].filter(Boolean).join('\n');

    try {
      await navigator.clipboard.writeText(payload);
      const trackUsageSafe = getTrackUsageSafe();
      if (trackUsageSafe) {
        trackUsageSafe('otc_ref', 'copy_reference', { item_id: item.id || 'unknown', source: 'otc_detail' }, { minIntervalMs: 1200, rateKey: `otc_copy_${item.id || 'unknown'}` });
      }
    } catch (err) {
      const trackUsageSafe = getTrackUsageSafe();
      if (trackUsageSafe) {
        trackUsageSafe('otc_ref', 'error_shown', { reason: 'clipboard_failed' }, { minIntervalMs: 1500, rateKey: 'otc_copy_error' });
      }
    }
  }

  function switchOTCTab(tab) {
    const tldrTab = document.getElementById('tldr-tab');
    const additionalTab = document.getElementById('additional-tab');
    const tldrContent = document.getElementById('tldr-content');
    const additionalContent = document.getElementById('additional-content');

    const trackUsageSafe = getTrackUsageSafe();
    if (trackUsageSafe) {
      trackUsageSafe('otc_ref', 'feature_use', { tab }, { minIntervalMs: 500, rateKey: `otc_tab_${tab}` });
    }

    if (tab === 'tldr') {
      if (tldrTab) tldrTab.classList.add('is-active');
      if (additionalTab) additionalTab.classList.remove('is-active');
      if (tldrContent) tldrContent.style.display = 'block';
      if (additionalContent) additionalContent.style.display = 'none';
    } else {
      if (additionalTab) additionalTab.classList.add('is-active');
      if (tldrTab) tldrTab.classList.remove('is-active');
      if (tldrContent) tldrContent.style.display = 'none';
      if (additionalContent) additionalContent.style.display = 'block';
    }
  }

  function calcIV() {
    const vol = parseFloat(document.getElementById('vol').value);
    const hours = parseFloat(document.getElementById('hours').value);
    const factor = parseFloat(document.getElementById('factor').value);
    const meaningEl = document.getElementById('iv-learn-meaning');
    const howEl = document.getElementById('iv-learn-how');

    if (vol && hours) {
      const mlPerHour = vol / hours;
      const gttPerMin = Math.round((mlPerHour / 60) * factor);
      const dfLabel = factor === 60 ? 'micro drip (peds/meds)' : 'macro drip';

      document.getElementById('mlhr').innerText = mlPerHour.toFixed(1) + ' mL/hr';
      document.getElementById('iv-result').innerText = gttPerMin + ' gtt/min';
      if (meaningEl) {
        meaningEl.textContent = `${mlPerHour.toFixed(1)} mL/hr → ${gttPerMin} gtt/min using ${factor} gtt/mL (${dfLabel}).`;
      }
      if (howEl) {
        howEl.textContent = `${vol}÷${hours} = ${mlPerHour.toFixed(1)} mL/hr; (${mlPerHour.toFixed(1)}÷60)×${factor} ≈ ${gttPerMin} gtt/min.`;
      }
      const trackUsageSafe = getTrackUsageSafe();
      if (trackUsageSafe) {
        trackUsageSafe('iv_calc', 'result_generated', { result_state: 'computed', has_value: true }, { minIntervalMs: 1500, rateKey: 'iv_calc_computed' });
      }
      const requestTelemetryFlush = getRequestTelemetryFlush();
      if (requestTelemetryFlush) requestTelemetryFlush();
    } else {
      document.getElementById('iv-result').innerText = '-- gtt/min';
      document.getElementById('mlhr').innerText = '-- mL/hr';
      if (meaningEl) meaningEl.textContent = 'Enter volume, time, and drop factor to compute.';
      if (howEl) howEl.textContent = 'mL/hr = V÷T · gtt/min = (mL/hr÷60)×DF';
    }
  }

  function calcBMI() {
    const w = parseFloat(document.getElementById('weight').value);
    const hCm = parseFloat(document.getElementById('height').value);
    const h = hCm / 100;
    const meaningEl = document.getElementById('bmi-learn-meaning');
    const howEl = document.getElementById('bmi-learn-how');

    if (w && h && h > 0) {
      const bmi = (w / (h * h)).toFixed(1);
      let category = 'Normal Weight';
      let categoryColor = 'text-green-400';

      if (bmi < 18.5) {
        category = 'Underweight';
        categoryColor = 'text-blue-400';
      } else if (bmi < 25) {
        category = 'Normal Weight';
        categoryColor = 'text-green-400';
      } else if (bmi < 30) {
        category = 'Overweight';
        categoryColor = 'text-yellow-400';
      } else {
        category = 'Obese';
        categoryColor = 'text-red-400';
      }

      document.getElementById('bmi-result').innerText = bmi;
      const bmiStatusEl = document.getElementById('bmi-status');
      bmiStatusEl.textContent = '';
      const catSpan = document.createElement('span');
      catSpan.className = categoryColor + ' font-bold';
      catSpan.textContent = 'Category: ' + category;
      bmiStatusEl.appendChild(catSpan);

      if (meaningEl) meaningEl.textContent = `BMI ${bmi} → ${category} (WHO adult). BMI ≠ diagnosis.`;
      if (howEl) howEl.textContent = `${w} ÷ (${hCm}/100)² = ${bmi}`;

      const trackUsageSafe = getTrackUsageSafe();
      if (trackUsageSafe) {
        trackUsageSafe('bmi', 'result_generated', { category, has_value: true }, { minIntervalMs: 1500, rateKey: `bmi_${category}` });
      }
      const requestTelemetryFlush = getRequestTelemetryFlush();
      if (requestTelemetryFlush) requestTelemetryFlush();
    }
  }

  function showPregnancyMilestones(currentWeeks, currentDays, calcDate, lmp) {
    const milestonesDiv = document.getElementById('pregnancy-milestones');
    const milestonesList = document.getElementById('milestones-list');

    const milestones = [
      { week: 6, name: 'Heartbeat detectable on ultrasound', icon: '💓' },
      { week: 8, name: 'All major organs forming', icon: '🫀' },
      { week: 10, name: 'End of embryonic period (now fetus)', icon: '👶' },
      { week: 12, name: 'First trimester screening (NT scan)', icon: '🔬' },
      { week: 13, name: 'Second trimester begins', icon: '📅' },
      { week: 16, name: 'Quickening (may feel movement)', icon: '✨' },
      { week: 18, name: 'Anomaly scan (18-22 weeks)', icon: '🩺' },
      { week: 24, name: 'Viability threshold', icon: '⭐' },
      { week: 27, name: 'Third trimester begins', icon: '📅' },
      { week: 28, name: 'GDM screening / Anti-D if Rh negative', icon: '💉' },
      { week: 32, name: 'Growth scan recommended', icon: '📊' },
      { week: 34, name: 'Group B Strep screening (35-37 wks)', icon: '🧫' },
      { week: 37, name: 'Early term (safe for delivery)', icon: '✅' },
      { week: 39, name: 'Full term', icon: '🎯' },
      { week: 40, name: 'Estimated due date', icon: '🗓️' },
      { week: 41, name: 'Late term - monitoring recommended', icon: '⚠️' },
      { week: 42, name: 'Post-term - induction usually recommended', icon: '🚨' }
    ];

    let html = '';
    milestones.forEach((m) => {
      const milestoneDate = new Date(lmp);
      milestoneDate.setDate(milestoneDate.getDate() + (m.week * 7));
      const dateStr = milestoneDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      if (currentWeeks >= m.week) {
        html += `<div class="flex items-center text-green-400"><span class="mr-2">✓</span><span class="flex-1">${m.icon} ${m.name}</span><span class="text-slate-500 text-[10px]">${dateStr}</span></div>`;
      } else if (currentWeeks >= m.week - 4) {
        html += `<div class="flex items-center text-yellow-400"><span class="mr-2">○</span><span class="flex-1">${m.icon} ${m.name}</span><span class="text-slate-500 text-[10px]">${dateStr}</span></div>`;
      }
    });

    if (milestonesList && milestonesDiv) {
      if (html) {
        milestonesList.innerHTML = html;
        milestonesDiv.classList.remove('hidden');
      } else {
        milestonesDiv.classList.add('hidden');
      }
    }
  }

  function calcAOGEDD() {
    const lmpInput = document.getElementById('lmp-date').value;
    const calcDateInput = document.getElementById('calc-date').value;

    if (!lmpInput) {
      document.getElementById('aog-result').innerText = 'Please enter LMP date';
      document.getElementById('aog-result').className = 'text-lg font-mono font-bold text-red-400';
      const trackUsageSafe = getTrackUsageSafe();
      if (trackUsageSafe) {
        trackUsageSafe('aog_edd', 'error_shown', { reason: 'missing_lmp' }, { minIntervalMs: 2000, rateKey: 'aog_missing_lmp' });
      }
      return;
    }

    const lmp = new Date(lmpInput);
    const calcDate = calcDateInput ? new Date(calcDateInput) : new Date();

    if (lmp > calcDate) {
      document.getElementById('aog-result').innerText = 'LMP cannot be after calculation date';
      document.getElementById('aog-result').className = 'text-lg font-mono font-bold text-red-400';
      const trackUsageSafe = getTrackUsageSafe();
      if (trackUsageSafe) {
        trackUsageSafe('aog_edd', 'error_shown', { reason: 'lmp_after_calc_date' }, { minIntervalMs: 2000, rateKey: 'aog_invalid_dates' });
      }
      return;
    }

    const diffTime = calcDate - lmp;
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(totalDays / 7);
    const days = totalDays % 7;

    const edd = new Date(lmp);
    edd.setDate(edd.getDate() + 280);
    const daysRemaining = Math.floor((edd - calcDate) / (1000 * 60 * 60 * 24));

    let trimester = '';
    let trimesterInfo = '';
    if (weeks < 13) {
      trimester = '1st Trimester';
      trimesterInfo = 'Weeks 1-12: Embryonic development, organ formation';
    } else if (weeks < 27) {
      trimester = '2nd Trimester';
      trimesterInfo = 'Weeks 13-26: Fetal growth, movement felt, viability threshold';
    } else if (weeks <= 42) {
      trimester = '3rd Trimester';
      trimesterInfo = 'Weeks 27-40: Rapid growth, lung maturation, preparation for birth';
    } else {
      trimester = 'Post-term';
      trimesterInfo = 'Beyond 42 weeks: Requires immediate medical evaluation';
    }

    const eddOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const eddFormatted = edd.toLocaleDateString('en-US', eddOptions);

    document.getElementById('aog-result').innerText = `${weeks} weeks, ${days} days`;
    document.getElementById('aog-result').className = 'text-2xl font-mono font-bold text-pink-400';
    document.getElementById('aog-days').innerText = `Total: ${totalDays} days`;
    document.getElementById('edd-result').innerText = eddFormatted;

    if (daysRemaining > 0) {
      document.getElementById('edd-remaining').innerText = `${daysRemaining} days remaining`;
    } else if (daysRemaining === 0) {
      document.getElementById('edd-remaining').innerText = 'Due date is today!';
      document.getElementById('edd-remaining').className = 'text-xs text-pink-400 mt-1 font-bold';
    } else {
      document.getElementById('edd-remaining').innerText = `${Math.abs(daysRemaining)} days past due date`;
      document.getElementById('edd-remaining').className = 'text-xs text-red-400 mt-1 font-bold';
    }

    document.getElementById('trimester-result').innerText = trimester;
    document.getElementById('trimester-info').innerText = trimesterInfo;

    const meaningEl = document.getElementById('aog-learn-meaning');
    const howEl = document.getElementById('aog-learn-how');
    if (meaningEl) {
      meaningEl.textContent = `AOG ${weeks}w ${days}d · ${trimester}. EDD ${eddFormatted}.`;
    }
    if (howEl) {
      howEl.textContent = `LMP + 280 days = EDD. AOG = ${totalDays} days from LMP to calculation date.`;
    }

    const trackUsageSafe = getTrackUsageSafe();
    if (trackUsageSafe) {
      trackUsageSafe('aog_edd', 'result_generated', { trimester, due_state: daysRemaining > 0 ? 'future' : (daysRemaining === 0 ? 'today' : 'past_due') }, { minIntervalMs: 1500, rateKey: `aog_${trimester}` });
    }
    const requestTelemetryFlush = getRequestTelemetryFlush();
    if (requestTelemetryFlush) requestTelemetryFlush();

    showPregnancyMilestones(weeks, days, calcDate, lmp);
  }

  window.NursePathUIHelpers = {
    showOTCDetail,
    hideOTCDetail,
    copyOTCReference,
    switchOTCTab,
    calcIV,
    calcBMI,
    calcAOGEDD,
    showPregnancyMilestones,
  };
})();