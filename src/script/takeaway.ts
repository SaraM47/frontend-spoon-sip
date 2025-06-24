import type { MenuItem } from '../types/MenuItem';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Select key DOM elements related to the takeaway form and modal
const form = document.getElementById("takeawayForm") as HTMLFormElement;
const messageBox = document.getElementById("orderMessage") as HTMLElement;

const acaiSelect = form.querySelector(
  'select[name="acai"]'
) as HTMLSelectElement;
const smoothieSelect = form.querySelector(
  'select[name="smoothie"]'
) as HTMLSelectElement;
const juiceSelect = form.querySelector(
  'select[name="juice"]'
) as HTMLSelectElement;

const receiptModal = document.getElementById("receiptModal") as HTMLElement;
const receiptText = document.getElementById("receiptText") as HTMLElement;
const closeReceipt = document.getElementById("closeReceipt") as HTMLElement;

// Fetch all menu items from backend and populate the select dropdowns based on category
async function fetchAndPopulateMenu() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/menu`);
    if (!res.ok) throw new Error("Failed to fetch menu");
    const menu: MenuItem[] = await res.json();

    const acai = menu.filter(
      (item) => item.category.toLowerCase() === "acai bowl"
    );
    const smoothies = menu.filter(
      (item) => item.category.toLowerCase() === "smoothie"
    );
    const juices = menu.filter(
      (item) => item.category.toLowerCase() === "juice"
    );

    populateSelect(acaiSelect, acai);
    populateSelect(smoothieSelect, smoothies);
    populateSelect(juiceSelect, juices);
  } catch (err) {
    console.error("Failed to load menu for select options:", err);
  }
}

// Add options to a given select element, including a default "None" option
function populateSelect(selectEl: HTMLSelectElement, items: MenuItem[]) {
  const noneOption = document.createElement("option");
  noneOption.value = "none";
  noneOption.textContent = "None";
  selectEl.appendChild(noneOption);

  items.forEach((item) => {
    const opt = document.createElement("option");
    opt.value = item._id;
    opt.textContent = item.name;
    selectEl.appendChild(opt);
  });
}

// Validate form input fields and ensure at least one product is selected
function validateForm(form: HTMLFormElement): boolean {
  let isValid = true;
  const fields = ["name", "phone", "people", "time"];
  const errorSpans = form.querySelectorAll(".error-message");

  errorSpans.forEach((span) => (span.textContent = ""));

  fields.forEach((field) => {
    const input = form.elements.namedItem(field) as
      | HTMLInputElement
      | HTMLSelectElement;
    const errorSpan = form.querySelector(
      `[data-error-for="${field}"]`
    ) as HTMLElement;
    if (!input.value.trim()) {
      errorSpan.textContent = `Please enter your ${field}.`;
      isValid = false;
    }
  });

  // Ensure at least one product is selected from the dropdowns
  const selectedMenuItems = [acaiSelect, smoothieSelect, juiceSelect]
    .map((select) => select.value)
    .filter((val) => val !== "" && val !== "none");

  if (selectedMenuItems.length === 0) {
    ["acai", "smoothie", "juice"].forEach((name) => {
      const errorSpan = form.querySelector(
        `[data-error-for="${name}"]`
      ) as HTMLElement;
      errorSpan.textContent = "Please choose at least one product.";
    });
    isValid = false;
  }

  return isValid;
}

// Handle form submission: validate, build order object, send POST request, show receipt
form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validateForm(form)) return;

  const formData = new FormData(form);

  const getItemId = (value: FormDataEntryValue | null) =>
    value && value !== "none" ? value.toString() : null;

  const menuItemIds: string[] = [];
  const acaiId = getItemId(formData.get("acai"));
  const smoothieId = getItemId(formData.get("smoothie"));
  const juiceId = getItemId(formData.get("juice"));

  if (acaiId) menuItemIds.push(acaiId);
  if (smoothieId) menuItemIds.push(smoothieId);
  if (juiceId) menuItemIds.push(juiceId);

  const order = {
    customerName: formData.get("name"),
    phone: formData.get("phone"),
    time: new Date().toISOString().split("T")[0] + "T" + formData.get("time"),
    people: formData.get("people"),
    note: formData.get("notes"),
    menuItemIds,
  };

  try {
    const res = await fetch(`${API_BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    const data = await res.json();

    if (res.ok) {
      form.reset();
      form
        .querySelectorAll(".error-message")
        .forEach((span) => (span.textContent = ""));

      // If receipt is returned, show it in a modal
      if (data.receipt) {
        receiptText.textContent = data.receipt;
        receiptModal.style.display = "block";
      }
    } else {
      throw new Error(data.message || "Order failed. Try again.");
    }
  } catch (err: any) {
    console.error("Order error:", err);
    messageBox.textContent = err.message || "Something went wrong.";
    messageBox.style.color = "crimson";
  }
});

// Close receipt modal when close button is clicked
closeReceipt?.addEventListener("click", () => {
  receiptModal.style.display = "none";
});

// Close receipt modal when clicking outside the modal content
window.addEventListener("click", (e) => {
  if (e.target === receiptModal) {
    receiptModal.style.display = "none";
  }
});

fetchAndPopulateMenu();
