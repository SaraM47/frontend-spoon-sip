# Spoon & Sip – Frontendapplikation
This is the public website for Spoon & Sip, a café concept offering smoothies, acai bowls, and juices.
This frontend represents the public interface of the business. The application is built using modern web development practices and consumes data from a separate REST API developed with Node.js, Express, and MongoDB.
The web application is developed using **Vite + TypeScript** and communicates with a separate backend API that manages data and business logic.
The frontend is hosted on Netlify, supporting both public usage and a protected admin view, while the backend API is hosted separately on **Render**, with all dynamic functionalities, such as menus, reviews, orders, and contact forms, connected to a **MongoDB Atlas-databas**.

Below is the published project link for the frontend part available:
[Frontend link](https://spoon-and-sip.netlify.app/)

---

## Overview
The website includes several public-facing pages and a password-protected admin panel. Visitors can:

- Browse the menu and filter items by category
- Place takeaway orders
- Send messages via the contact form
- Read and submit product-related reviews
- Register an account or log in
- (If the user is an admin) Manage all content through an interactive admin panel

Authentication is handled using JSON Web Tokens (JWT). When a user logs in, the backend returns a token that is saved in **localStorage**. That token is used to access protected resources and perform data modifications.
Protected fetch requests include the Authorization: Bearer <token> header to validate login and role (e.g. admin).

---

## Authentication and user roles
- When logging in, the backend returns a JWT token.
- This token is stored in localStorage and used in the Authorization header for all protected fetch requests.
- Users with the role admin can access the admin panel.
- If the token is missing or the user is not an admin, they are redirected from admin.html to login.html.

---

## User guide on the web application

### Startsidan (index.html)
When you visit Spoon & Sip's site, you land on the homepage, which introduces the brand through colors, imagery, and a clear message.
Here, the café's core values are presented: fresh smoothies, organic bowls, and a passion for sustainability and community.
The homepage features large call-to-action buttons that guide users to the menu page ("Explore Menu") or the takeaway form ("Order Take Away").
The homepage also includes scroll-triggered fade-in animations via scrollFade.ts.

### Menu (menu.html)
To explore the full selection of smoothies, acai bowls, and juices, visit menu.html.
Menu items are fetched automatically from the backend and displayed in a grid layout.
Users can filter by category using dedicated buttons. Each menu item displays its name, ingredients, price, and a camera icon by clicking it opens a modal with a larger product image.
This creates a clean and interactive visual menu that can be updated dynamically through the admin panel.

### Take-away-ordering (takeaway.html)
if you want to place an order online, go to takeaway.html. A form guides you through the ordering process:
You’ll enter your name, phone number, pickup time, and selected products that you want to order. There’s also an optional field for allergies or preferences.
When the form is submitted, a POST request is sent to /api/orders, and a receipt is returned with the order details returned immediately after successful order..
A confirmation message is then shown on screen after a successful order and also feedback if users miss filling in missing fields

### Vision & contact form (ourstory.html)
The ourstory.html page tells the story of Spoon & Sip, how the café was founded, what it stands for, and its future goals.
Below that section, a contact form makes it easy to reach the team.. 
The form includes fields for name, email, and message, and is submitted to backend through /api/contact.
A confirmation message appears immediately after sending. All data is transmitted securely.

### Log in (profile.html)
To log in as an administrator, use login.html.
They enter their email address and password, which is password protected form, and when these are correct, the server returns a JWT token that is saved locally in the browser in localStorage.
This token is then used to authenticate the user on all future protected API endpoints.
If the login is successful, you will be automatically redirected to the admin panel at admin.html.

### Register (register.html)
If you don't already have an account, you can create one by going to register.html. There you fill in your email and password.
When you submit the form, you are registered as a regular user (customer) in the system.
Confirmation is displayed directly in the interface, and then you can proceed automatically to log in, however, you cannot log in after you have registered your account because the admin page is password protected. 
So  note that logging in won't grant access to the admin panel unless you're an admin.

### Recensioner (index.html)
All users, both logged in and anonymous, can read and submit reviews.
Reviews are tied to overall impressions of the café or its products and are displayed on the homepage.
The functionality is handled via reviews.ts, and form data is submitted to /api/reviews.
Logged-in users are identified using the JWT token and can submit or delete their own reviews.

### Adminpanelen (admin.html)
The admin panel is password-protected and accessible only with a valid JWT token.
If the token is missing or invalid, the user is redirected back to the login page.
The administrator's name and email are displayed at the top as confirmation.
All operations use fetch requests with the token included in the Authorization header. 
You can even jump from different sections by buttons.

Once logged in as an admin, you can:
- Create, update, and delete menu items (including uploading images via Cloudinary)
- View and delete contact messages
- Moderate and delete reviews
- View, filter, and manage takeaway orders
- List and delete users (except yourself)

### Log out (admin.html)
To log out, click the "Log out" button in the admin panel.
This removes the JWT token from localStorage and redirects the user to login.html.
This ensures secure access and prevents unauthorized users from reusing the session on the same device.

---

## Example of a protected fetch request

```ts
fetch('/api/menu', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```
---
## File structure and tech stack
The frontend app is organized into folders by purpose:

- /src/pages/ : All HTML files (e.g. index.html, menu.html, takeaway.html)
- /src/script/ : All TypeScript logic, separated by page
- /src/styles/ : CSS/SCSS files for layout and visual identity
- /src/types/ : TypeScript interfaces for structured data

---

## Special Features
- Review system: Write, view, and delete reviews (includes name, rating, comment)
- Contact form: Connected to the backend and stored in the database
- Image modal: Product images open in a larger modal view
- Virtual receipt: Order receipt is logged in the console after a successful order
- Admin panel: CRUD operations, image upload, order filtering, review moderation

