/* ================================================
   NAVA PEACE — Internationalization (i18n) Engine
   Supports 12 languages with localStorage persistence
   ================================================ */

const I18N = (() => {
  const LANGUAGES = {
    en: { name: 'English', flag: '🇬🇧' },
    fr: { name: 'Français', flag: '🇫🇷' },
    de: { name: 'Deutsch', flag: '🇩🇪' },
    es: { name: 'Español', flag: '🇪🇸' },
    pt: { name: 'Português', flag: '🇧🇷' },
    hi: { name: 'हिन्दी', flag: '🇮🇳' },
    zh: { name: '中文', flag: '🇨🇳' },
    ar: { name: 'العربية', flag: '🇸🇦' },
    ru: { name: 'Русский', flag: '🇷🇺' },
    th: { name: 'ไทย', flag: '🇹🇭' },
    my: { name: 'မြန်မာ', flag: '🇲🇲' },
    ja: { name: '日本語', flag: '🇯🇵' },
    uk: { name: 'Українська', flag: '🇺🇦' }
  };

  let currentLang = 'en';
  let translations = {};
  let defaultTranslations = {};

  function getStoredLang() {
    return localStorage.getItem('nava-lang') || 'en';
  }

  function storeLang(lang) {
    localStorage.setItem('nava-lang', lang);
  }

  async function loadTranslations(lang) {
    try {
      const res = await fetch(`i18n/${lang}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn(`[i18n] Could not load ${lang}.json, falling back to English`);
      return null;
    }
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = translations[key] || defaultTranslations[key];
      if (!text) return;

      // Handle elements with HTML content (br tags, em, strong)
      if (el.hasAttribute('data-i18n-html')) {
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    });

    // Handle RTL for Arabic
    if (currentLang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.removeAttribute('dir');
    }

    document.documentElement.setAttribute('lang', currentLang);

    // Update language selector display
    const current = document.querySelector('.lang-current');
    if (current) {
      current.textContent = LANGUAGES[currentLang]?.flag || '🌐';
    }
  }

  async function setLanguage(lang) {
    if (!LANGUAGES[lang]) lang = 'en';
    currentLang = lang;
    storeLang(lang);

    if (lang === 'en') {
      translations = defaultTranslations;
    } else {
      const loaded = await loadTranslations(lang);
      translations = loaded || defaultTranslations;
    }

    applyTranslations();
  }

  function createSelector() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'lang-selector';

    const btn = document.createElement('button');
    btn.className = 'lang-current';
    btn.textContent = LANGUAGES[currentLang]?.flag || '🌐';
    btn.setAttribute('aria-label', 'Select language');
    wrapper.appendChild(btn);

    const dropdown = document.createElement('div');
    dropdown.className = 'lang-dropdown';

    Object.entries(LANGUAGES).forEach(([code, { name, flag }]) => {
      const item = document.createElement('button');
      item.className = 'lang-option' + (code === currentLang ? ' active' : '');
      item.setAttribute('data-lang', code);
      item.innerHTML = `<span class="lang-flag">${flag}</span> ${name}`;
      item.addEventListener('click', () => {
        setLanguage(code);
        dropdown.classList.remove('open');
        dropdown.querySelectorAll('.lang-option').forEach(o => o.classList.remove('active'));
        item.classList.add('active');
      });
      dropdown.appendChild(item);
    });

    wrapper.appendChild(dropdown);

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    document.addEventListener('click', () => {
      dropdown.classList.remove('open');
    });

    // Insert before the toggle button
    const toggle = nav.querySelector('.nav-toggle');
    nav.insertBefore(wrapper, toggle);
  }

  async function init() {
    // Load English as default/fallback
    defaultTranslations = await loadTranslations('en') || {};

    currentLang = getStoredLang();
    createSelector();

    if (currentLang !== 'en') {
      const loaded = await loadTranslations(currentLang);
      translations = loaded || defaultTranslations;
    } else {
      translations = defaultTranslations;
    }

    applyTranslations();
  }

  function t(key) {
    return translations[key] || defaultTranslations[key] || '';
  }

  return { init, setLanguage, LANGUAGES, t };
})();
