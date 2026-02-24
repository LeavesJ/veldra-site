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

  // ── Legal TOC active section tracking ────────
  var legalToc = document.querySelector('.legal-toc');
  if (legalToc && 'IntersectionObserver' in window) {
    var tocLinks = legalToc.querySelectorAll('a[href^="#"]');
    var sectionIds = [];
    tocLinks.forEach(function (link) {
      sectionIds.push(link.getAttribute('href').slice(1));
    });

    var tocObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          tocLinks.forEach(function (link) { link.classList.remove('active'); });
          var match = legalToc.querySelector('a[href="#' + entry.target.id + '"]');
          if (match) match.classList.add('active');
        }
      });
    }, { rootMargin: '-80px 0px -60% 0px', threshold: 0 });

    sectionIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) tocObserver.observe(el);
    });
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

  // ── Feature card expand/collapse ─────────────
  document.addEventListener('click', function (e) {
    var header = e.target.closest('.feature-card-header');
    if (!header) return;

    var card = header.closest('.feature-card');
    if (!card) return;

    var isExpanded = card.classList.contains('expanded');
    card.classList.toggle('expanded');
    header.setAttribute('aria-expanded', !isExpanded);
  });

  // ── Tab switcher ─────────────────────────────
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.tab-btn');
    if (!btn) return;

    var group = btn.closest('.tab-group');
    if (!group) return;

    var target = btn.getAttribute('data-tab');

    group.querySelectorAll('.tab-btn').forEach(function (b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');

    group.querySelectorAll('.tab-content').forEach(function (content) {
      content.classList.toggle('active', content.getAttribute('data-tab') === target);
    });
  });

  // ── Chip schematic activation ───────────────
  if ('IntersectionObserver' in window) {
    var chipObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('chip-active');
          chipObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.chip').forEach(function (chip) {
      chipObserver.observe(chip);
    });
  }

  // ── Timeline scroll animation ────────────────
  if ('IntersectionObserver' in window) {
    var timelineObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.timeline').forEach(function (tl) {
      timelineObserver.observe(tl);
    });
  }

  // ── Reason code filter ───────────────────────
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.filter-btn');
    if (!btn) return;

    var bar = btn.closest('.filter-bar');
    if (!bar) return;

    var category = btn.getAttribute('data-filter');
    var container = bar.parentElement;
    var table = container.querySelector('.data-table');
    if (!table) return;

    bar.querySelectorAll('.filter-btn').forEach(function (b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');

    table.querySelectorAll('tbody tr').forEach(function (row) {
      if (category === 'all') {
        row.style.display = '';
      } else {
        row.style.display = row.getAttribute('data-category') === category ? '' : 'none';
      }
    });
  });

  // ── Basic syntax highlighting for code panels ─
  document.querySelectorAll('.code-panel[data-lang]').forEach(function (panel) {
    var pre = panel.querySelector('pre');
    if (!pre) return;

    var lang = panel.getAttribute('data-lang');
    var html = pre.innerHTML;

    if (lang === 'json') {
      html = html
        .replace(/"([^"]+)"(\s*:)/g, '<span class="tok-key">"$1"</span>$2')
        .replace(/:\s*"([^"]*)"/g, ': <span class="tok-str">"$1"</span>')
        .replace(/:\s*(\d+\.?\d*)/g, ': <span class="tok-num">$1</span>')
        .replace(/:\s*(true|false)/g, ': <span class="tok-bool">$1</span>')
        .replace(/:\s*(null)/g, ': <span class="tok-null">$1</span>');
    }

    if (lang === 'toml') {
      html = html
        .replace(/^(\s*#.*)$/gm, '<span class="tok-comment">$1</span>')
        .replace(/^(\s*\[.*\])\s*$/gm, '<span class="tok-key">$1</span>')
        .replace(/^(\s*\w[\w.]*)\s*=/gm, '<span class="tok-key">$1</span> =')
        .replace(/=\s*"([^"]*)"/g, '= <span class="tok-str">"$1"</span>')
        .replace(/=\s*(\d+\.?\d*)/g, '= <span class="tok-num">$1</span>')
        .replace(/=\s*(true|false)/g, '= <span class="tok-bool">$1</span>');
    }

    pre.innerHTML = html;
  });

})();
