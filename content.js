// 1. UI HTML Inject Karna
const widgetHTML = `
    <div id="floatshield-pro-widget">
        <div class="fs-header">
            <div class="fs-title">🛡️ FloatShield Pro</div>
            <button class="fs-close-btn" id="fs-close">✕</button>
        </div>
        <div class="fs-stats">
            <span class="fs-count" id="fs-counter">0</span>
            <span class="fs-label">Ads & Trackers Blocked</span>
        </div>
        <div class="fs-logs" id="fs-log-box">
            <div style="color: #10b981; text-align: center; margin-top: 20px;">System Online. Scanning...</div>
        </div>
    </div>
`;

// Inject into page
const container = document.createElement('div');
container.innerHTML = widgetHTML;
document.body.appendChild(container);

// Close button working
document.getElementById('fs-close').addEventListener('click', () => {
    const widget = document.getElementById('floatshield-pro-widget');
    widget.style.opacity = '0';
    widget.style.transform = 'translateY(20px)';
    setTimeout(() => widget.remove(), 300);
});

// 2. The Ad Blocker Brain
let totalBlocked = 0;
const counterEl = document.getElementById('fs-counter');
const logBox = document.getElementById('fs-log-box');
let isFirstLog = true;

// Naye aur advance ad targets
const adSelectors = [
    '.ad', '.ads', '.adsbygoogle', '.banner-ad', '.sponsored',
    '.taboola', '.outbrain', '.mgid', 
    '#ad', 'iframe[src*="doubleclick"]', 'iframe[src*="amazon-adsystem"]',
    'iframe[src*="criteo"]', 'div[id^="google_ads"]'
];

function huntAds() {
    let freshlyBlocked = 0;

    adSelectors.forEach(selector => {
        const targets = document.querySelectorAll(selector);
        
        targets.forEach(ad => {
            if (ad.style.display !== 'none') {
                // Kill the ad
                ad.style.display = 'none';
                ad.remove();
                
                totalBlocked++;
                freshlyBlocked++;

                // Clear "System online" message on first block
                if(isFirstLog) {
                    logBox.innerHTML = '';
                    isFirstLog = false;
                }

                // Add to premium log
                const logItem = document.createElement('div');
                logItem.className = 'fs-log-item';
                
                // Format the name nicely
                let cleanName = selector.replace(/[.#\[\]^="]/g, '').substring(0, 15);
                
                logItem.innerHTML = `<span class="fs-log-tag">Blocked</span> <span>${cleanName}</span>`;
                logBox.prepend(logItem); // Naya log upar aayega
            }
        });
    });

    // Update Counter beautifully
    if (freshlyBlocked > 0) {
        counterEl.innerText = totalBlocked;
        // Chota sa bounce animation effect count update hone par
        counterEl.style.transform = 'scale(1.2)';
        setTimeout(() => { counterEl.style.transform = 'scale(1)'; }, 150);
    }
}

// 3. Start Engine
setTimeout(huntAds, 1000); // Pehla attack 1 second baad
setInterval(huntAds, 2500); // Phir har 2.5 second me background scan
