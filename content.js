(function () {
    'use strict';

    let adsBlockedCount = 0;

    // 1. Clean Floating Badge
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

    // 2. Safe CSS Injection (Hides Banners & Ads without touching Video Stream)
    const style = document.createElement('style');
    style.innerHTML = `
        div[class*="ad-"], div[class*="ads-"], div[class*="advert"],
        iframe[src*="doubleclick"], iframe[src*="googleads"], iframe[src*="adnxs"],
        ins.adsbygoogle, aside[class*="ad"], div[id*="google_ads"],
        a[href*="googleads"], div[data-ad-unit], .sponsor-post, .promoted-content,
        ytm-promoted-sparkles-web-renderer, ytm-companion-ad-renderer,
        .ytp-ad-overlay-container, ytm-promoted-sparkles-text-search-renderer,
        ytm-statement-banner-renderer {
            display: none !important;
        }
    `;
    (document.head || document.documentElement).appendChild(style);

    // 3. Skip Button Auto-Clicker
    function autoClickSkip() {
        const skipButtons = document.querySelectorAll(
            '.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytm-ad-skip-button, .ytp-ad-skip-button-slot'
        );

        skipButtons.forEach(btn => {
            if (btn && typeof btn.click === 'function') {
                btn.click();
                updateBadgeCount(1);
            }
        });
    }

    // 4. Initialize
    function init() {
        createBadge();
        autoClickSkip();

        const observer = new MutationObserver(() => {
            autoClickSkip();
        });

        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
