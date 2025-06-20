/**
 * Entry script for the Spoon & Sip homepage.
 * - Initializes scroll-triggered fade-in animations.
 * - Dynamically loads customer reviews.
 * - Enables mobile navigation menu toggling.
 */

import { initScrollFadeIn } from './scrollFade';
import { loadHomepageReviews } from './reviews';

window.addEventListener('DOMContentLoaded', () => {
  initScrollFadeIn();

  // Load general homepage reviews
  loadHomepageReviews();
});


// Toggle function for opening and closing the mobile navigation menu
function toggleMobileNav() {
  const nav = document.getElementById('mobileNav');
  if (nav) nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
}
(window as any).toggleMobileNav = toggleMobileNav;
