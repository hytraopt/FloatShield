// Widget HTML Inject Karna (Mobile Safe Version)
const widgetHTML = '<div id="floatshield-pro-widget" style="position:fixed; bottom:25px; right:25px; width:220px; background:#0f172a; border-radius:12px; padding:12px; color:white; z-index:999999; font-family:sans-serif; border:1px solid #3b82f6;"><div style="font-size:12px; font-weight:bold; color:#3b82f6;">🛡️ FloatShield Pro</div><div style="font-size:24px; font-weight:bold; color:#10b981; margin:5px 0;" id="fs-counter">0</div><div style="font-size:10px; color:#94a3b8;">Ads Blocked</div></div>';

const container = document.createElement('div');
container.innerHTML = widgetHTML;
document.body.appendChild(container);

let totalBlocked = 0;
const counterEl = document.getElementById('fs-counter');

// 1. Normal Website Banner Ads
const adSelectors = [
    'iframe[src*="ad"]', 'iframe[src*="doubleclick"]', 
    'div[class*="ad-"]', 'div[id*="ad-"]', 
    '.adsbygoogle', '.sponsored', '.ad-slot',
    'div[data-ad-slot]'
];

function removeNormalAds() {
    adSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            if (el.style.display !== 'none') {
                el.style.display = 'none';
                el.remove();
                totalBlocked++;
                if(counterEl) counterEl.innerText = totalBlocked;
            }
        });
    });
}

// 2. 🚀 YouTube Special Ad Skipper Engine
function killYouTubeAds() {
    // Auto-click Skip Button instantly
    const skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button');
    if (skipBtn) {
        skipBtn.click();
        totalBlocked++;
        if(counterEl) counterEl.innerText = totalBlocked;
    }

    // Fast-Forward Unskippable Video Ads to the end
    const video = document.querySelector('video');
    const adShowing = document.querySelector('.ad-showing');
    if (adShowing && video && !isNaN(video.duration)) {
        // Ad ko seedha last second par bhej do
        video.currentTime = video.duration; 
    }

    // Hide YouTube Mobile Banner Ads
    const ytBanners = document.querySelectorAll('ytm-companion-ad-renderer, ytm-promoted-sparkles-web-renderer, ad-slot-renderer, ytd-ad-slot-renderer');
    ytBanners.forEach(ad => {
        if (ad.style.display !== 'none') {
            ad.style.display = 'none';
            totalBlocked++;
            if(counterEl) counterEl.innerText = totalBlocked;
        }
    });
}

// Security Guard (MutationObserver for Normal Websites)
const observer = new MutationObserver(() => {
    removeNormalAds();
});
observer.observe(document.body, { childList: true, subtree: true });

// YouTube requires a fast timer because it constantly changes
setInterval(() => {
    if (window.location.hostname.includes("youtube.com")) {
        killYouTubeAds();
    }
}, 300); // Har 0.3 seconds mein attack karega

// Initial run
removeNormalAds();
