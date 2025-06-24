import type { MenuItem, Order } from '../types';

const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api';

// Redirect non-admin users or missing tokens to login page
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');
const email = localStorage.getItem('email');

if (!token || role !== 'admin') {
  window.location.href = '/login.html';
}

const headers = {
  Authorization: `Bearer ${token}`,
};

// DOM elements
// === DOM Elements ===
// Get references to all relevant DOM elements for admin panel
const menuList = document.getElementById('menuItemList') as HTMLTableSectionElement;
const orderList = document.getElementById('orderList') as HTMLTableSectionElement;
const logoutBtn = document.getElementById('logoutBtn') as HTMLButtonElement;
const adminEmail = document.getElementById('adminEmail') as HTMLSpanElement;
const addMenuItemBtn = document.getElementById('addMenuItemBtn') as HTMLButtonElement;
const modal = document.getElementById('adminModal')!;
const form = document.getElementById('modalForm') as HTMLFormElement;
const messageList = document.getElementById('messageList') as HTMLTableSectionElement;
const reviewList = document.getElementById('reviewList') as HTMLTableSectionElement;
const userList = document.getElementById('userList') as HTMLTableSectionElement;
const orderStatusFilter = document.getElementById('orderStatusFilter') as HTMLSelectElement;

// === Delete Modals ===
// Store references and state for delete confirmation modals
let deleteId = '';
let orderDeleteId = '';
let contactDeleteId = '';
let userDeleteId = '';
let reviewDeleteId = '';

const deleteModal = document.getElementById('deleteModal')!;
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn') as HTMLButtonElement;
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn') as HTMLButtonElement;

const orderDeleteModal = document.getElementById('orderDeleteModal')!;
const confirmOrderDeleteBtn = document.getElementById('confirmOrderDeleteBtn') as HTMLButtonElement;
const cancelOrderDeleteBtn = document.getElementById('cancelOrderDeleteBtn') as HTMLButtonElement;

const contactDeleteModal = document.getElementById('contactDeleteModal')!;
const confirmContactDeleteBtn = document.getElementById('confirmContactDeleteBtn') as HTMLButtonElement;
const cancelContactDeleteBtn = document.getElementById('cancelContactDeleteBtn') as HTMLButtonElement;

const userDeleteModal = document.getElementById('userDeleteModal')!;
const confirmUserDeleteBtn = document.getElementById('confirmUserDeleteBtn') as HTMLButtonElement;
const cancelUserDeleteBtn = document.getElementById('cancelUserDeleteBtn') as HTMLButtonElement;

const reviewDeleteModal = document.getElementById('reviewDeleteModal')!;
const confirmReviewDeleteBtn = document.getElementById('confirmReviewDeleteBtn') as HTMLButtonElement;
const cancelReviewDeleteBtn = document.getElementById('cancelReviewDeleteBtn') as HTMLButtonElement;

// Fetch all users and render them to the admin panel
async function fetchUsers() {
    try {
      const res = await fetch(`${apiUrl}/users`, { headers });
  
      const contentType = res.headers.get('content-type');
      if (!res.ok) throw new Error(`Server responded with status ${res.status}`);
      if (!contentType?.includes('application/json')) {
        const text = await res.text();
        throw new Error(`Unexpected response format: ${text}`);
      }
  
      const users = await res.json();
      renderUsers(users);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  }
  // Render user table rows with delete buttons
  function renderUsers(users: any[]) {
    userList.innerHTML = '';
    users.forEach((user) => {
      const created = new Date(user.account_created).toLocaleDateString('en-GB');
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>${created}</td>
        <td>
          <div class="cta-shadow-wrapper">
            <button class="cta-button small danger" data-id="${user._id}" data-user-delete>Delete</button>
          </div>
        </td>
      `;
      userList.appendChild(tr);
    });
  }
  
  // Handle click on user delete button
  userList.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const button = target.closest('button');
    if (!button) return;
  
    const id = button.dataset.id;
    if (button.hasAttribute('data-user-delete') && id) {
      userDeleteId = id;
      userDeleteModal.classList.remove('hidden');
    }
  });
  
  // Confirm/cancel user deletion
  confirmUserDeleteBtn.addEventListener('click', async () => {
    if (!userDeleteId) return;
    try {
      const res = await fetch(`${apiUrl}/users/${userDeleteId}`, {
        method: 'DELETE',
        headers,
      });
  
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete user');
      }
  
      userDeleteModal.classList.add('hidden');
      userDeleteId = '';
      fetchUsers();
    } catch (err) {
      alert('Could not delete user.');
      console.error('Delete failed:', err);
    }
  });
  
  cancelUserDeleteBtn.addEventListener('click', () => {
    userDeleteModal.classList.add('hidden');
    userDeleteId = '';
  });
  

// Fetch & render menu items
async function fetchMenu() {
  try {
    const res = await fetch(`${apiUrl}/menu`);
    const data: MenuItem[] = await res.json();
    renderMenuItems(data);
  } catch (err) {
    console.error('Failed to load menu items:', err);
  }
}

// Render menu item table rows with edit/delete options
function renderMenuItems(items: MenuItem[]) {
  menuList.innerHTML = '';
  items.forEach((item) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>${item.price} €</td>
      <td>${item.ingredients.join(', ')}</td>
      <td>
        <div class="cta-shadow-wrapper">
          <button class="cta-button small" data-id="${item._id}" data-edit>Edit</button>
        </div>
        <div class="cta-shadow-wrapper">
          <button class="cta-button small danger" data-id="${item._id}" data-delete>Delete</button>
        </div>
      </td>
    `;
    menuList.appendChild(tr);
  });
}

// Delete/edit menu item 
menuList.addEventListener('click', async (e) => {
  const target = e.target as HTMLElement;
  const button = target.closest('button');
  if (!button) return;

  const id = button.dataset.id;

  if (button.hasAttribute('data-delete') && id) {
    deleteId = id;
    deleteModal.classList.remove('hidden');
    return;
  }

  if (button.hasAttribute('data-edit') && id) {
    const res = await fetch(`${apiUrl}/menu/${id}`);
    const item: MenuItem = await res.json();
    openModal(item);
  }
});

confirmDeleteBtn.addEventListener('click', async () => {
  if (!deleteId) return;
  await fetch(`${apiUrl}/menu/${deleteId}`, { method: 'DELETE', headers });
  deleteId = '';
  deleteModal.classList.add('hidden');
  fetchMenu();
});

cancelDeleteBtn.addEventListener('click', () => {
  deleteModal.classList.add('hidden');
  deleteId = '';
});

// Open modal for add 
addMenuItemBtn?.addEventListener('click', () => {
  openModal();
});

// Modal logic
function openModal(item?: MenuItem) {
  const isEdit = Boolean(item);
  const title = document.querySelector('.modal-title')!;
  title.textContent = isEdit ? 'Edit Menu Item' : 'Add menu item';

  form.innerHTML = `
    <label>Name<input name="name" value="${item?.name || ''}" required></label>
    <label>Price<input name="price" type="number" value="${item?.price || ''}" required></label>
    <label>Category<input name="category" value="${item?.category || ''}" required></label>
    <label>Ingredients<textarea name="ingredients">${item?.ingredients?.join(', ') || ''}</textarea></label>
    ${item?.image ? `<img src="${item.image}" alt="Current image" class="admin-preview-image">` : ''}
    <label>Image<input type="file" name="image" accept="image/*"></label>
    <input type="hidden" name="id" value="${item?._id || ''}">
  `;
  modal.classList.remove('hidden');
}

document.getElementById('cancelModalBtn')?.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// Fetch message
async function fetchMessages() {
    try {
      const res = await fetch(`${apiUrl}/contact`, { headers });
      const messages = await res.json();
      renderMessages(messages);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  }

  function renderMessages(messages: any[]) {
    messageList.innerHTML = '';
    messages.forEach((msg) => {
      const date = new Date(msg.createdAt).toLocaleString('en-GB', {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: 'Europe/Stockholm',
      });
  
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${msg.name}</td>
        <td>${msg.email}</td>
        <td>${msg.message}</td>
        <td>${date}</td>
        <td>
          <div class="cta-shadow-wrapper">
            <button class="cta-button small danger" data-id="${msg._id}" data-message-delete>Delete</button>
          </div>
        </td>
      `;
      messageList.appendChild(tr);
    });
  }

  messageList.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const button = target.closest('button');
    if (!button) return;
  
    const id = button.dataset.id;
    if (button.hasAttribute('data-message-delete') && id) {
      contactDeleteId = id;
      contactDeleteModal.classList.remove('hidden');
    }
  });

  confirmContactDeleteBtn.addEventListener('click', async () => {
    if (!contactDeleteId) return;
    await fetch(`${apiUrl}/contact/${contactDeleteId}`, {
      method: 'DELETE',
      headers,
    });
    contactDeleteModal.classList.add('hidden');
    contactDeleteId = '';
    fetchMessages();
  });
  
  cancelContactDeleteBtn.addEventListener('click', () => {
    contactDeleteModal.classList.add('hidden');
    contactDeleteId = '';
  });
  
  

// Submit modal form 
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const id = formData.get('id') as string;

  const method = id ? 'PUT' : 'POST';
  const url = id ? `${apiUrl}/menu/${id}` : `${apiUrl}/menu`;

  const options: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${token!}`,
    },
    body: formData,
  };

  await fetch(url, options);
  form.reset();
  modal.classList.add('hidden');
  fetchMenu();
});

// Fetch & render orders 
async function fetchOrders(filter: 'all' | 'pending' | 'completed' = 'all') {
    try {
      const endpoint =
        filter === 'all'
          ? `${apiUrl}/orders`
          : `${apiUrl}/orders/${filter}`; // /orders/pending or /orders/completed
  
      const res = await fetch(endpoint, { headers });
      const text = await res.text();
  
      const data = JSON.parse(text);
      if (!Array.isArray(data)) return;
      renderOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  }
  
// Render each order into a table row, showing customer info, items, pickup time, and status
  function renderOrders(orders: Order[]) {
    orderList.innerHTML = '';
    orders.forEach((o) => {
      const menuList = Array.isArray(o.menuItemIds) && o.menuItemIds.length
        ? o.menuItemIds.map((m) => m.name).join(', ')
        : '<em>No items</em>';
  
      const pickupTime = new Date(o.time).toLocaleString('en-GB', {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: 'Europe/Stockholm',
      });
  
      const people = o.people ?? '-';
      const note = o.note ?? '-';
  
      const statusBtn = o.status === 'pending'
        ? `<div class="cta-shadow-wrapper">
              <button class="cta-button small" data-id="${o._id}" data-mark-complete>Mark as Completed</button>
           </div>`
        : `<span class="status-tag completed">Completed</span>`;
  
      const tr = document.createElement('tr');
      tr.innerHTML = `
      <td data-label="ID">${o._id.slice(-6)}</td>
        <td>${o.customerName}</td>
        <td>${o.phone}</td>
        <td>${menuList}</td>
        <td>${pickupTime}</td>
        <td>${people}</td>
        <td>${note}</td>
        <td>
            ${statusBtn}
            <div class="cta-shadow-wrapper">
              <button class="cta-button small danger" data-id="${o._id}" data-order-delete>Delete</button>
            </div>
        </td>
      `;
      orderList.appendChild(tr);
    });
  }

  // Handle order buttons: delete or mark as completed
  orderList.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement;
    const button = target.closest('button');
    if (!button) return;
  
    const id = button.dataset.id;
  
    if (button.hasAttribute('data-order-delete') && id) {
      orderDeleteId = id;
      orderDeleteModal.classList.remove('hidden');
    }
  
    if (button.hasAttribute('data-mark-complete') && id) {
      const res = await fetch(`${apiUrl}/orders/${id}`, {
        method: 'PATCH',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'completed' }),
      });
  
      if (res.ok) {
        fetchOrders(orderStatusFilter.value as 'all' | 'pending' | 'completed');
      } else {
        console.error('Failed to mark as completed');
      }
    }
  });
  
// Confirm or cancel order deletion
confirmOrderDeleteBtn.addEventListener('click', async () => {
  if (!orderDeleteId) return;
  await fetch(`${apiUrl}/orders/${orderDeleteId}`, {
    method: 'DELETE',
    headers,
  });
  orderDeleteId = '';
  orderDeleteModal.classList.add('hidden');
  fetchOrders();
});

cancelOrderDeleteBtn.addEventListener('click', () => {
  orderDeleteModal.classList.add('hidden');
  orderDeleteId = '';
});


// Fetch all reviews and render them in the admin review table
async function fetchReviews() {
    try {
      const res = await fetch(`${apiUrl}/reviews`, { headers });
      const reviews = await res.json();
      renderReviews(reviews);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    }
  }

  // Render each review with item, name, rating, comment, timestamp and delete button
  function renderReviews(reviews: any[]) {
    reviewList.innerHTML = '';
    reviews.forEach((r) => {
      const createdAt = new Date(r.createdAt).toLocaleString('en-GB', {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: 'Europe/Stockholm',
      });
  
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.menuItemId?.name || 'Unknown'}</td>
        <td>${r.name}</td>
        <td>${r.rating}</td>
        <td>${r.comment}</td>
        <td>${createdAt}</td>
        <td>
          <div class="cta-shadow-wrapper">
            <button class="cta-button small danger" data-id="${r._id}" data-review-delete>Delete</button>
          </div>
        </td>
      `;
      reviewList.appendChild(tr);
    });
  }

  reviewList.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const button = target.closest('button');
    if (!button) return;
  
    const id = button.dataset.id;
    if (button.hasAttribute('data-review-delete') && id) {
      reviewDeleteId = id;
      reviewDeleteModal.classList.remove('hidden');
    }
  });
  
  confirmReviewDeleteBtn.addEventListener('click', async () => {
    if (!reviewDeleteId) return;
    try {
      await fetch(`${apiUrl}/reviews/review/${reviewDeleteId}`, {
        method: 'DELETE',
        headers,
      });
      reviewDeleteModal.classList.add('hidden');
      reviewDeleteId = '';
      fetchReviews();
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
  });
  
  cancelReviewDeleteBtn.addEventListener('click', () => {
    reviewDeleteModal.classList.add('hidden');
    reviewDeleteId = '';
  });
  


// Clear localStorage and redirect to login page
logoutBtn?.addEventListener('click', () => {
  localStorage.clear();
  window.location.href = '/login.html';
});

// Load all data and set admin email in header
document.addEventListener('DOMContentLoaded', () => {
  if (email) adminEmail.textContent = email;
  fetchMenu();
  fetchOrders();
  fetchMessages();
  fetchUsers();
  fetchReviews();

  orderStatusFilter?.addEventListener('change', () => {
    const value = orderStatusFilter.value as 'all' | 'pending' | 'completed';
    fetchOrders(value);
  });
});
