        (function () {
            var npLog = typeof window.npDebugLog === 'function' ? window.npDebugLog : function () {};

            if ('serviceWorker' in navigator) {
                window.addEventListener('load', function () {
                    navigator.serviceWorker.register('/sw.js', { scope: '/' })
                        .then(function (registration) {
                            npLog('Service Worker registered:', registration.scope);
                            registration.update();

                            if (window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches) {
                                npLog('Running in standalone PWA mode');
                            }
                        })
                        .catch(function (error) {
                            console.error('Service Worker registration failed:', error);
                        });
                });

                var reloadedForController = false;
                navigator.serviceWorker.addEventListener('controllerchange', function () {
                    if (reloadedForController) {
                        return;
                    }
                    reloadedForController = true;
                    npLog('Service Worker updated; reloading');
                    window.location.reload();
                });
            } else {
                npLog('Service Workers not supported, running browser-only');
            }

            var isInStandaloneMode = function () {
                return window.navigator.standalone === true ||
                    window.matchMedia('(display-mode: standalone)').matches;
            };

            if (isInStandaloneMode()) {
                npLog('App in standalone / installed PWA mode');
            }
        })();
    
