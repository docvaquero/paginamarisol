"use strict";

/* Asegurar lang inicial si algo quedó vacío */
if (!document.documentElement.lang) document.documentElement.lang = "es";

/* ===== Menú móvil ===== */
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
toggle?.addEventListener('click', () => {
  nav.classList.toggle('open');
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!expanded));
});

/* ===== Dropdown idioma ===== */
const langBtn = document.querySelector('.lang-btn');
const langMenu = document.querySelector('.lang-menu');
langBtn?.addEventListener('click', () => {
  const open = langMenu.classList.toggle('open');
  langBtn.setAttribute('aria-expanded', String(open));
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('.lang')) langMenu?.classList.remove('open');
});

/* ===== i18n simple (ES/EN) ===== */
const I18N_ATTR = 'data-lang';
function setLang(lang){
  // normalizo solo "es" o "en"
  const v = (lang === 'en') ? 'en' : 'es';
  document.documentElement.lang = v;
  try { localStorage.setItem('lang', v); } catch {}
}
document.querySelectorAll('[data-setlang]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    e.preventDefault();
    setLang(a.getAttribute('data-setlang'));
    langMenu?.classList.remove('open');
  });
});
try {
  const saved = localStorage.getItem('lang');
  if (saved === 'en' || saved === 'es') setLang(saved);
} catch {}

/* ===== Acordeón accesible ===== */
(() => {
  const items = Array.from(document.querySelectorAll('.item'));
  items.forEach(item => {
    const btn = item.querySelector('.q');
    const panel = item.querySelector('.a');
    if (!btn || !panel) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      panel.hidden = isOpen;
    });

    // estado inicial
    btn.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
  });
})();
