/* ================================================
   NAVA PEACE WORLD 2026 — Main JavaScript
   Smooth animations, reading windows, navigation
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initReadingWindows();
  initParticles();
  initActiveNav();
  initJoinForm();
  initLangBanner();
  initVideoSound();
  I18N.init();
});

/* ---------- Floating Language Banner (auto-hide) ---------- */
function initLangBanner() {
  const banner = document.getElementById('langBanner');
  if (!banner) return;

  // Auto-hide after 8 seconds
  setTimeout(() => {
    banner.classList.add('hidden');
  }, 8000);
}

/* ---------- Video Sound (autoplay with sound, fallback to muted) ---------- */
function initVideoSound() {
  const video = document.querySelector('.hero-video');
  if (!video) return;

  // Try to play with sound
  video.muted = false;
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Browser blocked unmuted autoplay — fallback to muted
      video.muted = true;
      video.play();
    });
  }

  // Add sound toggle button
  const wrapper = video.closest('.video-wrapper');
  if (!wrapper) return;

  const btn = document.createElement('button');
  btn.className = 'video-sound-btn';
  btn.innerHTML = video.muted ? '🔇' : '🔊';
  btn.setAttribute('aria-label', 'Toggle sound');
  wrapper.appendChild(btn);

  btn.addEventListener('click', () => {
    video.muted = !video.muted;
    btn.innerHTML = video.muted ? '🔇' : '🔊';
  });

  // Update button if muted state changes
  video.addEventListener('volumechange', () => {
    btn.innerHTML = video.muted ? '🔇' : '🔊';
  });
}

/* ---- NAVBAR ---- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Mobile toggle
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.classList.toggle('active');
  });

  // Close menu on link click
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('active');
    });
  });
}

/* ---- SCROLL ANIMATIONS ---- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ---- READING WINDOWS ---- */
function initReadingWindows() {
  const windows = document.querySelectorAll('.reading-window');

  windows.forEach(win => {
    // Create toggle button
    const btn = document.createElement('button');
    btn.className = 'reading-window-toggle';
    btn.textContent = 'READ MORE';
    btn.setAttribute('aria-expanded', 'false');
    win.appendChild(btn);

    btn.addEventListener('click', () => {
      const isExpanded = win.classList.contains('expanded');
      win.classList.toggle('expanded');
      btn.textContent = isExpanded ? 'READ MORE' : 'READ LESS';
      btn.setAttribute('aria-expanded', String(!isExpanded));

      // Smooth scroll to keep in view
      if (!isExpanded) {
        setTimeout(() => {
          win.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    });
  });
}

/* ---- HERO PARTICLES ---- */
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = 20;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 6 + 2;
    const left = Math.random() * 100;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 10;

    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = left + '%';
    particle.style.animationDuration = duration + 's';
    particle.style.animationDelay = delay + 's';

    container.appendChild(particle);
  }
}

/* ---- ACTIVE NAV LINK ---- */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active',
            link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -50% 0px'
  });

  sections.forEach(section => observer.observe(section));
}

/* ---- JOIN FORM ---- */
function initJoinForm() {
  const form = document.getElementById('joinForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('.join-input');
    const btn = form.querySelector('.join-submit-btn');

    btn.textContent = 'JOINED!';
    btn.style.background = '#4caf50';
    input.value = '';

    setTimeout(() => {
      btn.textContent = 'JOIN NOW';
      btn.style.background = '';
    }, 3000);
  });
}
