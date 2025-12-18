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

// NUEVO: Cerrar nav al tocar fuera (solo en móvil)
document.addEventListener('click', (e) => {
  // Solo ejecutar si el nav está abierto
  if (!nav?.classList.contains('open')) return;
  
  // Si el clic fue dentro del nav o en el toggle, no hacer nada
  if (nav.contains(e.target) || toggle.contains(e.target)) return;
  
  // Cerrar nav
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
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
  whatsappBtn.href = 'https://wa.me/+17874695280'; // Reemplaza con tu número (código país + número sin +)
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

/* ===== Parallax para BANDAS (.band) - iOS compatible ===== */
(() => {
  const bands = Array.from(document.querySelectorAll('.band'));
  if (!bands.length) return;
  
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const update = () => {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    bands.forEach(b => {
      const before = b.querySelector('::before') || b;
      const rect = b.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / (rect.height + vh)));
      
      if (isMobile) {
        // En móvil/iOS: mover con CSS custom property
        const moveY = (progress - 0.5) * 80;
        b.style.setProperty('--parallax-y', `${moveY}px`);
      } else {
        // Desktop: background-position normal
        b.style.setProperty('--band-pos', `${Math.round(progress * 100)}%`);
      }
    });
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        update();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  
  window.addEventListener('resize', update);
  update();
})();

/* ===== Parallax SUTIL para BANDAS de astrología (.astro-band) ===== */
(() => {
  const bands = Array.from(document.querySelectorAll('.astro-band'));
  if (!bands.length) return;
  
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const update = () => {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    bands.forEach(b => {
      const rect = b.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / (rect.height + vh)));
      
      if (isMobile) {
        const moveY = (progress - 0.5) * 50;
        b.style.setProperty('--parallax-y', `${moveY}px`);
      } else {
        const subtleProgress = 40 + (progress * 20);
        b.style.setProperty('--astro-band-pos', `${Math.round(subtleProgress)}%`);
      }
    });
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        update();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  
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

/* ============================================
   CARRUSEL DE TESTIMONIOS CON FLECHAS
   ============================================ */
(function initTestimonials() {
  const carousels = Array.from(document.querySelectorAll('.t-carousel'));
  if (!carousels.length) return;

  carousels.forEach(carousel => {
    const track = carousel.querySelector('.t-track');
    const dotsWrap = carousel.querySelector('.t-dots');
    const slides = Array.from(carousel.querySelectorAll('.t-slide'));
    if (!slides.length) return;

    let currentIndex = 0;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    // AGREGAR FLECHAS AL .wrap (contenedor padre)
    const wrapper = carousel.closest('.wrap');
    if (!wrapper) return;
    
    // Verificar que no existan ya las flechas
    let prevBtn = wrapper.querySelector('.t-nav-btn--prev');
    let nextBtn = wrapper.querySelector('.t-nav-btn--next');
    
    if (!prevBtn) {
      prevBtn = document.createElement('button');
      prevBtn.className = 't-nav-btn t-nav-btn--prev';
      prevBtn.setAttribute('aria-label', 'Testimonio anterior');
      prevBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>';
      wrapper.appendChild(prevBtn);
    }
    
    if (!nextBtn) {
      nextBtn = document.createElement('button');
      nextBtn.className = 't-nav-btn t-nav-btn--next';
      nextBtn.setAttribute('aria-label', 'Siguiente testimonio');
      nextBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>';
      wrapper.appendChild(nextBtn);
    }

    function getSlidesPerView() {
      if (window.innerWidth <= 600) return 1;
      if (window.innerWidth <= 900) return 2;
      return 3;
    }

    function getMaxIndex() {
      return Math.max(0, slides.length - getSlidesPerView());
    }

    function updateDots() {
      const groupCount = getMaxIndex() + 1;
      dotsWrap.innerHTML = '';
      for (let i = 0; i < groupCount; i++) {
        const dot = document.createElement('button');
        dot.className = 't-dot';
        dot.setAttribute('aria-label', `Grupo ${i + 1}`);
        dotsWrap.appendChild(dot);
      }
    }

    function updateCarousel(animate = true) {
      const slidesPerView = getSlidesPerView();
      const maxIndex = getMaxIndex();
      currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
      
      const slideWidth = 100 / slidesPerView;
      const offset = -(currentIndex * slideWidth);
      
      track.style.transition = animate ? 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
      track.style.transform = `translateX(${offset}%)`;
      
      const dots = dotsWrap.querySelectorAll('.t-dot');
      dots.forEach((dot, i) => {
        dot.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false');
      });
      
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === getMaxIndex();
      prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
      nextBtn.style.opacity = currentIndex === maxIndex ? '0.3' : '1';
    }

    // Event listeners para las flechas
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel(true);
      }
    });
    
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const maxIndex = getMaxIndex();
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateCarousel(true);
      }
    });

    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      currentX = startX;
      isDragging = true;
      track.style.transition = 'none';
    }, { passive: true });
    
    track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
    }, { passive: true });
    
    track.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      const diff = currentX - startX;
      if (diff > 50 && currentIndex > 0) currentIndex--;
      else if (diff < -50 && currentIndex < getMaxIndex()) currentIndex++;
      updateCarousel(true);
    });

    track.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      currentX = startX;
      isDragging = true;
      track.style.cursor = 'grabbing';
      e.preventDefault();
    });
    
    track.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      currentX = e.clientX;
    });
    
    track.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      track.style.cursor = 'grab';
      const diff = currentX - startX;
      if (diff > 50 && currentIndex > 0) currentIndex--;
      else if (diff < -50 && currentIndex < getMaxIndex()) currentIndex++;
      updateCarousel(true);
    });

    dotsWrap.addEventListener('click', (e) => {
      const dot = e.target.closest('.t-dot');
      if (!dot) return;
      const dots = Array.from(dotsWrap.querySelectorAll('.t-dot'));
      currentIndex = dots.indexOf(dot);
      if (currentIndex >= 0) {
        updateCarousel(true);
      }
    });

    track.tabIndex = 0;
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' && currentIndex < getMaxIndex()) {
        currentIndex++;
        updateCarousel(true);
      }
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        currentIndex--;
        updateCarousel(true);
      }
    });

    window.addEventListener('resize', () => {
      updateDots();
      updateCarousel(false);
    });

    if (window.innerWidth > 768) track.style.cursor = 'grab';
    updateDots();
    updateCarousel(false);
  });
})();

/* ============================================
   HEADER COLOR EN FAQ HERO
   ============================================ */
(function initFaqHeaderColor() {
  const header = document.getElementById('site-header');
  const hero = document.querySelector('.faq-hero');
  
  if (!header || !hero) return;
  
  function updateHeaderColor() {
    const heroBottom = hero.getBoundingClientRect().bottom;
    const headerHeight = header.offsetHeight;
    
    if (heroBottom > headerHeight) {
      header.classList.add('on-dark');
    } else {
      header.classList.remove('on-dark');
    }
  }
  
  window.addEventListener('scroll', updateHeaderColor);
  window.addEventListener('resize', updateHeaderColor);
  updateHeaderColor(); // Ejecutar al cargar
})();
