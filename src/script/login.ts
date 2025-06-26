const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Get references to the login form, message paragraph, and input fields
const form = document.getElementById('loginForm') as HTMLFormElement;
const msg = document.getElementById('loginMessage') as HTMLParagraphElement;
const emailInput = document.getElementById('email') as HTMLInputElement;
const passwordInput = document.getElementById('password') as HTMLInputElement;

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  msg.textContent = '';
  msg.classList.remove('feedback-success', 'feedback-error');
  emailInput.classList.remove('invalid');
  passwordInput.classList.remove('invalid');

  // Extract form values
  const formData = new FormData(form);
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

   // Basic validation: check if email and password are filled in
  if (!email || !password) {
    if (!email) emailInput.classList.add('invalid');
    if (!password) passwordInput.classList.add('invalid');
    msg.textContent = 'Please enter both email and password.';
    msg.classList.add('feedback-error');
    return;
  }

  // Send login request to backend API
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      msg.textContent = 'Invalid email or password.';
      msg.classList.add('feedback-error');
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('email', data.email);
    localStorage.setItem('role', data.role);

    msg.textContent = 'Login successful!';
    msg.classList.add('feedback-success');

    setTimeout(() => {
      if (data.role === 'admin') {
        window.location.href = '/src/pages/admin.html';
      } else {
        window.location.href = '/src/pages/login.html';
      }
    }, 1500);
  } catch (err) {
    msg.textContent = 'Something went wrong';
    msg.classList.add('feedback-error');
  }
});
