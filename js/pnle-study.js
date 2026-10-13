/**
 * PNLE Study mode: full-screen launch gate, session player, mistakes, progress.
 */
(function (global) {
  'use strict';

  const LAUNCH_MODE_KEY = 'nursepath_launch_mode_v1';
  const DAILY_GOAL_KEY = 'nursepath_pnle_daily_goal_v1';
  const MISTAKES_KEY = 'nursepath_pnle_mistakes_v1';
  const PROGRESS_KEY = 'nursepath_pnle_progress_v1';
  const DAILY_COUNT_KEY = 'nursepath_pnle_daily_count_v1';
  const REPORTS_KEY = 'nursepath_pnle_reports_v1';

  const TOPICS = [
    { id: 'oxygenation', label: 'Oxygenation', locked: false },
    { id: 'heart', label: 'Heart', locked: false },
    { id: 'blood', label: 'Blood & transfusion', locked: false },
    { id: 'fluids_abg', label: 'Fluids, electrolytes & ABG', locked: false },
    { id: 'periop_iv', label: 'Perioperative & IV', locked: false },
    { id: 'all', label: 'All MedSurg topics', locked: false },
    { id: 'maternal', label: 'Maternal & newborn', locked: true },
    { id: 'peds', label: 'Pediatric nursing', locked: true },
    { id: 'psych', label: 'Psychiatric nursing', locked: true },
    { id: 'community', label: 'Community health', locked: true },
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

  function loadBank() {
    const pack = global.NursePathPnleMedSurg;
    if (!pack || !Array.isArray(pack.items)) return [];
    return pack.items.filter((it) => it.reviewed === true);
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

  function getMasteredCount() {
    const prog = readProgress();
    let n = 0;
    Object.keys(prog).forEach((id) => {
      const days = prog[id] && prog[id].correctDays;
      if (Array.isArray(days) && days.length >= 2) n += 1;
    });
    return n;
  }

  function updateMasteryUi() {
    const total = bankItems.length || 1;
    const mastered = getMasteredCount();
    const pct = Math.min(100, Math.round((mastered / total) * 100));
    const label = document.getElementById('pnleMasteryLabel');
    const fill = document.getElementById('pnleMasteryFill');
    if (label) label.textContent = `Mastered ${mastered} of ${bankItems.length}`;
    if (fill) fill.style.width = `${pct}%`;
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
    }
    prog[item.id] = entry;
    writeProgress(prog);

    const mistakes = readMistakes();
    if (!correct) {
      mistakes[item.id] = mistakes[item.id] || {
        missedAt: new Date().toISOString(),
        correctDays: [],
      };
      if (!mistakes[item.id].missedAt) {
        mistakes[item.id].missedAt = new Date().toISOString();
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
    updateMasteryUi();
  }

  function recordItemFeedback(itemId, helpful) {
    const reports = readJson(REPORTS_KEY, []);
    reports.push({
      itemId,
      helpful: Boolean(helpful),
      at: new Date().toISOString(),
    });
    writeJson(REPORTS_KEY, reports.slice(-200));
    trackStudy('study_item_feedback', 'feature_use', {
      item_id: itemId,
      helpful: Boolean(helpful),
    });
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

  function getDailyGoal() {
    const n = parseInt(localStorage.getItem(DAILY_GOAL_KEY) || '10', 10);
    return Number.isFinite(n) && n > 0 ? Math.min(n, 50) : 10;
  }

  function setDailyGoal(n) {
    const v = Math.max(1, Math.min(50, parseInt(n, 10) || 10));
    localStorage.setItem(DAILY_GOAL_KEY, String(v));
  }

  function getDailyProgress() {
    const daily = readJson(DAILY_COUNT_KEY, {});
    return daily[todayYmd()] || 0;
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
    const goal = getDailyGoal();
    const done = getDailyProgress();
    const mistakes = Object.keys(readMistakes()).length;
    const goalEl = document.getElementById('pnleGateStudyGoal');
    const misEl = document.getElementById('pnleGateStudyMistakes');
    if (goalEl) goalEl.textContent = `Today: ${done} of ${goal}`;
    if (misEl) {
      misEl.textContent =
        mistakes === 0
          ? 'My mistakes: none waiting'
          : `My mistakes: ${mistakes} waiting`;
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
    updateMasteryUi();
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

  function renderStudyHome() {
    const root = document.getElementById('pnleStudyRoot');
    if (!root) return;
    const goal = getDailyGoal();
    const done = getDailyProgress();
    const topicCards = TOPICS.map((t) => {
      const locked = t.locked;
      const sub = locked
        ? 'Coming in a future pack'
        : t.id === 'all'
          ? `Mixed from ${bankItems.length} questions`
          : `${bankItems.filter((i) => i.topic === t.id).length} in bank`;
      return `<button type="button" class="pnle-topic-card${locked ? ' is-locked' : ''}" data-topic="${t.id}" ${locked ? 'disabled' : ''}>
        <h3>${escapeHtml(t.label)}${locked ? ' 🔒' : ''}</h3>
        <p>${escapeHtml(sub)}</p>
      </button>`;
    }).join('');

    root.innerHTML = `
      <p class="pnle-study-progress">MedSurg · Daily goal ${done}/${goal}</p>
      <div class="pnle-daily-goal">
        <label for="pnleDailyGoalInput">Daily goal</label>
        <input type="number" id="pnleDailyGoalInput" min="1" max="50" value="${goal}">
        <span>questions / day</span>
      </div>
      <p class="pnle-study-hint">Pick a topic, then Normal or Hard.</p>
      <div class="pnle-topic-grid">${topicCards}</div>
    `;

    const goalInput = root.querySelector('#pnleDailyGoalInput');
    goalInput.addEventListener('change', () => {
      setDailyGoal(goalInput.value);
      renderStudyHome();
      refreshGateTileStats();
    });
    root.querySelectorAll('.pnle-topic-card:not(.is-locked)').forEach((btn) => {
      btn.addEventListener('click', () => {
        const topicId = btn.getAttribute('data-topic');
        session = {
          topicId,
          level: 'normal',
          queue: [],
          index: 0,
          answered: 0,
          locked: false,
          phase: 'level',
        };
        renderLevelPicker();
      });
    });
  }

  function renderMistakesHome() {
    const root = document.getElementById('pnleStudyRoot');
    if (!root) return;
    const mistakeCount = Object.keys(readMistakes()).length;
    root.innerHTML = `
      <p class="pnle-study-progress">Items need two correct answers on different days to clear.</p>
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
    setStudyTab('mistakes');
    renderQuestion();
  }

  function renderProgressHome() {
    const root = document.getElementById('pnleStudyRoot');
    if (!root) return;
    const mastered = getMasteredCount();
    const mistakes = Object.keys(readMistakes()).length;
    const done = getDailyProgress();
    const goal = getDailyGoal();
    root.innerHTML = `
      <div class="pnle-progress-card">
        <h2>Progress</h2>
        <ul class="pnle-progress-list">
          <li><span>Mastered (2+ correct days)</span><strong>${mastered} / ${bankItems.length}</strong></li>
          <li><span>Today answered</span><strong>${done} / ${goal}</strong></li>
          <li><span>Mistakes waiting</span><strong>${mistakes}</strong></li>
        </ul>
        <p class="pnle-study-hint">Mastery bar counts items you got right on two separate days — not total taps.</p>
      </div>
    `;
  }

  function renderLevelPicker() {
    const root = document.getElementById('pnleStudyRoot');
    if (!root || !session) return;
    const topic = TOPICS.find((t) => t.id === session.topicId);
    root.innerHTML = `
      <button type="button" class="pnle-back-link" id="pnleBackHome">← Topics</button>
      <h2 class="pnle-screen-title">${escapeHtml(topic ? topic.label : 'Study')}</h2>
      <p class="pnle-study-progress">Choose difficulty</p>
      <div class="pnle-level-row">
        <button type="button" class="pnle-level-btn is-active" data-level="normal">Normal</button>
        <button type="button" class="pnle-level-btn" data-level="hard">Hard</button>
      </div>
      <button type="button" class="pnle-btn-primary" id="pnleStartSession">Start session</button>
    `;
    root.querySelector('#pnleBackHome').addEventListener('click', () => {
      session = null;
      renderStudyHome();
    });
    root.querySelectorAll('.pnle-level-btn').forEach((b) => {
      b.addEventListener('click', () => {
        session.level = b.getAttribute('data-level');
        root.querySelectorAll('.pnle-level-btn').forEach((x) => x.classList.toggle('is-active', x === b));
      });
    });
    root.querySelector('#pnleStartSession').addEventListener('click', () => {
      const pool = filterItems(session.topicId, session.level);
      if (!pool.length) {
        alert('No questions in this pool yet. Try another topic or level.');
        return;
      }
      session.queue = shuffle(pool);
      session.index = 0;
      session.answered = 0;
      session.locked = false;
      session.phase = 'question';
      renderQuestion();
    });
  }

  const ICON_CHECK =
    '<svg class="pnle-choice-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15"/><path d="M8 12.5l2.5 2.5 5.5-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const ICON_X =
    '<svg class="pnle-choice-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15"/><path d="M9 9l6 6M15 9l-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';

  function renderQuestion() {
    const root = document.getElementById('pnleStudyRoot');
    const tabbar = document.getElementById('pnleStudyTabbar');
    if (tabbar) tabbar.classList.add('is-dimmed');
    if (!root || !session) return;
    const item = session.queue[session.index];
    if (!item) {
      if (tabbar) tabbar.classList.remove('is-dimmed');
      root.innerHTML = `
        <h2 class="pnle-screen-title">Session complete</h2>
        <p class="pnle-study-progress">You answered ${session.answered} question(s).</p>
        <button type="button" class="pnle-btn-primary" id="pnleDoneHome">Back to practice</button>
      `;
      root.querySelector('#pnleDoneHome').addEventListener('click', () => {
        session = null;
        setStudyTab('practice');
      });
      return;
    }

    const mistakeCount = Object.keys(readMistakes()).length;
    const choices = item.choices
      .map(
        (c, idx) =>
          `<button type="button" class="pnle-choice" data-idx="${idx}">
            <span class="pnle-choice-icon-slot"></span>
            <span class="pnle-choice-body">
              <span class="pnle-choice-text">${escapeHtml(c)}</span>
              <span class="pnle-choice-reason">${escapeHtml(item.reasons[idx])}</span>
            </span>
          </button>`
      )
      .join('');

    root.innerHTML = `
      <div class="pnle-question-toolbar">
        <span class="pnle-q-progress">Question ${session.index + 1} of ${session.queue.length}</span>
        <button type="button" class="pnle-history-btn" id="pnleHistoryBtn">Question history (${mistakeCount})</button>
        <button type="button" class="pnle-end-btn" id="pnleQuitSession">End</button>
      </div>
      <div class="pnle-question-card">
        <p class="pnle-question-stem">${escapeHtml(item.stem)}</p>
        <div class="pnle-choices">${choices}</div>
        <div class="pnle-study-actions">
          <button type="button" class="pnle-btn-secondary" id="pnleRevealBtn" disabled>Lock answer to see reasons</button>
        </div>
        <button type="button" class="pnle-btn-primary pnle-btn-next" id="pnleNextBtn" hidden>Next question</button>
        <div class="pnle-feedback-row" id="pnleFeedbackRow" hidden>
          <span>Was this question clear?</span>
          <button type="button" class="pnle-thumb" id="pnleThumbUp" title="Helpful">👍</button>
          <button type="button" class="pnle-thumb" id="pnleThumbDown" title="Report issue">👎</button>
        </div>
      </div>
    `;

    let picked = null;
    const revealBtn = root.querySelector('#pnleRevealBtn');
    const nextBtn = root.querySelector('#pnleNextBtn');
    const feedbackRow = root.querySelector('#pnleFeedbackRow');

    root.querySelector('#pnleQuitSession').addEventListener('click', () => {
      session = null;
      if (tabbar) tabbar.classList.remove('is-dimmed');
      setStudyTab(studyTab);
    });

    root.querySelector('#pnleHistoryBtn').addEventListener('click', () => {
      session = null;
      if (tabbar) tabbar.classList.remove('is-dimmed');
      setStudyTab('mistakes');
    });

    root.querySelectorAll('.pnle-choice').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (session.locked) return;
        picked = parseInt(btn.getAttribute('data-idx'), 10);
        root.querySelectorAll('.pnle-choice').forEach((b) => b.classList.remove('is-picked'));
        btn.classList.add('is-picked');
        revealBtn.disabled = false;
      });
    });

    revealBtn.addEventListener('click', () => {
      if (picked === null || session.locked) return;
      session.locked = true;
      const correct = item.correctIndex;
      const isCorrect = picked === correct;
      recordAnswer(item, isCorrect);
      session.answered += 1;

      root.querySelectorAll('.pnle-choice').forEach((b) => {
        const idx = parseInt(b.getAttribute('data-idx'), 10);
        b.disabled = true;
        const slot = b.querySelector('.pnle-choice-icon-slot');
        if (idx === correct) {
          b.classList.add('is-correct', 'is-revealed');
          if (slot) slot.innerHTML = ICON_CHECK;
        }
        if (idx === picked && picked !== correct) {
          b.classList.add('is-wrong', 'is-revealed');
          if (slot) slot.innerHTML = ICON_X;
        }
        if (idx !== correct && idx !== picked) {
          b.classList.add('is-revealed');
        }
      });

      revealBtn.hidden = true;
      nextBtn.hidden = false;
      feedbackRow.hidden = false;
    });

    nextBtn.addEventListener('click', () => {
      session.index += 1;
      session.locked = false;
      renderQuestion();
    });

    root.querySelector('#pnleThumbUp').addEventListener('click', () => {
      recordItemFeedback(item.id, true);
      feedbackRow.innerHTML = '<span class="pnle-feedback-thanks">Thanks — noted.</span>';
    });
    root.querySelector('#pnleThumbDown').addEventListener('click', () => {
      recordItemFeedback(item.id, false);
      feedbackRow.innerHTML = '<span class="pnle-feedback-thanks">Reported — we will review this item.</span>';
    });
  }

  function bindLaunchUi() {
    const dutyBtn = document.getElementById('pnleLaunchDuty');
    const studyBtn = document.getElementById('pnleLaunchStudy');
    if (dutyBtn) dutyBtn.addEventListener('click', enterDutyMode);
    if (studyBtn) studyBtn.addEventListener('click', enterStudyMode);

    const dutySwitch = document.getElementById('pnleDutySwitchMode');
    const studySwitch = document.getElementById('pnleStudySwitchMode');
    if (dutySwitch) {
      dutySwitch.addEventListener('click', () => showLaunchGateWhenReady(true));
    }
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
    handlePostAuth,
    enterDutyMode,
    enterStudyMode,
    showLaunchGate: () => showLaunchGateWhenReady(true),
    getReviewedCount: () => bankItems.length,
    getMistakeIds: () => Object.keys(readMistakes()),
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
