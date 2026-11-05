(function () {
    'use strict';
    var returnFocus = null;
    var background = [];
    var refreshing = false;
    var icons = {
        settings: '<path d="M4 7h9m4 0h3M4 17h3m4 0h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
        user: '<circle cx="12" cy="7" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/>',
        sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
        moon: '<path d="M21 13A9 9 0 0 1 11 3a9 9 0 1 0 10 10Z"/>',
        phone: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
        wifi: '<path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M8 16a6 6 0 0 1 8 0M12 20h.01"/>',
        refresh: '<path d="M20 7V3l-3 3a8 8 0 0 0-13 5M4 17v4l3-3a8 8 0 0 0 13-5M20 3h-4M4 21h4"/>',
        shield: '<path d="m12 2 9 4v6c0 6-9 10-9 10S3 18 3 12V6l9-4Z"/><path d="m8 12 3 3 5-6"/>',
        info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',
        logout: '<path d="M9 3H4v18h5m7-14 5 5-5 5M9 12h12"/>'
    };
    function text(id, value) {
        var el = document.getElementById(id);
        if (el) el.textContent = value;
    }
    function readRecord(key) {
        try { return JSON.parse(localStorage.getItem(key) || 'null'); }
        catch (e) { return null; }
    }
    async function refreshAccount() {
        var saved = typeof readGhostUser === 'function' ? readGhostUser() : readRecord('nursepath_user');
        var cached = readRecord('nursepath_supabase_session_cache_v1');
        var email = saved && saved.email;
        var provider = 'Saved device identity; Google session not verified.';
        if (cached && cached.user_id && cached.email === email) provider = 'Google account · saved on this device';
        text('settingsAccountEmail', email || 'No saved account');
        text('settingsAccountProvider', email ? provider : 'Sign in with Google to save your account.');
        // Returning/offline access does not always initialize the Supabase client.
        if (typeof supabaseClient !== 'undefined' && supabaseClient) {
            try {
                var result = await supabaseClient.auth.getSession();
                var user = result.data && result.data.session && result.data.session.user;
                if (user && user.email === email) {
                    var google = user.app_metadata && (user.app_metadata.provider === 'google' || (user.app_metadata.providers || []).includes('google'));
                    text('settingsAccountProvider', google ? 'Signed in with Google' : 'Signed-in account');
                    var name = user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name);
                    text('settingsAccountEmail', name ? name + ' · ' + email : email);
                }
            } catch (e) { /* Keep the actual saved identity visible offline. */ }
        }
    }
    function queryPack(worker) {
        return new Promise(function (resolve, reject) {
            var channel = new MessageChannel();
            function close() { channel.port1.close(); channel.port2.close(); }
            var timer = setTimeout(function () { close(); reject(new Error('The active worker did not report its reference pack. Check for updates while online.')); }, 4500);
            channel.port1.onmessage = function (event) { clearTimeout(timer); close(); resolve(event.data); };
            try { worker.postMessage({ type: 'NURSEPATH_PACK_STATUS' }, [channel.port2]); }
            catch (e) { clearTimeout(timer); close(); reject(e); }
        });
    }
    async function refreshPack() {
        if (refreshing) return;
        refreshing = true;
        var badge = document.getElementById('settingsPackStatus');
        badge.dataset.ready = 'false';
        text('settingsPackStatus', 'Checking');
        try {
            if (!('serviceWorker' in navigator)) throw new Error('Offline packs are not supported in this browser.');
            var registration = await navigator.serviceWorker.getRegistration('/');
            var worker = navigator.serviceWorker.controller || (registration && registration.active);
            if (!worker) throw new Error('No active offline pack. Open NursePath online and reload after installation.');
            var pack = await queryPack(worker);
            document.querySelectorAll('[data-settings-version]').forEach(function (el) { el.textContent = pack.version ? 'Version ' + pack.version : 'Version unavailable'; });
            text('settingsPackStatus', pack.ready ? 'Ready' : 'Incomplete');
            badge.dataset.ready = String(Boolean(pack.ready));
            text('settingsPackDetails', pack.error || (pack.ready ? 'All required resources are cached on this device.' : pack.cached + ' of ' + pack.required + ' required resources cached. Reconnect and check for updates.'));
        } catch (e) {
            text('settingsPackStatus', 'Unavailable');
            text('settingsPackDetails', e.message);
        } finally { refreshing = false; }
    }
    function updateMessage(message) {
        var el = document.getElementById('settingsUpdateStatus');
        el.hidden = false;
        el.textContent = message;
    }
    async function checkUpdates() {
        var button = document.getElementById('settingsCheckUpdates');
        button.disabled = true;
        updateMessage('Checking for an updated service worker…');
        try {
            if (!navigator.onLine) throw new Error('You are offline. Connect to the internet to check for updates.');
            if (!('serviceWorker' in navigator)) throw new Error('Service worker updates are not supported in this browser.');
            var registration = await navigator.serviceWorker.getRegistration('/');
            if (!registration) throw new Error('Offline installation is not registered yet. Reload NursePath online.');
            await registration.update();
            var installing = registration.installing;
            if (installing) {
                updateMessage('An update is downloading. NursePath reloads when the new worker takes control.');
                await new Promise(function (resolve) {
                    var timer = setTimeout(done, 20000);
                    function done() { clearTimeout(timer); installing.removeEventListener('statechange', changed); resolve(); }
                    function changed() { if (['installed', 'activated', 'redundant'].includes(installing.state)) done(); }
                    installing.addEventListener('statechange', changed);
                    changed();
                });
                updateMessage(installing.state === 'redundant' ? 'The update did not install. Try again while online.' : installing.state === 'activated' ? 'The new service worker activated. NursePath will reload when it takes control.' : 'Update download detected. It is not active yet.');
            } else if (registration.waiting) {
                updateMessage('An update is installed and waiting to activate. Close other NursePath tabs and reopen.');
            } else {
                updateMessage('Check complete: no new service worker detected.');
            }
            await refreshPack();
        } catch (e) { updateMessage(e.message || 'Unable to check for updates. Try again online.'); }
        finally { button.disabled = false; }
    }
    function setOpen(open) {
        var sheet = document.getElementById('npSettingsSheet');
        if (!sheet || sheet.hidden === !open) return;
        if (open) {
            returnFocus = document.activeElement;
            sheet.hidden = false;
            background = Array.from(sheet.parentElement.children).filter(function (el) { return el !== sheet; }).map(function (el) { var prior = el.inert; el.inert = true; return [el, prior]; });
            document.documentElement.classList.add('np-settings-is-open');
            document.getElementById('npSettingsClose').focus();
            refreshAccount();
            refreshPack();
            var consent = typeof readUsageConsent === 'function' && readUsageConsent();
            text('settingsConsentStatus', 'Usage consent saved on this device: ' + (consent ? 'enabled.' : 'not enabled.'));
        } else {
            sheet.hidden = true;
            background.forEach(function (entry) { entry[0].inert = entry[1]; });
            background = [];
            document.documentElement.classList.remove('np-settings-is-open');
            if (returnFocus && returnFocus.isConnected) returnFocus.focus();
        }
    }
    window.closeNursePathSettings = function () { setOpen(false); };
    window.openNursePathSettings = function () { setOpen(true); };
    window.addEventListener('DOMContentLoaded', function () {
        // Keep Settings available outside the Standard-only layout in PNLE mode.
        document.getElementById('app-shell').appendChild(document.getElementById('npSettingsSheet'));
        document.querySelectorAll('[data-settings-icon]').forEach(function (el) {
            el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + icons[el.getAttribute('data-settings-icon')] + '</svg>';
        });
        document.getElementById('npSettingsOpen').addEventListener('click', function () { setOpen(true); });
        var studySettings = document.getElementById('pnleSettingsOpen');
        if (studySettings) studySettings.addEventListener('click', function () { setOpen(true); });
        document.getElementById('npSettingsClose').addEventListener('click', function () { setOpen(false); });
        document.getElementById('npSettingsBackdrop').addEventListener('click', function () { setOpen(false); });
        document.getElementById('settingsCheckUpdates').addEventListener('click', checkUpdates);
        document.getElementById('settingsLogout').addEventListener('click', function () {
            if (window.confirm('Log out of NursePath on this device? You will need to sign in online to restore access.')) {
                setOpen(false);
                if (typeof window.manualLogout === 'function') window.manualLogout();
            }
        });
        document.getElementById('npSettingsBackdrop').tabIndex = -1;
        document.addEventListener('keydown', function (event) {
            var sheet = document.getElementById('npSettingsSheet');
            if (sheet.hidden) return;
            if (event.key === 'Escape') { event.preventDefault(); setOpen(false); }
            if (event.key === 'Tab') {
                var panel = sheet.querySelector('.np-settings-panel');
                var focusable = Array.from(panel.querySelectorAll('button:not([disabled]), summary, a[href]')).filter(function (el) { return el.tabIndex >= 0 && el.getClientRects().length; });
                var first = focusable[0], last = focusable[focusable.length - 1];
                if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
                else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
            }
        });
        if ('serviceWorker' in navigator) navigator.serviceWorker.addEventListener('controllerchange', function () { if (!document.getElementById('npSettingsSheet').hidden) refreshPack(); });
        window.addEventListener('online', function () { if (!document.getElementById('npSettingsSheet').hidden) refreshPack(); });
    });
})();
