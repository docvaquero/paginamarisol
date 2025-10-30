"use strict";

/* Quitar flag de no-js para el fallback CSS */
document.documentElement.classList.remove('no-js');

/* ===== Menú móvil ===== */
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
toggle?.addEventListener('click', () => {
  nav.classList.toggle('open');
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!expanded));
});

/* ===== Header claro/oscuro según hero ===== */
const header = document.getElementById('site-header');
const hero = document.getElementById('hero');
if (header && hero) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach(e =>
      e.isIntersecting
        ? header.classList.add('on-dark')
        : header.classList.remove('on-dark')
    ),
    { rootMargin: '-40% 0px -50% 0px' }
  );
  io.observe(hero);
}

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

/* ===== i18n ES/EN ===== */
const I18N_ATTR = 'data-lang';
const blocks = Array.from(document.querySelectorAll('.i18n'));

function setLang(lang){
  blocks.forEach(el => {
    const match = el.getAttribute(I18N_ATTR) === lang;
    el.classList.toggle('is-active', match);
  });
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

let initial = 'es';
try { initial = localStorage.getItem('lang') || 'es'; } catch {}
setLang(initial);

/* ===== Parallax para BANDAS (.band) ===== */
(() => {
  const bands = document.querySelectorAll('.band');
  if (!bands.length) return;

  const onScroll = () => {
    bands.forEach(b => {
      const rect = b.getBoundingClientRect();
      const h = window.innerHeight || document.documentElement.clientHeight;
      const ratio = Math.min(1, Math.max(0, (h - rect.top) / (rect.height + h)));
      b.style.setProperty('--band-pos', `${Math.round(ratio * 100)}%`);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ===== WhatsApp floating button (insertado dinámicamente en todas las páginas) =====
   Reemplaza el número en la constante `phone` por tu número en formato internacional sin +
   Ejemplo: Argentina (sin +): 5491123456789 */
(() => {
  const phone = '549000000000'; // <- REEMPLAZA con tu número (ej: 5491123456789)
  if (!phone || phone.indexOf('X') !== -1) return; // no insertar si es placeholder
  const text = encodeURIComponent('Hola, quisiera más información');
  const href = `https://wa.me/${phone}?text=${text}`;
  if (document.querySelector('.whatsapp-fab')) return;
  const a = document.createElement('a');
  a.href = href;
  a.target = '_blank';
  a.rel = 'noopener';
  a.className = 'whatsapp-fab';
  a.setAttribute('aria-label', 'Enviar mensaje por WhatsApp');
  a.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12.04 2C6.48 2 2 6.48 2 12.04c0 2.12.62 4.08 1.69 5.73L2.5 22l4.39-1.15A9.94 9.94 0 0 0 12.04 22c5.56 0 10.04-4.48 10.04-9.96C22.08 6.48 17.6 2 12.04 2zm5.48 14.37c-.3.84-1.74 1.6-2.43 1.7-.66.1-1.46.14-3.17-.64-2.33-1.06-3.83-3.18-4.04-3.43-.21-.25-1.66-1.98-1.66-3.78 0-1.8 1.05-2.62 1.42-2.98.37-.36.83-.36 1.12-.36.3 0 .63 0 .96 0 .32 0 .83-.13 1.28.98.44 1.11 1.46 3.89 1.59 4.17.13.28.21.62.02.99-.19.36-.45.6-.83.98-.36.37-.76.82-1.02 1.13-.26.31-.43.44-.69.63-.26.2-.53.37-.8.49-.27.11-.61.19-.92.19-.31 0-.7-.07-.99-.24-.29-.17-.93-.67-1.2-.9-.27-.23-1.03-.95-1.48-1.8-.45-.85-.62-1.72-.56-2.04.06-.32.26-.47.57-.72.3-.25.66-.44 1.04-.36.38.09.88.35 1.35.9.47.55 1.15 1.37 1.77 2.06.62.69 1.32 1.33 1.9 1.68.58.35 1.26.59 1.82.66.56.07 1.22-.02 1.78-.24.56-.22 1.6-.79 1.86-1.07.26-.27.26-.45.16-.73-.1-.28-.81-.64-1.11-.76-.3-.12-.5-.18-.55-.31-.06-.13.01-.35.19-.59.18-.24.47-.57.64-.77.18-.2.24-.37.25-.54.01-.16-.06-.33-.25-.53z"/></svg>';
  document.body.appendChild(a);
})();

/* ===== Carrusel de testimonios (multi-instancia, ES & EN) ===== */
(() => {
  const carousels = Array.from(document.querySelectorAll('.t-carousel'));
  if (!carousels.length) return;

  const setup = (carousel) => {
    const track = carousel.querySelector('.t-track');
    const dotsWrap = carousel.querySelector('.t-dots');
    const slides = Array.from(track.children);
    if (!slides.length) return;

    // Crear dots dinámicamente
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.className = 't-dot';
      b.setAttribute('aria-label', `Slide ${i+1}`);
      dotsWrap.appendChild(b);
    });

    const dots = Array.from(dotsWrap.querySelectorAll('.t-dot'));
    let current = 0;
    let timer = null;

    const slideWidth = () => carousel.getBoundingClientRect().width;

    function go(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(${-current * slideWidth()}px)`;
      dots.forEach((d, i) =>
        d.setAttribute('aria-selected', i === current ? 'true' : 'false')
      );
    }

    function play() {
      clearInterval(timer);
      timer = setInterval(() => go(current + 1), 6000);
    }

    dots.forEach((dot, i) => dot.addEventListener('click', () => { go(i); play(); }));

    // Accesibilidad con teclado
    track.tabIndex = 0;
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { go(current + 1); play(); }
      if (e.key === 'ArrowLeft')  { go(current - 1); play(); }
    });

    // init + mantener posición al redimensionar
    go(0); play();
    window.addEventListener('resize', () => go(current));
  };

  carousels.forEach(setup);
})();
