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
            z-index: 999999;
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

    // 2. Safe Ad Hiding (Banner & Popups Only)
    const AD_SELECTORS = [
        'div[class*="ad-"]', 'div[class*="ads-"]', 'div[class*="advert"]',
        'iframe[src*="doubleclick"]', 'iframe[src*="googleads"]', 'iframe[src*="adnxs"]',
        'ins.adsbygoogle', 'aside[class*="ad"]', 'div[id*="google_ads"]',
        'a[href*="googleads"]', 'div[data-ad-unit]', '.sponsor-post', '.promoted-content',
        'ytm-promoted-sparkles-web-renderer', 'ytm-companion-ad-renderer', '.ytp-ad-overlay-container'
    ];

    function hideAds() {
        let found = 0;
        AD_SELECTORS.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el.style.display !== 'none') {
                    el.style.display = 'none';
                    found++;
                }
            });
        });

        // 3. YouTube Mobile Specific Safe Skip
        const skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytm-ad-skip-button');
        if (skipBtn) {
            skipBtn.click();
            found++;
        }

        // Fast-forward ONLY if ad video explicitly exists (Prevents Main Video Blackout)
        const adPlayer = document.querySelector('.ad-created, .ad-showing');
        const video = document.querySelector('video');
        if (adPlayer && video && !isNaN(video.duration)) {
            video.playbackRate = 16.0; // Fast speed through ad without breaking main video
            video.muted = true;
            found++;
        } else if (video && video.playbackRate === 16.0) {
            video.playbackRate = 1.0; // Reset normal speed for main video
            video.muted = false;
        }

        if (found > 0) updateBadgeCount(found);
    }

    // 4. Initialize
    function init() {
        createBadge();
        hideAds();

        const observer = new MutationObserver(() => {
            hideAds();
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
