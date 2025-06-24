import { loadHomepageReviews } from './reviews';

// Wait for the DOM to load before initializing logic
document.addEventListener('DOMContentLoaded', () => {
  loadHomepageReviews();

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const reviewForm = document.getElementById('reviewForm') as HTMLFormElement;
  const feedback = document.getElementById('reviewFeedback') as HTMLParagraphElement;

  // Handle star rating clicks: update input value and visual star display
  document.querySelectorAll('.star-rating i').forEach(star => {
    star.addEventListener('click', () => {
      const val = parseInt(star.getAttribute('data-value') || '0');
      const input = document.getElementById('rating') as HTMLInputElement;
      input.value = val.toString();

      document.querySelectorAll('.star-rating i').forEach((s, i) => {
        s.classList.toggle('bi-star-fill', i < val);
        s.classList.toggle('bi-star', i >= val);
      });
    });
  });

  // Handle review form submission: validate, send POST request, update UI
  reviewForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(reviewForm);
    const name = formData.get('name')?.toString().trim();
    const rating = Number(formData.get('rating'));
    const comment = formData.get('comment')?.toString().trim();

    // Validate form fields before submission
    if (!name || !rating || !comment) {
      feedback.textContent = 'Please fill in all fields.';
      return;
    }

    // Send the review to the backend API with authentication token
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, rating, comment }),
      });

      // Handle successful submission: show feedback, reset form and stars
      if (!res.ok) throw new Error(`Status ${res.status}`);
      feedback.textContent = 'Thank you for your review!';
      reviewForm.reset();


      document.querySelectorAll('.star-rating i').forEach(star => {
        star.classList.remove('bi-star-fill');
        star.classList.add('bi-star');
      });

      // Reload reviews after new one is added
      loadHomepageReviews();
    } catch (err) {
      console.error('Review submission failed:', err);
      feedback.textContent = 'Something went wrong. Please try again later.';
    }
  });
});
