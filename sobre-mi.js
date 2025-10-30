"use strict";

/* Quitar flag de no-js (para el fallback CSS) */
document.documentElement.classList.remove('no-js');

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
const blocks = Array.from(document.querySelectorAll('.i18n'));

function setLang(lang){
  blocks.forEach(el => {
    const match = el.getAttribute(I18N_ATTR) === lang;
    el.classList.toggle('is-active', match);
  });
  // guardar preferencia y setear <html lang="...">
  try { localStorage.setItem('lang', lang); } catch {}
  document.documentElement.lang = (lang === 'en' ? 'en' : 'es');
}

document.querySelectorAll('[data-setlang]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    e.preventDefault();
    setLang(a.getAttribute('data-setlang'));
    langMenu?.classList.remove('open');
  });
});

// idioma inicial (preferencia previa o ES)
let initial = 'es';
try { initial = localStorage.getItem('lang') || 'es'; } catch {}
setLang(initial);
