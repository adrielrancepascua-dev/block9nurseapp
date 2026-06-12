// Shared non-clinical UI helpers for NursePath.

(function () {
  function getTrackUsageSafe() {
    return typeof window.trackUsageSafe === 'function' ? window.trackUsageSafe : null;
  }

  function getRequestTelemetryFlush() {
    return typeof window.requestTelemetryFlush === 'function' ? window.requestTelemetryFlush : null;
  }

  function renderOTCSidebar() {
    const conditionsEl = document.getElementById('conditions');
    const container = document.getElementById('otc-sidebar');
    const database = Array.isArray(window.otcDatabase) ? window.otcDatabase : [];

    if (!conditionsEl || !container) {
      return;
    }

    const conditions = conditionsEl.value;
    container.innerHTML = '';

    const colors = ['yellow-500', 'orange-500', 'purple-500', 'red-500', 'green-500', 'blue-500', 'pink-500', 'indigo-500'];

    database.forEach((med, index) => {
      const color = colors[index % colors.length];
      const borderClass = `border-l-4 border-${color}`;
      const hoverClass = `hover:border-${color.replace('500', '400')}`;

      let safetyStatus = 'SAFE';
      let safetyIcon = '🟢';
      let warningText = '';

      if (conditions && med.conditionSafety && med.conditionSafety[conditions]) {
        safetyStatus = med.conditionSafety[conditions];
        if (safetyStatus === '⚠️ CONTRAINDICATED') {
          safetyIcon = '🔴';
          warningText = `⚠️ AVOID with ${conditions.toUpperCase()}`;
        } else if (safetyStatus === 'CAUTION') {
          safetyIcon = '🟡';
          warningText = `⚠️ USE WITH CAUTION with ${conditions.toUpperCase()}`;
        }
      }

      const brandNames = med.ph_brands ? med.ph_brands.join(' • ') : 'N/A';
      const card = document.createElement('div');
      card.className = `bg-slate-700/50 p-3 rounded-xl ${borderClass} ${hoverClass} transition-all cursor-pointer hover:bg-slate-700/70`;
      card.innerHTML = `
        <p class="font-bold text-sm text-sky-300">${safetyIcon} ${med.name}</p>
        <p class="text-[10px] text-slate-500 font-semibold">PH Brands: ${brandNames}</p>
        ${warningText ? `<p class="text-[10px] mt-1 text-red-400 font-bold">${warningText}</p>` : ''}
        <p class="text-[11px] mt-1 text-slate-300">${med.uses}</p>
        <p class="text-[10px] text-slate-400 italic mt-1">When: ${med.whenToGive}</p>
      `;
      card.onclick = () => showOTCDetail(med);
      container.appendChild(card);
    });
  }

  function showOTCDetail(item) {
    const trackUsageSafe = getTrackUsageSafe();
    if (trackUsageSafe) {
      trackUsageSafe('otc_ref', 'feature_open', { item_id: item.id || 'unknown' }, { minIntervalMs: 1000, rateKey: `otc_open_${item.id || 'unknown'}` });
    }

    const tldrContent = `
      <div class="space-y-2 text-sm text-slate-300">
        <div><strong class="text-slate-200">Uses:</strong> ${item.uses}</div>
        <div><strong class="text-slate-200">Origin:</strong> ${item.origin}</div>
        <div><strong class="text-slate-200">When to Give:</strong> ${item.whenToGive}</div>
        <div><strong class="text-red-400">Contraindications / Cautions:</strong> ${item.contraindications}</div>
      </div>
    `;

    const hasAdditionalInfo = Boolean(item.additionalInfo);
    let additionalContent = '';
    if (hasAdditionalInfo) {
      const info = item.additionalInfo;
      additionalContent = `
        <div class="space-y-3 text-sm text-slate-300">
          ${info.genericNames ? `<div><strong class="text-cyan-400">Generic Names:</strong> ${info.genericNames.join(', ')}</div>` : ''}
          ${info.drugClass ? `<div><strong class="text-cyan-400">Drug Class:</strong> ${info.drugClass}</div>` : ''}
          <div><strong class="text-slate-200">Uses:</strong> ${info.usesExpanded || item.uses}</div>
          ${info.mechanismOfAction ? `<div><strong class="text-emerald-400">Mechanism of Action:</strong> ${info.mechanismOfAction}</div>` : ''}
          <div><strong class="text-slate-200">Origin:</strong> ${info.originExpanded || item.origin}</div>
          ${info.pharmacokinetics ? `<div><strong class="text-blue-400">Pharmacokinetics:</strong> ${info.pharmacokinetics}</div>` : ''}
          ${info.dosing ? `<div><strong class="text-amber-400">Dosing:</strong> ${info.dosing}</div>` : ''}
          <div><strong class="text-slate-200">When to Give:</strong> ${info.whenToGiveExpanded || item.whenToGive}</div>
          ${info.sideEffects ? `<div><strong class="text-orange-400">Side Effects:</strong> ${info.sideEffects}</div>` : ''}
          <div><strong class="text-red-400">Contraindications / Cautions:</strong> ${info.contraindicationsExpanded || item.contraindications}</div>
          ${info.drugInteractions ? `<div><strong class="text-pink-400">Drug Interactions:</strong> ${info.drugInteractions}</div>` : ''}
          ${info.nursingConsiderations ? `<div><strong class="text-green-400">Nursing Considerations:</strong> ${info.nursingConsiderations}</div>` : ''}
          ${info.patientEducation ? `<div><strong class="text-blue-300">Patient Education:</strong> ${info.patientEducation}</div>` : ''}
        </div>
      `;
    }

    const detailEl = document.getElementById('otc-detail');
    if (!detailEl) {
      return;
    }

    const html = `
      <h3 class="font-bold text-xl text-amber-300 mb-1">${item.name}</h3>
      <p class="text-xs text-slate-400 mb-3">Philippine Brand Names: ${item.ph_brands.join(', ')}</p>
      <button onclick="copyOTCReference()" class="mb-3 px-3 py-2 text-xs font-semibold rounded-lg transition" style="background: linear-gradient(135deg, #0e7490, #0f766e); color: white; border: 1px solid #14b8a6;">Copy Quick Reference</button>
      ${hasAdditionalInfo ? `
        <div class="flex gap-2 mb-4">
          <button id="tldr-tab" onclick="switchOTCTab('tldr')" class="px-4 py-2 text-sm font-semibold rounded-lg transition" style="background: linear-gradient(135deg, #06b6d4, #0891b2); color: white;">📋 TLDR</button>
          <button id="additional-tab" onclick="switchOTCTab('additional')" class="px-4 py-2 text-sm font-semibold rounded-lg transition" style="background: #334155; color: #94a3b8;">📚 Additional Info</button>
        </div>
        <div id="tldr-content">${tldrContent}</div>
        <div id="additional-content" style="display: none;">${additionalContent}</div>
      ` : tldrContent}
    `;

    detailEl.innerHTML = html;
    window.__nursepathSelectedOtc = item;

    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      const listContainer = document.getElementById('otc-list-container');
      const detailContainer = document.getElementById('otc-detail-container');
      if (listContainer) listContainer.classList.add('hidden');
      if (detailContainer) {
        detailContainer.classList.remove('hidden');
        detailContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      detailEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function hideOTCDetail() {
    const listContainer = document.getElementById('otc-list-container');
    const detailContainer = document.getElementById('otc-detail-container');
    if (listContainer) {
      listContainer.classList.remove('hidden');
      listContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (detailContainer) {
      detailContainer.classList.add('hidden');
    }

    const trackUsageSafe = getTrackUsageSafe();
    if (trackUsageSafe) {
      trackUsageSafe('otc_ref', 'feature_use', { action: 'back_to_list' }, { minIntervalMs: 1000, rateKey: 'otc_back_to_list' });
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
      if (tldrTab) {
        tldrTab.style.background = 'linear-gradient(135deg, #06b6d4, #0891b2)';
        tldrTab.style.color = 'white';
      }
      if (additionalTab) {
        additionalTab.style.background = '#334155';
        additionalTab.style.color = '#94a3b8';
      }
      if (tldrContent) tldrContent.style.display = 'block';
      if (additionalContent) additionalContent.style.display = 'none';
    } else {
      if (additionalTab) {
        additionalTab.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
        additionalTab.style.color = 'white';
      }
      if (tldrTab) {
        tldrTab.style.background = '#334155';
        tldrTab.style.color = '#94a3b8';
      }
      if (tldrContent) tldrContent.style.display = 'none';
      if (additionalContent) additionalContent.style.display = 'block';
    }
  }

  function calcIV() {
    const vol = parseFloat(document.getElementById('vol').value);
    const hours = parseFloat(document.getElementById('hours').value);
    const factor = parseFloat(document.getElementById('factor').value);

    if (vol && hours) {
      const mlPerHour = vol / hours;
      const gttPerMin = Math.round((mlPerHour / 60) * factor);

      document.getElementById('mlhr').innerText = mlPerHour.toFixed(1) + ' mL/hr';
      document.getElementById('iv-result').innerText = gttPerMin + ' gtt/min';
      const trackUsageSafe = getTrackUsageSafe();
      if (trackUsageSafe) {
        trackUsageSafe('iv_calc', 'result_generated', { result_state: 'computed', has_value: true }, { minIntervalMs: 1500, rateKey: 'iv_calc_computed' });
      }
      const requestTelemetryFlush = getRequestTelemetryFlush();
      if (requestTelemetryFlush) requestTelemetryFlush();
    } else {
      document.getElementById('iv-result').innerText = '-- gtt/min';
      document.getElementById('mlhr').innerText = '-- mL/hr';
    }
  }

  function calcBMI() {
    const w = parseFloat(document.getElementById('weight').value);
    const h = parseFloat(document.getElementById('height').value) / 100;

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

    const trackUsageSafe = getTrackUsageSafe();
    if (trackUsageSafe) {
      trackUsageSafe('aog_edd', 'result_generated', { trimester, due_state: daysRemaining > 0 ? 'future' : (daysRemaining === 0 ? 'today' : 'past_due') }, { minIntervalMs: 1500, rateKey: `aog_${trimester}` });
    }
    const requestTelemetryFlush = getRequestTelemetryFlush();
    if (requestTelemetryFlush) requestTelemetryFlush();

    showPregnancyMilestones(weeks, days, calcDate, lmp);
  }

  window.NursePathUIHelpers = {
    renderOTCSidebar,
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
