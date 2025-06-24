const form = document.getElementById('registerForm') as HTMLFormElement;
const msg = document.getElementById('registerMessage') as HTMLParagraphElement;
const emailInput = document.getElementById('email') as HTMLInputElement;
const passwordInput = document.getElementById('password') as HTMLInputElement;

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Handle form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Reset previous feedback and error styles
  msg.textContent = '';
  msg.classList.remove('feedback-success', 'feedback-error');
  emailInput.classList.remove('invalid');
  passwordInput.classList.remove('invalid');

  const formData = new FormData(form);
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

// Validation: show red border and message if fields are missing
  if (!email || !password) {
    if (!email) emailInput.classList.add('invalid');
    if (!password) passwordInput.classList.add('invalid');
    msg.textContent = 'Please enter both email and password.';
    msg.classList.add('feedback-error');
    return;
  }

  // Password length validation
  if (password.length < 6) {
    passwordInput.classList.add('invalid');
    msg.textContent = 'Password must be at least 6 characters.';
    msg.classList.add('feedback-error');
    return;
  }

  // Sends registration request to backend API
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      msg.textContent = data.message || 'Registration failed';
      msg.classList.add('feedback-error');
      return;
    }

    // Save token and user info in localStorage if registration was successful
    localStorage.setItem('token', data.token);
    localStorage.setItem('email', data.email);
    localStorage.setItem('role', data.role);

    msg.textContent = 'Account created!';
    msg.classList.add('feedback-success');

    // Redirect user to different pages depending on their role
    setTimeout(() => {
      if (data.role === 'admin') {
        window.location.href = '/admin.html';
      } else {
        window.location.href = '/login.html';
      }
    }, 1500);
  } catch (err) {
    msg.textContent = 'Something went wrong';
    msg.classList.add('feedback-error');
  }
});
