/**
 * JPe UNE — main.js
 * Vanilla JS: navigation behaviour, mobile menu, scroll effects, form handling
 */

'use strict';

/* ============================================================
   1. DOM helpers
   ============================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


/* ============================================================
   2. Navigation — sticky scroll shadow + active link
   ============================================================ */
function initNav() {
  const header = $('.site-header');
  if (!header) return;

  // Scroll shadow
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active link based on current page
  const currentPath = window.location.pathname.replace(/\/index\.html$/, '/');
  $$('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPath = new URL(href, window.location.href).pathname.replace(/\/index\.html$/, '/');
    if (currentPath === linkPath || (currentPath.endsWith('/') && linkPath === currentPath)) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}


/* ============================================================
   3. Mobile menu toggle
   ============================================================ */
function initMobileMenu() {
  const toggle = $('.nav__toggle');
  const links  = $('.nav__links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
    toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');

    // Animate hamburger to X
    const bars = $$('span', toggle);
    if (isOpen) {
      bars[0].style.transform = 'translateY(7px) rotate(45deg)';
      bars[1].style.opacity   = '0';
      bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
    }
  });

  // Close on link click (mobile)
  $$('.nav__link', links).forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      const bars = $$('span', toggle);
      bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!header && !toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
    }
  });
}


/* ============================================================
   4. Scroll-reveal (IntersectionObserver)
   ============================================================ */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;

  const targets = $$('[data-reveal]');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach((el, i) => {
    // Staggered delay via CSS var
    el.style.setProperty('--reveal-delay', `${i * 80}ms`);
    observer.observe(el);
  });
}


/* ============================================================
   5. Counter animation (for stats strip)
   ============================================================ */
function animateCounter(el, target, duration = 1600) {
  const start    = performance.now();
  const isFloat  = String(target).includes('.');
  const suffix   = el.dataset.suffix || '';

  const tick = (now) => {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current  = eased * target;

    el.textContent = (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;

    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

function initCounters() {
  const counters = $$('[data-counter]');
  if (!counters.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseFloat(el.dataset.counter);
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}


/* ============================================================
   6. Contact form — client-side validation + submit feedback
   ============================================================ */
function initContactForm() {
  const form = $('#contato-form');
  if (!form) return;

  const showError = (input, msg) => {
    input.classList.add('is-error');
    let hint = input.nextElementSibling;
    if (!hint || !hint.classList.contains('form-hint')) {
      hint = document.createElement('span');
      hint.className = 'form-hint form-hint--error';
      input.after(hint);
    }
    hint.textContent = msg;
  };

  const clearError = (input) => {
    input.classList.remove('is-error');
    const hint = input.nextElementSibling;
    if (hint && hint.classList.contains('form-hint--error')) hint.remove();
  };

  const validateField = (input) => {
    clearError(input);
    const val = input.value.trim();

    if (input.required && !val) {
      showError(input, 'Este campo é obrigatório.');
      return false;
    }

    if (input.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      showError(input, 'Informe um e-mail válido.');
      return false;
    }

    if (input.name === 'telefone' && val && val.replace(/\D/g, '').length < 10) {
      showError(input, 'Informe um telefone com DDD.');
      return false;
    }

    return true;
  };

  // Live validation on blur
  $$('input, select, textarea', form).forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('is-error')) validateField(input);
    });
  });

  // Phone mask (simple)
  const phoneInput = $('[name="telefone"]', form);
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      let v = phoneInput.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 6) {
        v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
      } else if (v.length > 2) {
        v = `(${v.slice(0,2)}) ${v.slice(2)}`;
      }
      phoneInput.value = v;
    });
  }

  // Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fields  = $$('input, select, textarea', form);
    const isValid = fields.map(validateField).every(Boolean);
    if (!isValid) return;

    const btn    = $('[type="submit"]', form);
    const orig   = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';

    try {
      // Replace this with your real backend endpoint
      await new Promise(resolve => setTimeout(resolve, 1200));

      form.innerHTML = `
        <div class="form-success" role="alert">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 12.5l3 3 5-5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h3>Mensagem enviada!</h3>
          <p>Entraremos em contato em breve. Obrigado.</p>
        </div>
      `;
    } catch {
      btn.disabled    = false;
      btn.textContent = orig;
      showError(btn, 'Erro ao enviar. Tente novamente.');
    }
  });
}


/* ============================================================
   7. Smooth scroll for anchor links
   ============================================================ */
function initSmoothScroll() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.getElementById(link.getAttribute('href').slice(1));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}


/* ============================================================
   8. Init
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initContactForm();
  initSmoothScroll();
});
