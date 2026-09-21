        const SIMULATION_KEY = 'nursepath_simulation_agreed';
        const SIMULATION_DURATION = 30 * 24 * 60 * 60 * 1000;
        const SESSION_CACHE_KEY = 'nursepath_supabase_session_cache_v1';
        const DEMO_USER_KEY = 'nursepath_user';
        const AUTH_MAGIC_LINK_COOLDOWN_KEY = 'nursepath_magic_link_cooldown_until_v1';
        const AUTH_EMAIL_LOG_KEY = 'nursepath_auth_email_log_v1';
        const AUTH_PENDING_LOG_KEY = 'nursepath_pending_auth_email_log_v1';
        const AUTH_EMAIL_LOG_TABLE = 'auth_email_log';
        const USAGE_CONSENT_KEY = 'nursepath_usage_consent_v1';
        const USAGE_QUEUE_KEY = 'nursepath_usage_queue_v1';
        const USAGE_SESSION_KEY = 'nursepath_usage_session_v1';
        const USAGE_EVENTS_TABLE = 'usage_events';
        const USAGE_QUEUE_LIMIT = 1000;
        const USAGE_QUEUE_MAX_AGE_MS = 48 * 60 * 60 * 1000;
        const PILOT_METRICS_SINCE_ISO = window.NURSEPATH_PILOT_METRICS_SINCE || '2026-06-26T00:00:00.000Z';
        const USAGE_SESSION_TIMEOUT_MS = 30 * 60 * 1000;
        const MAX_SESSION_ACTIVE_MS = 2 * 60 * 60 * 1000;
        const VISIBILITY_RESUME_THRESHOLD_MS = 30 * 1000;
        const SESSION_EVENT_DEBOUNCE_MS = 5 * 1000;
        const MIN_REPORTABLE_SESSION_MS = 2 * 1000;
        const TAB_SESSION_LOGGED_KEY = 'np_session_logged';
        const TAB_CURRENT_SESSION_ID_KEY = 'np_current_session_id';
        const TAB_APP_INIT_LOGGED_KEY = 'np_app_init_logged';
        const ACCESS_MODE_KEY = 'nursepath_access_mode_v1';
        const LAST_SYNC_KEY = 'nursepath_last_sync_v1';
        // Attach signed-in email to usage events unless explicitly disabled.
        const USAGE_INCLUDE_EMAIL = window.NURSEPATH_USAGE_INCLUDE_EMAIL !== false;
        const SUPABASE_URL = window.NURSEPATH_SUPABASE_URL || 'https://oobrhmnvbxiqdbpjnnbn.supabase.co';
        const SUPABASE_ANON_KEY = window.NURSEPATH_SUPABASE_ANON_KEY || 'sb_publishable_wXKxmmY-s0c5yv7kDITMoA_jPmufAK2';

        /** Set localStorage nursepath_debug=1 to enable verbose pilot diagnostics in the console. */
        const NP_DEBUG = (function () {
            try {
                return localStorage.getItem('nursepath_debug') === '1';
            } catch (e) {
                return false;
            }
        })();
        function npDebugLog() {
            if (NP_DEBUG && typeof console !== 'undefined' && console.log) {
                console.log.apply(console, arguments);
            }
        }
        window.npDebugLog = npDebugLog;

        let supabaseClient = null;
        /** Why Google sign-in cannot start (library missing, project unreachable, etc.). */
        let authBackendBlocker = '';
        window.__nursepathAuthState = window.__nursepathAuthState || {
            authenticated: false,
            booted: false,
            pendingBoot: false
        };
        const usageRateLimitMap = new Map();
        let usageSessionEndingSent = false;
        let hiddenSinceMs = null;
        let isSubmittingAuth = false;
        let usageFlushInFlight = false;

        function checkSimulationAgreement() {
            const stored = localStorage.getItem(SIMULATION_KEY);
            if (!stored) {
                return false;
            }
            try {
                const data = JSON.parse(stored);
                const now = Date.now();
                if (data.agreed && data.expires > now) {
                    return true;
                }
                localStorage.removeItem(SIMULATION_KEY);
            } catch (e) {
                localStorage.removeItem(SIMULATION_KEY);
            }
            return false;
        }

        function acceptSimulationMode() {
            const agreementData = {
                agreed: true,
                expires: Date.now() + SIMULATION_DURATION,
                agreedAt: new Date().toISOString()
            };
            localStorage.setItem(SIMULATION_KEY, JSON.stringify(agreementData));
            const overlay = document.getElementById('simulationModeOverlay');
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 500);
        }

        function setAuthStatus(message, isError = false) {
            const statusEl = document.getElementById('authStatus');
            if (!statusEl) {
                return;
            }
            statusEl.textContent = message || '';
            statusEl.style.color = isError ? '#f87171' : '#f59e0b';

            if (isError && message) {
                trackUsageEvent('auth', 'error_shown', { context: 'auth_overlay' }, { minIntervalMs: 4000, rateKey: message.slice(0, 40) });
            }
        }

        function safeUuid() {
            if (window.crypto && typeof window.crypto.randomUUID === 'function') {
                return window.crypto.randomUUID();
            }
            return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        }

        function readUsageConsent() {
            const raw = localStorage.getItem(USAGE_CONSENT_KEY);
            if (raw === null) return false;
            return raw === '1';
        }

        function readAccessMode() {
            return 'pilot';
        }

        function readLastSyncAt() {
            return localStorage.getItem(LAST_SYNC_KEY) || '';
        }

        function setLastSyncAt(isoTs) {
            localStorage.setItem(LAST_SYNC_KEY, isoTs || new Date().toISOString());
        }

        function setUsageConsent(enabled) {
            localStorage.setItem(USAGE_CONSENT_KEY, enabled ? '1' : '0');
        }

        function readUsageQueue() {
            try {
                const raw = localStorage.getItem(USAGE_QUEUE_KEY);
                if (!raw) return [];
                const parsed = JSON.parse(raw);
                const queue = Array.isArray(parsed) ? parsed.filter(Boolean) : [];
                const pruned = pruneUsageQueue(queue);
                if (pruned.length !== queue.length) {
                    writeUsageQueue(pruned);
                }
                return pruned;
            } catch (e) {
                return [];
            }
        }

        function pruneUsageQueue(queue, now = Date.now()) {
            const purgeBeforeMs = new Date(PILOT_METRICS_SINCE_ISO).getTime();
            const signedInEmail = resolveUsageUserEmail();
            return (queue || []).filter((item) => {
                if (!item || !item.timestamp) {
                    return false;
                }
                const ts = new Date(item.timestamp).getTime();
                if (!Number.isFinite(ts)) {
                    return false;
                }
                if (Number.isFinite(purgeBeforeMs) && ts < purgeBeforeMs) {
                    return false;
                }
                if (now - ts > USAGE_QUEUE_MAX_AGE_MS) {
                    return false;
                }
                if (signedInEmail && !item.user_email) {
                    return false;
                }
                return true;
            });
        }

        function resetStaleUsageSessionIfNeeded() {
            const session = readUsageSessionState();
            if (!session || !session.started_at) {
                return;
            }
            const startedMs = new Date(session.started_at).getTime();
            const cutoffMs = new Date(PILOT_METRICS_SINCE_ISO).getTime();
            if (Number.isFinite(startedMs) && Number.isFinite(cutoffMs) && startedMs < cutoffMs) {
                localStorage.removeItem(USAGE_SESSION_KEY);
                clearTabSessionLogged();
                clearCurrentTabSessionId();
                usageSessionEndingSent = false;
            }
        }

        function writeUsageQueue(queue) {
            const deduped = [];
            const seenEventIds = new Set();
            for (const item of queue.slice(-USAGE_QUEUE_LIMIT)) {
                const eventId = item && item.event_id ? String(item.event_id) : '';
                if (eventId && seenEventIds.has(eventId)) {
                    continue;
                }
                if (eventId) {
                    seenEventIds.add(eventId);
                }
                deduped.push(item);
            }

            let nextQueue = deduped;
            while (nextQueue.length > 0) {
                try {
                    localStorage.setItem(USAGE_QUEUE_KEY, JSON.stringify(nextQueue));
                    return;
                } catch (e) {
                    nextQueue = nextQueue.slice(Math.ceil(nextQueue.length / 2));
                }
            }
        }

        function readUsageSessionState() {
            const raw = localStorage.getItem(USAGE_SESSION_KEY);
            if (!raw) return null;
            try {
                const parsed = JSON.parse(raw);
                return parsed && parsed.session_id ? parsed : null;
            } catch (e) {
                return null;
            }
        }

        function writeUsageSessionState(state) {
            localStorage.setItem(USAGE_SESSION_KEY, JSON.stringify(state));
        }

        function ensureSessionActiveFields(session) {
            if (!session) {
                return session;
            }
            if (!Number.isFinite(session.active_duration_ms)) {
                session.active_duration_ms = 0;
            }
            if (!session.last_visible_at && session.started_at) {
                session.last_visible_at = session.started_at;
            }
            return session;
        }

        function tickSessionActiveTime(session, now = Date.now()) {
            session = ensureSessionActiveFields(session);
            if (document.visibilityState !== 'visible' || !session.last_visible_at) {
                return session;
            }
            const lastVisibleMs = new Date(session.last_visible_at).getTime();
            if (!Number.isFinite(lastVisibleMs) || now <= lastVisibleMs) {
                return session;
            }
            const delta = Math.min(now - lastVisibleMs, USAGE_SESSION_TIMEOUT_MS);
            session.active_duration_ms = Math.min(
                MAX_SESSION_ACTIVE_MS,
                (session.active_duration_ms || 0) + delta
            );
            session.last_visible_at = new Date(now).toISOString();
            return session;
        }

        function pauseSessionActiveTime(session, now = Date.now()) {
            session = tickSessionActiveTime(session, now);
            session.last_visible_at = null;
            return session;
        }

        function computeSessionActiveDurationMs(session, now = Date.now()) {
            return Math.max(0, Math.min(
                tickSessionActiveTime(ensureSessionActiveFields({ ...session }), now).active_duration_ms || 0,
                MAX_SESSION_ACTIVE_MS
            ));
        }

        function createUsageSessionState(sessionId, now = Date.now()) {
            const iso = new Date(now).toISOString();
            return {
                session_id: sessionId,
                started_at: iso,
                last_activity_at: iso,
                last_visible_at: iso,
                active_duration_ms: 0,
                ended_at: null
            };
        }

        function hasTabSessionLogged() {
            try {
                return Boolean(sessionStorage.getItem(TAB_SESSION_LOGGED_KEY));
            } catch (e) {
                return false;
            }
        }

        function markTabSessionLogged() {
            try {
                sessionStorage.setItem(TAB_SESSION_LOGGED_KEY, '1');
            } catch (e) {
                // ignore sessionStorage restrictions
            }
        }

        function clearTabSessionLogged() {
            try {
                sessionStorage.removeItem(TAB_SESSION_LOGGED_KEY);
            } catch (e) {
                // ignore sessionStorage restrictions
            }
        }

        function readCurrentTabSessionId() {
            try {
                const raw = sessionStorage.getItem(TAB_CURRENT_SESSION_ID_KEY);
                return raw ? String(raw) : '';
            } catch (e) {
                return '';
            }
        }

        function writeCurrentTabSessionId(sessionId) {
            try {
                if (sessionId) {
                    sessionStorage.setItem(TAB_CURRENT_SESSION_ID_KEY, String(sessionId));
                }
            } catch (e) {
                // ignore sessionStorage restrictions
            }
        }

        function clearCurrentTabSessionId() {
            try {
                sessionStorage.removeItem(TAB_CURRENT_SESSION_ID_KEY);
            } catch (e) {
                // ignore sessionStorage restrictions
            }
        }

        function hasTabAppInitLogged() {
            try {
                return Boolean(sessionStorage.getItem(TAB_APP_INIT_LOGGED_KEY));
            } catch (e) {
                return false;
            }
        }

        function markTabAppInitLogged() {
            try {
                sessionStorage.setItem(TAB_APP_INIT_LOGGED_KEY, '1');
            } catch (e) {
                // ignore sessionStorage restrictions
            }
        }

        function clearTabAppInitLogged() {
            try {
                sessionStorage.removeItem(TAB_APP_INIT_LOGGED_KEY);
            } catch (e) {
                // ignore sessionStorage restrictions
            }
        }

        function queueUsageEventRaw(event) {
            try {
                const queue = readUsageQueue();
                if (event && event.event_id && queue.some((item) => item && item.event_id === event.event_id)) {
                    return;
                }
                queue.push(event);
                writeUsageQueue(queue);
            } catch (e) {
                // Swallow storage failures so the app continues operating offline.
            }
        }

        function getUsageSessionId(now = Date.now()) {
            let session = readUsageSessionState();
            let tabSessionId = readCurrentTabSessionId();
            if (!tabSessionId) {
                tabSessionId = safeUuid();
                writeCurrentTabSessionId(tabSessionId);
            }

            if (!session) {
                const sessionId = tabSessionId;
                session = createUsageSessionState(sessionId, now);
                writeUsageSessionState(session);
                writeCurrentTabSessionId(session.session_id);
                if (!hasTabSessionLogged()) {
                    queueUsageEventRaw({
                        event_id: safeUuid(),
                        user_email: resolveUsageUserEmail(),
                        session_id: session.session_id,
                        feature: 'session',
                        action: 'session_start',
                        timestamp: new Date(now).toISOString(),
                        online: navigator.onLine,
                        duration_ms: 0,
                        meta: { reason: 'app_start' }
                    });
                    markTabSessionLogged();
                }
                usageSessionEndingSent = false;
                return session.session_id;
            }

            const lastActivityMs = new Date(session.last_activity_at || session.started_at).getTime();
            const timedOut = Number.isFinite(lastActivityMs) && (now - lastActivityMs > USAGE_SESSION_TIMEOUT_MS);
            const alreadyEnded = Boolean(session.ended_at);

            if (timedOut || alreadyEnded) {
                if (!alreadyEnded) {
                    const durationMs = computeSessionActiveDurationMs(session, now);
                    queueUsageEventRaw({
                        event_id: safeUuid(),
                        user_email: resolveUsageUserEmail(),
                        session_id: session.session_id,
                        feature: 'session',
                        action: 'session_end',
                        timestamp: new Date(now).toISOString(),
                        online: navigator.onLine,
                        duration_ms: durationMs,
                        meta: { reason: timedOut ? 'inactivity_timeout' : 'resume_after_end' }
                    });
                }

                const nextSessionId = safeUuid();
                session = createUsageSessionState(nextSessionId, now);
                writeUsageSessionState(session);
                writeCurrentTabSessionId(session.session_id);
                if (!hasTabSessionLogged()) {
                    queueUsageEventRaw({
                        event_id: safeUuid(),
                        user_email: resolveUsageUserEmail(),
                        session_id: session.session_id,
                        feature: 'session',
                        action: 'session_start',
                        timestamp: new Date(now).toISOString(),
                        online: navigator.onLine,
                        duration_ms: 0,
                        meta: { reason: timedOut ? 'resume_after_timeout' : 'resume_after_end' }
                    });
                    markTabSessionLogged();
                }
                usageSessionEndingSent = false;
                return session.session_id;
            }

            if (tabSessionId && session.session_id !== tabSessionId) {
                session.session_id = tabSessionId;
            }

            if (document.visibilityState === 'visible') {
                session = tickSessionActiveTime(session, now);
            }
            session.last_activity_at = new Date(now).toISOString();
            writeUsageSessionState(session);
            writeCurrentTabSessionId(session.session_id);
            return session.session_id;
        }

        function endUsageSession(reason) {
            if (usageSessionEndingSent) {
                return;
            }

            const session = readUsageSessionState();
            if (!session || session.ended_at) {
                return;
            }

            const now = Date.now();
            const durationMs = computeSessionActiveDurationMs(session, now);
            if (durationMs < MIN_REPORTABLE_SESSION_MS) {
                return;
            }
            queueUsageEventRaw({
                event_id: safeUuid(),
                user_email: resolveUsageUserEmail(),
                session_id: session.session_id,
                feature: 'session',
                action: 'session_end',
                timestamp: new Date(now).toISOString(),
                online: navigator.onLine,
                duration_ms: durationMs,
                meta: { reason: reason || 'page_exit' }
            });

            session = pauseSessionActiveTime(session, now);

            session.ended_at = new Date(now).toISOString();
            writeUsageSessionState(session);
            usageSessionEndingSent = true;
        }

        async function flushUsageEvents() {
            if (usageFlushInFlight || !supabaseClient || !navigator.onLine) {
                return;
            }

            const queue = pruneUsageQueue(readUsageQueue());
            if (!queue.length) {
                return;
            }

            usageFlushInFlight = true;
            npDebugLog('📡 Attempting Supabase Sync:', queue.length);

            try {
                const { error } = await supabaseClient.from(USAGE_EVENTS_TABLE).insert(queue);
                if (!error) {
                    localStorage.removeItem(USAGE_QUEUE_KEY);
                    setLastSyncAt(new Date().toISOString());
                    renderPilotMetrics();
                }
            } catch (e) {
                // Keep queued events for retry.
            } finally {
                usageFlushInFlight = false;
            }
        }

        function emergencyFlushUsageEvents() {
            if (usageFlushInFlight || !navigator.onLine) {
                return;
            }

            const queue = pruneUsageQueue(readUsageQueue());
            if (!queue.length) {
                return;
            }

            usageFlushInFlight = true;
            npDebugLog('📡 Attempting Supabase Sync:', queue.length);

            const configured =
                Boolean(SUPABASE_URL) &&
                Boolean(SUPABASE_ANON_KEY) &&
                !SUPABASE_URL.includes('YOUR-PROJECT') &&
                !SUPABASE_ANON_KEY.includes('YOUR_SUPABASE_ANON_KEY');

            if (!configured) {
                usageFlushInFlight = false;
                return;
            }

            const endpoint = `${SUPABASE_URL}/rest/v1/${USAGE_EVENTS_TABLE}`;
            fetch(endpoint, {
                method: 'POST',
                keepalive: true,
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(queue)
            }).then((response) => {
                if (response && response.ok) {
                    localStorage.removeItem(USAGE_QUEUE_KEY);
                    setLastSyncAt(new Date().toISOString());
                }
            }).catch(() => {
                // Keep queued events for retry.
            }).finally(() => {
                usageFlushInFlight = false;
            });
        }

        function trackUsageEvent(feature, action, meta = {}, options = {}) {
            if (feature === 'session' && action === 'session_start' && hasTabSessionLogged()) {
                return;
            }

            const durationMs = Number.isFinite(options.durationMs) ? options.durationMs : null;
            if (feature === 'session' && action === 'session_end' && durationMs !== null && durationMs < MIN_REPORTABLE_SESSION_MS) {
                return;
            }

            const now = Date.now();

            // Debounce noisy lifecycle actions that often duplicate on refresh/focus churn.
            if (action === 'session_start' || action === 'feature_open') {
                const lifecycleKey = `lifecycle:${feature}:${action}:${JSON.stringify(meta || {})}`;
                const lastLifecycleTs = usageRateLimitMap.get(lifecycleKey) || 0;
                if (now - lastLifecycleTs < SESSION_EVENT_DEBOUNCE_MS) {
                    return;
                }
                usageRateLimitMap.set(lifecycleKey, now);
            }

            const minIntervalMs = options.minIntervalMs || 0;
            const key = `${feature}:${action}:${options.rateKey || ''}`;
            if (minIntervalMs > 0) {
                const lastTs = usageRateLimitMap.get(key) || 0;
                if (now - lastTs < minIntervalMs) {
                    return;
                }
                usageRateLimitMap.set(key, now);
            }

            const sessionId = getUsageSessionId(now) || readCurrentTabSessionId() || safeUuid();
            if (!readCurrentTabSessionId()) {
                writeCurrentTabSessionId(sessionId);
            }
            const event = {
                event_id: safeUuid(),
                user_email: resolveUsageUserEmail(options),
                session_id: sessionId,
                feature,
                action,
                timestamp: new Date(now).toISOString(),
                online: navigator.onLine,
                duration_ms: durationMs,
                meta: meta || {}
            };

            queueUsageEventRaw(event);
            renderPilotMetrics();
            if (navigator.onLine) {
                void flushUsageEvents().catch(() => {
                    // Retry on the next online/visibility event.
                });
            }
        }

        function initUsageTracking() {
            resetStaleUsageSessionIfNeeded();
            writeUsageQueue(pruneUsageQueue(readUsageQueue()));
            getUsageSessionId();

            window.trackUsageEvent = trackUsageEvent;
            window.flushUsageEvents = flushUsageEvents;

            window.addEventListener('online', () => {
                void flushUsageEvents();
            });

            document.addEventListener('visibilitychange', () => {
                const now = Date.now();
                if (document.visibilityState === 'hidden') {
                    hiddenSinceMs = now;
                    let session = readUsageSessionState();
                    if (session && !session.ended_at) {
                        session = pauseSessionActiveTime(session, now);
                        writeUsageSessionState(session);
                    }
                    void flushUsageEvents();
                } else {
                    const hiddenMs = hiddenSinceMs ? (now - hiddenSinceMs) : 0;
                    hiddenSinceMs = null;
                    const session = readUsageSessionState();
                    if (session && !session.ended_at) {
                        if (hiddenMs >= VISIBILITY_RESUME_THRESHOLD_MS) {
                            usageSessionEndingSent = false;
                            endUsageSession('background_pause');
                            clearTabSessionLogged();
                            getUsageSessionId(now);
                        } else {
                            let resumed = ensureSessionActiveFields(session);
                            resumed.last_visible_at = new Date(now).toISOString();
                            writeUsageSessionState(resumed);
                        }
                    }
                    if (hiddenMs > VISIBILITY_RESUME_THRESHOLD_MS) {
                        trackUsageEvent('session', 'feature_open', {
                            reason: 'tab_resumed_after_hide',
                            hidden_ms: hiddenMs
                        }, { minIntervalMs: 5000, rateKey: 'tab_resumed_after_hide' });
                    }
                }
            });

            window.addEventListener('pagehide', () => {
                endUsageSession('page_exit');
                emergencyFlushUsageEvents();
            });

            window.addEventListener('beforeunload', () => {
                endUsageSession('page_exit');
                emergencyFlushUsageEvents();
            });
        }

        function readGhostUser() {
            const raw = localStorage.getItem(DEMO_USER_KEY);
            if (!raw) return null;
            try {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed.email === 'string' && parsed.email.trim()) {
                    return parsed;
                }
            } catch (e) {
                if (typeof raw === 'string' && raw.includes('@')) {
                    return { email: raw, sealedAt: new Date().toISOString(), legacy: true };
                }
            }
            return null;
        }

        function saveGhostUser(email) {
            const now = new Date().toISOString();
            const existing = readGhostUser();
            const entry = {
                email: normalizeEmail(email),
                access_mode: readAccessMode(),
                sealedAt: existing && existing.sealedAt ? existing.sealedAt : now,
                lastSeenAt: now
            };
            localStorage.setItem(DEMO_USER_KEY, JSON.stringify(entry));
            document.documentElement.setAttribute('data-ghost-auth', '1');
            return entry;
        }

        function clearGhostUser() {
            localStorage.removeItem(DEMO_USER_KEY);
            localStorage.removeItem(SESSION_CACHE_KEY);
            localStorage.removeItem(AUTH_MAGIC_LINK_COOLDOWN_KEY);
            document.documentElement.removeAttribute('data-ghost-auth');
        }

        function readPendingLogs() {
            try {
                const raw = localStorage.getItem(AUTH_PENDING_LOG_KEY);
                if (!raw) return [];
                const parsed = JSON.parse(raw);
                return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
            } catch (e) {
                return [];
            }
        }

        function writePendingLogs(entries) {
            let nextEntries = entries.slice(-300);
            while (nextEntries.length > 0) {
                try {
                    localStorage.setItem(AUTH_PENDING_LOG_KEY, JSON.stringify(nextEntries));
                    return;
                } catch (e) {
                    nextEntries = nextEntries.slice(Math.ceil(nextEntries.length / 2));
                }
            }
        }

        function queuePendingLog(entry) {
            const pending = readPendingLogs();
            pending.push(entry);
            writePendingLogs(pending);
        }

        function normalizeEmail(email) {
            return (email || '').trim().toLowerCase();
        }

        function resolveUsageUserEmail(options = {}) {
            if (!USAGE_INCLUDE_EMAIL) {
                return null;
            }
            if (options.userEmail) {
                return normalizeEmail(options.userEmail);
            }
            const ghostUser = readGhostUser();
            if (ghostUser && ghostUser.email) {
                return normalizeEmail(ghostUser.email);
            }
            return null;
        }

        function isValidEmailFormat(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizeEmail(email));
        }

        function getDomainFromEmail(email) {
            const parts = normalizeEmail(email).split('@');
            return parts.length === 2 ? parts[1] : '';
        }

        function applyRoleVisibility() {
            const metricsPanel = document.getElementById('pilotMetricsPanel');
            const facultyResetBtn = document.getElementById('facultyResetBtn');
            if (metricsPanel) metricsPanel.style.display = 'none';
            if (facultyResetBtn) facultyResetBtn.style.display = 'none';
        }

        function summarizeFeatureUsage(queue) {
            const counts = {};
            (queue || []).forEach((item) => {
                const key = `${item.feature || 'unknown'}:${item.action || 'unknown'}`;
                counts[key] = (counts[key] || 0) + 1;
            });
            return Object.entries(counts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([k, v]) => `${k} (${v})`)
                .join(' • ');
        }

        function buildReportableEvents(queue) {
            const items = Array.isArray(queue) ? queue : [];
            const microSessionIds = new Set(
                items
                    .filter((e) => e.feature === 'session' && e.action === 'session_end')
                    .filter((e) => Number.isFinite(e.duration_ms) && e.duration_ms < MIN_REPORTABLE_SESSION_MS)
                    .map((e) => e.session_id)
                    .filter(Boolean)
            );
            return items.filter((e) => !e.session_id || !microSessionIds.has(e.session_id));
        }

        function formatInstructorTimestamp(isoTimestamp) {
            if (!isoTimestamp) return '';
            const d = new Date(isoTimestamp);
            if (Number.isNaN(d.getTime())) return String(isoTimestamp);
            return d.toLocaleString('en-US', {
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        }

        function mapActionToInstructorEnglish(action) {
            if (action === 'session_start') return 'App Opened';
            if (action === 'session_end') return 'App Closed/Minimized';
            if (action === 'feature_use') return 'Tool Accessed';
            return action || 'Activity';
        }

        function renderPilotMetrics() {
            // OPTIMIZATION: Re-enable pilot metrics panel - removed early return
            const queue = buildReportableEvents(readUsageQueue());
            const sessions = queue.filter((e) => e.feature === 'session' && e.action === 'session_start').length;
            const onlineCount = queue.filter((e) => e.online === true).length;
            const offlineCount = queue.filter((e) => e.online === false).length;
            const lastSync = readLastSyncAt();
            const topUsage = summarizeFeatureUsage(queue);

            const sessionsEl = document.getElementById('metricSessions');
            const onlineEl = document.getElementById('metricOnline');
            const offlineEl = document.getElementById('metricOffline');
            const syncEl = document.getElementById('metricLastSync');
            const consentEl = document.getElementById('metricConsent');
            const topEl = document.getElementById('metricFeatureTop');

            if (sessionsEl) sessionsEl.textContent = String(sessions);
            if (onlineEl) onlineEl.textContent = String(onlineCount);
            if (offlineEl) offlineEl.textContent = String(offlineCount);
            if (syncEl) syncEl.textContent = lastSync ? new Date(lastSync).toLocaleString() : 'Never';
            if (consentEl) consentEl.textContent = readUsageConsent() ? 'On' : 'Off';
            if (topEl) topEl.textContent = topUsage ? `Top feature use: ${topUsage}` : 'Top feature use: none yet';
        }

        function toCsvCell(value) {
            const raw = value == null ? '' : String(value);
            return `"${raw.replace(/"/g, '""')}"`;
        }

        function exportUsageCsv() {
            setAuthStatus('CSV export is available in the dashboard only.', true);
            return;
        }

        function manualLogout() {
            clearGhostUser();
            clearTabSessionLogged();
            clearCurrentTabSessionId();
            clearTabAppInitLogged();
            // OPTIMIZATION: Reset vital signs tracking flag on logout
            hasTrackedVitalsOpen = false;
            try {
                if (supabaseClient) {
                    void supabaseClient.auth.signOut({ scope: 'local' });
                }
            } catch (e) { /* offline-safe */ }
            try { localStorage.removeItem(SESSION_CACHE_KEY); } catch (e) {}
            showAuthOverlay('Signed out. Continue with Google to open NursePath.', false);
            applyRoleVisibility();
            trackUsageEvent('auth', 'feature_use', { action: 'logout' }, { minIntervalMs: 500, rateKey: 'logout_action' });
        }

        function facultyResetDevice() {
            clearGhostUser();
            clearTabSessionLogged();
            clearCurrentTabSessionId();
            clearTabAppInitLogged();
            // OPTIMIZATION: Reset vital signs tracking flag on device reset
            hasTrackedVitalsOpen = false;
            localStorage.removeItem(AUTH_EMAIL_LOG_KEY);
            localStorage.removeItem(AUTH_PENDING_LOG_KEY);
            localStorage.removeItem(USAGE_QUEUE_KEY);
            localStorage.removeItem(USAGE_SESSION_KEY);
            localStorage.removeItem(SIMULATION_KEY);
            localStorage.removeItem(LAST_SYNC_KEY);
            localStorage.removeItem(ACCESS_MODE_KEY);
            localStorage.removeItem(SESSION_CACHE_KEY);
            location.reload();
        }

        window.manualLogout = manualLogout;
        window.facultyResetDevice = facultyResetDevice;
        window.renderPilotMetrics = renderPilotMetrics;
        window.exportUsageCsv = exportUsageCsv;

        function saveEmailAttemptLocal(entry) {
            const raw = localStorage.getItem(AUTH_EMAIL_LOG_KEY);
            const list = raw ? JSON.parse(raw) : [];
            list.push(entry);
            const trimmed = list.slice(-300);
            localStorage.setItem(AUTH_EMAIL_LOG_KEY, JSON.stringify(trimmed));
        }

        async function recordEmailAttempt(email, status, reason = '') {
            const entry = {
                email: normalizeEmail(email),
                status,
                reason,
                timestamp: new Date().toISOString()
            };

            try {
                saveEmailAttemptLocal(entry);
            } catch (e) {
                // no-op for localStorage failures
            }

            if (!supabaseClient || !navigator.onLine) {
                queuePendingLog(entry);
                return;
            }

            try {
                const { error } = await supabaseClient.from(AUTH_EMAIL_LOG_TABLE).insert(entry);
                if (error) {
                    queuePendingLog(entry);
                }
            } catch (e) {
                // Table may not exist or network may fail; keep pending for best-effort retry.
                queuePendingLog(entry);
            }
        }

        async function flushPendingEmailLogs() {
            if (!supabaseClient || !navigator.onLine) {
                return;
            }

            const pending = readPendingLogs();
            if (!pending.length) {
                return;
            }

            try {
                const { error } = await supabaseClient.from(AUTH_EMAIL_LOG_TABLE).insert(pending);
                if (!error) {
                    localStorage.removeItem(AUTH_PENDING_LOG_KEY);
                }
            } catch (e) {
                // Keep pending logs for another retry.
            }
        }

        function bootProtectedApp() {
            if (typeof window.__nursepathBootApp === 'function') {
                window.__nursepathBootApp();
                return;
            }
            window.__nursepathAuthState.pendingBoot = true;
        }

        function checkAuth() {
            const ghostUser = readGhostUser();
            if (!ghostUser || !isValidEmailFormat(ghostUser.email)) {
                return false;
            }

            const authOverlay = document.getElementById('authOverlay');
            const appShell = document.getElementById('app-shell');
            if (authOverlay) authOverlay.style.display = 'none';
            if (appShell) appShell.style.display = 'block';
            document.documentElement.setAttribute('data-ghost-auth', '1');

            window.__nursepathAuthState.authenticated = true;

            if (!checkSimulationAgreement()) {
                document.getElementById('simulationModeOverlay').style.display = 'flex';
            }

            bootProtectedApp();
            return true;
        }

        function showAuthenticatedApp(email, source) {
            const authOverlay = document.getElementById('authOverlay');
            const appShell = document.getElementById('app-shell');
            if (authOverlay) {
                authOverlay.style.display = 'none';
            }
            if (appShell) {
                appShell.style.display = 'block';
            }
            document.documentElement.setAttribute('data-ghost-auth', '1');

            window.__nursepathAuthState.authenticated = true;

            if (email) {
                saveGhostUser(email);
            }

            if (!checkSimulationAgreement()) {
                document.getElementById('simulationModeOverlay').style.display = 'flex';
            }

            if (source === 'ghost') {
                setAuthStatus('Session restored on this device.', false);
            }
            bootProtectedApp();
        }

        function showAuthOverlay(message, isError = false) {
            const authOverlay = document.getElementById('authOverlay');
            const appShell = document.getElementById('app-shell');
            if (authOverlay) {
                authOverlay.style.display = 'flex';
            }
            if (appShell) {
                appShell.style.display = 'none';
            }
            document.documentElement.removeAttribute('data-ghost-auth');
            window.__nursepathAuthState.authenticated = false;
            window.__nursepathAuthState.booted = false;
            if (message) {
                setAuthStatus(message, isError);
            }
        }

        function updateConsentRequirementUI() {
            const usageConsent = document.getElementById('usageConsent');
            const googleBtn = document.getElementById('googleSignInBtn');
            const allowed = Boolean(usageConsent && usageConsent.checked);
            if (googleBtn) {
                googleBtn.disabled = !allowed;
            }
        }

        function cacheSupabaseSession(session) {
            try {
                if (!session) {
                    localStorage.removeItem(SESSION_CACHE_KEY);
                    return;
                }
                localStorage.setItem(SESSION_CACHE_KEY, JSON.stringify({
                    email: session.user && session.user.email ? normalizeEmail(session.user.email) : '',
                    user_id: session.user && session.user.id ? session.user.id : '',
                    cached_at: new Date().toISOString()
                }));
            } catch (e) { /* ignore */ }
        }

        function readCachedSupabaseSession() {
            try {
                const raw = localStorage.getItem(SESSION_CACHE_KEY);
                if (!raw) return null;
                const parsed = JSON.parse(raw);
                if (parsed && parsed.email) return parsed;
            } catch (e) {}
            return null;
        }

        async function completeOAuthLogin(session, source) {
            const email = session && session.user ? normalizeEmail(session.user.email || '') : '';
            if (!email || !isValidEmailFormat(email)) {
                setAuthStatus('Google sign-in did not return an email.', true);
                return false;
            }
            setUsageConsent(true);
            cacheSupabaseSession(session);
            saveGhostUser(email);
            void recordEmailAttempt(email, 'oauth_google_ok', source || 'oauth');
            trackUsageEvent('auth', 'result_generated', {
                action: 'google_oauth_sealed',
                source: source || 'oauth'
            }, { userEmail: email, minIntervalMs: 1000, rateKey: 'google_oauth_sealed' });
            showAuthenticatedApp(email, source || 'oauth');
            return true;
        }

        async function startGoogleSignIn() {
            const usageConsent = document.getElementById('usageConsent');
            if (!usageConsent || !usageConsent.checked) {
                setUsageConsent(false);
                setAuthStatus('You must consent to usage tracking to continue.', true);
                return;
            }
            setUsageConsent(true);

            if (!navigator.onLine) {
                const ghost = readGhostUser();
                if (ghost && isValidEmailFormat(ghost.email)) {
                    showAuthenticatedApp(ghost.email, 'ghost');
                    setAuthStatus('Offline session restored for this device.', false);
                    return;
                }
                setAuthStatus('Google sign-in needs a network connection the first time. Open NursePath online once, then it works offline.', true);
                return;
            }

            if (authBackendBlocker) {
                setAuthStatus(authBackendBlocker, true);
                return;
            }

            if (!supabaseClient) {
                setAuthStatus(
                    'Sign-in is not ready. Hard-refresh once online, or ask faculty to check the Supabase project.',
                    true
                );
                return;
            }

            setAuthStatus('Opening Google sign-in...', false);
            trackUsageEvent('auth', 'feature_use', { action: 'google_oauth_start' }, { minIntervalMs: 1000, rateKey: 'google_oauth_start' });

            const redirectTo = window.location.origin + (window.location.pathname || '/');
            const { error } = await supabaseClient.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo,
                    queryParams: {
                        prompt: 'select_account'
                    }
                }
            });
            if (error) {
                setAuthStatus(error.message || 'Google sign-in failed. Try again.', true);
                trackUsageEvent('auth', 'error_shown', { reason: 'oauth_start_failed' }, { minIntervalMs: 2000, rateKey: 'oauth_start_failed' });
            }
        }

        function readOAuthRedirectError() {
            try {
                const params = new URLSearchParams(window.location.search || '');
                const error = params.get('error');
                if (!error) return null;
                const code = params.get('error_code') || '';
                const description = params.get('error_description') || '';
                return { error, code, description: description.replace(/\+/g, ' ') };
            } catch (e) {
                return null;
            }
        }

        function clearOAuthRedirectParams() {
            try {
                const url = new URL(window.location.href);
                const keys = ['error', 'error_code', 'error_description', 'code', 'state'];
                let changed = false;
                keys.forEach((key) => {
                    if (url.searchParams.has(key)) {
                        url.searchParams.delete(key);
                        changed = true;
                    }
                });
                if (changed) {
                    window.history.replaceState({}, document.title, url.pathname + (url.search ? url.search : '') + url.hash);
                }
            } catch (e) { /* ignore */ }
        }

        function formatOAuthRedirectError(oauthError) {
            const raw = String(oauthError && oauthError.description ? oauthError.description : '').toLowerCase();
            if (raw.includes('unable to exchange external code') || oauthError.code === 'unexpected_failure') {
                return 'Google sign-in reached NursePath, but Supabase could not finish the login. In Google Cloud → Credentials, confirm the OAuth client redirect URI is exactly https://oobrhmnvbxiqdbpjnnbn.supabase.co/auth/v1/callback, then re-copy Client ID + Client Secret into Supabase → Authentication → Sign In / Providers → Google (no extra spaces).';
            }
            if (oauthError.description) return oauthError.description;
            return 'Google sign-in failed. Try again in a moment.';
        }

        async function initSupabaseAuth() {
            const resetBtn = document.getElementById('authResetBtn');
            const usageConsent = document.getElementById('usageConsent');
            const googleBtn = document.getElementById('googleSignInBtn');

            if (googleBtn) {
                googleBtn.addEventListener('click', () => { void startGoogleSignIn(); });
            }

            if (usageConsent) {
                usageConsent.checked = readUsageConsent();
                usageConsent.addEventListener('change', () => {
                    setUsageConsent(Boolean(usageConsent.checked));
                    updateConsentRequirementUI();
                    if (usageConsent.checked) {
                        trackUsageEvent('consent', 'feature_use', { value: 'enabled' }, { minIntervalMs: 500, rateKey: 'consent_enabled' });
                        void flushUsageEvents();
                    } else {
                        trackUsageEvent('consent', 'feature_use', { value: 'disabled' }, { minIntervalMs: 500, rateKey: 'consent_disabled' });
                    }
                });
            }
            updateConsentRequirementUI();

            if (resetBtn) {
                resetBtn.addEventListener('click', facultyResetDevice);
            }

            initUsageTracking();
            applyRoleVisibility();
            if (isFacultyDebugEnabled()) {
                renderPilotMetrics();
            }

            const oauthRedirectError = readOAuthRedirectError();
            if (oauthRedirectError) {
                clearOAuthRedirectParams();
                showAuthOverlay(formatOAuthRedirectError(oauthRedirectError), true);
                trackUsageEvent('auth', 'error_shown', {
                    reason: 'oauth_redirect_error',
                    error: oauthRedirectError.error,
                    error_code: oauthRedirectError.code
                }, { minIntervalMs: 2000, rateKey: 'oauth_redirect_error' });
            }

            // Returning device: offline-capable ghost session
            if (!oauthRedirectError && checkAuth()) {
                return;
            }

            const isConfigured = !SUPABASE_URL.includes('YOUR-PROJECT') && !SUPABASE_ANON_KEY.includes('YOUR_SUPABASE_ANON_KEY');
            if (!isConfigured) {
                authBackendBlocker = 'Supabase keys are missing in this build. Ask faculty to set the project URL and anon key.';
                if (!oauthRedirectError) {
                    showAuthOverlay(authBackendBlocker, true);
                }
                return;
            }
            if (!window.supabase || typeof window.supabase.createClient !== 'function') {
                authBackendBlocker = 'Auth library failed to load (CDN blocked or offline). Connect to the internet and hard-refresh, then try Google again.';
                if (!oauthRedirectError) {
                    showAuthOverlay(authBackendBlocker, true);
                }
                return;
            }

            // Fail fast if the Supabase project host is paused/deleted (common on free-tier inactivity).
            try {
                const probe = await fetch(`${SUPABASE_URL}/auth/v1/settings`, {
                    method: 'GET',
                    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
                });
                if (!probe.ok) {
                    authBackendBlocker = `Supabase responded ${probe.status}. Confirm the project is active and the anon key matches Project Settings → API.`;
                }
            } catch (probeErr) {
                authBackendBlocker = 'Supabase project is unreachable (paused, deleted, or DNS missing). Open supabase.com, restore or recreate the project, re-enable Google provider, then update NursePath keys. See GOOGLE_OAUTH_SETUP.md.';
                npDebugLog('Supabase settings probe failed', probeErr);
            }

            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true,
                    flowType: 'pkce'
                }
            });

            if (authBackendBlocker) {
                if (!oauthRedirectError) {
                    showAuthOverlay(authBackendBlocker, true);
                }
                return;
            }

            // Offline-safe: never force logout solely because refresh failed while offline.
            supabaseClient.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_IN' && session) {
                    cacheSupabaseSession(session);
                    if (!window.__nursepathAuthState.authenticated) {
                        void completeOAuthLogin(session, 'auth_state');
                    }
                }
                if (event === 'TOKEN_REFRESHED' && session) {
                    cacheSupabaseSession(session);
                }
                if (event === 'SIGNED_OUT') {
                    // Keep ghost offline access unless the user explicitly logged out.
                    if (!navigator.onLine) {
                        npDebugLog('Ignoring SIGNED_OUT while offline to preserve offline access.');
                    }
                }
            });

            try {
                const { data, error } = await supabaseClient.auth.getSession();
                if (!error && data && data.session) {
                    const ok = await completeOAuthLogin(data.session, 'get_session');
                    if (ok) {
                        await flushPendingEmailLogs();
                        await flushUsageEvents();
                        return;
                    }
                }
            } catch (e) {
                npDebugLog('getSession failed', e);
                const cached = readCachedSupabaseSession();
                if (cached && isValidEmailFormat(cached.email)) {
                    saveGhostUser(cached.email);
                    showAuthenticatedApp(cached.email, 'ghost');
                    return;
                }
            }

            await flushPendingEmailLogs();
            await flushUsageEvents();
            window.addEventListener('online', () => { void flushPendingEmailLogs(); });

            if (!oauthRedirectError) {
                showAuthOverlay('Sign in with Google to continue.', false);
            }
        }

        function isFacultyDebugEnabled() {
            try {
                return localStorage.getItem('nursepath_debug') === '1' || window.NURSEPATH_ENABLE_FACULTY_TOOLS === true;
            } catch (e) {
                return false;
            }
        }

        function initEmergencyReset() {
            const logo = document.getElementById('nursepathHeaderLogo');
            if (!logo) return;

            // Production: no secret gesture. Faculty tools require nursepath_debug=1.
            if (!isFacultyDebugEnabled()) {
                logo.removeAttribute('title');
                logo.style.cursor = 'default';
                return;
            }

            logo.title = 'Faculty tools: tap 5 times';
            logo.style.cursor = 'pointer';

            let taps = 0;
            let tapResetTimer = null;

            logo.addEventListener('click', () => {
                taps += 1;

                if (tapResetTimer) {
                    clearTimeout(tapResetTimer);
                }

                tapResetTimer = setTimeout(() => {
                    taps = 0;
                }, 3000);

                if (taps >= 5) {
                    const metricsPanel = document.getElementById('pilotMetricsPanel');
                    if (metricsPanel) {
                        const showing = metricsPanel.style.display !== 'none' && metricsPanel.style.display !== '';
                        metricsPanel.style.display = showing ? 'none' : 'block';
                        if (!showing) renderPilotMetrics();
                        return;
                    }
                    clearGhostUser();
                    localStorage.removeItem(AUTH_EMAIL_LOG_KEY);
                    localStorage.removeItem(AUTH_PENDING_LOG_KEY);
                    location.reload();
                }
            });
        }

        window.addEventListener('DOMContentLoaded', () => {
            initSupabaseAuth();
            initEmergencyReset();
        });
    
