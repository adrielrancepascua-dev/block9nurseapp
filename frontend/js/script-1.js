        // Ghost persistence pre-check: hide auth overlay as early as possible.
        (function () {
            try {
                if (localStorage.getItem('nursepath_user')) {
                    document.documentElement.setAttribute('data-ghost-auth', '1');
                }
                if (localStorage.getItem('nursepath_theme') === 'light') {
                    document.documentElement.setAttribute('data-theme', 'light');
                }
            } catch (e) {
                // Ignore storage access failures.
            }
        })();
    
