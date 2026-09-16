const loader = document.querySelector('.loader');
window.addEventListener('load', () => setTimeout(() => loader.classList.add('done'), 700));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    entry.target.classList.toggle('visible', entry.isIntersecting);
    if (entry.isIntersecting && entry.target.matches('.stats-grid') && !entry.target.dataset.counted) {
      entry.target.dataset.counted = 'true';
      animateStats(entry.target);
    }
  });
}, { threshold: 0.16 });
document.querySelectorAll('.reveal, .stats-grid').forEach((element) => observer.observe(element));

function animateStats(stats) {
  stats.querySelectorAll('[data-count]').forEach((number) => {
    const target = Number(number.dataset.count);
    let current = 0;
    const tick = () => {
      current += Math.max(1, Math.ceil(target / 24));
      number.textContent = Math.min(current, target);
      if (current < target) requestAnimationFrame(tick);
    };
    tick();
  });
}

const cursor = document.querySelector('.cursor-dot');
const heroGrid = document.querySelector('.hero-grid');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let cursorX = mouseX;
let cursorY = mouseY;
let gridX = 0;
let gridY = 0;
let cursorActive = false;

function renderCursorFrame() {
  const ease = prefersReducedMotion ? 1 : 0.35;
  cursorX += (mouseX - cursorX) * ease;
  cursorY += (mouseY - cursorY) * ease;
  if (cursor) cursor.style.transform = `translate3d(${cursorX - 4}px, ${cursorY - 4}px, 0) scale(${cursorActive ? 2.5 : 1})`;
  if (heroGrid) {
    const targetGridX = (mouseX / window.innerWidth - .5) * -14;
    const targetGridY = (mouseY / window.innerHeight - .5) * -10;
    const gridEase = prefersReducedMotion ? 1 : 0.08;
    gridX += (targetGridX - gridX) * gridEase;
    gridY += (targetGridY - gridY) * gridEase;
    heroGrid.style.transform = `translate3d(${gridX}px, ${gridY}px, 0) scale(1.2)`;
  }
  requestAnimationFrame(renderCursorFrame);
}
if (cursor) requestAnimationFrame(renderCursorFrame);

window.addEventListener('mousemove', (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
  cursorActive = Boolean(event.target.closest('a, button'));
  if (cursor) cursor.classList.toggle('active', cursorActive);
}, { passive: true });

document.querySelector('.contact-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector('button');
  const original = button.innerHTML;
  button.innerHTML = 'Message received <span>✓</span>';
  button.style.background = '#e7ecd8';
  setTimeout(() => { button.innerHTML = original; button.style.background = ''; event.currentTarget.reset(); }, 2800);
});

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.desktop-nav');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('mobile-open', !open);
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  nav.classList.remove('mobile-open');
}));

const processSteps = [...document.querySelectorAll('.process-step')];
let activeProcessStep = 0;
setInterval(() => {
  if (document.hidden || processSteps.length === 0) return;
  processSteps[activeProcessStep].classList.remove('active');
  activeProcessStep = (activeProcessStep + 1) % processSteps.length;
  processSteps[activeProcessStep].classList.add('active');
}, 2200);
