Follow DRY (don't repeat yourself) principle.
dont make similar components repeatedly.
always try to make reusable components.
use organised folder structure.
dont write all codes and logics and functions in one file.

# Odyssey Next.js Assessment Task

Build a simple application using Next.js (App Router). The app should have public and protected pages with authentication using Firebase. You can choose any idea to implement the task, e.g., event management, course management, e-commerce, blog, etc., or any of your custom ideas.

Focus on polished UI, responsiveness, and layout consistency. Functionality can be minimal but must include the protected page and login.

## 1. Landing Page (/)
Must include 7 sections:
- **Navbar** – logo, 4+ routes, login/register, sticky, responsive
  - After login, show a dropdown with:
    - Logged-in user info (replacing login/register)
    - Add Product
    - Manage Products
- **Hero** – headline, subtitle, primary CTA, optional background
- **4 Relevant Sections** – choose based on theme (e.g., features, items, testimonials, banner)
- Cards/layout must be uniform with hover/focus states
- Clear hierarchy, spacing, and responsive design
- **Footer** – links, optional social icons, copyright, consistent spacing

## 2. Items Page (/items)
- Search bar
- Filtering must be implemented using at least 2 fields (e.g., category, price, rating, date, location).
- Display a minimum of 6 items (static data / local storage)
- Grid layout (responsive)
- Each card must include:
  - Image or icon
  - Title
  - Short description (1–2 lines)
  - Button → “View Details”

## 3. Item Details Page (/items/[id])
- Dynamic route using App Router
- Show:
  - Title
  - Image
  - Full description
  - Key information / Specifications
  - Related items (if applicable).
  - Additional info (price/date/category)
  - Back button to Items page

## 4. About Page (/about)
- Simple page about your app
- Add:
  - Title
  - Description
  - Optional image or section

## 5. Authentication (Firebase)
- Implement Firebase Authentication:
  - Email & Password login/register
  - Google login (optional but recommended)
- Store user state (using Context API or simple state)
- Redirect to `/` after login

## 6. Protected Page: Add Items (/items/add)
- Only accessible when logged in; redirect others to `/login`
- Form fields:
  - Title
  - Short description
  - Full description
  - Price/date/priority/relevant field
  - Optional image URL
- Buttons: Submit (add) 
- On success: show toast or confirmation message

## 7. Protected Page: Manage Items (/items/manage)
- List all products in a table/grid
- Each row/card with actions: View, Delete
- The layout should be clean, readable, and responsive

## Overall UI Guidelines
- **Layout & Responsiveness** – consistent spacing, clean layouts, adaptive for mobile/tablet/desktop.
- **Typography & Colors** – clear hierarchy, readable fonts, consistent color palette.
- **Cards, Lists & Forms** – uniform cards with hover/focus, responsive grids, clean forms with inline validation and optional loading states.
- **Interactions & Consistency** – Hover/focus for interactive elements, visual consistency across pages, optional micro-animations.

## Technologies
- Next.js (App Router) for the frontend application
- Firebase for authentication (Read Documentation)

## Submission Requirements
- GitHub Repository link
- Live demo (Vercel recommended)
- README.md including:
  - Short project description
  - Project key features
  - Setup & installation instructions
  - Route summary
