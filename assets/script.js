// Veldra site v3 — interactions

(function () {
  'use strict';

  // ── Sticky nav shadow on scroll ──────────────
  var topbar = document.querySelector('.topbar');
  if (topbar) {
    window.addEventListener('scroll', function () {
      topbar.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
  }

  // ── Mobile nav toggle ────────────────────────
  var toggle = document.querySelector('.nav-toggle');
  var navlinks = document.querySelector('.navlinks');
  if (toggle && navlinks) {
    toggle.addEventListener('click', function () {
      navlinks.classList.toggle('open');
      var expanded = navlinks.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
    });
    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !navlinks.contains(e.target)) {
        navlinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── Copy button ──────────────────────────────
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.copy-btn');
    if (!btn) return;

    var panel = btn.closest('.code-panel');
    if (!panel) return;

    var pre = panel.querySelector('pre');
    if (!pre) return;

    var text = pre.innerText || pre.textContent || '';
    if (!text.trim()) return;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () {
        flashCopied(btn);
      }).catch(function () {
        fallbackCopy(text, btn);
      });
    } else {
      fallbackCopy(text, btn);
    }
  });

  function fallbackCopy(text, btn) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* noop */ }
    document.body.removeChild(ta);
    flashCopied(btn);
  }

  function flashCopied(btn) {
    var original = btn.textContent;
    btn.textContent = 'Copied';
    btn.style.borderColor = 'rgba(118,185,0,.5)';
    setTimeout(function () {
      btn.textContent = original;
      btn.style.borderColor = '';
    }, 1200);
  }

  // ── Intersection observer for fade-up ────────
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up').forEach(function (el) {
      el.style.animationPlayState = 'paused';
      observer.observe(el);
    });
  }
})();
