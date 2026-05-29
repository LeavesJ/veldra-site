/* Scroll-effect interactions — section-reveal and fade-up.
   Ported from veldra-site/assets/script.js (current production site).
   Two effects only: section directional entrance and per-element fade-up.
   Both use IntersectionObserver so they cost near zero on idle scroll.

   Opt-in markup:
     <section class="section-reveal"> ... </section>
       → fades + slides up when 8 percent of section is in view.
     <element class="fade-up"> ... </element>
       → fades up when 10 percent of element is in view.
       → optional class fade-up-d1, -d2, -d3, -d4 staggers the reveal.

   Reduced-motion users see static content. The animation-play-state pause
   pattern means CSS keyframes never fire if the observer never marks the
   element as in view, which keeps the page accessible without script. */

(function () {
  "use strict";

  if (typeof window === "undefined") return;

  // Respect prefers-reduced-motion: skip all observers, leave static state.
  var prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  if (!("IntersectionObserver" in window)) return;

  function initFadeUp() {
    var fadeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = "running";
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".fade-up").forEach(function (el) {
      el.style.animationPlayState = "paused";
      fadeObserver.observe(el);
    });
  }

  function initSectionReveal() {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("section-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
    );

    document.querySelectorAll(".section-reveal").forEach(function (section) {
      revealObserver.observe(section);
    });
  }

  function init() {
    initFadeUp();
    initSectionReveal();
  }

  // The main page-shell pages mount React after DOMContentLoaded, so we
  // listen for the first React commit by re-running init on a short
  // RAF loop until at least one observer has bound. Two passes covers
  // the React mount window without needing a hook into each page.
  function deferredInit() {
    init();
    var attempts = 0;
    var interval = setInterval(function () {
      attempts += 1;
      var fade = document.querySelectorAll(".fade-up").length;
      var rev = document.querySelectorAll(".section-reveal").length;
      if (fade > 0 || rev > 0 || attempts > 6) {
        init();
        clearInterval(interval);
      }
    }, 200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", deferredInit);
  } else {
    deferredInit();
  }
})();
