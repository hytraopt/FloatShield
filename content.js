// ==========================================
// 🛡️ FloatShield Pro - Enhanced Edition
// ==========================================

let totalBlocked = 0;
let widgetInjected = false;

// 1. Inject Widget Safely
function injectWidget() {
    if (document.getElementById('floatshield-pro-widget')) return;

    const widgetHTML = `
        <div id="floatshield-pro-widget" style="position:fixed; bottom:25px; right:25px; width:220px; background:#0f172a; border-radius:12px; padding:12px; color:white; z-index:2147483647; font-family:sans-serif; border:1px solid #3b82f6; pointer-events:none; box-shadow: 0px 4px 10px rgba(0,0,0,0.5);">
            <div style="font-size:12px; font-weight:bold; color:#3b82f6;">🛡️ FloatShield Pro</div>
            <div style="font-size:24px; font-weight:bold; color:#10b981; margin:5px 0;" id="fs-counter">${totalBlocked}</div>
            <div style="font-size:10px; color:#94a3b8;">Ads Blocked</div>
        </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = widgetHTML;
    document.documentElement.appendChild(container); // Appending to HTML rather than Body helps bypass some site resets
    widgetInjected = true;
}

function updateCounter() {
    const counterEl = document.getElementById('fs-counter');
    if (counterEl) counterEl.innerText = totalBlocked;
}

// 2. Normal Website Banner Ads
const adSelectors = [
    'iframe[src*="ad"]', 'iframe[src*="doubleclick"]', 
    'div[class*="ad-"]', 'div[id*="ad-"]', 
    '.adsbygoogle', '.sponsored', '.ad-slot',
    'div[data-ad-slot]', '.taboola-container'
];

function removeNormalAds() {
    let blockedThisRun = false;
    adSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            if (el.style.display !== 'none') {
                el.style.display = 'none';
                el.style.opacity = '0';
                el.style.pointerEvents = 'none';
                totalBlocked++;
                blockedThisRun = true;
            }
        });
    });
    if (blockedThisRun) updateCounter();
}

// 3. 🚀 Advanced YouTube Special Ad Skipper Engine
function killYouTubeAds() {
    let blockedThisRun = false;

    // A. Auto-click Skip Button instantly (Includes new YouTube selectors)
    const skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button, .ytp-ad-text.ytp-ad-skip-button-text');
    if (skipBtn) {
        skipBtn.click();
        totalBlocked++;
        blockedThisRun = true;
    }

    // B. Fast-Forward Unskippable Video Ads (Safer Method)
    const adShowing = document.querySelector('.ad-showing, .ad-interrupting');
    const video = document.querySelector('video');
    
    // Check if the ad player wrapper exists and video is playing an ad
    if (adShowing && video) {
        if (!isNaN(video.duration) && video.currentTime < video.duration - 0.5) {
            video.muted = true; // Mute the ad
            video.playbackRate = 16.0; // Speed it up immensely (safer than skipping straight to the end)
            video.currentTime = video.duration - 0.1; // Jump to the very last millisecond
            totalBlocked++;
            blockedThisRun = true;
        }
    }

    // C. Hide YouTube Mobile/Desktop Banner Ads & Popups
    const ytBanners = document.querySelectorAll(`
        ytm-companion-ad-renderer, 
        ytm-promoted-sparkles-web-renderer, 
        ytd-ad-slot-renderer, 
        ytd-banner-promo-renderer, 
        ytd-player-legacy-desktop-watch-ads-renderer, 
        .ytd-in-feed-ad-layout-renderer,
        .ytp-ad-overlay-container
    `);
    
    ytBanners.forEach(ad => {
        if (ad.style.display !== 'none') {
            ad.style.display = 'none';
            totalBlocked++;
            blockedThisRun = true;
        }
    });

    if (blockedThisRun) updateCounter();
}

// 4. Engine Initialization & Event Loops

// Ensure widget is loaded even if the site clears the body
injectWidget();
setInterval(() => {
    if (!document.getElementById('floatshield-pro-widget')) {
        injectWidget();
    }
}, 2000);

// Security Guard (MutationObserver for Normal Websites)
const observer = new MutationObserver(() => {
    removeNormalAds();
});
// Observe document body once it exists
if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
} else {
    document.addEventListener("DOMContentLoaded", () => {
        observer.observe(document.body, { childList: true, subtree: true });
    });
}

// YouTube fast-attack timer (Kept at 300ms)
if (window.location.hostname.includes("youtube.com")) {
    setInterval(killYouTubeAds, 300);
}

// Initial run
removeNormalAds();
