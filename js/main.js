/* ============================================================
   MAIN.JS — JPe UNE
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     NAVBAR — SHADOW ON SCROLL
     ============================================================ */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ============================================================
     HAMBURGER MENU
     ============================================================ */
  const hamburger = document.querySelector('.navbar__hamburger');
  const mobileMenu = document.querySelector('.navbar__mobile');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on any link click inside mobile menu
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ============================================================
     MOBILE DROPDOWN ACCORDION
     ============================================================ */
  const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown__toggle');
  mobileDropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const sub = toggle.nextElementSibling;
      if (!sub) return;
      const isOpen = toggle.classList.toggle('open');
      sub.classList.toggle('open', isOpen);
    });
  });

  /* ============================================================
     ACTIVE LINK IN NAVBAR
     ============================================================ */
  const currentPath = window.location.pathname;
  document.querySelectorAll('.navbar__links a, .navbar__mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    // Normalize: resolve relative href to absolute
    const resolved = new URL(href, window.location.href).pathname;
    if (
      resolved === currentPath ||
      (resolved.endsWith('index.html') && currentPath === resolved.replace('index.html', '')) ||
      (currentPath.endsWith('/') && resolved === currentPath + 'index.html')
    ) {
      link.classList.add('active');
    }
  });

  /* ============================================================
     INTERSECTION OBSERVER — FADE IN
     ============================================================ */
  const fadeEls = document.querySelectorAll('[data-fade]');
  if (fadeEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    fadeEls.forEach(el => observer.observe(el));
  }

  /* ============================================================
     FAQ ACCORDION
     ============================================================ */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = question.classList.contains('open');
      // Close all
      faqItems.forEach(i => {
        i.querySelector('.faq-question')?.classList.remove('open');
        i.querySelector('.faq-answer')?.classList.remove('open');
      });
      // Toggle current
      if (!isOpen) {
        question.classList.add('open');
        answer.classList.add('open');
      }
    });
  });

  /* ============================================================
     CONTACT FORM VALIDATION
     ============================================================ */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validate = (field) => {
      const group = field.closest('.form-group');
      if (!group) return true;
      let valid = true;

      if (field.required && !field.value.trim()) {
        valid = false;
      }
      if (field.type === 'email' && field.value.trim() && !emailRegex.test(field.value.trim())) {
        valid = false;
      }

      group.classList.toggle('has-error', !valid);
      field.classList.toggle('error', !valid);
      return valid;
    };

    // Live validation on blur
    contactForm.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('blur', () => validate(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('error')) validate(field);
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let allValid = true;

      contactForm.querySelectorAll('input[required], textarea[required]').forEach(field => {
        if (!validate(field)) allValid = false;
      });

      if (allValid) {
        const successMsg = contactForm.querySelector('.form-success');
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Enviando…';
        }
        // Simulate async send
        setTimeout(() => {
          contactForm.reset();
          if (successMsg) successMsg.classList.add('show');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar mensagem';
          }
          setTimeout(() => successMsg?.classList.remove('show'), 6000);
        }, 800);
      }
    });
  }

  /* ============================================================
     DESKTOP DROPDOWN — KEYBOARD ACCESSIBLE
     ============================================================ */
  document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
    const toggle = dropdown.querySelector('.nav-dropdown__toggle');
    const menu = dropdown.querySelector('.nav-dropdown__menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dropdown.classList.toggle('open');
      }
      if (e.key === 'Escape') dropdown.classList.remove('open');
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) dropdown.classList.remove('open');
    });
  });

})();
