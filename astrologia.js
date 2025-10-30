"use strict";

/* Menú móvil */
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
toggle?.addEventListener('click', () => {
  nav.classList.toggle('open');
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!expanded));
});

/* Idiomas */
const langBtn = document.querySelector('.lang-btn');
const langMenu = document.querySelector('.lang-menu');
langBtn?.addEventListener('click', () => {
  const open = langMenu.classList.toggle('open');
  langBtn.setAttribute('aria-expanded', String(open));
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('.lang')) langMenu?.classList.remove('open');
});

function setLang(lang) {
  document.documentElement.lang = (lang === 'en') ? 'en' : 'es';
  try { localStorage.setItem('lang', lang); } catch {}
}
document.querySelectorAll('[data-setlang]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    setLang(a.getAttribute('data-setlang'));
    langMenu?.classList.remove('open');
  });
});

let initial = 'es';
try { initial = localStorage.getItem('lang') || 'es'; } catch {}
setLang(initial);

/* Parallax */
(() => {
  const band = document.querySelector('.astro-band');
  if (!band) return;
  const onScroll = () => {
    const rect = band.getBoundingClientRect();
    const h = window.innerHeight;
    const ratio = Math.min(1, Math.max(0, (h - rect.top) / (rect.height + h)));
    band.style.setProperty('--astro-band-pos', `${Math.round(ratio * 100)}%`);
  };
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();
})();

/* Acordeón */
(() => {
  const items = document.querySelectorAll('.astro-item');
  items.forEach(item => {
    const btn = item.querySelector('.astro-q');
    const panel = item.querySelector('.astro-a');
    if (!btn || !panel) return;
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
    });
  });
})();
