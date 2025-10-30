"use strict";

/* Menú móvil (respeta tu patrón global) */
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
toggle?.addEventListener('click', () => {
  nav.classList.toggle('open');
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!expanded));
});

/* Idioma: mismo mecanismo ES/EN */
if (!document.documentElement.lang) document.documentElement.lang = 'es';

const langBtn = document.querySelector('.lang-btn');
const langMenu = document.querySelector('.lang-menu');

langBtn?.addEventListener('click', ()=>{
  const open = langMenu.classList.toggle('open');
  langBtn.setAttribute('aria-expanded', String(open));
});
document.addEventListener('click', e=>{
  if(!e.target.closest('.lang')) langMenu?.classList.remove('open');
});

function setLang(lang){
  const L = (lang === 'en') ? 'en' : 'es';
  document.documentElement.lang = L;
  try{ localStorage.setItem('lang', L); }catch{}
}
document.querySelectorAll('[data-setlang]').forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    setLang(a.getAttribute('data-setlang'));
    langMenu?.classList.remove('open');
  });
});
setLang(localStorage.getItem('lang') || 'es');

/* Envío real del formulario */
const form = document.getElementById('form-contacto');
const msg = document.getElementById('form-msg');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.textContent = 'Enviando...';

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form)
    });
    const data = await res.json();

    if (data.ok) {
      msg.textContent = data.msg || '¡Gracias! Tu mensaje fue enviado.';
      form.reset();
    } else {
      msg.textContent = data.msg || 'No se pudo enviar. Probá de nuevo.';
    }
  } catch (err) {
    msg.textContent = 'Error de conexión. Intentá otra vez.';
  }
});
