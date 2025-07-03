/**
 * Entry script for the Spoon & Sip homepage.
 * - Initializes scroll-triggered fade-in animations.
 * - Enables mobile navigation menu toggling.
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
  const path = window.location.pathname.split('/').pop() || '';

  // Desktop sidebar
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (href.includes(path)) {
      link.classList.add('active');
    }
  });

  // Mobile nav
  document.querySelectorAll('.mobile-nav a').forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (href.includes(path)) {
      link.classList.add('active');
    }
  });
}
