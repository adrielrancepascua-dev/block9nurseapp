        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function () {
                navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(function () {});
            });
        }

        (function () {
            var THEME_KEY = 'nursepath_theme';
            var TOUCH_QUERY = window.matchMedia('(hover: none), (pointer: coarse), (max-width: 760px)');

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

            function themeActionText(theme) {
                return theme === 'light' ? 'Dark mode' : 'Light mode';
            }

            function updateThemeButton(theme) {
                var text = themeActionText(theme);
                var isLight = theme === 'light';
                var desktop = document.getElementById('npThemeToggle');
                if (desktop) {
                    var label = desktop.querySelector('.np-action-label');
                    if (label) label.textContent = text;
                    desktop.setAttribute('aria-pressed', isLight ? 'true' : 'false');
                    desktop.setAttribute('title', isLight ? 'Switch to dark mode' : 'Switch to light mode');
                }
                var mobile = document.getElementById('npThemeToggleMobile');
                if (mobile) {
                    var value = mobile.querySelector('[data-theme-label]');
                    if (value) value.textContent = text;
                    mobile.setAttribute('aria-pressed', isLight ? 'true' : 'false');
                }
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

            function syncTouchMode() {
                document.documentElement.classList.toggle('np-touch', TOUCH_QUERY.matches);
            }

            function setSettingsOpen(open) {
                var sheet = document.getElementById('npSettingsSheet');
                if (!sheet) return;
                if (open) sheet.removeAttribute('hidden');
                else sheet.setAttribute('hidden', '');
                document.documentElement.classList.toggle('np-settings-open', !!open);
            }

            function initSettingsSheet() {
                var openBtn = document.getElementById('npSettingsOpen');
                var closeBtn = document.getElementById('npSettingsClose');
                var backdrop = document.getElementById('npSettingsBackdrop');
                var mobileTheme = document.getElementById('npThemeToggleMobile');
                if (openBtn) {
                    openBtn.addEventListener('click', function () {
                        setSettingsOpen(true);
                    });
                }
                if (closeBtn) {
                    closeBtn.addEventListener('click', function () {
                        setSettingsOpen(false);
                    });
                }
                if (backdrop) {
                    backdrop.addEventListener('click', function () {
                        setSettingsOpen(false);
                    });
                }
                if (mobileTheme) {
                    mobileTheme.addEventListener('click', window.toggleNursePathTheme);
                }
                document.addEventListener('keydown', function (event) {
                    if (event.key === 'Escape') setSettingsOpen(false);
                });
                window.closeNursePathSettings = function () {
                    setSettingsOpen(false);
                };
            }

            syncTouchMode();
            if (TOUCH_QUERY.addEventListener) {
                TOUCH_QUERY.addEventListener('change', syncTouchMode);
            } else if (TOUCH_QUERY.addListener) {
                TOUCH_QUERY.addListener(syncTouchMode);
            }

            window.addEventListener('DOMContentLoaded', function () {
                syncTouchMode();
                var theme = getTheme();
                applyTheme(theme);
                var btn = document.getElementById('npThemeToggle');
                if (btn) {
                    btn.addEventListener('click', window.toggleNursePathTheme);
                }
                initSettingsSheet();
            });
        })();
