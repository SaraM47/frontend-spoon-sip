/**
 * Entry script for the Spoon & Sip homepage.
 * - Initializes scroll-triggered fade-in animations.
 * - Enables mobile navigation menu toggling.
 * - Highlights the current active navigation link.
 */

import { initScrollFadeIn } from './scrollFade';

window.addEventListener('DOMContentLoaded', () => {
  initScrollFadeIn();
  highlightCurrentNavLink();

  const toggleBtn = document.getElementById('menuToggle') as HTMLButtonElement;
  const nav = document.getElementById('mobileNav') as HTMLElement;

  toggleBtn?.addEventListener('click', () => {
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
  });
});

function highlightCurrentNavLink(): void {
  let path = window.location.pathname.split('/').pop();

  // If path is empty (e.g. you are at "/", not "index.html")
  if (!path || path === '') {
    path = 'index.html';
  }

  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach((link) => {
    const href = link.getAttribute('href') || '';
    const targetFile = href.split('/').pop(); // Takes only the filename

    if (targetFile === path) {
      link.classList.add('active');
    }
  });
}

