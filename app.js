"use strict";

/* Quitar flag de no-js para el fallback CSS */
document.documentElement.classList.remove('no-js');

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

/* ===== Botón flotante de WhatsApp ===== */
(() => {
  const whatsappBtn = document.createElement('a');
  whatsappBtn.href = 'https://wa.me/5491162039502'; // Reemplaza con tu número (código país + número sin +)
  whatsappBtn.target = '_blank';
  whatsappBtn.rel = 'noopener noreferrer';
  whatsappBtn.className = 'whatsapp-float';
  whatsappBtn.setAttribute('aria-label', 'Contactar por WhatsApp');
  
  const img = document.createElement('img');
  img.src = 'logo-blanco-whatsapp.png';
  img.alt = 'WhatsApp';
  
  whatsappBtn.appendChild(img);
  document.body.appendChild(whatsappBtn);
})();

/* ===== i18n MEJORADO (compatible con ambos métodos) ===== */
const I18N_ATTR = 'data-lang';

function normalizeLang(raw) {
  const v = String(raw || "").toLowerCase().trim();
  if (v.startsWith("en")) return "en";
  if (v.startsWith("es")) return "es";
  return "es";
}

function getParam(name) {
  return new URLSearchParams(location.search).get(name);
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

function updateLangUI(lang){
  document.querySelectorAll('.lang-btn .lang-flag, .lang-menu .lang-flag').forEach(n => n.remove());

  const cleanFlagsInText = (el) => {
    if (!el) return;
    el.childNodes.forEach(n => {
      if (n.nodeType === Node.TEXT_NODE) {
        n.textContent = n.textContent.replace(/[\u{1F1E6}-\u{1F1FF}]{2}/gu, '').trim();
      }
    });
  };
  cleanFlagsInText(document.querySelector('.lang-btn'));
  cleanFlagsInText(document.querySelector('.lang-menu [data-setlang="es"]'));
  cleanFlagsInText(document.querySelector('.lang-menu [data-setlang="en"]'));

  const addFlag = (selector, code) => {
    const el = document.querySelector(selector);
    if (!el) return;
    const span = document.createElement('span');
    span.className = 'lang-flag';
    span.textContent = code === 'es' ? '🇪🇸' : '🇺🇸';
    el.appendChild(span);
  };
  addFlag('.lang-menu [data-setlang="es"]', 'es');
  addFlag('.lang-menu [data-setlang="en"]', 'en');
}

function setLang(lang){
  const L = normalizeLang(lang);
  
  // Método 1: usando clases (index, astrología)
  document.querySelectorAll('.i18n').forEach(el => {
    const match = el.getAttribute(I18N_ATTR) === L;
    el.classList.toggle('is-active', match);
  });
  
  // Método 2: usando display (relaciones, hijos, viajes)
  document.querySelectorAll('.i18n').forEach(el => {
    el.style.display = (el.getAttribute(I18N_ATTR) === L) ? "" : "none";
  });
  
  try { localStorage.setItem('lang', L); } catch {}
  document.documentElement.lang = L;
  updateLangUI(L);
}

document.querySelectorAll('[data-setlang]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    setLang(a.getAttribute('data-setlang'));
    document.querySelector('.lang-menu')?.classList.remove('open');
  });
});

let initialLang = getInitialLang();
setLang(initialLang);

/* ===== Desplegable "Servicios" (nav) ===== */
(function(){
  const closeAll = (except) => {
    document.querySelectorAll('.site-nav .nav-item.open').forEach(n => {
      if (except && n === except) return;
      n.classList.remove('open');
      n.querySelector('.nav-services-btn')?.setAttribute('aria-expanded','false');
    });
  };

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.nav-services-btn');
    if (btn) {
      e.preventDefault();
      const item = btn.closest('.nav-item');
      const isOpen = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) closeAll(item);
      return;
    }
    if (!e.target.closest('.site-nav .nav-item')) closeAll();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });
})();

/* ===== Parallax para BANDAS (.band) ===== */
(() => {
  const bands = Array.from(document.querySelectorAll('.band'));
  if (!bands.length) return;

  const update = () => {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    bands.forEach(b => {
      const rect = b.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / (rect.height + vh)));
      b.style.setProperty('--band-pos', `${Math.round(progress * 100)}%`);
    });
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

/* ===== Parallax SUTIL para BANDAS de astrología (.astro-band) ===== */
(() => {
  const bands = Array.from(document.querySelectorAll('.astro-band'));
  if (!bands.length) return;

  const update = () => {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    bands.forEach(b => {
      const rect = b.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / (rect.height + vh)));
      const subtleProgress = 40 + (progress * 20);
      b.style.setProperty('--astro-band-pos', `${Math.round(subtleProgress)}%`);
    });
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

/* ===== Dropdown idioma (con captura prioritaria) ===== */
(function(){
  const closeAllLang = () => {
    document.querySelectorAll('.lang-menu.open').forEach(m => {
      m.classList.remove('open');
    });
    document.querySelectorAll('.lang-btn').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
    });
  };

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.lang-btn');
    
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      const parent = btn.parentElement;
      const menu = parent?.querySelector('.lang-menu');
      
      if (!menu) return;
      
      document.querySelectorAll('.lang-menu').forEach(m => {
        if (m !== menu) {
          m.classList.remove('open');
        }
      });
      
      document.querySelectorAll('.lang-btn').forEach(b => {
        if (b !== btn) {
          b.setAttribute('aria-expanded', 'false');
        }
      });
      
      const isOpen = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
      
      return false;
    }
    
    if (!e.target.closest('.lang-menu') && !e.target.closest('.lang-btn')) {
      closeAllLang();
    }
  }, true);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllLang();
  });
})();

/* ===== Acordeón de Astrología ===== */
(() => {
  const items = document.querySelectorAll('.astro-item');
  if (!items.length) return;
  
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

/* ===== Acordeón de FAQs (.q / .a) ===== */
(() => {
  const questions = document.querySelectorAll('.q');
  if (!questions.length) return;
  
  questions.forEach(function(button) {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const answer = this.nextElementSibling;
      const icon = this.querySelector('.icon');
      const isOpen = answer.style.display === 'block';
      
      document.querySelectorAll('.a').forEach(a => {
        a.style.display = 'none';
      });
      document.querySelectorAll('.icon').forEach(i => {
        i.textContent = '+';
      });
      document.querySelectorAll('.q').forEach(q => {
        q.setAttribute('aria-expanded', 'false');
      });
      
      if (!isOpen) {
        answer.style.display = 'block';
        icon.textContent = '−';
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });
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

    const getSlidesPerView = () => {
      if (window.innerWidth <= 600) return 1;
      if (window.innerWidth <= 900) return 2;
      return 3;
    };

    const getGroupCount = () => Math.ceil(slides.length / getSlidesPerView());

    const updateDots = () => {
      const groupCount = getGroupCount();
      dotsWrap.innerHTML = '';
      for (let i = 0; i < groupCount; i++) {
        const b = document.createElement('button');
        b.className = 't-dot';
        b.setAttribute('aria-label', `Grupo ${i+1}`);
        dotsWrap.appendChild(b);
      }
    };

    updateDots();
    let current = 0;
    let timer = null;

    const slideWidth = () => carousel.getBoundingClientRect().width;

    function go(groupIndex) {
      const groupCount = getGroupCount();
      current = ((groupIndex % groupCount) + groupCount) % groupCount;
      track.style.transform = `translateX(${-current * slideWidth()}px)`;
      const dots = dotsWrap.querySelectorAll('.t-dot');
      dots.forEach((d, i) =>
        d.setAttribute('aria-selected', i === current ? 'true' : 'false')
      );
    }

    function play() {
      clearInterval(timer);
      timer = setInterval(() => go(current + 1), 18000);
    }

    dotsWrap.addEventListener('click', (e) => {
      const dot = e.target.closest('.t-dot');
      if (!dot) return;
      const dots = Array.from(dotsWrap.querySelectorAll('.t-dot'));
      const i = dots.indexOf(dot);
      if (i >= 0) { go(i); play(); }
    });

    track.tabIndex = 0;
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { go(current + 1); play(); }
      if (e.key === 'ArrowLeft')  { go(current - 1); play(); }
    });

    window.addEventListener('resize', () => {
      updateDots();
      go(current);
    });

    go(0); play();
  };

  carousels.forEach(setup);
})();

/* ============================================
   TESTIMONIOS - SWIPE EN MÓVIL
   ============================================ */
(function initTestimonialSwipe() {
  const track = document.querySelector('.t-track');
  const slides = document.querySelectorAll('.t-slide');
  const dots = document.querySelectorAll('.t-dot');
  
  if (!track || slides.length === 0) return;
  
  let currentIndex = 0;
  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  
  // Calcular cuántos slides mostrar según el ancho de pantalla
  function getSlidesPerView() {
    const width = window.innerWidth;
    if (width <= 600) return 1;
    if (width <= 900) return 2;
    return 3;
  }
  
  function updateCarousel() {
    const slidesPerView = getSlidesPerView();
    const maxIndex = Math.max(0, slides.length - slidesPerView);
    currentIndex = Math.min(currentIndex, maxIndex);
    
    const slideWidth = 100 / slidesPerView;
    const offset = -(currentIndex * slideWidth);
    track.style.transform = `translateX(${offset}%)`;
    
    // Actualizar dots
    dots.forEach((dot, i) => {
      dot.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false');
    });
  }
  
  // Touch events
  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    track.style.transition = 'none';
  });
  
  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    const slidesPerView = getSlidesPerView();
    const slideWidth = track.offsetWidth / slidesPerView;
    const offset = -(currentIndex * slideWidth) + diff;
    track.style.transform = `translateX(${offset}px)`;
  });
  
  track.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = 'transform 0.5s ease';
    
    const diff = currentX - startX;
    const threshold = 50; // mínimo de píxeles para cambiar
    
    if (diff > threshold && currentIndex > 0) {
      currentIndex--;
    } else if (diff < -threshold) {
      const slidesPerView = getSlidesPerView();
      const maxIndex = Math.max(0, slides.length - slidesPerView);
      if (currentIndex < maxIndex) {
        currentIndex++;
      }
    }
    
    updateCarousel();
  });
  
  // Mouse events (para desktop también)
  track.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    isDragging = true;
    track.style.transition = 'none';
    track.style.cursor = 'grabbing';
  });
  
  track.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    currentX = e.clientX;
    const diff = currentX - startX;
    const slidesPerView = getSlidesPerView();
    const slideWidth = track.offsetWidth / slidesPerView;
    const offset = -(currentIndex * slideWidth) + diff;
    track.style.transform = `translateX(${offset}px)`;
  });
  
  track.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = 'transform 0.5s ease';
    track.style.cursor = 'grab';
    
    const diff = currentX - startX;
    const threshold = 50;
    
    if (diff > threshold && currentIndex > 0) {
      currentIndex--;
    } else if (diff < -threshold) {
      const slidesPerView = getSlidesPerView();
      const maxIndex = Math.max(0, slides.length - slidesPerView);
      if (currentIndex < maxIndex) {
        currentIndex++;
      }
    }
    
    updateCarousel();
  });
  
  track.addEventListener('mouseleave', () => {
    if (isDragging) {
      isDragging = false;
      track.style.transition = 'transform 0.5s ease';
      track.style.cursor = 'grab';
      updateCarousel();
    }
  });
  
  // Clicks en dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentIndex = index;
      updateCarousel();
    });
  });
  
  // Actualizar en resize
  window.addEventListener('resize', updateCarousel);
  
  // Cursor grab en desktop
  track.style.cursor = 'grab';
  
  // Inicializar
  updateCarousel();
})();
