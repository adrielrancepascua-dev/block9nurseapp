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

            function syncTouchMode() {
                document.documentElement.classList.toggle('np-touch', TOUCH_QUERY.matches);
            }

            function initSidebarDrawer() {
                var sidebar = document.getElementById('npSidebar');
                var toggle = document.getElementById('npSidebarToggle');
                var backdrop = document.getElementById('npSidebarBackdrop');
                if (!sidebar || !toggle) return;

                function isOpen() {
                    return sidebar.classList.contains('is-open');
                }

                function blurSidebar() {
                    var active = document.activeElement;
                    if (active && sidebar.contains(active) && typeof active.blur === 'function') {
                        active.blur();
                    }
                }

                function setOpen(open) {
                    sidebar.classList.toggle('is-open', !!open);
                    sidebar.classList.toggle('is-collapsed-lock', !open);
                    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
                    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
                    if (!open) {
                        blurSidebar();
                    }
                }

                function closeSidebar() {
                    setOpen(false);
                }

                function isMenuAction(target) {
                    var action = target && target.closest ? target.closest('.np-sidebar-link, .np-action-btn') : null;
                    if (!action || action.classList.contains('np-sidebar-placeholder')) {
                        return null;
                    }
                    return action;
                }

                toggle.addEventListener('pointerup', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    setOpen(!isOpen());
                });

                if (backdrop) {
                    backdrop.addEventListener('pointerup', function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        closeSidebar();
                    });
                }

                sidebar.addEventListener('pointerup', function (event) {
                    if (event.target.closest('#npSidebarToggle')) {
                        return;
                    }
                    if (!isMenuAction(event.target)) {
                        return;
                    }
                    closeSidebar();
                });

                document.addEventListener('pointerdown', function (event) {
                    if (TOUCH_QUERY.matches || (event && event.pointerType === 'touch')) {
                        document.documentElement.classList.add('np-touch');
                    }
                    if (!isOpen()) return;
                    if (sidebar.contains(event.target) || (backdrop && backdrop.contains(event.target))) {
                        return;
                    }
                    closeSidebar();
                }, true);

                sidebar.addEventListener('pointerleave', function () {
                    if (!isOpen()) {
                        sidebar.classList.remove('is-collapsed-lock');
                    }
                });

                document.addEventListener('keydown', function (event) {
                    if (event.key === 'Escape') {
                        closeSidebar();
                    }
                });

                window.closeNursePathSidebar = closeSidebar;
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
                initSidebarDrawer();
            });
        })();
