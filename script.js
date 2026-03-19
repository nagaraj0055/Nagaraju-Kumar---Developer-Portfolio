/* ============================================================
   NAGARAJU KUMAR — Premium Developer Portfolio
   Vanilla JavaScript — Animations, Smooth Scrolling, Interactions
   ============================================================ */

(function () {
  'use strict';

  /* ===================== PRELOADER ===================== */
  const preloader = document.getElementById('preloader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
      initAnimations();
    }, 1200);
  });

  // Prevent scroll during load
  document.body.style.overflow = 'hidden';

  /* ===================== CURSOR GLOW (Desktop only) ===================== */
  const cursorGlow = document.getElementById('cursor-glow');
  let cursorX = 0, cursorY = 0;
  let glowX = 0, glowY = 0;

  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
    });

    function animateCursorGlow() {
      glowX += (cursorX - glowX) * 0.08;
      glowY += (cursorY - glowY) * 0.08;
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
      requestAnimationFrame(animateCursorGlow);
    }
    animateCursorGlow();
  }

  /* ===================== NAVIGATION ===================== */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section, .hero-section');

  // Sticky nav on scroll
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }, { passive: true });

  // Hamburger toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Smooth scroll on nav link click
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        smoothScrollTo(target);
      }
      // Close mobile menu
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Active section highlighting
  function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.section === current) {
        link.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ===================== CUSTOM SMOOTH SCROLL ===================== */
  function smoothScrollTo(target) {
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - 80;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const duration = 1000;
    let startTime = null;

    function easeInOutCubic(t) {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function animateScroll(currentTime) {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);

      window.scrollTo(0, startPosition + distance * eased);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    }

    requestAnimationFrame(animateScroll);
  }

  /* ===================== TYPED TEXT EFFECT ===================== */
  const typedElement = document.getElementById('typed-text');
  const typedStrings = [
    'Software Developer',
    'Backend Enthusiast',
    'Problem Solver',
    'CS Student'
  ];
  let stringIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    const currentString = typedStrings[stringIndex];

    if (isDeleting) {
      typedElement.textContent = currentString.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typedElement.textContent = currentString.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentString.length) {
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      stringIndex = (stringIndex + 1) % typedStrings.length;
      typingSpeed = 500;
    }

    setTimeout(typeEffect, typingSpeed);
  }

  /* ===================== SCROLL ANIMATIONS (Intersection Observer) ===================== */
  function initAnimations() {
    // Start typing effect
    typeEffect();

    // Intersection Observer for scroll animations
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay) || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          // Animate skill bars when visible
          if (entry.target.classList.contains('skill-category')) {
            const bars = entry.target.querySelectorAll('.skill-bar-fill');
            bars.forEach((bar, i) => {
              setTimeout(() => {
                bar.style.width = bar.dataset.width + '%';
              }, delay + (i * 150));
            });
          }

          // Animate stat counters when visible
          if (entry.target.closest('.hero-stats')) {
            animateCounters();
          }

          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  /* ===================== COUNTER ANIMATION ===================== */
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    document.querySelectorAll('.stat-number').forEach(counter => {
      const target = parseInt(counter.dataset.count);
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        counter.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  /* ===================== PARTICLES ===================== */
  const particlesContainer = document.getElementById('particles');

  function createParticles() {
    const count = window.innerWidth < 768 ? 20 : 40;
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.width = (Math.random() * 3 + 1) + 'px';
      particle.style.height = particle.style.width;
      particle.style.animationDuration = (Math.random() * 4 + 3) + 's';
      particle.style.animationDelay = (Math.random() * 4) + 's';
      particle.style.opacity = 0;

      // Random accent color
      const colors = ['#6c63ff', '#a855f7', '#06b6d4'];
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];

      particlesContainer.appendChild(particle);
    }
  }
  createParticles();

  /* ===================== CONTACT FORM ===================== */
  const contactForm = document.getElementById('contact-form');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('form-submit');
    const originalText = submitBtn.innerHTML;

    // Simulate sending
    submitBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin">
        <line x1="12" y1="2" x2="12" y2="6"/>
        <line x1="12" y1="18" x2="12" y2="22"/>
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
        <line x1="2" y1="12" x2="6" y2="12"/>
        <line x1="18" y1="12" x2="22" y2="12"/>
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
      </svg>
      Sending...
    `;
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    setTimeout(() => {
      submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Message Sent!
      `;
      submitBtn.style.opacity = '1';
      submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
        contactForm.reset();
      }, 3000);
    }, 1500);
  });

  /* ===================== SMOOTH PARALLAX ON HERO ===================== */
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroContent = document.querySelector('.hero-content');
    const orbs = document.querySelectorAll('.gradient-orb');

    if (scrollY < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
      heroContent.style.opacity = 1 - scrollY / (window.innerHeight * 0.8);

      orbs.forEach((orb, i) => {
        const speed = (i + 1) * 0.1;
        orb.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }
  }, { passive: true });

  /* ===================== BUTTON RIPPLE EFFECT ===================== */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: translate(-50%, -50%);
        left: ${x}px;
        top: ${y}px;
        animation: btnRipple 0.6s ease-out forwards;
        pointer-events: none;
      `;

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple keyframes dynamically
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes btnRipple {
      to {
        width: 300px;
        height: 300px;
        opacity: 0;
      }
    }
    .spin {
      animation: spinAnim 1s linear infinite;
    }
    @keyframes spinAnim {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(rippleStyle);

  /* ===================== TILT EFFECT ON PROJECT CARDS ===================== */
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.project-card-inner').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        card.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
      });
    });
  }

  /* ===================== FORM INPUT ANIMATIONS ===================== */
  document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
    });
  });

  /* ===================== NAVBAR LINK — HERO SCROLL ===================== */
  document.querySelector('.nav-logo').addEventListener('click', (e) => {
    e.preventDefault();
    smoothScrollTo(document.getElementById('home'));
  });

  /* ===================== HERO BUTTON SMOOTH SCROLL ===================== */
  document.querySelectorAll('.hero-buttons a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        smoothScrollTo(target);
      }
    });
  });

})();
