import type { MenuItem } from '../types/MenuItem';

  // Define base URL for the API
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  
  // Select key DOM elements used in the menu page
  const menuContainer = document.querySelector('.menu-container');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const modal = document.querySelector('.menu-modal') as HTMLElement;
  const modalContent = document.querySelector('.menu-modal-content img') as HTMLImageElement;
  
  let menuData: MenuItem[] = [];
  
  // Fetch menu data from the API and render it on the page
  async function fetchMenu() {
    if (menuContainer) {
      menuContainer.innerHTML = `<p class="menu-loading">Loading the menu, please wait a moment.</p>`;
    }
  
    try {
      const res = await fetch(`${API_BASE_URL}/api/menu`);
      if (!res.ok) throw new Error("Failed to fetch menu");
  
      const data = await res.json();
      menuData = data;
      renderMenu(menuData);
    } catch (err) {
      console.error("Error loading menu:", err);
      if (menuContainer) {
        menuContainer.innerHTML = `<p class="menu-error">Could not load menu. Please try again later.</p>`;
      }
    }
  }
  

// Render all menu items or filtered ones inside the container
  function renderMenu(items: MenuItem[]) {
    if (!menuContainer) return;
    menuContainer.innerHTML = '';
  
    items.forEach(item => {
      console.log("Rendering item:", item.name, "img:", item.image); // For debugging
  
      const div = document.createElement('div');
      div.classList.add('menu-item');
      div.innerHTML = `
        <h3>${sanitize(item.name)}</h3>
        <p>${sanitize(item.ingredients.join(", "))}</p>
        <div class="price-and-icon">
          <span class="price">$${item.price.toFixed(2)}</span>
          <i class="bi bi-camera camera-icon" title="View image" data-img="${item.image}"></i>
        </div>
      `;
      menuContainer.appendChild(div);
    });
  

  // Add click event to each camera icon to open the modal with the image
    document.querySelectorAll('.camera-icon').forEach(icon => {
      icon.addEventListener('click', () => {
        const url = (icon as HTMLElement).getAttribute('data-img');
        console.log('Clicked image URL:', url);
  
        if (modal && modalContent && url && url.startsWith('http')) {
          modal.style.display = 'flex';
          modalContent.src = url;
          modalContent.alt = "Product image";
        } else {
          console.warn('Missing or invalid image URL');
        }
      });
    });
  }
  
  function sanitize(str: string): string {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  
// Filter menu items based on selected category button
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = (btn as HTMLElement).dataset.category;
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
  
      const filtered = selected === 'all'
        ? menuData
        : menuData.filter(item => item.category.toLowerCase() === selected?.toLowerCase());
  
      renderMenu(filtered);
    });
  });
  
// Allow closing the modal by clicking outside the image or on close icon
  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal || (e.target as HTMLElement).classList.contains('menu-modal-close')) {
        modal.style.display = 'none';
        modalContent.src = '';
      }
    });
  }
  
  fetchMenu();
  