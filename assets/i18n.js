// Veldra i18n — lightweight locale switcher
// Loads JSON locale files, swaps [data-i18n] textContent, persists choice.

(function () {
  'use strict';

  var SUPPORTED = ['en', 'es', 'zh'];
  var DEFAULT = 'en';
  var CACHE = {};

  function detect() {
    var stored = localStorage.getItem('veldra_lang');
    if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;
    var nav = (navigator.language || '').slice(0, 2).toLowerCase();
    if (SUPPORTED.indexOf(nav) !== -1) return nav;
    return DEFAULT;
  }

  function fetchLocale(lang, cb) {
    if (CACHE[lang]) return cb(CACHE[lang]);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/assets/i18n/' + lang + '.json?v=2', true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          CACHE[lang] = JSON.parse(xhr.responseText);
        } catch (e) {
          CACHE[lang] = {};
        }
      } else {
        CACHE[lang] = {};
      }
      cb(CACHE[lang]);
    };
    xhr.onerror = function () { CACHE[lang] = {}; cb(CACHE[lang]); };
    xhr.send();
  }

  function apply(strings) {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (strings[key] !== undefined && strings[key] !== '') {
        // Handle elements with child HTML (like <br> or <span>)
        var mode = el.getAttribute('data-i18n-html');
        if (mode === 'true') {
          el.innerHTML = strings[key];
        } else {
          el.textContent = strings[key];
        }
      }
      // Handle placeholder attribute
      var phKey = el.getAttribute('data-i18n-ph');
      if (phKey && strings[phKey] !== undefined) {
        el.setAttribute('placeholder', strings[phKey]);
      }
    });
    // Handle title
    var titleKey = document.documentElement.getAttribute('data-i18n-title');
    if (titleKey && strings[titleKey]) {
      document.title = strings[titleKey];
    }
    // Set html lang
    var current = getCurrentLang();
    document.documentElement.setAttribute('lang', current);
  }

  function getCurrentLang() {
    return localStorage.getItem('veldra_lang') || detect();
  }

  function switchLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    localStorage.setItem('veldra_lang', lang);
    fetchLocale(lang, apply);
    // Update toggle UI
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }

  // Expose for external use
  window.veldraI18n = {
    switchLang: switchLang,
    getCurrentLang: getCurrentLang,
    SUPPORTED: SUPPORTED
  };

  // Initialize on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function () {
    var lang = detect();

    // Bind toggle buttons
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
      btn.addEventListener('click', function () {
        switchLang(btn.getAttribute('data-lang'));
      });
    });

    // Only fetch and apply if not English (English is the source HTML)
    if (lang !== DEFAULT) {
      fetchLocale(lang, apply);
    }
  });

})();
