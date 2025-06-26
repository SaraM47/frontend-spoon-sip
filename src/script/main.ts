/**
 * Entry script for the Spoon & Sip homepage.
 * - Initializes scroll-triggered fade-in animations.
 * - Enables mobile navigation menu toggling.
 */

import { initScrollFadeIn } from './scrollFade';

window.addEventListener('DOMContentLoaded', () => {
  initScrollFadeIn();

});


// Toggle function for opening and closing the mobile navigation menu
window.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('menuToggle') as HTMLButtonElement;
  const nav = document.getElementById('mobileNav') as HTMLElement;

  toggleBtn?.addEventListener('click', () => {
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
  });
});
