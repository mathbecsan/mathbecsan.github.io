/* Main JS: dark mode, smooth scroll, reveal animations, filters, form validation */
(function () {
  const docEl = document.documentElement;
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme toggle with localStorage
  const themeKey = 'mb-theme';
  const toggleBtn = document.getElementById('themeToggle');
  const setTheme = (t) => docEl.setAttribute('data-theme', t);
  const saved = localStorage.getItem(themeKey);
  setTheme(saved || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const next = docEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next);
      localStorage.setItem(themeKey, next);
    });

  // If URL hash is #home-about, open the collapsible on load
  window.addEventListener('load', () => {
    if (location.hash === '#home-about') {
      const sec = document.getElementById('home-about');
      if (sec) {
        sec.classList.add('is-open');
        sec.style.maxHeight = sec.scrollHeight + 'px';
        const trigger = document.querySelector('a[data-toggle="home-about"]');
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
      }
    }
  });
  }

  // Smooth scroll for same-page anchors
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    // If this is the home-about toggle, handle collapsible behavior
    if (a.dataset.toggle === 'home-about') {
      const sec = document.getElementById(id);
      if (!sec) return;
      e.preventDefault();
      const isOpen = sec.classList.toggle('is-open');
      // Height animation
      if (isOpen) {
        sec.style.maxHeight = sec.scrollHeight + 'px';
        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        a.setAttribute('aria-expanded', 'true');
      } else {
        sec.style.maxHeight = '';
        a.setAttribute('aria-expanded', 'false');
      }
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Reveal on scroll
  const revealEls = document.querySelectorAll('[data-reveal], .projects-grid');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
  }

  // Project filtering
  const grid = document.getElementById('projectsGrid') || document.querySelector('.projects-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (grid && filterBtns.length) {
    filterBtns.forEach((btn) => btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      const items = grid.querySelectorAll('.project');
      items.forEach((card) => {
        const cats = (card.dataset.category || '').split(/\s+/);
        const show = filter === 'all' || cats.includes(filter);
        card.style.display = show ? '' : 'none';
      });
    }));
  }

  // Contact form validation
  const form = document.getElementById('contactForm');
  if (form) {
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const message = form.querySelector('#message');
    const nameError = form.querySelector('#nameError');
    const emailError = form.querySelector('#emailError');
    const messageError = form.querySelector('#messageError');
    const status = form.querySelector('#formStatus');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      nameError.textContent = '';
      emailError.textContent = '';
      messageError.textContent = '';
      status.textContent = '';

      if (!name.value.trim()) { nameError.textContent = 'Please enter your name.'; ok = false; }
      if (!email.value.trim() || !emailRegex.test(email.value)) { emailError.textContent = 'Enter a valid email.'; ok = false; }
      if (!message.value.trim() || message.value.trim().length < 10) { messageError.textContent = 'Please write a short message (10+ chars).'; ok = false; }

      if (!ok) return;

      // Since this is a static site, simulate a successful submit
      status.textContent = 'Thanks! Your message was validated locally. Please email me directly at mathbecsan@gmail.com.';
      form.reset();
    });
  }
})();
