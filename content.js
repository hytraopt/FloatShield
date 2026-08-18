// ==========================================
// 🛡️ FloatShield Pro - Mobile Optimized Edition
// ==========================================

let totalBlocked = 0;

// 1. 🟢 Inject a "Chota Sa" (Tiny) Widget
function injectWidget() {
    // If it already exists, don't inject again
    if (document.getElementById('fs-mini-widget')) return;

    const widgetHTML = `
        <div id="fs-mini-widget" style="position:fixed; bottom:15px; right:15px; background:rgba(15,23,42,0.85); border:1px solid #3b82f6; border-radius:25px; padding:6px 12px; color:#10b981; z-index:2147483647; font-family:sans-serif; font-size:12px; font-weight:bold; display:flex; align-items:center; gap:5px; pointer-events:none; box-shadow:0px 4px 10px rgba(0,0,0,0.4); backdrop-filter:blur(4px);">
            <span>🛡️</span>
            <span id="fs-counter">${totalBlocked}</span>
        </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = widgetHTML;
    document.documentElement.appendChild(container); 
}

function updateCounter() {
    const counterEl = document.getElementById('fs-counter');
    if (counterEl) counterEl.innerText = totalBlocked;
}

// 2. 🚫 Normal Website & Mobile Banner Ads
const adSelectors = [
    'iframe[src*="ad"]', 'iframe[src*="doubleclick"]', 
    '.ad-slot', 'div[data-ad-slot]', 
    'ytm-companion-ad-renderer', // Mobile banners
    'ytm-promoted-sparkles-web-renderer',
    'ytm-promoted-video-renderer'
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

// 3. 🚀 Advanced YouTube Mobile & Desktop Ad Skipper
function killYouTubeAds() {
    let blockedThisRun = false;

    // A. Auto-click Skip Button (Includes mobile classes)
    const skipButtons = document.querySelectorAll('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button, .ytp-ad-text.ytp-ad-skip-button-text, .ytp-ad-skip-button-slot');
    skipButtons.forEach(btn => {
        btn.click();
        totalBlocked++;
        blockedThisRun = true;
    });

    // B. Fast-Forward Unskippable Ads (Mobile specific triggers added)
    // On mobile web, 'ad-showing' isn't always reliable. We also look for overlay banners.
    const isAdPlaying = document.querySelector('.ad-showing, .ad-interrupting, .ytp-ad-player-overlay, .ytp-ad-persistent-progress-bar, [id^="ad-text:"]');
    const video = document.querySelector('video');
    
    if (isAdPlaying && video) {
        if (!isNaN(video.duration) && video.currentTime < video.duration - 0.5) {
            video.muted = true; // Mute it instantly
            video.playbackRate = 16.0; // Max speed
            video.currentTime = video.duration - 0.1; // Jump to the end
            totalBlocked++;
            blockedThisRun = true;
        }
    }

    // C. Hide annoying "Sponsored" overlays on mobile players
    const mobileOverlays = document.querySelectorAll('.ytp-ad-overlay-container, .ytp-ad-message-container');
    mobileOverlays.forEach(el => {
        if (el.style.display !== 'none') {
            el.style.display = 'none';
            totalBlocked++;
            blockedThisRun = true;
        }
    });

    if (blockedThisRun) updateCounter();
}

// 4. ⚙️ Engine Initialization

// Keep widget alive if the site tries to delete it
injectWidget();
setInterval(() => {
    if (!document.getElementById('fs-mini-widget')) {
        injectWidget();
    }
}, 2000);

// Watch for standard ads popping up
const observer = new MutationObserver(() => {
    removeNormalAds();
});
if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
} else {
    document.addEventListener("DOMContentLoaded", () => {
        observer.observe(document.body, { childList: true, subtree: true });
    });
}

// YouTube requires aggressive checking (300ms)
if (window.location.hostname.includes("youtube.com")) {
    setInterval(killYouTubeAds, 300);
}

// Run once immediately
removeNormalAds();
