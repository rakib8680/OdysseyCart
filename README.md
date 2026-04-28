# OdysseyCart

A premium e-commerce web application built with Next.js 15 (App Router) and Firebase Authentication. OdysseyCart features a high-end, editorial design language with a full product browsing experience, dynamic filtering, and secured protected routes for authenticated users.

**Live Demo:** [https://odyssey-cart.vercel.app](https://odyssey-cart.vercel.app)

---

## Features

- **Premium Landing Page** — Hero section with product showcase, Category Grid, Editorial Featured Products, Craftsmanship story section, Bento Value Props, Newsletter CTA, and a full 6-column Footer.
- **Product Catalogue** — Browse 6+ products with live search and category filtering.
- **Product Detail Pages** — Dynamic routes with full descriptions, specs, related products, and a back button.
- **Firebase Authentication** — Email/Password and Google Sign-In via Firebase Auth.
- **Protected Routes** — `/items/add` and `/items/manage` are locked behind authentication with an intelligent redirect flow that returns the user to their intended page after login.
- **Auth-Aware Navbar** — Dynamically switches between Login/Register links and a logged-in user dropdown menu.
- **Toast Notifications** — User feedback on all key actions (login, register, unauthorized access) via Sonner.
- **Fully Responsive** — Optimized layouts for mobile, tablet, and desktop.

---

## Tech Stack

| Technology                  | Purpose             |
| --------------------------- | ------------------- |
| **Next.js 15** (App Router) | Framework & Routing |
| **React 19**                | UI Library          |
| **TypeScript**              | Type Safety         |
| **Tailwind CSS v4**         | Styling             |
| **Shadcn UI**               | Component Library   |
| **Firebase v12**            | Authentication      |
| **Sonner**                  | Toast Notifications |
| **Lucide React**            | Icon Library        |
| **Vercel**                  | Deployment          |

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/rakib8680/OdysseyCart.git
cd OdysseyCart
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root of the project and add your Firebase project credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> You can find these values in your Firebase Console → Project Settings → Your Apps.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Route Summary

| Route           | Access        | Description                            |
| --------------- | ------------- | -------------------------------------- |
| `/`             | Public        | Landing page with all sections         |
| `/items`        | Public        | Product catalogue with search & filter |
| `/items/[id]`   | Public        | Individual product detail page         |
| `/about`        | Public        | About page                             |
| `/login`        | Public        | Email/Password & Google Sign-In        |
| `/register`     | Public        | Create a new account                   |
| `/items/add`    | **Protected** | Form to add a new product              |
| `/items/manage` | **Protected** | Table view to manage all products      |

---

## Project Structure

```
odyssey-app/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing page
│   ├── items/              # Items catalogue & detail
│   ├── login/              # Login page
│   ├── register/           # Register page
│   └── about/              # About page
├── components/
│   ├── landing/            # Landing page sections
│   ├── form/               # Reusable auth form components
│   ├── ui/                 # Shadcn UI primitives
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   └── ProtectedRoute.tsx  # Authentication gatekeeper
├── contexts/
│   └── AuthContext.tsx     # Global Firebase auth state
└── lib/
    └── data.ts             # Static product data
```
