(function () {
    'use strict';

    let adsBlockedCount = 0;

    // 1. Create Floating Badge for "Ads Detected" Counter
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
            padding: 10px 16px;
            border-radius: 30px;
            font-family: sans-serif;
            font-size: 13px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 999999;
            display: flex;
            align-items: center;
            gap: 8px;
            border: 1px solid #10B981;
            pointer-events: none;
        `;
        badge.innerHTML = `🛡️ FloatShield: <span id="shield-count">0</span> Ads Blocked`;
        document.body.appendChild(badge);
    }

    function updateBadgeCount(count) {
        adsBlockedCount += count;
        const countEl = document.getElementById('shield-count');
        if (countEl) {
            countEl.innerText = adsBlockedCount;
        }
    }

    // 2. Hide Banner/Overlay Ads Without Breaking Video Players
    const AD_SELECTORS = [
        'div[class*="ad-"]', 'div[class*="ads-"]', 'div[class*="advert"]',
        'iframe[src*="doubleclick"]', 'iframe[src*="googleads"]', 'iframe[src*="adnxs"]',
        'ins.adsbygoogle', 'aside[class*="ad"]', 'div[id*="google_ads"]',
        'a[href*="googleads"]', 'div[data-ad-unit]', '.sponsor-post', '.promoted-content'
    ];

    function hideAds() {
        let found = 0;
        AD_SELECTORS.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el.style.display !== 'none') {
                    el.style.display = 'none'; // Safe hiding (Doesn't break player)
                    found++;
                }
            });
        });

        // 3. Auto-Skip Video Ads (Fast-Forward instead of deleting)
        const video = document.querySelector('video');
        const skipButton = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern');
        const adShowing = document.querySelector('.ad-showing, .ytp-ad-self-ad-overlay');

        if (skipButton) {
            skipButton.click();
            found++;
        }

        if (adShowing && video) {
            video.currentTime = video.duration || 999; // Skip to end of ad
            video.muted = true;
            found++;
        }

        if (found > 0) {
            updateBadgeCount(found);
        }
    }

    // 4. Initialize Shield
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
