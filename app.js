"use strict";

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

/* ===== Parallax para BANDAS (.band) ===== */
(() => {
  const bands = document.querySelectorAll('.band');
  if (!bands.length) return;

  const onScroll = () => {
    bands.forEach(b => {
      const rect = b.getBoundingClientRect();
      const h = window.innerHeight || document.documentElement.clientHeight;
      const ratio = Math.min(1, Math.max(0, (h - rect.top) / (rect.height + h)));
      // mueve el fondo del ::before con variable CSS
      b.style.setProperty('--band-pos', `${Math.round(ratio * 100)}%`);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ===== Carrusel de testimonios (autoplay + dots) ===== */
(() => {
  const carousel = document.querySelector('.t-carousel');
  const track = document.getElementById('t-track');
  const dots = Array.from(document.querySelectorAll('.t-dot'));
  if (!carousel || !track || !dots.length) return;

  const slides = Array.from(track.children);
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

  dots.forEach((dot, i) =>
    dot.addEventListener('click', () => { go(i); play(); })
  );

  // Accesibilidad con teclado
  track.tabIndex = 0;
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { go(current + 1); play(); }
    if (e.key === 'ArrowLeft')  { go(current - 1); play(); }
  });

  // init
  go(0);
  play();

  // mantener posición al redimensionar
  window.addEventListener('resize', () => go(current));
})();
