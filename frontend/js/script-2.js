        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function () {
                navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(function () {});
            });
        }

        (function () {
            var THEME_KEY = 'nursepath_theme';

            function getTheme() {
                try {
                    return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark';
                } catch (e) {
                    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
                }
            }

            function paintBody(theme) {
                if (!document.body) return;
                document.body.style.setProperty('background-color', theme === 'light' ? '#f8fafc' : '#020617', 'important');
            }

            function updateThemeButton(theme) {
                var btn = document.getElementById('npThemeToggle');
                if (!btn) return;
                var isLight = theme === 'light';
                btn.textContent = isLight ? 'Dark mode' : 'Light mode';
                btn.setAttribute('aria-pressed', isLight ? 'true' : 'false');
                btn.setAttribute('title', isLight ? 'Switch to dark mode' : 'Switch to light mode');
            }

            function applyTheme(theme) {
                if (theme === 'light') {
                    document.documentElement.setAttribute('data-theme', 'light');
                } else {
                    document.documentElement.removeAttribute('data-theme');
                }
                paintBody(theme);
                updateThemeButton(theme);
                try {
                    localStorage.setItem(THEME_KEY, theme);
                } catch (e) {
                    // Ignore storage access failures.
                }
            }

            window.toggleNursePathTheme = function () {
                applyTheme(getTheme() === 'light' ? 'dark' : 'light');
            };

            window.addEventListener('DOMContentLoaded', function () {
                var theme = getTheme();
                applyTheme(theme);
                var btn = document.getElementById('npThemeToggle');
                if (btn) {
                    btn.addEventListener('click', window.toggleNursePathTheme);
                }
            });
        })();
    
