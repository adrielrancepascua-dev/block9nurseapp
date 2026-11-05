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
  const ACTIVE_SESSION_KEY = 'nursepath_pnle_session_v1';
  const BANK_GATE_OVERRIDE_KEY = 'nursepath_pnle_bank_gate_v1';
  const CHOICE_LABELS = ['A', 'B', 'C', 'D', 'E'];

  function choiceLabel(idx) {
    return CHOICE_LABELS[idx] || String(idx + 1);
  }

  function isSataItem(item) {
    return item && item.format === 'sata';
  }

  function getCorrectIndices(item) {
    if (item.correctIndices && item.correctIndices.length) {
      return item.correctIndices.slice().sort((a, b) => a - b);
    }
    return [item.correctIndex];
  }

  function setsEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i += 1) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  const TOPIC_ROWS = [
    { id: 'oxygenation', label: 'Oxygenation' },
    { id: 'heart', label: 'Heart' },
    { id: 'blood', label: 'Blood & transfusion' },
    { id: 'fluids_abg', label: 'Fluids, electrolytes & ABG' },
    { id: 'periop_iv', label: 'Perioperative & IV' },
  ];

  let bankItems = [];
  let session = null;
  let sessionBankSignature = '';
  let sessionSaveFailed = false;
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

  function sessionContext() {
    const user = readJson('nursepath_user', null);
    return { owner: user && typeof user.email === 'string' ? user.email.trim().toLowerCase() : '', bankSignature: sessionBankSignature, now: Date.now() };
  }

  function removeSavedSession() {
    try { localStorage.removeItem(ACTIVE_SESSION_KEY); } catch (e) { /* Storage may be unavailable. */ }
  }

  function restoreSavedSession() {
    const helper = global.NursePathPnleSession;
    if (!helper) return null;
    const saved = readJson(ACTIVE_SESSION_KEY, null);
    const restored = helper.decode(saved, bankItems, sessionContext());
    if (saved && !restored) removeSavedSession();
    return restored;
  }

  function saveActiveSession() {
    try {
      const helper = global.NursePathPnleSession;
      if (!helper) throw new Error('Session helper unavailable');
      const saved = helper.encode(session, sessionContext());
      if (saved) localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(saved));
      else removeSavedSession();
      sessionSaveFailed = false;
    } catch (e) { sessionSaveFailed = true; }
    const status = document.getElementById('pnleSessionSaveStatus');
    if (status) status.textContent = sessionSaveFailed ? 'This session could not be saved on this device. Keep this tab open to continue.' : '';
  }

  function discardActiveSession() {
    session = null;
    sessionSaveFailed = false;
    removeSavedSession();
  }

  function hasUnfinishedSession() {
    return Boolean(session && session.phase === 'question' && session.index < session.queue.length);
  }

  function resumePractice() {
    if (!hasUnfinishedSession()) session = restoreSavedSession();
    if (!hasUnfinishedSession()) { renderStudyHome(); return; }
    studyTab = session.topicId === 'mistakes' ? 'mistakes' : 'practice';
    renderQuestion();
  }

  function beginPractice(pool, topicId, level, kind, limit) {
    if (hasUnfinishedSession() && !global.confirm('Start a new session? Your current question position will be replaced. Recorded answers stay saved.')) return;
    const queue = shuffle(pool).slice(0, limit || pool.length);
    session = { topicId, level, kind, queue, index: 0, answered: 0, locked: false, picked: [], phase: 'question' };
    studyTab = topicId === 'mistakes' ? 'mistakes' : 'practice';
    saveActiveSession();
    renderQuestion();
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

  function isTestingReleaseAll() {
    const pack = global.NursePathPnleMedSurg;
    return Boolean(pack && pack.testingReleaseAll === true);
  }

  function loadBank() {
    const pack = global.NursePathPnleMedSurg;
    if (!pack || !Array.isArray(pack.items)) return [];
    const stemOk = (stem) => !/\b(handout|sheet|reviewer|per\s+the)\b/i.test(stem || '');
    if (isTestingReleaseAll()) {
      return pack.items.filter((it) => stemOk(it.stem));
    }
    return pack.items.filter((it) => itemInStudyBank(it) && stemOk(it.stem));
  }

  function getStudyDisclaimerBannerHtml() {
    if (isTestingReleaseAll()) {
      return `<p class="pnle-study-gate-banner pnle-study-gate-banner--testing" role="status">Unofficial Questions</p>`;
    }
    if (getStudyBankGate() === 'preview') {
      return `<p class="pnle-study-gate-banner" role="status">Preview bank — self-checked items only (not instructor-signed for students).</p>`;
    }
    return '';
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
    discardActiveSession();
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
    if (level === 'hard') {
      pool = pool.filter((it) => it.examStyle === true || it.level === 'hard');
    } else if (level === 'normal') {
      pool = pool.filter((it) => it.level !== 'hard' && !it.examStyle);
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
    document.querySelectorAll('.np-app-mode-picker').forEach((picker) => {
      const next = mode === 'study' ? 'study' : 'duty';
      picker.dataset.mode = next;
      picker.querySelector('[data-app-mode-label]').textContent = next === 'study' ? 'PNLE' : 'Standard';
      picker.querySelectorAll('[data-app-mode]').forEach((option) => {
        option.setAttribute('aria-checked', String(option.getAttribute('data-app-mode') === next));
      });
    });
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
    saveActiveSession();
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
    saveActiveSession();
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
    sessionBankSignature = global.NursePathPnleSession ? global.NursePathPnleSession.signature(bankItems) : '';
    session = restoreSavedSession();
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

  function syncStudyNavigation() {
    const bar = document.getElementById('pnleStudyTabbar');
    if (bar) {
      bar.classList.remove('is-dimmed');
      bar.querySelectorAll('.pnle-tab').forEach((btn, index) => {
        const t = btn.getAttribute('data-study-tab');
        const active = t === studyTab;
        btn.classList.toggle('is-active', active);
        if (active) {
          btn.setAttribute('aria-current', 'page');
          bar.style.setProperty('--pnle-nav-index', index);
        } else btn.removeAttribute('aria-current');
      });
    }
  }

  function setStudyTab(tab) {
    studyTab = tab;
    syncStudyNavigation();
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
    beginPractice(pool, topicId, level, 'topic');
  }

  function startMixedPractice(fullBank) {
    const level = getStudyLevel();
    const pool = filterItems('all', level);
    if (!pool.length) { alert('No questions available.'); return; }
    beginPractice(pool, 'all', level, fullBank ? 'full' : 'daily', fullBank ? pool.length : getDailyGoal());
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
    const practiceCount = filterItems('all', level).length;
    const dailyCount = Math.min(getDailyGoal(), practiceCount);
    const resumable = hasUnfinishedSession();
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

    const gateBanner = getStudyDisclaimerBannerHtml();

    root.innerHTML = `
      ${isTestingReleaseAll() ? '' : gateBanner}
      <header class="pnle-practice-heading">
        <h2>MedSurg practice</h2>
        <p>Unofficial Questions</p>
      </header>
      ${resumable ? `<section class="pnle-resume-card" aria-labelledby="pnleResumeTitle"><div><h3 id="pnleResumeTitle">Pick up where you left off</h3><p>Question ${session.index + 1} of ${session.queue.length} · ${session.level === 'mixed' ? 'Mistakes' : session.level === 'hard' ? 'Hard' : 'Normal'}${session.locked ? ' · Answer saved' : ''}</p></div><button type="button" class="pnle-btn-primary" id="pnleResumePractice">Resume practice</button></section>` : ''}
      <div class="pnle-home-hero">
        <div class="pnle-goal-ring-wrap">
          <div class="pnle-goal-ring" style="--ring-pct:${ringPct}" aria-hidden="true">
            <div class="pnle-goal-ring-inner">${ringInner}</div>
          </div>
          <div class="pnle-goal-ring-labels">
            <p class="pnle-goal-ring-frac">${escapeHtml(frac)}</p>
            <p class="pnle-goal-ring-cap">${goalMet ? 'Goal met' : 'Answered today'}</p>
          </div>
        </div>
        <div class="pnle-home-hero-text">
          <p class="pnle-home-hero-title" aria-label="${mastered} of ${bankItems.length} questions mastered">${mastered} / ${bankItems.length}</p>
        </div>
      </div>
      <div class="pnle-level-row" role="group" aria-label="Difficulty">
        <button type="button" class="pnle-level-btn${level === 'normal' ? ' is-active' : ''}" data-level="normal" aria-pressed="${level === 'normal'}">Normal</button>
        <button type="button" class="pnle-level-btn${level === 'hard' ? ' is-active' : ''}" data-level="hard" aria-pressed="${level === 'hard'}">Hard</button>
      </div>
      <button type="button" class="pnle-btn-primary" id="pnleStartPractice"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m8 4 12 8-12 8V4Z"/></svg>${resumable ? 'New daily practice' : goalMet ? 'Practice again' : 'Daily practice'} · ${dailyCount} questions</button>
      <button type="button" class="pnle-full-practice np-action-btn" id="pnleStartFullPractice">Full ${level === 'hard' ? 'Hard' : 'Normal'} bank · ${practiceCount} questions</button>
      <button type="button" class="pnle-mistakes-strip" id="pnleHomeMistakes">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5C8 3 5 3 2 4v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-6-1-10 1Zm0 0v15M15 10l2 2 3-4"/></svg>
        <span>My mistakes</span>
        <strong>${mistakeCount} waiting</strong>
      </button>
      <div class="pnle-topics-heading"><h2 class="pnle-section-label">Topics</h2><span>${TOPIC_ROWS.length} topics</span></div>
      <p class="pnle-difficulty-help">Topic practice includes all questions at your selected difficulty.</p>
      <div class="pnle-topic-list">${topicRows}</div>
    `;

    root.querySelector('#pnleStartPractice').addEventListener('click', () => startMixedPractice(false));
    root.querySelector('#pnleStartFullPractice').addEventListener('click', () => startMixedPractice(true));
    const resume = root.querySelector('#pnleResumePractice');
    if (resume) resume.addEventListener('click', resumePractice);
    root.querySelector('#pnleHomeMistakes').addEventListener('click', () => setStudyTab('mistakes'));
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

  function getMistakeItems() {
    const mistakes = readMistakes();
    return bankItems.filter((item) => Boolean(mistakes[item.id]));
  }

  function renderMistakesHome() {
    const root = document.getElementById('pnleStudyRoot');
    if (!root) return;
    const mistakeCount = getMistakeItems().length;
    if (!mistakeCount) {
      root.innerHTML = `<div class="pnle-mistakes-card"><h2>You're all caught up</h2><p class="pnle-study-hint">Questions you miss during practice will appear here for review.</p></div>`;
      return;
    }
    root.innerHTML = `
      <header class="pnle-practice-heading"><h2>My mistakes</h2><p>${mistakeCount} question${mistakeCount === 1 ? '' : 's'} waiting</p></header>
      <div class="pnle-mistake-actions">
        <button type="button" class="pnle-mistake-action np-action-btn" id="pnleReviewExplanations">
          <span class="pnle-mistake-action-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5C8 3 5 3 2 4v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-6-1-10 1Zm0 0v15"/></svg></span>
          <span><span class="pnle-mistake-action-title">Review concepts</span><span class="pnle-mistake-action-description">Short, focused lessons on the concepts behind your mistakes.</span></span><span class="pnle-mistake-action-chevron" aria-hidden="true">›</span>
        </button>
        <button type="button" class="pnle-mistake-action np-action-btn" id="pnleStartMistakes">
          <span class="pnle-mistake-action-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7V3l-3 3a8 8 0 1 0 3 8M16 3h4"/></svg></span>
          <span><span class="pnle-mistake-action-title">Retake mistakes</span><span class="pnle-mistake-action-description">Test what you've learned.</span></span><span class="pnle-mistake-action-chevron" aria-hidden="true">›</span>
        </button>
      </div>
      <p class="pnle-study-hint pnle-mistake-reminder">Questions clear after correct answers on two different days. Reading lessons does not change your progress.</p>
    `;
    root.querySelector('#pnleReviewExplanations').addEventListener('click', startMistakeExplanations);
    const start = root.querySelector('#pnleStartMistakes');
    if (start) start.addEventListener('click', startMistakesSession);
  }

  function startMistakeExplanations() {
    studyTab = 'mistakes';
    syncStudyNavigation();
    const items = getMistakeItems();
    if (!items.length) { renderMistakesHome(); return; }
    const lessons = window.NursePathPnleConcepts ? window.NursePathPnleConcepts.getForItems(items) : [{ id: 'unavailable', title: 'Lessons unavailable', summary: 'The lesson library could not be loaded. Reopen the app online to download it.', sections: [], reflect: '', sources: [] }];
    renderConceptLesson(lessons, 0);
  }

  function renderConceptLesson(lessons, index) {
    const root = document.getElementById('pnleStudyRoot');
    const lesson = lessons[index];
    if (!root || !lesson) { renderMistakesHome(); return; }
    const sections = lesson.sections.map(section => `<section class="pnle-lesson-section"><h3>${escapeHtml(section.heading)}</h3><p>${escapeHtml(section.body)}</p></section>`).join('');
    const sources = lesson.sources.map(source => `<li><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.label)}<span class="sr-only"> (opens in a new tab)</span></a></li>`).join('');
    root.innerHTML = `<section class="pnle-mistake-review">
      <button type="button" class="pnle-review-back np-action-btn" id="pnleReviewBack">← My mistakes</button>
      <header class="pnle-practice-heading"><p>${index + 1} of ${lessons.length} concepts · Short lesson</p><h2 id="pnleReviewTitle" tabindex="-1">${escapeHtml(lesson.title)}</h2></header>
      <article class="pnle-concept-lesson" aria-labelledby="pnleReviewTitle">
        <p class="pnle-lesson-summary">${escapeHtml(lesson.summary)}</p>
        ${sections}
        ${lesson.reflect ? `<aside class="pnle-lesson-reflect"><h3>Think it through</h3><p>${escapeHtml(lesson.reflect)}</p></aside>` : ''}
        ${sources ? `<details class="pnle-lesson-sources"><summary>Sources &amp; further reading</summary><p>Lessons are available offline after download. Source links need an internet connection.</p><ul>${sources}</ul></details>` : ''}
      </article>
      <div class="pnle-review-pagination"><button type="button" class="pnle-review-previous np-action-btn" id="pnleReviewPrevious"${index === 0 ? ' disabled' : ''}>Previous</button><button type="button" class="pnle-btn-primary" id="pnleReviewNext">${index + 1 === lessons.length ? 'Done reviewing' : 'Next concept'}</button></div>
      <p class="pnle-study-hint pnle-mistake-reminder">Reading does not change your progress. Verify learning with your Clinical Instructor and approved course materials.</p>
    </section>`;
    root.scrollTop = 0;
    root.querySelector('#pnleReviewTitle').focus({ preventScroll: true });
    const backToChoices = () => {
      setStudyTab('mistakes');
      const review = root.querySelector('#pnleReviewExplanations');
      if (review) review.focus();
    };
    root.querySelector('#pnleReviewBack').addEventListener('click', backToChoices);
    root.querySelector('#pnleReviewPrevious').addEventListener('click', () => { if (index > 0) renderConceptLesson(lessons, index - 1); });
    root.querySelector('#pnleReviewNext').addEventListener('click', () => {
      if (index + 1 < lessons.length) renderConceptLesson(lessons, index + 1);
      else backToChoices();
    });
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
    beginPractice(unique, 'mistakes', 'mixed', 'mistakes');
  }

  function renderProgressHome() {
    const root = document.getElementById('pnleStudyRoot');
    if (!root) return;
    const mastered = getMasteredCount();
    const mistakes = Object.keys(readMistakes()).length;
    const done = getDailyProgress();
    const goal = getDailyGoal();
    const percent = bankItems.length ? Math.min(100, Math.round(mastered / bankItems.length * 100)) : 0;
    const topicProgress = TOPIC_ROWS.map((t, index) => {
      const total = getTopicTotal(t.id);
      const m = getMasteredInTopic(t.id);
      return `<li class="pnle-progress-topic"><div class="pnle-progress-topic-heading"><h4 id="pnleTopicProgress${index}">${escapeHtml(t.label)}</h4><strong>${m} <span>/ ${total}</span></strong></div><progress value="${m}" max="${Math.max(1, total)}" aria-labelledby="pnleTopicProgress${index}" aria-valuetext="${m} of ${total} questions mastered">${m} / ${total}</progress></li>`;
    }).join('');
    root.innerHTML = `
      <section class="pnle-progress-dashboard" aria-labelledby="pnleProgressTitle">
        <header class="pnle-practice-heading"><h2 id="pnleProgressTitle">Your progress</h2><p>A little practice, lasting knowledge.</p></header>
        <div class="pnle-progress-overview">
          <div class="pnle-mastery-ring" style="--mastery-percent:${percent}%" aria-hidden="true"><span>${percent}%</span></div>
          <div class="pnle-progress-overview-copy"><p>Questions mastered</p><strong>${mastered} / ${bankItems.length}</strong><span>Correct on two different days</span></div>
        </div>
        <div class="pnle-progress-stats">
          <div class="pnle-progress-stat"><span class="pnle-progress-stat-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18m-11 5 2 2 4-4"/></svg></span><p>Today answered</p><strong>${formatTodayFraction()}</strong><span>${done >= goal ? 'Daily goal reached' : 'Toward your daily goal'}</span><progress value="${Math.min(done, goal)}" max="${Math.max(1, goal)}" aria-label="Daily answer goal" aria-valuetext="${done} of ${goal} answers">${done} / ${goal}</progress></div>
          <div class="pnle-progress-stat"><span class="pnle-progress-stat-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5C8 3 5 3 2 4v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-6-1-10 1Zm0 0v15"/></svg></span><p>Mistakes waiting</p><strong>${mistakes}</strong><span>${mistakes ? 'Keep learning at your pace' : 'You’re all caught up'}</span></div>
        </div>
        <section aria-labelledby="pnleProgressTopics"><div class="pnle-topics-heading"><h3 class="pnle-section-label" id="pnleProgressTopics">Mastery by topic</h3><span>${TOPIC_ROWS.length} topics</span></div><ul class="pnle-progress-topics">${topicProgress}</ul></section>
        <aside class="pnle-progress-note"><h3>How mastery works</h3><p>Answer correctly on two different calendar days to master a question. Missing it again resets that streak. Today’s count includes every answer you lock.</p></aside>
      </section>
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

  function revealChoiceRow(b, item, idx, correctSet, pickedSet) {
    b.disabled = true;
    const slot = b.querySelector('.pnle-choice-icon-slot');
    const body = b.querySelector('.pnle-choice-body');
    const isCorrectOpt = correctSet.has(idx);
    const wasPicked = pickedSet.has(idx);
    const showReason = isCorrectOpt || wasPicked;
    if (showReason && body) {
      const state = document.createElement('span');
      state.className = 'pnle-choice-state';
      state.textContent = isCorrectOpt
        ? (wasPicked ? 'Your answer · Correct' : 'Correct answer')
        : 'Your answer · Incorrect';
      body.appendChild(state);
      const reason = document.createElement('span');
      reason.className = 'pnle-choice-reason';
      reason.textContent = item.reasons[idx];
      body.appendChild(reason);
    }
    if (isCorrectOpt) {
      b.classList.add('is-correct', 'is-revealed');
      if (slot) slot.innerHTML = ICON_CHECK;
    } else if (wasPicked) {
      b.classList.add('is-wrong', 'is-revealed');
      if (slot) slot.innerHTML = ICON_X;
    } else {
      b.classList.add('is-dimmed');
      if (slot) slot.innerHTML = `<span class="pnle-choice-letter">${choiceLabel(idx)}</span>`;
    }
  }

  function showNextButton(root, correct) {
    const nextBtn = root.querySelector('#pnleNextBtn');
    if (nextBtn) {
      nextBtn.classList.remove('is-hidden');
      nextBtn.removeAttribute('hidden');
      nextBtn.removeAttribute('aria-hidden');
      nextBtn.disabled = false;
      nextBtn.innerHTML = 'Next question <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>';
    }
    const announcement = root.querySelector('.pnle-answer-announcement');
    if (announcement) announcement.textContent = correct ? 'Correct answer. Review the explanation, then continue.' : 'Incorrect answer. Review the correct answer and explanation, then continue.';
    const sataBtn = root.querySelector('#pnleSataSubmit');
    if (sataBtn) sataBtn.setAttribute('hidden', 'hidden');
  }

  function lockChoiceAnswer(root, item, picked) {
    session.locked = true;
    session.picked = [picked];
    const correct = item.correctIndex;
    const isCorrect = picked === correct;
    recordAnswer(item, isCorrect);
    session.answered += 1;
    saveActiveSession();
    const correctSet = new Set([correct]);
    const pickedSet = new Set([picked]);
    root.querySelectorAll('.pnle-choice').forEach((b) => {
      const idx = parseInt(b.getAttribute('data-idx'), 10);
      revealChoiceRow(b, item, idx, correctSet, pickedSet);
    });
    showNextButton(root, isCorrect);
  }

  function lockSataAnswer(root, item, pickedList) {
    session.locked = true;
    session.picked = pickedList.slice();
    const correct = getCorrectIndices(item);
    const pickedSorted = pickedList.slice().sort((a, b) => a - b);
    const isCorrect = setsEqual(pickedSorted, correct);
    recordAnswer(item, isCorrect);
    session.answered += 1;
    saveActiveSession();
    const correctSet = new Set(correct);
    const pickedSet = new Set(pickedSorted);
    root.querySelectorAll('.pnle-choice').forEach((b) => {
      const idx = parseInt(b.getAttribute('data-idx'), 10);
      revealChoiceRow(b, item, idx, correctSet, pickedSet);
    });
    showNextButton(root, isCorrect);
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
    syncStudyNavigation();
    const root = document.getElementById('pnleStudyRoot');
    const tabbar = document.getElementById('pnleStudyTabbar');
    if (!root || !session) return;
    const item = session.queue[session.index];
    if (!item) {
      session.phase = 'complete';
      removeSavedSession();
      root.innerHTML = `
        <h2 class="pnle-screen-title">Session complete</h2>
        <p class="pnle-study-hint">You answered ${session.answered} question(s).</p>
        <button type="button" class="pnle-btn-primary" id="pnleDoneHome">Back to practice</button>
      `;
      root.querySelector('#pnleDoneHome').addEventListener('click', () => {
        discardActiveSession();
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
      ? `${session.index + 1} of ${session.queue.length} · ${levelLabel}`
      : `${session.index + 1} of ${session.queue.length}`;
    const sata = isSataItem(item);
    const choices = item.choices
      .map(
        (c, idx) =>
          `<button type="button" class="pnle-choice${sata ? ' pnle-choice--sata' : ''}" data-idx="${idx}"${sata ? ' aria-pressed="false"' : ''}>
            <span class="pnle-choice-icon-slot"><span class="pnle-choice-letter">${choiceLabel(idx)}</span></span>
            <span class="pnle-choice-body">
              <span class="pnle-choice-text">${escapeHtml(c)}</span>
            </span>
          </button>`
      )
      .join('');

    const caseBlock = item.caseNarrative
      ? `<div class="pnle-case-block" role="region" aria-label="Case notes"><pre class="pnle-case-pre">${escapeHtml(item.caseNarrative)}</pre></div>`
      : '';
    const sataHint = sata
      ? '<p class="pnle-sata-hint">Select all that apply, then tap Check answer.</p>'
      : '';
    const sataSubmit = sata
      ? '<button type="button" class="pnle-btn-primary" id="pnleSataSubmit">Check answer</button>'
      : '';

    const testingBanner = isTestingReleaseAll()
      ? `<p class="pnle-study-gate-banner pnle-study-gate-banner--testing pnle-study-gate-banner--compact" role="status">Unofficial Questions</p>`
      : '';
    const topic = TOPIC_ROWS.find((row) => row.id === item.topic);

    root.innerHTML = `
      <div class="pnle-question-card">
        <div class="pnle-question-toolbar">
          <span class="pnle-q-progress">${escapeHtml(progressLabel)}</span>
          <div class="pnle-question-toolbar-actions">
            <button type="button" class="pnle-history-btn" id="pnleHistoryBtn">Mistakes (${mistakeCount})</button>
            <button type="button" class="pnle-end-btn" id="pnleQuitSession">End</button>
          </div>
        </div>
        <div class="pnle-question-meter" aria-hidden="true"><span style="width:${((session.index + 1) / session.queue.length) * 100}%"></span></div>
        ${topic ? `<p class="pnle-question-topic">${escapeHtml(topic.label)}</p>` : ''}
        ${caseBlock}
        <p class="pnle-question-stem">${escapeHtml(item.stem)}</p>
        ${sataHint}
        <div class="pnle-choices">${choices}</div>
      </div>
      <p class="pnle-answer-announcement" role="status" aria-live="polite"></p>
      <p class="pnle-session-save-status" id="pnleSessionSaveStatus" role="status">${sessionSaveFailed ? 'This session could not be saved on this device. Keep this tab open to continue.' : ''}</p>
      <div class="pnle-question-actions">
        ${sataSubmit}
        <button type="button" class="pnle-btn-primary pnle-btn-next${sata ? ' is-hidden' : ''}" id="pnleNextBtn" disabled${sata ? ' hidden aria-hidden="true"' : ''}>Select an answer</button>
      </div>
      ${testingBanner}
    `;

    const nextBtn = root.querySelector('#pnleNextBtn');

    root.querySelector('#pnleQuitSession').addEventListener('click', () => {
      if (!global.confirm('End this session? Recorded answers stay saved.')) return;
      discardActiveSession();
      setStudyTab(studyTab);
    });

    root.querySelector('#pnleHistoryBtn').addEventListener('click', () => {
      setStudyTab('mistakes');
    });

    if (sata) {
      const selected = new Set(session.picked || []);
      root.querySelectorAll('.pnle-choice--sata').forEach((btn) => {
        const initiallySelected = selected.has(parseInt(btn.getAttribute('data-idx'), 10));
        btn.classList.toggle('is-selected', initiallySelected);
        btn.setAttribute('aria-pressed', String(initiallySelected));
        btn.addEventListener('click', () => {
          if (session.locked) return;
          const idx = parseInt(btn.getAttribute('data-idx'), 10);
          if (selected.has(idx)) {
            selected.delete(idx);
            btn.classList.remove('is-selected');
          } else {
            selected.add(idx);
            btn.classList.add('is-selected');
          }
          btn.setAttribute('aria-pressed', String(selected.has(idx)));
          session.picked = Array.from(selected);
          saveActiveSession();
        });
      });
      const sataBtn = root.querySelector('#pnleSataSubmit');
      if (sataBtn) {
        sataBtn.addEventListener('click', () => {
          if (session.locked) return;
          if (!selected.size) {
            alert('Select at least one answer.');
            return;
          }
          lockSataAnswer(root, item, Array.from(selected));
        });
      }
    } else {
      root.querySelectorAll('.pnle-choice').forEach((btn) => bindChoiceTap(btn, root, item));
    }

    if (session.locked) {
      const correct = getCorrectIndices(item);
      const picked = session.picked || [];
      root.querySelectorAll('.pnle-choice').forEach(button => revealChoiceRow(button, item, parseInt(button.getAttribute('data-idx'), 10), new Set(correct), new Set(picked)));
      showNextButton(root, setsEqual(picked.slice().sort((a, b) => a - b), correct));
    }

    nextBtn.addEventListener('click', () => {
      if (!session || !session.locked) return;
      session.index += 1;
      session.locked = false;
      session.picked = [];
      saveActiveSession();
      renderQuestion();
    });
  }

  function bindLaunchUi() {
    const dutyBtn = document.getElementById('pnleLaunchDuty');
    const studyBtn = document.getElementById('pnleLaunchStudy');
    if (dutyBtn) dutyBtn.addEventListener('click', enterDutyMode);
    if (studyBtn) studyBtn.addEventListener('click', enterStudyMode);

    document.querySelectorAll('.np-app-mode-picker').forEach((picker) => {
      const trigger = picker.querySelector('.np-app-mode-select');
      const menu = picker.querySelector('.np-app-mode-menu');
      const options = Array.from(menu.querySelectorAll('[data-app-mode]'));
      function close() { menu.hidden = true; trigger.setAttribute('aria-expanded', 'false'); }
      function open() {
        menu.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
      }
      trigger.addEventListener('click', () => {
        if (!menu.hidden) { close(); return; }
        open();
        options.find(option => option.getAttribute('aria-checked') === 'true').focus();
      });
      trigger.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
        event.preventDefault();
        open();
        options[event.key === 'ArrowDown' ? 0 : options.length - 1].focus();
      });
      menu.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          event.preventDefault(); event.stopPropagation(); close(); trigger.focus();
        } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
          event.preventDefault();
          const index = options.indexOf(document.activeElement);
          const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
          options[next].focus();
        }
      });
      options.forEach((option) => option.addEventListener('click', () => {
        const mode = option.getAttribute('data-app-mode');
        close();
        if (mode !== picker.dataset.mode) {
          if (mode === 'study') enterStudyMode();
          else enterDutyMode();
        }
        const active = document.getElementById(mode === 'study' ? 'pnleStudySwitchMode' : 'pnleDutySwitchMode');
        if (active) active.focus();
      }));
      document.addEventListener('pointerdown', (event) => { if (!picker.contains(event.target)) close(); });
      document.addEventListener('focusin', (event) => { if (!picker.contains(event.target)) close(); });
    });

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
