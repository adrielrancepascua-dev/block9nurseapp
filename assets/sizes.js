// NursePath sizes: teaching tray for needles, syringes, IV cannulas, and common tubes.
// Package print, the order, and the CI always win. Hub colors are memory aids.

(function () {
  const CHIPS = [
    { id: 'needles', label: 'Needles' },
    { id: 'syringes', label: 'Syringes' },
    { id: 'iv', label: 'IV cannulas' },
    { id: 'tubes', label: 'Tubes' }
  ];

  const sizes = [
    { id: 'id-needle', family: 'needles', name: 'Intradermal', spec: '25–27 G · 1/4–5/8 in', color: '', swatch: '', use: 'Skin tests, small bleb', angle: '5–15°, bevel up', note: 'Usually a 1 mL tuberculin syringe. Inner forearm is the classic teaching site. Read the needle package for the exact gauge and length.' },
    { id: 'sq-needle', family: 'needles', name: 'Subcutaneous', spec: '25–30 G · 3/8–5/8 in', color: '', swatch: '', use: 'Insulin, heparin, many SQ meds', angle: '45°, or 90° with a short needle and enough tissue', note: 'Write “subcut,” not SQ. Insulin pen needles are often 4–6 mm and the cap color is brand-specific — use the box, not a universal color.' },
    { id: 'im-needle', family: 'needles', name: 'Intramuscular', spec: '20–25 G · 1–1.5 in adult', color: '', swatch: '', use: 'IM medicines', angle: '90°', note: 'Thicker medicine may need a lower gauge (wider bore). Deltoid, ventrogluteal, and vastus lateralis are the usual teaching sites. Length follows body size and the site, not a single number for every adult.' },
    { id: 'hub-18', family: 'needles', name: '18 G hypodermic', spec: 'Pink hub', color: 'Pink', swatch: '#f9a8d4', use: 'Drawing up viscous medicine', angle: '', note: 'ISO hub color for an 18 G hypodermic is pink. This is not the same color system as IV cannulas. An 18 G IV cannula is green.' },
    { id: 'hub-20', family: 'needles', name: '20 G hypodermic', spec: 'Yellow hub', color: 'Yellow', swatch: '#facc15', use: 'IM, drawing up', angle: '', note: 'ISO hub color is yellow. Confirm gauge printed on the hub. IV 20 G cannulas are pink.' },
    { id: 'hub-21', family: 'needles', name: '21 G hypodermic', spec: 'Green hub', color: 'Green', swatch: '#16a34a', use: 'IM', angle: '', note: 'ISO hub color is deep green. Do not match it to the green 18 G IV cannula.' },
    { id: 'hub-22', family: 'needles', name: '22 G hypodermic', spec: 'Black hub', color: 'Black', swatch: '#334155', use: 'IM or SQ', angle: '', note: 'ISO hub color is black.' },
    { id: 'hub-23', family: 'needles', name: '23 G hypodermic', spec: 'Blue hub', color: 'Blue', swatch: '#2563eb', use: 'IM or SQ', angle: '', note: 'ISO hub color is blue. IV 22 G cannulas are also blue — read the package.' },
    { id: 'hub-25', family: 'needles', name: '25 G hypodermic', spec: 'Orange hub', color: 'Orange', swatch: '#f97316', use: 'SQ, ID, thinner IM', angle: '', note: 'ISO hub color is orange. Higher gauge means a thinner needle.' },
    { id: 'hub-27', family: 'needles', name: '26–27 G hypodermic', spec: 'Brown / gray hub', color: 'Brown', swatch: '#92400e', use: 'ID and SQ', angle: '', note: '26 G is typically brown and 27 G gray under ISO hub colors. Brands can fade; the printed gauge wins.' },

    { id: 'tb-syr', family: 'syringes', name: '1 mL tuberculin', spec: '0.01 mL marks', color: '', swatch: '', use: 'Tiny doses, intradermal tests', angle: '', note: 'Marked in milliliters, not insulin units. Do not measure insulin in a TB syringe.' },
    { id: 'ins-syr', family: 'syringes', name: 'Insulin syringe', spec: 'U-100 · 0.3, 0.5, or 1 mL', color: '', swatch: '', use: 'U-100 insulin only', angle: '', note: 'The barrel is marked in units. Match U-100 insulin with a U-100 syringe. An orange cap is common and is still not a substitute for reading the label.' },
    { id: 'syr-3', family: 'syringes', name: '3 mL syringe', spec: 'Most IM and SQ doses', color: '', swatch: '', use: 'Injections', angle: '', note: 'The everyday injection syringe in student labs. Check the mark you need before you draw.' },
    { id: 'syr-5', family: 'syringes', name: '5 mL syringe', spec: 'Larger IV doses', color: '', swatch: '', use: 'IV medicines, dilution', angle: '', note: 'Use when the volume does not fit cleanly in a 3 mL syringe.' },
    { id: 'syr-10', family: 'syringes', name: '10 mL syringe', spec: 'Flushes and dilution', color: '', swatch: '', use: 'IV flush, reconstituting', angle: '', note: 'Many IV push medicines are diluted and given from a 10 mL syringe. Follow the drug reference and the order for rate.' },
    { id: 'syr-20', family: 'syringes', name: '20 mL syringe', spec: 'Irrigation and larger volumes', color: '', swatch: '', use: 'Irrigation, dilution', angle: '', note: 'Not an injection syringe for routine IM doses.' },
    { id: 'syr-50', family: 'syringes', name: '50–60 mL syringe', spec: 'Catheter tip or Luer tip', color: '', swatch: '', use: 'Enteral feeds, irrigation, aspiration', angle: '', note: 'A catheter tip is for tubes. A Luer tip connects to IV and needle hubs. Do not swap them.' },

    { id: 'iv-14', family: 'iv', name: '14 G cannula', spec: 'Orange hub', color: 'Orange', swatch: '#f97316', use: 'Trauma, very rapid infusion', angle: '', note: 'Largest common teaching gauge. Lower gauge number means a wider tube. Hospital kits and the order decide, not the color alone.' },
    { id: 'iv-16', family: 'iv', name: '16 G cannula', spec: 'Gray hub', color: 'Gray', swatch: '#94a3b8', use: 'Trauma, surgery, rapid fluid', angle: '', note: 'Wide bore. Used when a large volume has to move quickly.' },
    { id: 'iv-18', family: 'iv', name: '18 G cannula', spec: 'Green hub', color: 'Green', swatch: '#16a34a', use: 'Blood, surgery, rapid meds', angle: '', note: 'Common teaching choice when blood may be given. Green here is the IV cannula, not the green 21 G hypodermic.' },
    { id: 'iv-20', family: 'iv', name: '20 G cannula', spec: 'Pink hub', color: 'Pink', swatch: '#f9a8d4', use: 'Routine adult IV', angle: '', note: 'The usual adult maintenance and medication line in many wards. Blood is often easier through an 18 G.' },
    { id: 'iv-22', family: 'iv', name: '22 G cannula', spec: 'Blue hub', color: 'Blue', swatch: '#2563eb', use: 'Smaller veins, many routine IVs', angle: '', note: 'A good teaching default for small or fragile veins. Still read the order if blood or contrast is planned.' },
    { id: 'iv-24', family: 'iv', name: '24 G cannula', spec: 'Yellow hub', color: 'Yellow', swatch: '#eab308', use: 'Pediatrics, fragile veins', angle: '', note: 'Slow drips and small veins. Not the first choice for rapid volume.' },
    { id: 'iv-26', family: 'iv', name: '26 G cannula', spec: 'Violet hub', color: 'Violet', swatch: '#7c3aed', use: 'Neonates, very small veins', angle: '', note: 'Tiny bore. Color names vary slightly by brand; the printed gauge wins.' },

    { id: 'foley', family: 'tubes', name: 'Indwelling urinary catheter', spec: 'Adult teaching band 14–18 Fr', color: '', swatch: '', use: 'Bladder drainage', angle: '', note: 'French size: a higher number is a wider tube. Balloon volume is printed on the catheter (often 5–10 mL sterile water for a standard 2-way). Use the package, not a memorized fill.' },
    { id: 'foley-3', family: 'tubes', name: '3-way urinary catheter', spec: 'Often 20–24 Fr', color: '', swatch: '', use: 'Continuous bladder irrigation', angle: '', note: 'The third lumen is for irrigation. Size and balloon follow the order and the hematuria setup, not the routine Foley chart.' },
    { id: 'ng-sump', family: 'tubes', name: 'Nasogastric tube', spec: 'Adult teaching band 14–18 Fr', color: '', swatch: '', use: 'Decompression', angle: '', note: 'Salem sump and Levin tubes sit in this band. Measure nose–ear–xiphoid for length, then confirm placement the way your CI teaches before anything goes down the tube.' },
    { id: 'ng-fine', family: 'tubes', name: 'Fine-bore feeding tube', spec: 'Often 8–12 Fr', color: '', swatch: '', use: 'Enteral feeding', angle: '', note: 'Softer and narrower than a decompression NG. Placement check is mandatory. Do not use a large irrigation syringe as if it were a sump.' }
  ];

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  const FAMILY_ICON = { needles: 'needle', syringes: 'syringe', iv: 'iv', tubes: 'tube' };
  let activeChip = 'all';
  let searchTerm = '';

  function filtered() {
    const q = searchTerm.trim().toLowerCase();
    return sizes.filter((item) => {
      if (activeChip !== 'all' && item.family !== activeChip) return false;
      if (!q) return true;
      return [item.name, item.spec, item.use, item.note, item.color].join(' ').toLowerCase().includes(q);
    });
  }

  function chipCount(id) {
    const q = searchTerm.trim().toLowerCase();
    return sizes.filter((item) => {
      if (id !== 'all' && item.family !== id) return false;
      if (!q) return true;
      return [item.name, item.spec, item.use, item.note, item.color].join(' ').toLowerCase().includes(q);
    }).length;
  }

  function renderChips() {
    const host = document.getElementById('sz-chips');
    if (!host || !window.NPRef) return;
    const opts = [{ id: 'all', label: 'All trays' }].concat(CHIPS);
    window.NPRef.buildSelect(host, {
      id: 'sz-filter',
      label: 'Tray',
      value: activeChip,
      options: opts.map((c) => ({ id: c.id, label: c.label, count: chipCount(c.id) })),
      onChange: (value) => {
        activeChip = value;
        renderSizeList();
      }
    });
  }

  function block(kind, title, body, ic) {
    if (!body) return '';
    return `<section class="rf-card rf-card--${kind}">
      <div class="rf-card-head"><span class="rf-card-ic">${window.NPRef.icon(ic || 'eye')}</span><span class="rf-card-label">${escapeHtml(title)}</span></div>
      <div class="rf-card-body">${escapeHtml(body)}</div>
    </section>`;
  }

  function showSizeDetail(item, opts) {
    const detailEl = document.getElementById('sz-detail');
    if (!detailEl || !item) return;
    const track = typeof window.trackUsageSafe === 'function' ? window.trackUsageSafe : null;
    if (track) track('size_ref', 'feature_open', { item_id: item.id }, { minIntervalMs: 1000, rateKey: `sz_open_${item.id}` });
    const fam = CHIPS.find((c) => c.id === item.family);
    const R = window.NPRef;
    const badge = item.swatch
      ? `<span class="rf-badge rf-badge--lg rf-badge--swatch" style="--sw:${item.swatch}">${R.icon(FAMILY_ICON[item.family])}</span>`
      : `<span class="rf-badge rf-badge--lg rf-badge--icon">${R.icon(FAMILY_ICON[item.family])}</span>`;
    const hubPill = item.color
      ? `<span class="rf-pill rf-pill--hub"><i style="background:${item.swatch}"></i>Hub: ${escapeHtml(item.color)}</span>`
      : '';
    detailEl.innerHTML = `
      <div class="rf-detail-head">
        ${badge}
        <div class="rf-detail-head-text">
          <div class="rf-kicker">${escapeHtml(fam ? fam.label : '')}</div>
          <h3 class="rf-title">${escapeHtml(item.name)}</h3>
        </div>
      </div>
      ${hubPill ? `<div class="rf-meta">${hubPill}</div>` : ''}
      <section class="rf-hero">
        <div class="rf-hero-label">Size</div>
        <div class="rf-hero-value">${escapeHtml(item.spec)}</div>
      </section>
      ${block('use', 'Typical use', item.use, 'check')}
      ${item.angle ? block('how', 'Insertion angle', item.angle, 'target') : ''}
      ${block('watch', 'Watch', item.note, 'warn')}
      <div class="rf-foot">Teaching sizes. The package, the order, and your CI win.</div>`;
    window.__nursepathSelectedSize = item;
    document.querySelectorAll('.sz-row').forEach((el) => {
      el.classList.toggle('is-active', el.dataset.szId === item.id);
    });
    if (!(opts && opts.skipHistory) && typeof window.pushNursePathState === 'function') {
      window.pushNursePathState({ view: 'sizes-detail', tab: 'sizes', sizeId: item.id });
    }
    const hub = document.querySelector('.sz-hub');
    const list = document.getElementById('sz-list-container');
    const detail = document.getElementById('sz-detail-container');
    if (window.innerWidth < 768) {
      window.__npListScroll = window.scrollY;
      if (hub) hub.classList.add('is-detail');
      if (list) list.classList.add('hidden');
      if (detail) detail.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }

  function hideSizeDetail(opts) {
    const list = document.getElementById('sz-list-container');
    const detail = document.getElementById('sz-detail-container');
    const detailEl = document.getElementById('sz-detail');
    const hub = document.querySelector('.sz-hub');
    if (hub) hub.classList.remove('is-detail');
    if (list) list.classList.remove('hidden');
    if (detail) detail.classList.add('hidden');
    const savedScroll = window.__npListScroll;
    window.__npListScroll = null;
    if (detailEl) detailEl.innerHTML = window.NPRef.placeholder('needle', 'Tap a size for the usual job, the angle, and what to read on the package.');
    window.__nursepathSelectedSize = null;
    document.querySelectorAll('.sz-row.is-active').forEach((el) => el.classList.remove('is-active'));
    if (!(opts && opts.skipHistory)) {
      const cur = window.history.state;
      if (cur && cur.np === 1 && cur.view === 'sizes-detail') window.history.back();
      else if (typeof window.pushNursePathState === 'function') window.pushNursePathState({ view: 'sizes', tab: 'sizes' });
    }
    if (window.innerWidth < 768 && typeof savedScroll === 'number') {
      const apply = () => window.scrollTo({ top: savedScroll, behavior: 'auto' });
      apply();
      requestAnimationFrame(apply);
    }
  }

  function renderSizeList() {
    const host = document.getElementById('sz-list');
    if (!host) return;
    renderChips();
    const items = filtered();
    const fragment = document.createDocumentFragment();
    const selected = window.__nursepathSelectedSize && window.__nursepathSelectedSize.id;
    const q = searchTerm.trim();
    window.NPRef.setCount(document.getElementById('sz-count'), items.length, sizes.length, 'sizes', Boolean(q) || activeChip !== 'all');
    if (!items.length) {
      const empty = document.createElement('div');
      empty.className = 'rf-empty';
      empty.textContent = 'No matches. Try 22, insulin, or Foley.';
      fragment.appendChild(empty);
    } else {
      let lastFam = '';
      items.forEach((item) => {
        if (activeChip === 'all' && item.family !== lastFam) {
          lastFam = item.family;
          const label = document.createElement('div');
          label.className = 'rf-group';
          const fam = CHIPS.find((c) => c.id === item.family);
          label.textContent = fam ? fam.label : item.family;
          fragment.appendChild(label);
        }
        const row = document.createElement('button');
        row.type = 'button';
        row.className = 'rf-row' + (selected === item.id ? ' is-active' : '');
        row.dataset.szId = item.id;
        const lead = item.swatch
          ? `<span class="rf-badge rf-badge--swatch" style="--sw:${item.swatch}" title="Hub color: ${escapeHtml(item.color)}">${window.NPRef.icon(FAMILY_ICON[item.family])}</span>`
          : `<span class="rf-badge rf-badge--icon">${window.NPRef.icon(FAMILY_ICON[item.family])}</span>`;
        row.innerHTML = `${lead}
          <span class="rf-row-body">
            <span class="rf-row-title">${escapeHtml(item.name)}</span>
            <span class="rf-row-sub">${escapeHtml(item.spec)}</span>
          </span>
          <span class="rf-row-go">${window.NPRef.icon('chevron')}</span>`;
        row.onclick = () => showSizeDetail(item);
        fragment.appendChild(row);
      });
    }
    host.innerHTML = '';
    host.appendChild(fragment);
  }

  let searchTimer = null;
  function initSizes() {
    renderSizeList();
    const input = document.getElementById('sz-search');
    if (window.NPRef) window.NPRef.bindSearch(input);
    if (input && !input.dataset.npBound) {
      input.dataset.npBound = '1';
      input.addEventListener('input', (e) => {
        if (searchTimer) clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
          searchTerm = e.target.value || '';
          renderSizeList();
          searchTimer = null;
        }, 180);
      });
    }
  }

  function resetSizeView() {
    activeChip = 'all';
    searchTerm = '';
    const input = document.getElementById('sz-search');
    if (input) { input.value = ''; const c = input.closest('.rf-search'); if (c) c.querySelector('.rf-search-clear').hidden = true; }
    hideSizeDetail({ skipHistory: true });
    renderSizeList();
  }

  window.sizeDatabase = sizes;
  window.renderSizeList = renderSizeList;
  window.showSizeDetail = showSizeDetail;
  window.hideSizeDetail = hideSizeDetail;
  window.initSizes = initSizes;
  window.resetSizeView = resetSizeView;
})();