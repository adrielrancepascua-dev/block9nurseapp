/**
 * PNLE Study mode: launch gate, session player, mistakes, progress.
 */
(function (global) {
  'use strict';

  const LAUNCH_MODE_KEY = 'nursepath_launch_mode_v1';
  const LEVEL_KEY = 'nursepath_pnle_level_v1';
  const DAILY_GOAL_FIXED = 10;
  const MISTAKES_KEY = 'nursepath_pnle_mistakes_v1';
  const PROGRESS_KEY = 'nursepath_pnle_progress_v1';
  const DAILY_COUNT_KEY = 'nursepath_pnle_daily_count_v1';
  const BANK_GATE_OVERRIDE_KEY = 'nursepath_pnle_bank_gate_v1';
  const CHOICE_LABELS = ['A', 'B', 'C', 'D'];

  const TOPIC_ROWS = [
    { id: 'oxygenation', label: 'Oxygenation' },
    { id: 'heart', label: 'Heart' },
    { id: 'blood', label: 'Blood & transfusion' },
    { id: 'fluids_abg', label: 'Fluids, electrolytes & ABG' },
    { id: 'periop_iv', label: 'Perioperative & IV' },
  ];

  let bankItems = [];
  let session = null;
  let launchResolved = false;
  let studySessionStartedAt = null;
  let studyTab = 'practice';
  let gateOpenForSwitch = false;

  function todayYmd() {
    return new Date().toISOString().slice(0, 10);
  }

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getLastMode() {
    const m = localStorage.getItem(LAUNCH_MODE_KEY);
    return m === 'study' || m === 'duty' ? m : '';
  }

  function setLastMode(mode) {
    localStorage.setItem(LAUNCH_MODE_KEY, mode);
  }

  function getStudyLevel() {
    const l = localStorage.getItem(LEVEL_KEY);
    return l === 'hard' ? 'hard' : 'normal';
  }

  function setStudyLevel(level) {
    localStorage.setItem(LEVEL_KEY, level === 'hard' ? 'hard' : 'normal');
  }

  function getDailyGoal() {
    return DAILY_GOAL_FIXED;
  }

  /** preview = selfChecked items; pilot = instructorReviewed only (student release). */
  function getStudyBankGate() {
    const stored = localStorage.getItem(BANK_GATE_OVERRIDE_KEY);
    if (stored === 'pilot' || stored === 'preview') return stored;
    try {
      const meta = document.querySelector('meta[name="nursepath-pnle-bank-gate"]');
      const content = meta && meta.getAttribute('content');
      if (content === 'pilot' || content === 'preview') return content;
    } catch (e) {
      /* ignore */
    }
    const q = new URLSearchParams(global.location.search).get('pnleBank');
    if (q === 'pilot' || q === 'preview') return q;
    const host = (global.location.hostname || '').toLowerCase();
    if (
      !host ||
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host.endsWith('.vercel.app')
    ) {
      return 'preview';
    }
    return 'pilot';
  }

  function itemInStudyBank(it) {
    const gate = getStudyBankGate();
    if (gate === 'preview') return it.selfChecked === true;
    return it.instructorReviewed === true;
  }

  function loadBank() {
    const pack = global.NursePathPnleMedSurg;
    if (!pack || !Array.isArray(pack.items)) return [];
    const stemOk = (stem) => !/\b(handout|sheet|reviewer|per\s+the)\b/i.test(stem || '');
    return pack.items.filter((it) => itemInStudyBank(it) && stemOk(it.stem));
  }

  function trackStudy(feature, action, meta) {
    if (typeof global.trackUsageEvent === 'function') {
      global.trackUsageEvent(feature, action, meta || {}, { minIntervalMs: 0 });
    }
  }

  function readMistakes() {
    const data = readJson(MISTAKES_KEY, {});
    return data && typeof data === 'object' ? data : {};
  }

  function writeMistakes(map) {
    writeJson(MISTAKES_KEY, map);
  }

  function readProgress() {
    const data = readJson(PROGRESS_KEY, {});
    return data && typeof data === 'object' ? data : {};
  }

  function writeProgress(map) {
    writeJson(PROGRESS_KEY, map);
  }

  function isItemMastered(itemId) {
    const prog = readProgress();
    const days = prog[itemId] && prog[itemId].correctDays;
    return Array.isArray(days) && days.length >= 2;
  }

  function getMasteredCount() {
    return bankItems.filter((it) => isItemMastered(it.id)).length;
  }

  function getMasteredInTopic(topicId) {
    return bankItems.filter((it) => it.topic === topicId && isItemMastered(it.id)).length;
  }

  function getTopicTotal(topicId) {
    return bankItems.filter((it) => it.topic === topicId).length;
  }

  function getDailyProgress() {
    const daily = readJson(DAILY_COUNT_KEY, {});
    return daily[todayYmd()] || 0;
  }

  function formatTodayFraction() {
    const done = getDailyProgress();
    const goal = getDailyGoal();
    return `${Math.min(done, goal)} / ${goal}`;
  }

  function formatTodayGoalLong() {
    const done = getDailyProgress();
    const goal = getDailyGoal();
    const frac = formatTodayFraction();
    if (done >= goal) return `Today: ${frac} · Goal met`;
    return `Today: ${frac}`;
  }

  function todayGoalRingPercent() {
    const done = getDailyProgress();
    const goal = getDailyGoal();
    return Math.min(100, Math.round((Math.min(done, goal) / goal) * 100));
  }

  function resetAllStudyLocalData() {
    localStorage.removeItem(MISTAKES_KEY);
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(DAILY_COUNT_KEY);
    session = null;
    if (studyTab === 'practice') renderStudyHome();
    else if (studyTab === 'mistakes') renderMistakesHome();
    else if (studyTab === 'progress') renderProgressHome();
    refreshGateTileStats();
  }

  function recordAnswer(item, correct) {
    trackStudy('study_item_answer', 'feature_use', {
      item_id: item.id,
      correct: Boolean(correct),
      topic: item.topic,
      level: item.level,
      type: item.type,
    });

    const day = todayYmd();
    const daily = readJson(DAILY_COUNT_KEY, {});
    daily[day] = (daily[day] || 0) + 1;
    writeJson(DAILY_COUNT_KEY, daily);

    const prog = readProgress();
    const entry = prog[item.id] || { correctDays: [], lastAt: null };
    entry.lastAt = new Date().toISOString();
    if (correct) {
      const days = entry.correctDays || [];
      if (!days.includes(day)) {
        days.push(day);
        entry.correctDays = days.sort();
      }
    } else {
      entry.correctDays = [];
    }
    prog[item.id] = entry;
    writeProgress(prog);

    const mistakes = readMistakes();
    if (!correct) {
      const prev = mistakes[item.id];
      mistakes[item.id] = {
        missedAt: new Date().toISOString(),
        correctDays: [],
      };
      if (prev && prev.missedAt) {
        mistakes[item.id].missedAt = prev.missedAt;
      }
    } else if (mistakes[item.id]) {
      const days = mistakes[item.id].correctDays || [];
      if (!days.includes(day)) {
        days.push(day);
        mistakes[item.id].correctDays = days.sort();
      }
      const uniqueDays = [...new Set(mistakes[item.id].correctDays)];
      if (uniqueDays.length >= 2) {
        delete mistakes[item.id];
      }
    }
    writeMistakes(mistakes);
  }

  function filterItems(topicId, level) {
    let pool = bankItems;
    if (topicId === 'mistakes') {
      const mistakes = readMistakes();
      const ids = Object.keys(mistakes);
      pool = bankItems.filter((it) => ids.includes(it.id));
    } else if (topicId !== 'all') {
      pool = bankItems.filter((it) => it.topic === topicId);
    }
    if (level === 'normal' || level === 'hard') {
      pool = pool.filter((it) => it.level === level);
    }
    return pool;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function endStudySession() {
    if (!studySessionStartedAt) return;
    const ms = Date.now() - studySessionStartedAt;
    trackStudy('study_session_end', 'feature_use', {
      duration_ms: ms,
      items_answered: session ? session.answered : 0,
    });
    studySessionStartedAt = null;
  }

  function startStudySession() {
    if (!studySessionStartedAt) {
      studySessionStartedAt = Date.now();
      trackStudy('study_open', 'feature_open', { bank: 'medsurg', count: bankItems.length });
    }
  }

  function setAppShellVisible(visible) {
    const shell = document.getElementById('app-shell');
    if (shell) shell.style.display = visible ? '' : 'none';
  }

  function setDutySwitchVisible(visible) {
    const btn = document.getElementById('pnleDutySwitchMode');
    if (btn) btn.hidden = !visible;
  }

  function applyBodyMode(mode) {
    document.body.classList.remove('pnle-mode-duty', 'pnle-mode-study');
    document.body.classList.add(mode === 'study' ? 'pnle-mode-study' : 'pnle-mode-duty');
  }

  function hideLaunchGate() {
    const gate = document.getElementById('pnleLaunchGate');
    if (gate) gate.hidden = true;
    document.body.classList.remove('pnle-gate-open');
    gateOpenForSwitch = false;
  }

  function refreshGateTileStats() {
    const mistakes = Object.keys(readMistakes()).length;
    const goalEl = document.getElementById('pnleGateStudyGoal');
    const misEl = document.getElementById('pnleGateStudyMistakes');
    if (goalEl) goalEl.textContent = formatTodayGoalLong();
    if (misEl) {
      misEl.textContent =
        mistakes === 0 ? 'My mistakes: none waiting' : `My mistakes: ${mistakes} waiting`;
    }
    const last = getLastMode();
    const dutyBadge = document.getElementById('pnleGateDutyBadge');
    const studyBadge = document.getElementById('pnleGateStudyBadge');
    const dutyTile = document.getElementById('pnleLaunchDuty');
    const studyTile = document.getElementById('pnleLaunchStudy');
    if (dutyBadge) dutyBadge.hidden = !(gateOpenForSwitch && last === 'duty');
    if (studyBadge) studyBadge.hidden = !(gateOpenForSwitch && last === 'study');
    if (dutyTile) dutyTile.classList.toggle('is-last-used', gateOpenForSwitch && last === 'duty');
    if (studyTile) studyTile.classList.toggle('is-last-used', gateOpenForSwitch && last === 'study');
  }

  function showLaunchGate(forSwitch) {
    gateOpenForSwitch = Boolean(forSwitch);
    refreshGateTileStats();
    const gate = document.getElementById('pnleLaunchGate');
    if (!gate) {
      enterDutyMode();
      return;
    }
    endStudySession();
    session = null;
    const studyShell = document.getElementById('pnle-study-shell');
    if (studyShell) studyShell.classList.remove('is-active');
    setAppShellVisible(false);
    setDutySwitchVisible(false);
    document.body.classList.add('pnle-gate-open');
    gate.hidden = false;
  }

  function ensureAppBooted() {
    if (global.__nursepathAuthState && !global.__nursepathAuthState.booted) {
      if (typeof global.__nursepathBootAppCore === 'function') {
        global.__nursepathBootAppCore();
      }
    }
  }

  function bootDutyApp() {
    applyBodyMode('duty');
    const shell = document.getElementById('pnle-study-shell');
    if (shell) shell.classList.remove('is-active');
    setAppShellVisible(true);
    setDutySwitchVisible(true);
    ensureAppBooted();
  }

  function enterStudyMode() {
    setLastMode('study');
    applyBodyMode('study');
    launchResolved = true;
    hideLaunchGate();
    setAppShellVisible(true);
    setDutySwitchVisible(false);
    const shell = document.getElementById('pnle-study-shell');
    if (shell) shell.classList.add('is-active');
    ensureAppBooted();
    setStudyTab(studyTab || 'practice');
    startStudySession();
  }

  function enterDutyMode() {
    endStudySession();
    setLastMode('duty');
    launchResolved = true;
    hideLaunchGate();
    session = null;
    bootDutyApp();
  }

  function simulationBlocking() {
    const sim = document.getElementById('simulationModeOverlay');
    if (!sim) return false;
    return window.getComputedStyle(sim).display !== 'none';
  }

  function showLaunchGateWhenReady(forSwitch) {
    if (simulationBlocking()) {
      setTimeout(() => showLaunchGateWhenReady(forSwitch), 400);
      return;
    }
    showLaunchGate(forSwitch);
  }

  function handlePostAuth() {
    bankItems = loadBank();
    const last = getLastMode();
    if (last === 'study') {
      enterStudyMode();
      return true;
    }
    if (last === 'duty') {
      enterDutyMode();
      return true;
    }
    showLaunchGateWhenReady(false);
    return true;
  }

  function setStudyTab(tab) {
    studyTab = tab;
    const bar = document.getElementById('pnleStudyTabbar');
    if (bar) {
      bar.classList.remove('is-dimmed');
      bar.querySelectorAll('.pnle-tab').forEach((btn) => {
        const t = btn.getAttribute('data-study-tab');
        btn.classList.toggle('is-active', t === tab);
      });
    }
    if (session && session.phase === 'question') {
      if (tab === 'mistakes') {
        startMistakesSession();
        return;
      }
      if (tab !== 'practice') {
        session = null;
      }
    }
    if (tab === 'practice') renderStudyHome();
    else if (tab === 'mistakes') renderMistakesHome();
    else if (tab === 'progress') renderProgressHome();
  }

  function startTopicSession(topicId) {
    const level = getStudyLevel();
    const pool = filterItems(topicId, level);
    if (!pool.length) {
      alert('No questions in this pool yet. Try another topic or level.');
      return;
    }
    session = {
      topicId,
      level,
      queue: shuffle(pool),
      index: 0,
      answered: 0,
      locked: false,
      phase: 'question',
    };
    renderQuestion();
  }

  function startMixedPractice() {
    const level = getStudyLevel();
    const pool = filterItems('all', level);
    if (!pool.length) {
      alert('No questions available.');
      return;
    }
    session = {
      topicId: 'all',
      level,
      queue: shuffle(pool),
      index: 0,
      answered: 0,
      locked: false,
      phase: 'question',
    };
    renderQuestion();
  }

  function renderStudyHome() {
    const root = document.getElementById('pnleStudyRoot');
    if (!root) return;
    if (!bankItems.length) {
      const preview = getStudyBankGate() === 'preview';
      root.innerHTML = preview
        ? `<div class="pnle-study-empty">
          <h2 class="pnle-section-label">No self-checked items yet</h2>
          <p class="pnle-study-hint">Preview builds show questions you mark <strong>selfChecked</strong> in the bank status file after you verify them against your handouts.</p>
        </div>`
        : `<div class="pnle-study-empty">
          <h2 class="pnle-section-label">No instructor-approved items yet</h2>
          <p class="pnle-study-hint">The student pilot only shows questions your MedSurg instructor has signed off (<strong>instructorReviewed</strong>).</p>
        </div>`;
      return;
    }
    const level = getStudyLevel();
    const mistakeCount = Object.keys(readMistakes()).length;
    const ringPct = todayGoalRingPercent();
    const done = getDailyProgress();
    const goal = getDailyGoal();
    const goalMet = done >= goal;
    const frac = formatTodayFraction();
    const mastered = getMasteredCount();
    const ringInner = goalMet
      ? '<span class="pnle-ring-check" aria-hidden="true">✓</span>'
      : `<span class="pnle-ring-num">${Math.min(done, goal)}</span>`;

    const topicRows = TOPIC_ROWS.map((t) => {
      const total = getTopicTotal(t.id);
      const m = getMasteredInTopic(t.id);
      const pct = total ? Math.round((m / total) * 100) : 0;
      return `<button type="button" class="pnle-topic-row" data-topic="${t.id}">
        <span class="pnle-topic-row-label">${escapeHtml(t.label)}</span>
        <span class="pnle-topic-row-meta">${m} of ${total} mastered</span>
        <span class="pnle-topic-row-bar" aria-hidden="true"><span style="width:${pct}%"></span></span>
      </button>`;
    }).join('');

    const gateBanner =
      getStudyBankGate() === 'preview'
        ? `<p class="pnle-study-gate-banner" role="status">Preview bank — self-checked items only (not instructor-signed for students).</p>`
        : '';

    root.innerHTML = `
      ${gateBanner}
      <div class="pnle-home-hero">
        <div class="pnle-goal-ring-wrap">
          <div class="pnle-goal-ring" style="--ring-pct:${ringPct}" aria-hidden="true">
            <div class="pnle-goal-ring-inner">${ringInner}</div>
          </div>
          <div class="pnle-goal-ring-labels">
            <p class="pnle-goal-ring-frac">${escapeHtml(frac)}</p>
            <p class="pnle-goal-ring-cap">${goalMet ? 'Goal met' : 'Today'}</p>
          </div>
        </div>
        <div class="pnle-home-hero-text">
          <p class="pnle-home-hero-title">MedSurg practice</p>
          <p class="pnle-home-hero-sub">Mastered ${mastered} of ${bankItems.length}</p>
        </div>
      </div>
      <div class="pnle-level-row" role="group" aria-label="Difficulty">
        <button type="button" class="pnle-level-btn${level === 'normal' ? ' is-active' : ''}" data-level="normal">Normal</button>
        <button type="button" class="pnle-level-btn${level === 'hard' ? ' is-active' : ''}" data-level="hard">Hard</button>
      </div>
      <button type="button" class="pnle-btn-primary" id="pnleStartPractice">Start practice</button>
      <button type="button" class="pnle-mistakes-strip" id="pnleHomeMistakes">
        <span>My mistakes</span>
        <strong>${mistakeCount} waiting</strong>
      </button>
      <h2 class="pnle-section-label">Topics</h2>
      <div class="pnle-topic-list">${topicRows}</div>
    `;

    root.querySelector('#pnleStartPractice').addEventListener('click', startMixedPractice);
    root.querySelector('#pnleHomeMistakes').addEventListener('click', () => {
      if (mistakeCount) startMistakesSession();
      else setStudyTab('mistakes');
    });
    root.querySelectorAll('.pnle-level-btn').forEach((b) => {
      b.addEventListener('click', () => {
        setStudyLevel(b.getAttribute('data-level'));
        renderStudyHome();
      });
    });
    root.querySelectorAll('.pnle-topic-row').forEach((btn) => {
      btn.addEventListener('click', () => startTopicSession(btn.getAttribute('data-topic')));
    });
  }

  function renderMistakesHome() {
    const root = document.getElementById('pnleStudyRoot');
    if (!root) return;
    const mistakeCount = Object.keys(readMistakes()).length;
    root.innerHTML = `
      <p class="pnle-study-hint">Clear an item with two correct answers on different days.</p>
      <div class="pnle-mistakes-card">
        <h2>My mistakes</h2>
        <p class="pnle-mistakes-count">${mistakeCount} item${mistakeCount === 1 ? '' : 's'} waiting</p>
        <button type="button" class="pnle-btn-primary" id="pnleStartMistakes" ${mistakeCount ? '' : 'disabled'}>
          Review mistakes
        </button>
      </div>
    `;
    const start = root.querySelector('#pnleStartMistakes');
    if (start) start.addEventListener('click', startMistakesSession);
  }

  function startMistakesSession() {
    const pool = filterItems('mistakes', 'normal').concat(filterItems('mistakes', 'hard'));
    const unique = [];
    const seen = new Set();
    pool.forEach((it) => {
      if (!seen.has(it.id)) {
        seen.add(it.id);
        unique.push(it);
      }
    });
    if (!unique.length) {
      alert('No mistakes to review right now.');
      return;
    }
    session = {
      topicId: 'mistakes',
      level: 'mixed',
      queue: shuffle(unique),
      index: 0,
      answered: 0,
      locked: false,
      phase: 'question',
    };
    studyTab = 'mistakes';
    renderQuestion();
  }

  function renderProgressHome() {
    const root = document.getElementById('pnleStudyRoot');
    if (!root) return;
    const mastered = getMasteredCount();
    const mistakes = Object.keys(readMistakes()).length;
    const done = getDailyProgress();
    const goal = getDailyGoal();
    const topicProgress = TOPIC_ROWS.map((t) => {
      const total = getTopicTotal(t.id);
      const m = getMasteredInTopic(t.id);
      return `<li><span>${escapeHtml(t.label)}</span><strong>${m} / ${total}</strong></li>`;
    }).join('');
    root.innerHTML = `
      <div class="pnle-progress-card">
        <h2 id="pnleProgressTitle">Progress</h2>
        <ul class="pnle-progress-list">
          <li><span>Mastered (2+ correct days)</span><strong>${mastered} / ${bankItems.length}</strong></li>
          <li><span>Today answered</span><strong>${formatTodayFraction()}</strong></li>
          <li><span>Mistakes waiting</span><strong>${mistakes}</strong></li>
        </ul>
        <h3 class="pnle-section-label">By topic</h3>
        <ul class="pnle-progress-list">${topicProgress}</ul>
        <p class="pnle-study-hint">Mastered = correct on two different calendar days (not two in one sitting). Mistakes stay until two correct days clear them; missing again resets that streak. Today counts every answer you lock.</p>
      </div>
    `;
    let resetTaps = 0;
    const title = root.querySelector('#pnleProgressTitle');
    if (title) {
      title.addEventListener('click', () => {
        resetTaps += 1;
        if (resetTaps >= 5) {
          resetTaps = 0;
          if (window.confirm('Reset all Study progress on this device?')) {
            resetAllStudyLocalData();
          }
        }
      });
    }
  }

  const ICON_CHECK =
    '<svg class="pnle-choice-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15"/><path d="M8 12.5l2.5 2.5 5.5-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const ICON_X =
    '<svg class="pnle-choice-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15"/><path d="M9 9l6 6M15 9l-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';

  function lockChoiceAnswer(root, item, picked) {
    session.locked = true;
    const correct = item.correctIndex;
    const isCorrect = picked === correct;
    recordAnswer(item, isCorrect);
    session.answered += 1;

    root.querySelectorAll('.pnle-choice').forEach((b) => {
      const idx = parseInt(b.getAttribute('data-idx'), 10);
      b.disabled = true;
      const slot = b.querySelector('.pnle-choice-icon-slot');
      const body = b.querySelector('.pnle-choice-body');
      const showReason = idx === correct || idx === picked;
      if (showReason && body) {
        const reason = document.createElement('span');
        reason.className = 'pnle-choice-reason';
        reason.textContent = item.reasons[idx];
        body.appendChild(reason);
      }

      if (idx === correct) {
        b.classList.add('is-correct', 'is-revealed');
        if (slot) slot.innerHTML = ICON_CHECK;
      } else if (idx === picked) {
        b.classList.add('is-wrong', 'is-revealed');
        if (slot) slot.innerHTML = ICON_X;
      } else {
        b.classList.add('is-dimmed');
        if (slot) {
          slot.innerHTML = `<span class="pnle-choice-letter">${CHOICE_LABELS[idx]}</span>`;
        }
      }
    });

    const nextBtn = root.querySelector('#pnleNextBtn');
    if (nextBtn) {
      nextBtn.classList.remove('is-hidden');
      nextBtn.removeAttribute('hidden');
    }
  }

  function bindChoiceTap(btn, root, item) {
    let touchStartY = 0;
    btn.addEventListener(
      'touchstart',
      (e) => {
        touchStartY = e.changedTouches[0].clientY;
      },
      { passive: true }
    );
    btn.addEventListener('touchend', (e) => {
      if (session.locked) return;
      const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
      if (dy > 14) return;
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      lockChoiceAnswer(root, item, idx);
    });
    btn.addEventListener('click', (e) => {
      if (session.locked) return;
      if (e.pointerType === 'touch') return;
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      lockChoiceAnswer(root, item, idx);
    });
  }

  function renderQuestion() {
    const root = document.getElementById('pnleStudyRoot');
    const tabbar = document.getElementById('pnleStudyTabbar');
    if (!root || !session) return;
    const item = session.queue[session.index];
    if (!item) {
      root.innerHTML = `
        <h2 class="pnle-screen-title">Session complete</h2>
        <p class="pnle-study-hint">You answered ${session.answered} question(s).</p>
        <button type="button" class="pnle-btn-primary" id="pnleDoneHome">Back to practice</button>
      `;
      root.querySelector('#pnleDoneHome').addEventListener('click', () => {
        session = null;
        setStudyTab('practice');
      });
      return;
    }

    const mistakeCount = Object.keys(readMistakes()).length;
    const levelLabel =
      session.level === 'hard'
        ? 'Hard'
        : session.level === 'normal'
          ? 'Normal'
          : session.level === 'mixed'
            ? 'Mistakes'
            : '';
    const progressLabel = levelLabel
      ? `Question ${session.index + 1} of ${session.queue.length} · ${levelLabel}`
      : `Question ${session.index + 1} of ${session.queue.length}`;
    const choices = item.choices
      .map(
        (c, idx) =>
          `<button type="button" class="pnle-choice" data-idx="${idx}">
            <span class="pnle-choice-icon-slot"><span class="pnle-choice-letter">${CHOICE_LABELS[idx]}</span></span>
            <span class="pnle-choice-body">
              <span class="pnle-choice-text">${escapeHtml(c)}</span>
            </span>
          </button>`
      )
      .join('');

    root.innerHTML = `
      <div class="pnle-question-card">
        <div class="pnle-question-toolbar">
          <span class="pnle-q-progress">${escapeHtml(progressLabel)}</span>
          <div class="pnle-question-toolbar-actions">
            <button type="button" class="pnle-history-btn" id="pnleHistoryBtn">Mistakes (${mistakeCount})</button>
            <button type="button" class="pnle-end-btn" id="pnleQuitSession">End</button>
          </div>
        </div>
        <p class="pnle-question-stem">${escapeHtml(item.stem)}</p>
        <div class="pnle-choices">${choices}</div>
        <button type="button" class="pnle-btn-primary pnle-btn-next is-hidden" id="pnleNextBtn" hidden aria-hidden="true">Next question</button>
      </div>
    `;

    const nextBtn = root.querySelector('#pnleNextBtn');

    root.querySelector('#pnleQuitSession').addEventListener('click', () => {
      session = null;
      setStudyTab(studyTab);
    });

    root.querySelector('#pnleHistoryBtn').addEventListener('click', () => {
      session = null;
      setStudyTab('mistakes');
    });

    root.querySelectorAll('.pnle-choice').forEach((btn) => bindChoiceTap(btn, root, item));

    nextBtn.addEventListener('click', () => {
      session.index += 1;
      session.locked = false;
      renderQuestion();
    });
  }

  function bindLaunchUi() {
    const dutyBtn = document.getElementById('pnleLaunchDuty');
    const studyBtn = document.getElementById('pnleLaunchStudy');
    if (dutyBtn) dutyBtn.addEventListener('click', enterDutyMode);
    if (studyBtn) studyBtn.addEventListener('click', enterStudyMode);

    const dutySwitch = document.getElementById('pnleDutySwitchMode');
    const studySwitch = document.getElementById('pnleStudySwitchMode');
    if (dutySwitch) dutySwitch.addEventListener('click', () => showLaunchGateWhenReady(true));
    if (studySwitch) {
      studySwitch.addEventListener('click', () => {
        endStudySession();
        showLaunchGateWhenReady(true);
      });
    }

    const tabbar = document.getElementById('pnleStudyTabbar');
    if (tabbar) {
      tabbar.querySelectorAll('.pnle-tab[data-study-tab]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const tab = btn.getAttribute('data-study-tab');
          if (tab) setStudyTab(tab);
        });
      });
    }
  }

  function init() {
    bankItems = loadBank();
    bindLaunchUi();
    const origAccept = global.acceptSimulationMode;
    if (typeof origAccept === 'function') {
      global.acceptSimulationMode = function wrappedAcceptSimulation() {
        origAccept();
        setTimeout(() => {
          if (!launchResolved && global.__nursepathAuthState && global.__nursepathAuthState.authenticated) {
            handlePostAuth();
          }
        }, 550);
      };
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  global.NursePathPnleStudy = {
    getStudyBankGate,
    handlePostAuth,
    enterDutyMode,
    enterStudyMode,
    showLaunchGate: () => showLaunchGateWhenReady(true),
    getReviewedCount: () => bankItems.length,
    getMistakeIds: () => Object.keys(readMistakes()),
    resetAllStudyLocalData,
  };

  const origBoot = global.__nursepathBootApp;
  global.__nursepathBootAppCore = origBoot;
  global.__nursepathBootApp = function patchedBoot() {
    global.__nursepathBootApp._pnleWrapped = true;
    if (global.NursePathPnleStudy && NursePathPnleStudy.handlePostAuth()) {
      return;
    }
    if (origBoot) origBoot();
  };

  window.addEventListener('beforeunload', endStudySession);
})(typeof window !== 'undefined' ? window : globalThis);
