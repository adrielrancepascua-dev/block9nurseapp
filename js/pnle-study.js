/**
 * PNLE Study mode: launch chooser, session player, mistakes store, telemetry hooks.
 */
(function (global) {
  'use strict';

  const LAUNCH_MODE_KEY = 'nursepath_launch_mode_v1';
  const DAILY_GOAL_KEY = 'nursepath_pnle_daily_goal_v1';
  const MISTAKES_KEY = 'nursepath_pnle_mistakes_v1';
  const PROGRESS_KEY = 'nursepath_pnle_progress_v1';
  const DAILY_COUNT_KEY = 'nursepath_pnle_daily_count_v1';

  const TOPICS = [
    { id: 'oxygenation', label: 'Oxygenation', locked: false },
    { id: 'heart', label: 'Heart', locked: false },
    { id: 'blood', label: 'Blood & transfusion', locked: false },
    { id: 'fluids_abg', label: 'Fluids, electrolytes & ABG', locked: false },
    { id: 'periop_iv', label: 'Perioperative & IV', locked: false },
    { id: 'all', label: 'All MedSurg topics', locked: false },
    { id: 'mistakes', label: 'My mistakes', locked: false },
    { id: 'maternal', label: 'Maternal & newborn', locked: true },
    { id: 'peds', label: 'Pediatric nursing', locked: true },
    { id: 'psych', label: 'Psychiatric nursing', locked: true },
    { id: 'community', label: 'Community health', locked: true },
  ];

  let bankItems = [];
  let session = null;
  let launchResolved = false;
  let studySessionStartedAt = null;

  function todayYmd() {
    const d = new Date();
    return d.toISOString().slice(0, 10);
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

    const prog = readJson(PROGRESS_KEY, {});
    prog[item.id] = { lastAt: new Date().toISOString(), correct: Boolean(correct) };
    writeJson(PROGRESS_KEY, prog);

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

  function applyBodyMode(mode) {
    document.body.classList.remove('pnle-mode-duty', 'pnle-mode-study');
    document.body.classList.add(mode === 'study' ? 'pnle-mode-study' : 'pnle-mode-duty');
  }

  function bootDutyApp() {
    applyBodyMode('duty');
    const shell = document.getElementById('pnle-study-shell');
    if (shell) shell.classList.remove('is-active');
    if (typeof global.__nursepathBootApp === 'function') {
      global.__nursepathBootApp();
    }
  }

  function enterStudyMode() {
    setLastMode('study');
    applyBodyMode('study');
    launchResolved = true;
    const overlay = document.getElementById('pnleLaunchOverlay');
    if (overlay) overlay.style.display = 'none';
    const shell = document.getElementById('pnle-study-shell');
    if (shell) shell.classList.add('is-active');
    if (global.__nursepathAuthState && !global.__nursepathAuthState.booted) {
      if (typeof global.__nursepathBootApp === 'function') {
        global.__nursepathBootApp();
      }
    }
    renderStudyHome();
    startStudySession();
  }

  function enterDutyMode() {
    endStudySession();
    setLastMode('duty');
    launchResolved = true;
    const overlay = document.getElementById('pnleLaunchOverlay');
    if (overlay) overlay.style.display = 'none';
    bootDutyApp();
  }

  function simulationBlocking() {
    const sim = document.getElementById('simulationModeOverlay');
    if (!sim) return false;
    return window.getComputedStyle(sim).display !== 'none';
  }

  function showLaunchOverlayWhenReady() {
    if (simulationBlocking()) {
      setTimeout(showLaunchOverlayWhenReady, 400);
      return;
    }
    showLaunchOverlay();
  }

  function showLaunchOverlay() {
    const overlay = document.getElementById('pnleLaunchOverlay');
    if (!overlay) {
      enterDutyMode();
      return;
    }
    const last = getLastMode();
    const cont = document.getElementById('pnleLaunchContinue');
    if (cont) {
      if (last) {
        cont.classList.remove('hidden');
        cont.textContent =
          last === 'study' ? 'Continue in Study' : 'Continue in Duty';
      } else {
        cont.classList.add('hidden');
      }
    }
    overlay.style.display = 'flex';
  }

  function handlePostAuth() {
    bankItems = loadBank();
    if (!launchResolved) {
      showLaunchOverlayWhenReady();
      return true;
    }
    return false;
  }

  function renderStudyHome() {
    const root = document.getElementById('pnleStudyRoot');
    if (!root) return;
    const goal = getDailyGoal();
    const done = getDailyProgress();
    const mistakeCount = Object.keys(readMistakes()).length;
    const topicCards = TOPICS.map((t) => {
      const locked = t.locked;
      const sub =
        t.id === 'mistakes'
          ? `${mistakeCount} item${mistakeCount === 1 ? '' : 's'} to review`
          : t.id === 'all'
            ? `Mixed from ${bankItems.length} questions`
            : locked
              ? 'Coming in a future pack'
              : `${bankItems.filter((i) => i.topic === t.id).length} in bank`;
      return `<button type="button" class="pnle-topic-card${locked ? ' is-locked' : ''}" data-topic="${t.id}" ${locked ? 'disabled' : ''}>
        <h3>${escapeHtml(t.label)}${locked ? ' 🔒' : ''}</h3>
        <p>${escapeHtml(sub)}</p>
      </button>`;
    }).join('');

    root.innerHTML = `
      <div class="pnle-study-top">
        <h1>PNLE Study · MedSurg</h1>
        <button type="button" class="pnle-study-switch" id="pnleSwitchDuty">Switch to Duty</button>
      </div>
      <p class="pnle-study-progress">MedSurg · ${bankItems.length} reviewed questions · Daily ${done}/${goal}</p>
      <div class="pnle-daily-goal">
        <label for="pnleDailyGoalInput">Daily goal</label>
        <input type="number" id="pnleDailyGoalInput" min="1" max="50" value="${goal}">
        <span>questions / day</span>
      </div>
      <p style="font-size:13px;color:var(--hub-text-2,#94a3b8);margin:0 0 12px;">Pick a topic, then Normal or Hard.</p>
      <div class="pnle-topic-grid">${topicCards}</div>
    `;

    root.querySelector('#pnleSwitchDuty').addEventListener('click', () => {
      endStudySession();
      enterDutyMode();
    });
    const goalInput = root.querySelector('#pnleDailyGoalInput');
    goalInput.addEventListener('change', () => {
      setDailyGoal(goalInput.value);
      renderStudyHome();
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
        };
        renderLevelPicker();
      });
    });
  }

  function renderLevelPicker() {
    const root = document.getElementById('pnleStudyRoot');
    if (!root || !session) return;
    const topic = TOPICS.find((t) => t.id === session.topicId);
    root.innerHTML = `
      <div class="pnle-study-top">
        <h1>${escapeHtml(topic ? topic.label : 'Study')}</h1>
        <button type="button" class="pnle-study-switch" id="pnleBackHome">← Topics</button>
      </div>
      <p class="pnle-study-progress">Choose difficulty</p>
      <div class="pnle-level-row">
        <button type="button" class="pnle-level-btn is-active" data-level="normal">Normal</button>
        <button type="button" class="pnle-level-btn" data-level="hard">Hard</button>
      </div>
      <button type="button" class="pnle-launch-btn primary" id="pnleStartSession">Start session</button>
    `;
    root.querySelector('#pnleBackHome').addEventListener('click', renderStudyHome);
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
      renderQuestion();
    });
  }

  function renderQuestion() {
    const root = document.getElementById('pnleStudyRoot');
    if (!root || !session) return;
    const item = session.queue[session.index];
    if (!item) {
      root.innerHTML = `
        <div class="pnle-study-top"><h1>Session complete</h1></div>
        <p class="pnle-study-progress">You answered ${session.answered} question(s).</p>
        <button type="button" class="pnle-launch-btn primary" id="pnleDoneHome">Back to topics</button>
      `;
      root.querySelector('#pnleDoneHome').addEventListener('click', renderStudyHome);
      return;
    }

    const choices = item.choices
      .map(
        (c, idx) =>
          `<button type="button" class="pnle-choice" data-idx="${idx}">${escapeHtml(c)}</button>`
      )
      .join('');

    root.innerHTML = `
      <div class="pnle-study-top">
        <h1>Question ${session.index + 1} of ${session.queue.length}</h1>
        <button type="button" class="pnle-study-switch" id="pnleQuitSession">End</button>
      </div>
      <div class="pnle-question-card">
        <p class="pnle-question-stem">${escapeHtml(item.stem)}</p>
        <div class="pnle-choices">${choices}</div>
        <div class="pnle-reasons" id="pnleReasons"></div>
        <div class="pnle-study-actions">
          <button type="button" class="secondary" id="pnleRevealBtn" disabled>Lock answer to see reasons</button>
          <button type="button" id="pnleNextBtn" style="display:none">Next</button>
        </div>
      </div>
    `;

    let picked = null;
    const revealBtn = root.querySelector('#pnleRevealBtn');
    const nextBtn = root.querySelector('#pnleNextBtn');
    const reasonEl = root.querySelector('#pnleReasons');

    root.querySelector('#pnleQuitSession').addEventListener('click', renderStudyHome);

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
        if (idx === correct) b.classList.add('is-correct');
        if (idx === picked && picked !== correct) b.classList.add('is-wrong');
      });

      const labels = ['A', 'B', 'C', 'D'];
      reasonEl.innerHTML = item.reasons
        .map(
          (r, i) =>
            `<div class="pnle-reason-block"><strong>${labels[i]}.</strong> ${escapeHtml(r)}${
              i === picked ? ' <em>(Your pick)</em>' : ''
            }${i === correct ? ' <em>(Correct)</em>' : ''}</div>`
        )
        .join('');
      reasonEl.classList.add('is-visible');
      revealBtn.style.display = 'none';
      nextBtn.style.display = 'inline-block';
    });

    nextBtn.addEventListener('click', () => {
      session.index += 1;
      session.locked = false;
      renderQuestion();
    });
  }

  function bindLaunchUi() {
    const dutyBtn = document.getElementById('pnleLaunchDuty');
    const studyBtn = document.getElementById('pnleLaunchStudy');
    const contBtn = document.getElementById('pnleLaunchContinue');
    if (dutyBtn) dutyBtn.addEventListener('click', enterDutyMode);
    if (studyBtn) studyBtn.addEventListener('click', enterStudyMode);
    if (contBtn) {
      contBtn.addEventListener('click', () => {
        const last = getLastMode() || 'duty';
        if (last === 'study') enterStudyMode();
        else enterDutyMode();
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
            showLaunchOverlayWhenReady();
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
    getReviewedCount: () => bankItems.length,
    getMistakeIds: () => Object.keys(readMistakes()),
  };

  const origBoot = global.__nursepathBootApp;
  global.__nursepathBootApp = function patchedBoot() {
    if (global.NursePathPnleStudy && NursePathPnleStudy.handlePostAuth()) {
      if (origBoot && global.__nursepathAuthState && !global.__nursepathAuthState.booted) {
        /* defer duty boot until mode chosen; study path may call origBoot */
      }
      return;
    }
    if (origBoot) origBoot();
    const last = getLastMode();
    if (last === 'study') {
      enterStudyMode();
    }
  };

  window.addEventListener('beforeunload', endStudySession);
})(typeof window !== 'undefined' ? window : globalThis);
