"use strict";

// === Menú móvil ===
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
toggle?.addEventListener('click', () => {
  nav.classList.toggle('open');
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!expanded));
});

// === Header claro/oscuro según hero ===
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

// === Dropdown idioma ===
const langBtn = document.querySelector('.lang-btn');
const langMenu = document.querySelector('.lang-menu');
langBtn?.addEventListener('click', () => {
  const open = langMenu.classList.toggle('open');
  langBtn.setAttribute('aria-expanded', String(open));
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('.lang')) langMenu?.classList.remove('open');
});

// === “Foto ventana” parallax ===
(() => {
  const win = document.querySelector('.awareness .window');
  if (!win) return;
  const onScroll = () => {
    const rect = win.getBoundingClientRect();
    const h = window.innerHeight || document.documentElement.clientHeight;
    const ratio = Math.min(1, Math.max(0, (h - rect.top) / (rect.height + h)));
    win.style.backgroundPosition = `50% ${Math.round(ratio * 100)}%`;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// === Carrusel testimonios (7 items) ===
(() => {
  const carousel = document.querySelector('.t-carousel');
  const track = document.getElementById('t-track');
  const dots = Array.from(document.querySelectorAll('.t-dot'));
  if (!carousel || !track || dots.length === 0) return;

  const slides = Array.from(track.children);
  let current = 0;
  let timer;

  function slideWidth() {
    // ancho visible del carrusel (no del track)
    return carousel.getBoundingClientRect().width;
  }

  function update(index) {
    current = (index + slides.length) % slides.length;
    const x = -current * slideWidth();
    track.style.transform = `translateX(${x}px)`;
    dots.forEach((d, i) =>
      d.setAttribute('aria-selected', i === current ? 'true' : 'false')
    );
  }

  function play() {
    clearInterval(timer);
    timer = setInterval(() => update(current + 1), 6000);
  }

  dots.forEach((dot, i) =>
    dot.addEventListener('click', () => { update(i); play(); })
  );

  // Inicial
  update(0); play();

  // Mantener posición al redimensionar
  window.addEventListener('resize', () => update(current));
})();
