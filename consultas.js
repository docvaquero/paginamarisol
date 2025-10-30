// consultas.js
"use strict";

(function () {
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const getParam = (name) => new URLSearchParams(location.search).get(name);

  function normalizeLang(raw) {
    const v = String(raw || "").toLowerCase().trim();
    if (v.startsWith("en")) return "en";
    if (v.startsWith("es")) return "es";
    return "es";
  }

  function setLang(lang) {
    const L = normalizeLang(lang);
    qsa(".i18n").forEach(el => {
      el.style.display = (el.getAttribute("data-lang") === L) ? "" : "none";
    });
    try { localStorage.setItem("lang", L); } catch {}
    document.documentElement.lang = L;
  }

  function getInitialLang() {
    const fromQuery = getParam("lang");
    if (fromQuery) return normalizeLang(fromQuery);
    try {
      const stored = localStorage.getItem("lang");
      if (stored) return normalizeLang(stored);
    } catch {}
    const htmlLang = document.documentElement.getAttribute("lang");
    if (htmlLang) return normalizeLang(htmlLang);
    if (navigator.language) return normalizeLang(navigator.language);
    return "es";
  }

  function wireLanguageControls() {
    qsa("[data-setlang]").forEach(el => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        setLang(el.getAttribute("data-setlang"));
        // cerrar dropdown si existe
        const menu = el.closest(".lang")?.querySelector(".lang-menu");
        menu?.classList.remove("open");
      });
    });

    const langBtn = document.querySelector(".lang-btn");
    const langMenu = document.querySelector(".lang-menu");
    langBtn?.addEventListener("click", () => {
      const open = langMenu.classList.toggle("open");
      langBtn.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".lang")) langMenu?.classList.remove("open");
    });
  }

  function wireMobileNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".site-nav");
    toggle?.addEventListener("click", () => {
      nav?.classList.toggle("open");
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    wireMobileNav();
    wireLanguageControls();
    setLang(getInitialLang());
  });
})();
