// Widget HTML Inject Karna (Mobile Safe Version)
const widgetHTML = '<div id="floatshield-pro-widget" style="position:fixed; bottom:25px; right:25px; width:220px; background:#0f172a; border-radius:12px; padding:12px; color:white; z-index:999999; font-family:sans-serif; border:1px solid #3b82f6;"><div style="font-size:12px; font-weight:bold; color:#3b82f6;">🛡️ FloatShield Pro</div><div style="font-size:24px; font-weight:bold; color:#10b981; margin:5px 0;" id="fs-counter">0</div><div style="font-size:10px; color:#94a3b8;">Ads Blocked</div></div>';

const container = document.createElement('div');
container.innerHTML = widgetHTML;
document.body.appendChild(container);

let totalBlocked = 0;
const counterEl = document.getElementById('fs-counter');

// Agresive Ad Selectors
const adSelectors = [
    'iframe[src*="ad"]', 'iframe[src*="doubleclick"]', 
    'div[class*="ad-"]', 'div[id*="ad-"]', 
    '.adsbygoogle', '.sponsored', '.ad-slot',
    'div[data-ad-slot]'
];

function removeAds() {
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

// 🛡️ THE SECURITY GUARD (MutationObserver)
const observer = new MutationObserver(() => {
    removeAds();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Initial run
removeAds();
