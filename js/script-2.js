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
                var label = btn.querySelector('.np-action-label');
                var text = isLight ? 'Dark mode' : 'Light mode';
                if (label) {
                    label.textContent = text;
                }
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

            function markTouchUi(event) {
                if (event && event.pointerType && event.pointerType !== 'touch') {
                    return;
                }
                document.documentElement.classList.add('np-touch');
            }

            function initSidebarDrawer() {
                var sidebar = document.getElementById('npSidebar');
                var toggle = document.getElementById('npSidebarToggle');
                var backdrop = document.getElementById('npSidebarBackdrop');
                if (!sidebar || !toggle) return;

                function isOpen() {
                    return sidebar.classList.contains('is-open');
                }

                function setOpen(open) {
                    sidebar.classList.toggle('is-open', !!open);
                    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
                    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
                    if (!open) {
                        var active = document.activeElement;
                        if (active && sidebar.contains(active) && typeof active.blur === 'function') {
                            active.blur();
                        }
                    }
                }

                function closeSidebar() {
                    setOpen(false);
                }

                toggle.addEventListener('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    setOpen(!isOpen());
                });

                if (backdrop) {
                    backdrop.addEventListener('pointerdown', function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        closeSidebar();
                    });
                }

                sidebar.addEventListener('click', function (event) {
                    var action = event.target.closest('.np-sidebar-link, .np-action-btn');
                    if (!action || action.classList.contains('np-sidebar-placeholder')) {
                        return;
                    }
                    closeSidebar();
                });

                document.addEventListener('pointerdown', function (event) {
                    markTouchUi(event);
                    if (!isOpen()) return;
                    if (sidebar.contains(event.target) || (backdrop && event.target === backdrop)) {
                        return;
                    }
                    closeSidebar();
                }, true);

                document.addEventListener('keydown', function (event) {
                    if (event.key === 'Escape') {
                        closeSidebar();
                    }
                });

                window.closeNursePathSidebar = closeSidebar;
            }

            window.addEventListener('DOMContentLoaded', function () {
                var theme = getTheme();
                applyTheme(theme);
                var btn = document.getElementById('npThemeToggle');
                if (btn) {
                    btn.addEventListener('click', window.toggleNursePathTheme);
                }
                initSidebarDrawer();
            });

            window.addEventListener('pointerdown', markTouchUi, { passive: true });
        })();
