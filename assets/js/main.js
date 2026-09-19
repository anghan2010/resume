/**
 * Anghan Mehul — Portfolio interactions
 * Vanilla JS: nav, theme, filters, reveal animations
 */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- Theme ---------- */
  var THEME_KEY = "am-theme";
  var root = document.documentElement;
  var themeToggle = document.getElementById("theme-toggle");

  function getPreferredTheme() {
    var stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
      themeToggle.setAttribute("data-theme-active", theme);
    }
  }

  applyTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next =
        root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }

  /* ---------- Sticky header (rAF-throttled) ---------- */
  var header = document.getElementById("site-header");
  if (header) {
    var headerTicking = false;
    var updateHeader = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
      headerTicking = false;
    };
    updateHeader();
    window.addEventListener(
      "scroll",
      function () {
        if (headerTicking) return;
        headerTicking = true;
        window.requestAnimationFrame(updateHeader);
      },
      { passive: true }
    );
  }

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById("nav-toggle");
  var navMobile = document.getElementById("nav-mobile");

  function closeMobileNav() {
    if (!navToggle || !navMobile) return;
    navToggle.setAttribute("aria-expanded", "false");
    navMobile.classList.remove("is-open");
  }

  if (navToggle && navMobile) {
    navToggle.addEventListener("click", function () {
      var open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      navMobile.classList.toggle("is-open", !open);
    });

    navMobile.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMobileNav);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMobileNav();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 900) closeMobileNav();
    });
  }

  /* ---------- Portfolio filters ---------- */
  var filterBar = document.getElementById("portfolio-filters");
  var projectGrid = document.getElementById("project-grid");
  var emptyState = document.getElementById("project-empty");

  if (filterBar && projectGrid) {
    var buttons = filterBar.querySelectorAll("[data-filter]");
    var cards = projectGrid.querySelectorAll("[data-category]");

    function setFilter(category) {
      buttons.forEach(function (btn) {
        var active = btn.getAttribute("data-filter") === category;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-pressed", String(active));
      });

      var visible = 0;
      cards.forEach(function (card) {
        var match =
          category === "all" ||
          card.getAttribute("data-category") === category;
        card.classList.toggle("is-hidden", !match);
        if (match) visible += 1;
      });

      if (emptyState) {
        emptyState.classList.toggle("is-visible", visible === 0);
      }
    }

    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-filter]");
      if (!btn) return;
      setFilter(btn.getAttribute("data-filter"));
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  if (revealEls.length) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) {
        el.classList.add("is-visible");
      });
    } else {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -5% 0px", threshold: 0.05 }
      );

      revealEls.forEach(function (el) {
        observer.observe(el);
      });
    }
  }
})();
