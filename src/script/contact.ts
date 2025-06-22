// Define the base URL for the API, using environment variable or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Get references to the contact form and its input elements
const contactForm = document.getElementById("contactForm") as HTMLFormElement;
const nameInput = document.getElementById("contactName") as HTMLInputElement;
const emailInput = document.getElementById("contactEmail") as HTMLInputElement;
const messageInput = document.getElementById("contactMessage") as HTMLTextAreaElement;
const formFeedback = document.getElementById("formFeedback") as HTMLElement;
const submitBtn = contactForm?.querySelector("button[type='submit']") as HTMLButtonElement;

// Add submit event listener to the form, if it exists
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
      showFeedback("Please fill in all fields.", false);
      return;
    }

    // Validate the email format using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFeedback("Please enter a valid email address.", false);
      return;
    }

    // Try sending the message via POST request to the backend
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send message");

      showFeedback("Your message was sent successfully!", true);
      contactForm.reset();
    } catch (err) {
      console.error(err); // If there was an error, show a generic error message
      showFeedback("Something went wrong. Please try again later.", false);
    } finally {
      setLoading(false);
    }
  });
}

// Show or hide loading state on the submit button
function setLoading(loading: boolean) {
  if (submitBtn) {
    submitBtn.disabled = loading;
    submitBtn.textContent = loading ? "Sending..." : "SEND MESSAGE";
  }
}

// Display feedback message to the user and clear it after a delay
function showFeedback(message: string, isSuccess: boolean) {
  if (!formFeedback) return;
  formFeedback.textContent = message;
  formFeedback.className = "form-message " + (isSuccess ? "success" : "error");

  setTimeout(() => {
    formFeedback.textContent = "";
    formFeedback.className = "form-message";
  }, 5000);
}
