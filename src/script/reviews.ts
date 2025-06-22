import type { Review } from "../types/Review";

// Seting the base URL for API calls, using Vite's environment variable or defaulting to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Fetch and display recent reviews on the homepage
export async function loadHomepageReviews() {
  const container = document.querySelector('.review-cards');
  if (!container) return console.warn('Missing .review-cards element');

  try {
    const res = await fetch(`${API_BASE_URL}/api/reviews`);
    const contentType = res.headers.get('content-type');

    // Handle unexpected response format or server error
    if (!res.ok || !contentType?.includes('application/json')) {
      container.innerHTML = `<p class="review-error">Could not load reviews.</p>`;
      console.error(`Homepage reviews fetch error: ${res.status}`);
      return;
    }

    const reviews: Review[] = await res.json();

    // Show message if there are no reviews
    if (!Array.isArray(reviews) || reviews.length === 0) {
      container.innerHTML = `<p class="review-empty">No reviews yet. Be the first to share your thoughts!</p>`;
      return;
    }

    renderReviews(reviews, container);
  } catch (err) {
    console.error("Homepage review error:", err);
    container.innerHTML = `<p class="review-error">An unexpected error occurred.</p>`;
  }
}

// Fetch and display reviews for a specific menu item (e.g., on detail page)
export async function loadFeaturedReviews(menuItemId: string) {
  const container = document.querySelector('.review-cards');
  if (!container) return console.warn('Missing .review-cards element');

  try {
    const res = await fetch(`${API_BASE_URL}/api/reviews/${menuItemId}`);
    const contentType = res.headers.get('content-type');

    if (!res.ok || !contentType?.includes('application/json')) {
      container.innerHTML = `<p class="review-error">Could not load reviews.</p>`;
      console.error(`Item review fetch error: ${res.status}`);
      return;
    }

    const reviews: Review[] = await res.json();

    if (!Array.isArray(reviews) || reviews.length === 0) {
      container.innerHTML = `<p class="review-empty">No reviews yet. Be the first to share your thoughts!</p>`;
      return;
    }

    renderReviews(reviews, container);
  } catch (err) {
    console.error("Unexpected error while loading item reviews:", err);
    container.innerHTML = `<p class="review-error">An unexpected error occurred.</p>`;
  }
}

// Render review cards in the provided container element
function renderReviews(reviews: Review[], container: Element) {
  container.innerHTML = '';

  reviews.forEach(r => {
    const card = document.createElement('div');
    card.classList.add('card');

    const stars = renderStars(r.rating);

    card.innerHTML = `
      <h3>${sanitize(r.name)}</h3>
      <div class="stars" aria-label="Rating: ${r.rating} out of 5">
        ${stars}
      </div>
      <p>"${sanitize(r.comment)}"</p>
      <p class="review-date">${new Date(r.createdAt).toLocaleDateString()}</p>
    `;
    container.appendChild(card);
  });
}

// Generate HTML markup for Bootstrap star icons based on rating
function renderStars(rating: number): string {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;

  return (
    '<i class="bi bi-star-fill"></i>'.repeat(fullStars) +
    '<i class="bi bi-star"></i>'.repeat(emptyStars)
  );
}

// Cleans the user's text from dangerous characters so that no malicious code (e.g. script) can be executed on the page
function sanitize(str: string): string {
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
