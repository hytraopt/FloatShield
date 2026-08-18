package com.floatshield.app;

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        WebView webView = new WebView(this);
        setContentView(webView);

        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                String jsCode = "javascript:(function() { " +
                    "let totalBlocked = 0; " +
                    "function injectWidget() { " +
                    "    if (document.getElementById('fs-mini-widget')) return; " +
                    "    const widgetHTML = '<div id=\"fs-mini-widget\" style=\"position:fixed; bottom:15px; right:15px; background:rgba(15,23,42,0.85); border:1px solid #3b82f6; border-radius:25px; padding:6px 12px; color:#10b981; z-index:2147483647; font-family:sans-serif; font-size:12px; font-weight:bold; display:flex; align-items:center; gap:5px; pointer-events:none; box-shadow:0px 4px 10px rgba(0,0,0,0.4); backdrop-filter:blur(4px);\"><span>🛡️</span><span id=\"fs-counter\">0</span></div>'; " +
                    "    const container = document.createElement('div'); " +
                    "    container.innerHTML = widgetHTML; " +
                    "    document.documentElement.appendChild(container); " +
                    "} " +
                    "function updateCounter() { " +
                    "    const counterEl = document.getElementById('fs-counter'); " +
                    "    if (counterEl) counterEl.innerText = totalBlocked; " +
                    "} " +
                    "function killYouTubeAds() { " +
                    "    let blockedThisRun = false; " +
                    "    const skipButtons = document.querySelectorAll('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button, .ytp-ad-text.ytp-ad-skip-button-text, .ytp-ad-skip-button-slot'); " +
                    "    skipButtons.forEach(btn => { btn.click(); totalBlocked++; blockedThisRun = true; }); " +
                    "    const isAdPlaying = document.querySelector('.ad-showing, .ad-interrupting, .ytp-ad-player-overlay, .ytp-ad-persistent-progress-bar, [id^=\"ad-text:\"]'); " +
                    "    const video = document.querySelector('video'); " +
                    "    if (isAdPlaying && video && !isNaN(video.duration) && video.currentTime < video.duration - 0.5) { " +
                    "        video.muted = true; video.playbackRate = 16.0; video.currentTime = video.duration - 0.1; totalBlocked++; blockedThisRun = true; " +
                    "    } " +
                    "    const mobileOverlays = document.querySelectorAll('.ytp-ad-overlay-container, .ytp-ad-message-container, ytm-companion-ad-renderer'); " +
                    "    mobileOverlays.forEach(el => { if (el.style.display !== 'none') { el.style.display = 'none'; totalBlocked++; blockedThisRun = true; } }); " +
                    "    if (blockedThisRun) updateCounter(); " +
                    "} " +
                    "injectWidget(); " +
                    "setInterval(() => { if (!document.getElementById('fs-mini-widget')) injectWidget(); }, 2000); " +
                    "setInterval(killYouTubeAds, 300); " +
                "})()";
                view.evaluateJavascript(jsCode, null);
            }
        });

        webView.loadUrl("https://m.youtube.com");
    }
}
