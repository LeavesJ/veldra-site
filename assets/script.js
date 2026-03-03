// Veldra site v3 — interactions + scroll-driven UX

(function () {
  'use strict';

  // ── Utility: throttle ─────────────────────────
  function throttle(fn, ms) {
    var last = 0;
    return function () {
      var now = Date.now();
      if (now - last >= ms) { last = now; fn.apply(this, arguments); }
    };
  }

  // ── Utility: lerp ─────────────────────────────
  function lerp(a, b, t) { return a + (b - a) * t; }

  // ── Utility: clamp ────────────────────────────
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  // ── Utility: map range ────────────────────────
  function mapRange(value, inMin, inMax, outMin, outMax) {
    return clamp(outMin + (value - inMin) * (outMax - outMin) / (inMax - inMin), outMin, outMax);
  }

  // ═══════════════════════════════════════════════
  // 1. Scroll progress bar
  // ═══════════════════════════════════════════════
  var progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  // ═══════════════════════════════════════════════
  // 2. Sticky nav shadow on scroll
  // ═══════════════════════════════════════════════
  var topbar = document.querySelector('.topbar');

  function onScroll() {
    // Progress bar
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docH > 0 ? (window.scrollY / docH) : 0;
    progressBar.style.transform = 'scaleX(' + pct + ')';

    // Nav shadow
    if (topbar) topbar.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ═══════════════════════════════════════════════
  // 3. Mobile nav toggle
  // ═══════════════════════════════════════════════
  var toggle = document.querySelector('.nav-toggle');
  var navlinks = document.querySelector('.navlinks');
  if (toggle && navlinks) {
    toggle.addEventListener('click', function () {
      navlinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', navlinks.classList.contains('open'));
    });
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !navlinks.contains(e.target)) {
        navlinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ═══════════════════════════════════════════════
  // 4. Hero parallax depth layers
  // ═══════════════════════════════════════════════
  var heroSection = document.querySelector('.hero-dark');
  var heroRing = document.querySelector('.hero-ring');
  var heroGrid = document.querySelector('.hero-grid');
  var heroInner = document.querySelector('.hero-inner');

  if (heroSection) {
    window.addEventListener('scroll', throttle(function () {
      var scrollY = window.scrollY;
      var heroH = heroSection.offsetHeight;
      if (scrollY > heroH * 1.5) return; // skip when past hero

      var t = scrollY / heroH;
      if (heroRing) {
        heroRing.style.transform = 'translateY(' + (scrollY * 0.3) + 'px) scale(' + (1 + t * 0.08) + ')';
        heroRing.style.opacity = Math.max(0, 1 - t * 1.2);
      }
      if (heroGrid) {
        heroGrid.style.transform = 'translateY(' + (scrollY * 0.15) + 'px)';
        heroGrid.style.opacity = Math.max(0, 1 - t * 0.8);
      }
      if (heroInner) {
        heroInner.style.transform = 'translateY(' + (scrollY * 0.08) + 'px)';
        heroInner.style.opacity = Math.max(0, 1 - t * 1.5);
      }
    }, 16), { passive: true });

    // Hex background parallax (product page)
    var heroHex = document.querySelector('.hero-hex');
    if (heroHex) {
      window.addEventListener('scroll', throttle(function () {
        var scrollY = window.scrollY;
        var heroH = heroSection.offsetHeight;
        if (scrollY > heroH * 1.5) return;
        heroHex.style.transform = 'translate(-50%, -50%) translateY(' + (scrollY * 0.2) + 'px) rotate(' + (scrollY * 0.02) + 'deg)';
      }, 16), { passive: true });
    }
  }

  // ═══════════════════════════════════════════════
  // 5. 3D chip tilt (mouse-driven gyroscope)
  // ═══════════════════════════════════════════════
  var chipWrap = document.querySelector('.chip-wrap');
  var chip = document.querySelector('.chip');

  if (chipWrap && chip && window.innerWidth > 768) {
    var chipRect, chipCx, chipCy;
    var targetRx = 0, targetRy = 0, currentRx = 0, currentRy = 0;
    var chipRafId = null;

    function updateChipRect() {
      chipRect = chipWrap.getBoundingClientRect();
      chipCx = chipRect.left + chipRect.width / 2;
      chipCy = chipRect.top + chipRect.height / 2;
    }

    chipWrap.addEventListener('mouseenter', function () {
      updateChipRect();
      chipWrap.classList.add('chip-hovering');
      if (!chipRafId) chipRafLoop();
    });

    chipWrap.addEventListener('mousemove', function (e) {
      if (!chipRect) updateChipRect();
      var dx = (e.clientX - chipCx) / (chipRect.width / 2);
      var dy = (e.clientY - chipCy) / (chipRect.height / 2);
      targetRy = dx * 12;  // rotate around Y
      targetRx = -dy * 8;  // rotate around X
    });

    chipWrap.addEventListener('mouseleave', function () {
      targetRx = 0;
      targetRy = 0;
      chipWrap.classList.remove('chip-hovering');
    });

    function chipRafLoop() {
      currentRx = lerp(currentRx, targetRx, 0.08);
      currentRy = lerp(currentRy, targetRy, 0.08);
      chip.style.transform = 'perspective(800px) rotateX(' + currentRx + 'deg) rotateY(' + currentRy + 'deg)';

      if (Math.abs(currentRx - targetRx) > 0.01 || Math.abs(currentRy - targetRy) > 0.01) {
        chipRafId = requestAnimationFrame(chipRafLoop);
      } else {
        chip.style.transform = 'perspective(800px) rotateX(' + targetRx + 'deg) rotateY(' + targetRy + 'deg)';
        chipRafId = null;
        // Keep looping if still hovering
        if (chipWrap.classList.contains('chip-hovering')) {
          chipRafId = requestAnimationFrame(chipRafLoop);
        }
      }
    }
  }

  // ═══════════════════════════════════════════════
  // 6. Magnetic card hover (3D tilt + glow follow)
  // ═══════════════════════════════════════════════
  if (window.innerWidth > 768) {
    document.querySelectorAll('.card, .mode-card, .feature-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var cx = rect.width / 2;
        var cy = rect.height / 2;

        var ry = ((x - cx) / cx) * 4;
        var rx = -((y - cy) / cy) * 3;

        card.style.transform = 'perspective(600px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateZ(4px)';
        card.style.setProperty('--glow-x', x + 'px');
        card.style.setProperty('--glow-y', y + 'px');
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  // ═══════════════════════════════════════════════
  // 7. Intersection observer for fade-up
  // ═══════════════════════════════════════════════
  if ('IntersectionObserver' in window) {
    var fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up').forEach(function (el) {
      el.style.animationPlayState = 'paused';
      fadeObserver.observe(el);
    });
  }

  // ═══════════════════════════════════════════════
  // 8. Section reveal with directional entrance
  // ═══════════════════════════════════════════════
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.section').forEach(function (section) {
      section.classList.add('section-reveal');
      revealObserver.observe(section);
    });
  }

  // ═══════════════════════════════════════════════
  // 9. Comparison table staggered row reveal
  // ═══════════════════════════════════════════════
  if ('IntersectionObserver' in window) {
    var tableObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var rows = entry.target.querySelectorAll('tbody tr');
          rows.forEach(function (row, i) {
            row.style.transitionDelay = (i * 0.08) + 's';
            row.classList.add('row-visible');
          });
          tableObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.comparison-table').forEach(function (table) {
      table.querySelectorAll('tbody tr').forEach(function (row) {
        row.classList.add('row-hidden');
      });
      tableObserver.observe(table);
    });
  }

  // ═══════════════════════════════════════════════
  // 10. Architecture progressive line draw
  // ═══════════════════════════════════════════════
  var archFull = document.querySelector('.arch-full-svg');
  if (archFull && 'IntersectionObserver' in window) {
    // Set up stroke-dasharray for connection lines
    var archLines = archFull.querySelectorAll('line');
    archLines.forEach(function (line) {
      var len = Math.sqrt(
        Math.pow(parseFloat(line.getAttribute('x2')) - parseFloat(line.getAttribute('x1')), 2) +
        Math.pow(parseFloat(line.getAttribute('y2')) - parseFloat(line.getAttribute('y1')), 2)
      );
      line.style.strokeDasharray = len;
      line.style.strokeDashoffset = len;
      line.style.transition = 'stroke-dash-offset 0s';
    });

    var archObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          archFull.classList.add('arch-animate');
          // Animate lines with stagger
          archLines.forEach(function (line, i) {
            line.style.transition = 'stroke-dashoffset 0.8s ease ' + (0.3 + i * 0.12) + 's';
            line.style.strokeDashoffset = '0';
          });
          archObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    archObserver.observe(archFull);
  }

  // ═══════════════════════════════════════════════
  // 11. Chip schematic activation + counters
  // ═══════════════════════════════════════════════
  function animateCounter(el, target, suffix) {
    var duration = 1200;
    var start = performance.now();
    function tick(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
      else if (suffix) el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window) {
    var chipObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('chip-active');
          // Animate counter values
          var values = entry.target.querySelectorAll('.chip-pin-value');
          values.forEach(function (v) {
            var text = v.textContent.trim();
            var num = parseInt(text, 10);
            if (!isNaN(num) && num > 0) {
              var suffix = v.querySelector('span');
              v.childNodes[0].textContent = '0';
              setTimeout(function () {
                animateCounter(v.childNodes[0], num, suffix);
              }, 600);
            }
          });
          chipObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.chip').forEach(function (c) {
      chipObserver.observe(c);
    });
  }

  // ═══════════════════════════════════════════════
  // 12. Feature card expand/collapse
  // ═══════════════════════════════════════════════
  document.addEventListener('click', function (e) {
    var header = e.target.closest('.feature-card-header');
    if (!header) return;
    var card = header.closest('.feature-card');
    if (!card) return;
    var isExpanded = card.classList.contains('expanded');
    card.classList.toggle('expanded');
    header.setAttribute('aria-expanded', !isExpanded);
  });

  // ═══════════════════════════════════════════════
  // 13. Tab switcher with crossfade
  // ═══════════════════════════════════════════════
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.tab-btn');
    if (!btn) return;
    var group = btn.closest('.tab-group');
    if (!group) return;
    var target = btn.getAttribute('data-tab');
    var current = group.querySelector('.tab-content.active');
    var next = group.querySelector('.tab-content[data-tab="' + target + '"]');
    if (current === next) return;

    group.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');

    if (current && next) {
      current.classList.add('fade-out');
      current.classList.remove('active');
      setTimeout(function () {
        current.classList.remove('fade-out');
        next.classList.add('active');
      }, 150);
    } else {
      group.querySelectorAll('.tab-content').forEach(function (c) {
        c.classList.toggle('active', c.getAttribute('data-tab') === target);
      });
    }
  });

  // ═══════════════════════════════════════════════
  // 14. Copy button with animated checkmark
  // ═══════════════════════════════════════════════
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
      navigator.clipboard.writeText(text).then(function () { flashCopied(btn); })
        .catch(function () { fallbackCopy(text, btn); });
    } else {
      fallbackCopy(text, btn);
    }
  });

  function fallbackCopy(text, btn) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;left:-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* noop */ }
    document.body.removeChild(ta);
    flashCopied(btn);
  }

  function flashCopied(btn) {
    var original = btn.innerHTML;
    btn.classList.add('copied');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="stroke-dasharray:20;stroke-dashoffset:20;"><path d="M20 6L9 17l-5-5"/></svg> Copied';
    setTimeout(function () {
      btn.classList.remove('copied');
      btn.innerHTML = original;
    }, 1800);
  }

  // ═══════════════════════════════════════════════
  // 15. Timeline + Reason code filter
  // ═══════════════════════════════════════════════
  if ('IntersectionObserver' in window) {
    var timelineObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('.timeline').forEach(function (tl) { timelineObserver.observe(tl); });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.filter-btn');
    if (!btn) return;
    var bar = btn.closest('.filter-bar');
    if (!bar) return;
    var category = btn.getAttribute('data-filter');
    var table = bar.parentElement.querySelector('.data-table');
    if (!table) return;

    bar.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');

    table.querySelectorAll('tbody tr').forEach(function (row) {
      row.style.display = (category === 'all' || row.getAttribute('data-category') === category) ? '' : 'none';
    });
  });

  // ═══════════════════════════════════════════════
  // 16. Scroll-to-top button
  // ═══════════════════════════════════════════════
  var scrollBtn = document.querySelector('.scroll-top');
  if (scrollBtn) {
    window.addEventListener('scroll', function () {
      scrollBtn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    scrollBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ═══════════════════════════════════════════════
  // 17. Legal TOC active tracking
  // ═══════════════════════════════════════════════
  var legalToc = document.querySelector('.legal-toc');
  if (legalToc && 'IntersectionObserver' in window) {
    var tocLinks = legalToc.querySelectorAll('a[href^="#"]');
    var tocObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          tocLinks.forEach(function (link) { link.classList.remove('active'); });
          var match = legalToc.querySelector('a[href="#' + entry.target.id + '"]');
          if (match) match.classList.add('active');
        }
      });
    }, { rootMargin: '-80px 0px -60% 0px', threshold: 0 });

    tocLinks.forEach(function (link) {
      var el = document.getElementById(link.getAttribute('href').slice(1));
      if (el) tocObserver.observe(el);
    });
  }

  // ═══════════════════════════════════════════════
  // 18. Docs search (Cmd+K)
  // ═══════════════════════════════════════════════
  var searchOverlay = document.getElementById('search-overlay');
  var searchInput = document.getElementById('search-input');
  var searchResults = document.getElementById('search-results');
  var searchTrigger = document.getElementById('search-trigger');
  var searchIndex = [];

  if (searchOverlay && searchInput) {
    document.querySelectorAll('.data-table tbody tr').forEach(function (row) {
      var cells = row.querySelectorAll('td');
      if (cells.length >= 2) {
        var code = (cells[0].textContent || '').trim();
        var desc = (cells[1].textContent || '').trim();
        if (code) searchIndex.push({ code: code, desc: desc, tag: row.getAttribute('data-category') || '', row: row });
      }
    });
    document.querySelectorAll('.kv-list dt').forEach(function (dt) {
      var dd = dt.nextElementSibling;
      if (dd && dd.tagName === 'DD') {
        searchIndex.push({ code: dt.textContent.trim(), desc: dd.textContent.trim().substring(0, 120), tag: 'config', row: null });
      }
    });

    function openSearch() { searchOverlay.classList.add('open'); searchInput.value = ''; searchResults.innerHTML = ''; setTimeout(function () { searchInput.focus(); }, 50); }
    function closeSearch() { searchOverlay.classList.remove('open'); }

    searchInput.addEventListener('input', function () {
      var q = searchInput.value.trim().toLowerCase();
      if (!q) { searchResults.innerHTML = ''; return; }
      var matches = searchIndex.filter(function (item) {
        return item.code.toLowerCase().indexOf(q) !== -1 || item.desc.toLowerCase().indexOf(q) !== -1 || item.tag.toLowerCase().indexOf(q) !== -1;
      }).slice(0, 20);
      searchResults.innerHTML = matches.length === 0
        ? '<div class="search-empty">No results for "' + q + '"</div>'
        : matches.map(function (m) {
            return '<div class="search-result" data-code="' + m.code + '"><span class="search-result-code">' + m.code + '</span><span class="search-result-desc">' + m.desc + '</span><span class="search-result-tag">' + m.tag + '</span></div>';
          }).join('');
    });

    searchResults.addEventListener('click', function (e) {
      var result = e.target.closest('.search-result');
      if (!result) return;
      var match = searchIndex.find(function (item) { return item.code === result.getAttribute('data-code'); });
      closeSearch();
      if (match && match.row) {
        match.row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        match.row.style.background = 'rgba(212,148,60,.1)';
        setTimeout(function () { match.row.style.background = ''; }, 2000);
      }
    });

    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); searchOverlay.classList.contains('open') ? closeSearch() : openSearch(); }
      if (e.key === 'Escape' && searchOverlay.classList.contains('open')) closeSearch();
    });
    searchOverlay.addEventListener('click', function (e) { if (e.target === searchOverlay) closeSearch(); });
    if (searchTrigger) searchTrigger.addEventListener('click', function (e) { e.preventDefault(); openSearch(); });
  }

  // ═══════════════════════════════════════════════
  // 19. Syntax highlighting for code panels
  // ═══════════════════════════════════════════════
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

  // ═══════════════════════════════════════════════
  // 20. Smooth anchor scroll
  // ═══════════════════════════════════════════════
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href').slice(1);
    var target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', '#' + id);
    }
  });

  // ═══════════════════════════════════════════════
  // 21. Cursor spotlight on hero
  // ═══════════════════════════════════════════════
  if (heroSection && window.innerWidth > 768) {
    heroSection.addEventListener('mousemove', throttle(function (e) {
      var rect = heroSection.getBoundingClientRect();
      heroSection.style.setProperty('--cursor-x', (e.clientX - rect.left) + 'px');
      heroSection.style.setProperty('--cursor-y', (e.clientY - rect.top) + 'px');
    }, 32));
  }

  // ═══════════════════════════════════════════════
  // 22. Isometric hero: mode toggle
  // ═══════════════════════════════════════════════
  var heroCube = document.getElementById('hero-cube');
  var modeDesc = document.getElementById('hero-mode-desc');
  var modeI18nKeys = {
    shadow: 'home.hero.mode_shadow',
    observe: 'home.hero.mode_observe',
    inline: 'home.hero.mode_inline'
  };
  var modeDefaults = {
    shadow: 'Audit templates silently. No miner impact. Zero risk.',
    observe: 'Log every verdict and share event. Build confidence before enforcing.',
    inline: 'Enforce policy on every template. Reject violations in real time.'
  };

  function getModeText(mode) {
    // Try to pull translated string from i18n cache if available
    var i18n = window.veldraI18n;
    if (i18n && i18n.getCurrentLang && i18n.getCurrentLang() !== 'en') {
      // Look for a hidden element with that key to grab the translated string
      var el = document.querySelector('[data-i18n="' + modeI18nKeys[mode] + '"]');
      if (el && el.textContent) return el.textContent;
    }
    return modeDefaults[mode] || '';
  }

  document.querySelectorAll('.hero-mode-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var mode = btn.getAttribute('data-mode');
      if (!mode || !heroCube) return;
      document.querySelectorAll('.hero-mode-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      heroCube.setAttribute('data-mode', mode);
      if (modeDesc) {
        modeDesc.setAttribute('data-i18n', modeI18nKeys[mode]);
        modeDesc.textContent = getModeText(mode);
      }
    });
  });

  // ═══════════════════════════════════════════════
  // 23. Isometric hero: mouse-driven subtle tilt
  // ═══════════════════════════════════════════════
  var heroStackScene = document.querySelector('.hero-stack-scene');
  if (heroStackScene && heroCube && window.innerWidth > 768) {
    var cubeTargetRx = 0, cubeTargetRy = 0, cubeCurRx = 0, cubeCurRy = 0;
    var cubeRafId = null;

    heroStackScene.addEventListener('mousemove', function (e) {
      var rect = heroStackScene.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      cubeTargetRy = ((e.clientX - cx) / (rect.width / 2)) * 6;
      cubeTargetRx = -((e.clientY - cy) / (rect.height / 2)) * 4;
      if (!cubeRafId) cubeRafId = requestAnimationFrame(cubeTiltLoop);
    });

    heroStackScene.addEventListener('mouseleave', function () {
      cubeTargetRx = 0;
      cubeTargetRy = 0;
    });

    function cubeTiltLoop() {
      cubeCurRx = lerp(cubeCurRx, cubeTargetRx, 0.06);
      cubeCurRy = lerp(cubeCurRy, cubeTargetRy, 0.06);
      heroCube.style.transform =
        'rotateX(' + (-25 + cubeCurRx) + 'deg) rotateY(' + (35 + cubeCurRy) + 'deg)';

      if (Math.abs(cubeCurRx - cubeTargetRx) > 0.05 || Math.abs(cubeCurRy - cubeTargetRy) > 0.05) {
        cubeRafId = requestAnimationFrame(cubeTiltLoop);
      } else {
        cubeRafId = null;
      }
    }
  }

  // ═══════════════════════════════════════════════
  // 24. Isometric hero: reason code chip spawner
  // ═══════════════════════════════════════════════
  var reasonStream = document.getElementById('reason-stream');
  var reasonCodes = [
    'avg_fee_below_minimum', 'tx_count_exceeded', 'coinbase_mismatch',
    'version_bits_invalid', 'sigops_exceeded', 'duplicate_tx',
    'prevhash_stale', 'weight_exceeded', 'locktime_invalid',
    'witness_mismatch', 'fee_variance_high', 'merkle_root_invalid',
    'template_timeout', 'nonce_range_exhausted'
  ];

  if (reasonStream && window.innerWidth > 768) {
    var chipCount = 0;
    var maxChips = 6;

    setInterval(function () {
      if (!heroCube || heroCube.getAttribute('data-mode') === 'shadow') return;
      var chip = document.createElement('span');
      chip.className = 'iso-reason-chip';
      chip.textContent = reasonCodes[chipCount % reasonCodes.length];
      reasonStream.appendChild(chip);
      chipCount++;

      // Remove oldest when over limit
      while (reasonStream.children.length > maxChips) {
        reasonStream.removeChild(reasonStream.firstChild);
      }
    }, 2400);
  }

  // ═══════════════════════════════════════════════
  // 25. Isometric hero: NDJSON ticker
  // ═══════════════════════════════════════════════
  var tickerTrack = document.getElementById('ticker-track');
  if (tickerTrack) {
    var verdicts = [
      { accepted: true,  reason_code: 'ok', share_id: 'a7c3…e1' },
      { accepted: false, reason_code: 'avg_fee_below_minimum', share_id: 'b2d1…f4' },
      { accepted: true,  reason_code: 'ok', share_id: 'c9e7…a2' },
      { accepted: false, reason_code: 'tx_count_exceeded', share_id: 'd4f0…b8' },
      { accepted: true,  reason_code: 'ok', share_id: 'e1a5…c6' },
      { accepted: false, reason_code: 'prevhash_stale', share_id: 'f8b3…d9' },
      { accepted: true,  reason_code: 'ok', share_id: 'g6c2…e0' },
      { accepted: false, reason_code: 'sigops_exceeded', share_id: 'h3d8…a1' },
      { accepted: true,  reason_code: 'ok', share_id: 'i0f4…b7' },
      { accepted: false, reason_code: 'weight_exceeded', share_id: 'j5e9…c3' },
      { accepted: true,  reason_code: 'ok', share_id: 'k2a6…d5' },
      { accepted: false, reason_code: 'coinbase_mismatch', share_id: 'l7b1…e8' }
    ];
    // Double to fill ticker width for seamless loop
    var tickerHtml = '';
    for (var t = 0; t < 2; t++) {
      verdicts.forEach(function (v) {
        var cls = v.accepted ? 'ticker-ok' : 'ticker-reject';
        tickerHtml += '<span class="' + cls + '">'
          + JSON.stringify(v)
          + '</span>';
      });
    }
    tickerTrack.innerHTML = tickerHtml;
  }

  // ═══════════════════════════════════════════════
  // 26a. Light parallax for section content
  // ═══════════════════════════════════════════════
  if (window.innerWidth > 768) {
    var parallaxEls = document.querySelectorAll('.section .section-header, .chip-wrap, .card-glow');
    if (parallaxEls.length > 0) {
      window.addEventListener('scroll', throttle(function () {
        parallaxEls.forEach(function (el) {
          var rect = el.getBoundingClientRect();
          var vh = window.innerHeight;
          // only apply when element is near viewport
          if (rect.top > vh * 1.3 || rect.bottom < -100) return;
          var center = rect.top + rect.height / 2;
          var offset = (center - vh / 2) / vh;
          el.style.transform = 'translateY(' + (offset * -18) + 'px)';
        });
      }, 16), { passive: true });
    }
  }

  // ═══════════════════════════════════════════════
  // 26b. Cube-scroll storytelling controller
  // ═══════════════════════════════════════════════
  // Document-level wheel capture. No scroll-position sync.
  // The wheel handler is the only thing that changes panels.
  (function () {
    var section = document.querySelector('.scroll-lock-section');
    if (!section) return;
    var panels = section.querySelectorAll('.scroll-lock-panel');
    var dots = section.querySelectorAll('.scroll-lock-dot');
    if (panels.length === 0 || window.innerWidth <= 768) return;

    var N = panels.length;
    var cur = 0;
    var busy = false;
    var LOCK_MS = 750;

    panels[0].classList.add('cube-active');

    function show(idx) {
      for (var i = 0; i < N; i++) {
        panels[i].classList.remove('cube-active', 'cube-exited');
        if (i === idx) panels[i].classList.add('cube-active');
        else if (i < idx) panels[i].classList.add('cube-exited');
      }
      for (var j = 0; j < dots.length; j++) {
        dots[j].classList.toggle('dot-active', j === idx);
      }
    }

    function stickyActive() {
      var r = section.getBoundingClientRect();
      return r.top <= 5 && r.bottom >= window.innerHeight;
    }

    function pin() {
      // Keep scroll pinned so sticky stays engaged and position cannot drift
      var ph = section.offsetHeight / N;
      var target = section.offsetTop + cur * ph + 1;
      window.scrollTo(0, target);
    }

    // Document-level wheel: catches events regardless of cursor position
    document.addEventListener('wheel', function (e) {
      if (!stickyActive()) return;

      // Block all native scroll while in the section
      e.preventDefault();

      // Swallow everything while transitioning
      if (busy) return;

      var dir = e.deltaY > 0 ? 1 : -1;
      var next = cur + dir;

      // Boundary: scroll past the section to exit
      if (next < 0 || next >= N) {
        busy = true;
        var target;
        if (next >= N) {
          target = section.offsetTop + section.offsetHeight + 5;
        } else {
          target = section.offsetTop - window.innerHeight + 5;
          if (target < 0) target = 0;
        }
        window.scrollTo(0, target);
        setTimeout(function () { busy = false; }, LOCK_MS);
        return;
      }

      // Step one panel
      busy = true;
      cur = next;
      show(cur);
      pin();

      setTimeout(function () {
        pin(); // re-pin to correct any drift
        busy = false;
      }, LOCK_MS);
    }, { passive: false });

    // When scrolling into the section naturally (scrollbar, keyboard),
    // snap to panel 0 or last panel depending on direction
    var wasInView = false;
    window.addEventListener('scroll', function () {
      if (busy) return;
      var inView = stickyActive();
      if (inView && !wasInView) {
        // Just entered the section
        var r = section.getBoundingClientRect();
        var scrolled = -r.top;
        // If near the top, panel 0; if near the bottom, last panel
        cur = scrolled < section.offsetHeight / 2 ? 0 : N - 1;
        show(cur);
        pin();
      }
      wasInView = inView;
    }, { passive: true });
  })();

})();
