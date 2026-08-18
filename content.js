(function () {
    'use strict';

    let adsBlockedCount = 0;

    // 1. Floating Badge
    function createBadge() {
        if (document.getElementById('floatshield-badge')) return;

        const badge = document.createElement('div');
        badge.id = 'floatshield-badge';
        badge.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #111827;
            color: #10B981;
            padding: 8px 14px;
            border-radius: 30px;
            font-family: sans-serif;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            z-index: 9999999;
            display: flex;
            align-items: center;
            gap: 6px;
            border: 1px solid #10B981;
            pointer-events: none;
        `;
        badge.innerHTML = `🛡️ FloatShield: <span id="shield-count">0</span> Ads Blocked`;
        document.body.appendChild(badge);
    }

    function updateBadgeCount(count) {
        adsBlockedCount += count;
        const countEl = document.getElementById('shield-count');
        if (countEl) countEl.innerText = adsBlockedCount;
    }

    // 2. Safe Banner & Popup Selector Removal (Strictly Avoids Video Player)
    const AD_SELECTORS = [
        'div[class*="ad-slot"]', 'div[class*="ad-banner"]', 'iframe[src*="doubleclick"]',
        'iframe[src*="googleads"]', 'ins.adsbygoogle', 'ytm-promoted-sparkles-web-renderer',
        'ytm-companion-ad-renderer', 'ytm-promoted-sparkles-text-search-renderer'
    ];

    function removeExternalAds() {
        let count = 0;
        AD_SELECTORS.forEach(selector => {
            const els = document.querySelectorAll(selector);
            els.forEach(el => {
                if (el && el.style.display !== 'none') {
                    el.style.display = 'none';
                    count++;
                }
            });
        });

        // Safe Auto-Skip Button Click
        const skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytm-ad-skip-button');
        if (skipBtn) {
            skipBtn.click();
            count++;
        }

        if (count > 0) {
            updateBadgeCount(count);
        }
    }

    // 3. Initialize
    function init() {
        createBadge();
        removeExternalAds();

        // Interval approach avoids heavy DOM mutation locks on video stream
        setInterval(removeExternalAds, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
