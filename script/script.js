const root = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const savedTheme = localStorage.getItem('janhvi-portfolio-theme');

if (savedTheme === 'dark') root.dataset.theme = 'dark';
updateThemeButton();

themeButton.addEventListener('click', () => {
  const isDark = root.dataset.theme !== 'dark';
  root.dataset.theme = isDark ? 'dark' : 'light';
  localStorage.setItem('janhvi-portfolio-theme', isDark ? 'dark' : 'light');
  updateThemeButton();
});

function updateThemeButton() {
  const isDark = root.dataset.theme === 'dark';
  themeIcon.textContent = isDark ? '☀' : '☾';
  themeButton.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
}

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navLinks.classList.toggle('is-open', open);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    navLinks.classList.remove('is-open');
  });
});

const filters = document.querySelectorAll('.filter-button');
const cards = document.querySelectorAll('.project-card');
const emptyMessage = document.querySelector('.filter-empty');
filters.forEach(button => {
  const filter = button.dataset.filter;
  const count = filter === 'all'
    ? cards.length
    : [...cards].filter(card => card.dataset.category.split(/\s+/).includes(filter)).length;
  const counter = button.querySelector('span');
  if (counter) counter.textContent = String(count).padStart(2, '0');
});
filters.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filters.forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    let visibleCount = 0;
    cards.forEach(card => {
      const visible = filter === 'all' || card.dataset.category.split(/\s+/).includes(filter);
      card.hidden = !visible;
      if (visible) visibleCount++;
    });
    emptyMessage.hidden = visibleCount !== 0;
  });
});

const words = ['AI and machine learning', 'real-world problems', 'web experiences', 'new ideas'];
const typing = document.querySelector('#typing');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion) {
  let word = 0;
  let character = words[0].length;
  let deleting = true;
  const typeNext = () => {
    const current = words[word];
    character += deleting ? -1 : 1;
    typing.textContent = current.slice(0, character);
    let delay = deleting ? 52 : 88;
    if (character <= 0) {
      deleting = false;
      word = (word + 1) % words.length;
      delay = 320;
    } else if (character >= current.length) {
      deleting = true;
      delay = 1250;
    }
    window.setTimeout(typeNext, delay);
  };
  window.setTimeout(typeNext, 1400);
}

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

const sections = document.querySelectorAll('main section[id]');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll('.nav-links>a').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(section => sectionObserver.observe(section));

document.querySelector('#year').textContent = new Date().getFullYear();
