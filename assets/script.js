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

  // ── Copy button with animated checkmark ──────
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
    var original = btn.innerHTML;
    btn.classList.add('copied');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="stroke-dasharray:20;stroke-dashoffset:20;"><path d="M20 6L9 17l-5-5"/></svg> Copied';
    setTimeout(function () {
      btn.classList.remove('copied');
      btn.innerHTML = original;
    }, 1800);
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

  // ── Tab switcher with crossfade ──────────────
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.tab-btn');
    if (!btn) return;

    var group = btn.closest('.tab-group');
    if (!group) return;

    var target = btn.getAttribute('data-tab');
    var currentActive = group.querySelector('.tab-content.active');
    var nextContent = group.querySelector('.tab-content[data-tab="' + target + '"]');

    if (currentActive === nextContent) return;

    group.querySelectorAll('.tab-btn').forEach(function (b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');

    if (currentActive && nextContent) {
      currentActive.classList.add('fade-out');
      currentActive.classList.remove('active');
      setTimeout(function () {
        currentActive.classList.remove('fade-out');
        nextContent.classList.add('active');
      }, 150);
    } else {
      group.querySelectorAll('.tab-content').forEach(function (content) {
        content.classList.toggle('active', content.getAttribute('data-tab') === target);
      });
    }
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

  // ── Animated stat counters ──────────────────
  function animateCounter(el, target, suffix) {
    var duration = 1200;
    var start = performance.now();
    function tick(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(eased * target);
      el.textContent = current;
      if (progress < 1) requestAnimationFrame(tick);
      else if (suffix) el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
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
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.chip').forEach(function (chip) {
      counterObserver.observe(chip);
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

  // ── Scroll-to-top button ─────────────────────
  var scrollBtn = document.querySelector('.scroll-top');
  if (scrollBtn) {
    window.addEventListener('scroll', function () {
      scrollBtn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    scrollBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Active nav section highlight on scroll ───
  var navLinksAll = document.querySelectorAll('.navlinks a[href^="#"], .navlinks a[href^="/"]');
  var sections = document.querySelectorAll('section[id]');
  if (sections.length > 0 && 'IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinksAll.forEach(function (link) {
            var href = link.getAttribute('href');
            if (href === '#' + id) {
              link.classList.add('section-active');
            } else {
              link.classList.remove('section-active');
            }
          });
        }
      });
    }, { rootMargin: '-80px 0px -50% 0px', threshold: 0 });

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  // ── Docs search (Cmd+K) ─────────────────────
  var searchOverlay = document.getElementById('search-overlay');
  var searchInput = document.getElementById('search-input');
  var searchResults = document.getElementById('search-results');
  var searchTrigger = document.getElementById('search-trigger');
  var searchIndex = [];

  if (searchOverlay && searchInput) {
    // Build index from data tables on docs page
    document.querySelectorAll('.data-table tbody tr').forEach(function (row) {
      var cells = row.querySelectorAll('td');
      if (cells.length >= 2) {
        var code = (cells[0].textContent || '').trim();
        var desc = (cells[1].textContent || '').trim();
        var cat = row.getAttribute('data-category') || '';
        if (code) {
          searchIndex.push({ code: code, desc: desc, tag: cat, type: 'reason_code', row: row });
        }
      }
    });

    // Also index config keys from kv-list elements
    document.querySelectorAll('.kv-list dt').forEach(function (dt) {
      var dd = dt.nextElementSibling;
      if (dd && dd.tagName === 'DD') {
        searchIndex.push({
          code: dt.textContent.trim(),
          desc: dd.textContent.trim().substring(0, 120),
          tag: 'config',
          type: 'config_key',
          row: null
        });
      }
    });

    function openSearch() {
      searchOverlay.classList.add('open');
      searchInput.value = '';
      searchResults.innerHTML = '';
      setTimeout(function () { searchInput.focus(); }, 50);
    }

    function closeSearch() {
      searchOverlay.classList.remove('open');
    }

    function renderResults(query) {
      if (!query) {
        searchResults.innerHTML = '';
        return;
      }
      var q = query.toLowerCase();
      var matches = searchIndex.filter(function (item) {
        return item.code.toLowerCase().indexOf(q) !== -1 ||
               item.desc.toLowerCase().indexOf(q) !== -1 ||
               item.tag.toLowerCase().indexOf(q) !== -1;
      }).slice(0, 20);

      if (matches.length === 0) {
        searchResults.innerHTML = '<div class="search-empty">No results for "' + query + '"</div>';
        return;
      }

      searchResults.innerHTML = matches.map(function (item) {
        return '<div class="search-result" data-code="' + item.code + '">' +
          '<span class="search-result-code">' + item.code + '</span>' +
          '<span class="search-result-desc">' + item.desc + '</span>' +
          '<span class="search-result-tag">' + item.tag + '</span>' +
          '</div>';
      }).join('');
    }

    searchInput.addEventListener('input', function () {
      renderResults(searchInput.value.trim());
    });

    // Click result to scroll to it
    searchResults.addEventListener('click', function (e) {
      var result = e.target.closest('.search-result');
      if (!result) return;
      var code = result.getAttribute('data-code');
      var match = searchIndex.find(function (item) { return item.code === code; });
      if (match && match.row) {
        closeSearch();
        match.row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        match.row.style.background = 'rgba(212,148,60,.1)';
        setTimeout(function () { match.row.style.background = ''; }, 2000);
      } else {
        closeSearch();
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (searchOverlay.classList.contains('open')) {
          closeSearch();
        } else {
          openSearch();
        }
      }
      if (e.key === 'Escape' && searchOverlay.classList.contains('open')) {
        closeSearch();
      }
    });

    // Close on overlay click
    searchOverlay.addEventListener('click', function (e) {
      if (e.target === searchOverlay) closeSearch();
    });

    // Trigger button
    if (searchTrigger) {
      searchTrigger.addEventListener('click', function (e) {
        e.preventDefault();
        openSearch();
      });
    }
  }

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
