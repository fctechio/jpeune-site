/**
 * JPe UNE — main.js
 * Vanilla JS: navigation (scroll shadow, active link, dropdown, mobile menu),
 * scroll-reveal, counter animation, contact form validation.
 */

'use strict';

/* ============================================================
   1. DOM helpers
   ============================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/** Resolve a relative href to an absolute pathname. */
const resolvePath = (href) => {
  try { return new URL(href, window.location.href).pathname; }
  catch { return null; }
};

/** Strip trailing /index.html and normalise slashes for comparison. */
const normalizePath = (p) => p.replace(/\/index\.html$/, '/').replace(/([^/])$/, '$1');


/* ============================================================
   2. Navigation — scroll shadow + active link detection
   ============================================================ */
function initNav() {
  const header = $('.site-header');
  if (!header) return;

  /* Scroll shadow */
  const updateShadow = () => header.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', updateShadow, { passive: true });
  updateShadow();

  /* Active link detection */
  const current = normalizePath(window.location.pathname);

  /* Regular nav links (non-dropdown) */
  $$('.nav__link[href]').forEach(link => {
    const target = resolvePath(link.getAttribute('href'));
    if (!target) return;
    if (normalizePath(target) === current) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  /* Dropdown sub-links */
  $$('.nav__dropdown-link').forEach(link => {
    const target = resolvePath(link.getAttribute('href'));
    if (!target) return;
    if (normalizePath(target) === current) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
      /* Also mark the parent trigger as active */
      const trigger = link.closest('.nav__item--dropdown')
        && $('.nav__dropdown-trigger', link.closest('.nav__item--dropdown'));
      if (trigger) trigger.classList.add('active');
    }
  });

  /* Also mark "Serviços" trigger active when on any /servicos/* page */
  const trigger = $('.nav__dropdown-trigger');
  if (trigger && window.location.pathname.includes('/servicos') && !trigger.classList.contains('active')) {
    trigger.classList.add('active');
  }
}


/* ============================================================
   3. Dropdown — desktop hover + keyboard + close on outside click
   ============================================================ */
function initDropdown() {
  const MOBILE_BP = 900; // must match CSS breakpoint

  $$('.nav__item--dropdown').forEach(item => {
    const trigger  = $('.nav__dropdown-trigger', item);
    const dropdown = $('.nav__dropdown', item);
    if (!trigger || !dropdown) return;

    let closeTimer = null;

    const openDropdown = () => {
      clearTimeout(closeTimer);
      item.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    };

    const closeDropdown = (immediate = false) => {
      if (immediate) {
        item.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        closeTimer = setTimeout(() => {
          item.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
        }, 120);
      }
    };

    /* Desktop: hover */
    item.addEventListener('mouseenter', () => {
      if (window.innerWidth > MOBILE_BP) openDropdown();
    });
    item.addEventListener('mouseleave', () => {
      if (window.innerWidth > MOBILE_BP) closeDropdown();
    });

    /* Mobile: click to toggle accordion (handled here AND in initMobileMenu) */
    trigger.addEventListener('click', () => {
      if (window.innerWidth <= MOBILE_BP) {
        const isOpen = item.classList.toggle('open');
        trigger.setAttribute('aria-expanded', isOpen);
      }
    });

    /* Keyboard: Escape closes dropdown and returns focus to trigger */
    item.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeDropdown(true);
        trigger.focus();
      }
    });

    /* Keep open while focus moves inside the dropdown */
    dropdown.addEventListener('focusin', () => clearTimeout(closeTimer));
    dropdown.addEventListener('focusout', e => {
      if (!item.contains(e.relatedTarget)) closeDropdown(true);
    });
  });

  /* Close any open dropdown when clicking outside */
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav__item--dropdown')) {
      $$('.nav__item--dropdown.open').forEach(item => {
        item.classList.remove('open');
        const t = $('.nav__dropdown-trigger', item);
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }
  });
}


/* ============================================================
   4. Mobile menu — hamburger toggle
   ============================================================ */
function initMobileMenu() {
  const toggle   = $('.nav__toggle');
  const navLinks = $('.nav__links');
  if (!toggle || !navLinks) return;

  const bars = () => $$('span', toggle);

  const closeMenu = () => {
    navLinks.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
    bars().forEach(b => { b.style.transform = ''; b.style.opacity = ''; });

    /* Also collapse any open accordion dropdowns */
    $$('.nav__item--dropdown.open', navLinks).forEach(item => {
      item.classList.remove('open');
      const t = $('.nav__dropdown-trigger', item);
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  };

  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
    toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');

    if (isOpen) {
      bars()[0].style.transform = 'translateY(7px) rotate(45deg)';
      bars()[1].style.opacity   = '0';
      bars()[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      bars().forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
      $$('.nav__item--dropdown.open', navLinks).forEach(item => {
        item.classList.remove('open');
        const t = $('.nav__dropdown-trigger', item);
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }
  });

  /* Close when a final destination link is clicked */
  $$('a.nav__link, .nav__dropdown-link', navLinks).forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* Close on outside click */
  document.addEventListener('click', e => {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !toggle.contains(e.target)) {
      closeMenu();
    }
  });
}


/* ============================================================
   5. Scroll-reveal (IntersectionObserver)
   ============================================================ */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;
  const targets = $$('[data-reveal]');
  if (!targets.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach((el, i) => {
    el.style.setProperty('--reveal-delay', `${i * 80}ms`);
    observer.observe(el);
  });
}


/* ============================================================
   6. Counter animation (stats strip)
   ============================================================ */
function animateCounter(el, target, duration = 1600) {
  const start   = performance.now();
  const isFloat = String(target).includes('.');
  const suffix  = el.dataset.suffix || '';

  const tick = now => {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = (isFloat ? (eased * target).toFixed(1) : Math.floor(eased * target)) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function initCounters() {
  const counters = $$('[data-counter]');
  if (!counters.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target, parseFloat(entry.target.dataset.counter));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}


/* ============================================================
   7. Contact form — validation + phone mask + success state
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

  const clearError = input => {
    input.classList.remove('is-error');
    const hint = input.nextElementSibling;
    if (hint && hint.classList.contains('form-hint--error')) hint.remove();
  };

  const validateField = input => {
    clearError(input);
    const val = input.value.trim();
    if (input.required && !val)
      return showError(input, 'Este campo é obrigatório.'), false;
    if (input.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
      return showError(input, 'Informe um e-mail válido.'), false;
    if (input.name === 'telefone' && val && val.replace(/\D/g, '').length < 10)
      return showError(input, 'Informe um telefone com DDD.'), false;
    return true;
  };

  $$('input, select, textarea', form).forEach(input => {
    input.addEventListener('blur',  () => validateField(input));
    input.addEventListener('input', () => { if (input.classList.contains('is-error')) validateField(input); });
  });

  /* Phone mask */
  const phone = $('[name="telefone"]', form);
  if (phone) {
    phone.addEventListener('input', () => {
      let v = phone.value.replace(/\D/g, '').slice(0, 11);
      if      (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
      else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
      phone.value = v;
    });
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const isValid = $$('input, select, textarea', form).map(validateField).every(Boolean);
    if (!isValid) return;

    const btn  = $('[type="submit"]', form);
    const orig = btn.textContent;
    btn.disabled    = true;
    btn.textContent = 'Enviando…';

    try {
      await new Promise(resolve => setTimeout(resolve, 1200)); /* replace with real endpoint */
      form.innerHTML = `
        <div class="form-success" role="alert">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 12.5l3 3 5-5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h3>Mensagem enviada!</h3>
          <p>Entraremos em contato em breve. Obrigado.</p>
        </div>`;
    } catch {
      btn.disabled    = false;
      btn.textContent = orig;
    }
  });
}


/* ============================================================
   8. Smooth scroll for on-page anchors
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
   9. Footer year
   ============================================================ */
function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}


/* ============================================================
   10. Init
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initDropdown();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initContactForm();
  initSmoothScroll();
  initFooterYear();
});
