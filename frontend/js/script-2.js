if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(function () {});
    });
}

(function () {
    var THEME_KEY = 'nursepath_theme';
    var device = window.matchMedia('(prefers-color-scheme: dark)');
    var touch = window.matchMedia('(hover: none), (pointer: coarse), (max-width: 760px)');
    function preference() {
        try {
            var saved = localStorage.getItem(THEME_KEY);
            return ['light', 'dark', 'system'].includes(saved) ? saved : 'dark';
        } catch (e) { return 'dark'; }
    }
    function paintTheme() {
        var selected = preference();
        var theme = selected === 'system' ? (device.matches ? 'dark' : 'light') : selected;
        if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
        else document.documentElement.removeAttribute('data-theme');
        if (document.body) document.body.style.setProperty('background-color', theme === 'light' ? '#f8fafc' : '#020617', 'important');
        var desktop = document.getElementById('npThemeToggle');
        if (desktop) {
            var label = desktop.querySelector('.np-action-label');
            if (label) label.textContent = theme === 'light' ? 'Dark mode' : 'Light mode';
            desktop.setAttribute('aria-pressed', String(theme === 'light'));
            desktop.setAttribute('title', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
        }
        document.querySelectorAll('[data-settings-theme]').forEach(function (button) {
            button.setAttribute('aria-pressed', String(button.getAttribute('data-settings-theme') === selected));
        });
    }
    window.setNursePathTheme = function (theme) {
        if (!['light', 'dark', 'system'].includes(theme)) return;
        try { localStorage.setItem(THEME_KEY, theme); } catch (e) { return; }
        paintTheme();
    };
    window.toggleNursePathTheme = function () {
        window.setNursePathTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
    };
    function syncTouch() { document.documentElement.classList.toggle('np-touch', touch.matches); }
    function listen(query, callback) {
        if (query.addEventListener) query.addEventListener('change', callback);
        else if (query.addListener) query.addListener(callback);
    }
    listen(device, function () { if (preference() === 'system') paintTheme(); });
    listen(touch, syncTouch);
    window.addEventListener('storage', function (event) { if (event.key === THEME_KEY || event.key === null) paintTheme(); });
    syncTouch();
    window.addEventListener('DOMContentLoaded', function () {
        paintTheme();
        var button = document.getElementById('npThemeToggle');
        if (button) button.addEventListener('click', window.toggleNursePathTheme);
        document.querySelectorAll('[data-settings-theme]').forEach(function (option) {
            option.addEventListener('click', function () { window.setNursePathTheme(option.getAttribute('data-settings-theme')); });
        });
    });
})();
