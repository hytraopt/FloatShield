(function () {
    'use strict';

    // 1. Aggressive Ad Selectors
    const AD_SELECTORS = [
        'div[class*="ad-"]', 'div[class*="ads-"]', 'div[class*="advert"]',
        'iframe[src*="doubleclick"]', 'iframe[src*="googleads"]', 'iframe[src*="adnxs"]',
        'ins.adsbygoogle', 'aside[class*="ad"]', 'div[id*="google_ads"]',
        'a[href*="googleads"]', 'div[data-ad-unit]', '.sponsor-post', '.promoted-content',
        '#player-ads', '.ytp-ad-overlay-container', '.ytp-ad-skip-button-slot'
    ];

    // 2. Remove Ad Elements Function
    function nukeAds() {
        AD_SELECTORS.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => el.remove());
        });
    }

    // 3. Bypass Anti-AdBlock Detection (Legal Script Tricking)
    function disableAntiAdblock() {
        window.canRunAds = true;
        window.isAdBlockActive = false;
        if (window.google_ad_status) window.google_ad_status = 1;
    }

    // 4. Live DOM Observer for Dynamic Ads
    const observer = new MutationObserver(() => {
        nukeAds();
    });

    // Initialize Shield
    function initShield() {
        disableAntiAdblock();
        nukeAds();

        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                observer.observe(document.body, { childList: true, subtree: true });
            });
        }
    }

    initShield();
})();
