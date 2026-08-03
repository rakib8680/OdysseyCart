# 🛒 OdysseyCart — Production-Grade Editorial E-Commerce Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.5-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9.6-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-v22-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![Firebase](https://img.shields.io/badge/Firebase-v12-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Deployment](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://odyssey-cart.vercel.app)

> **OdysseyCart** is an enterprise-ready, full-stack e-commerce web application engineered with a luxury editorial aesthetic, high-performance server architecture, robust security safeguards, and seamless real-time user experiences.

🌐 **Live Production Deployment:** [https://odyssey-cart.vercel.app](https://odyssey-cart.vercel.app)

---

## 📑 Table of Contents

- [Executive Summary](#-executive-summary)
- [Key Platform Capabilities](#-key-platform-capabilities)
- [System Architecture Overview](#-system-architecture-overview)
- [Core Feature Architectures](#-core-feature-architectures)
  - [1. Checkout & Stock Fulfillment Architecture](#1-checkout--stock-fulfillment-architecture)
  - [2. Transactional Email Notification Pipeline](#2-transactional-email-notification-pipeline)
  - [3. Dynamic URL-Driven State & Search Engine](#3-dynamic-url-driven-state--search-engine)
  - [4. Auth & User Profile Synchronization](#4-auth--user-profile-synchronization)
  - [5. Verified Buyer Review Moderation Engine](#5-verified-buyer-review-moderation-engine)
  - [6. Dual-Layer Cart State Synchronization](#6-dual-layer-cart-state-synchronization)
- [Tech Stack Specification](#-tech-stack-specification)
- [Project Directory Structure](#-project-directory-structure)
- [Route & Access Control Matrix](#-route--access-control-matrix)
- [Environment Configuration](#-environment-configuration)
- [Getting Started (Local Development)](#-getting-started-local-development)
- [Production Deployment & Infrastructure](#-production-deployment--infrastructure)
- [License](#-license)

---

## 🌟 Executive Summary

OdysseyCart is built to bridge the gap between high-end editorial storefront UI design and resilient, production-grade backend architecture. Developed with **Next.js 16 App Router**, **React 19**, **TypeScript**, and **Tailwind CSS v4**, the application enforces:

- **Sub-Second Performance & SEO:** Server-Side Rendering (SSR) paired with dynamic metadata generation (`generateMetadata`), canonical links, OpenGraph social cards, and human-friendly slug routing (`/items/[slug]`).
- **Data Integrity & Concurrency Safeguards:** Atomic inventory bulk-writes, Stripe webhook idempotency guards, and Optimistic Concurrency Control (OCC) for admin workflows.
- **State Synchronization:** URL-driven state management via `nuqs` for search, category filtering, and pagination—preserving filter context across browser reloads without client-side latency.
- **Asynchronous Email Pipeline:** Non-blocking transactional emails built with **Resend** and **React Email** for order receipts, shipping updates, and account registration welcomes.

---

## ✨ Key Platform Capabilities

### 🛍️ 1. Storefront & Catalog Experience
- **Editorial Landing Page:** Features a luxury Hero banner, dynamic Category Grid, Craftsmanship story section, Bento grid value propositions, and interactive Newsletter CTA.
- **SEO Slug Routing:** Clean SEO-optimized product URLs (`/items/signature-leather-tote`) paired with automatic 301 redirects for legacy ID-based links.
- **URL-Synced Search & Filtering:** Instant multi-faceted filtering by Category, Price Range, and Sorting order powered by MongoDB `$text` indexing and `nuqs` URL state sync.
- **Product Details & Gallery:** High-resolution product showcase, detailed specifications, real-time stock availability indicators, and verified star rating summaries.

### 🛒 2. Checkout & Payment Engine
- **Slide-Over Drawer Cart:** Persistent local cart state with instant stock validation, quantity adjusters, and optimistic UI updates.
- **Stripe Checkout Integration:** Payment Element integration supporting standard PaymentIntent upserts.
- **Server-Validated Coupon Engine:** Promo code discount engine supporting fixed dollar and percentage deductions with single-use guards.
- **Atomic Stock Inventory Fulfillment:** Stripe webhooks execute bulk atomic `bulkWrite` operations on MongoDB upon successful payment receipt, preventing oversell vulnerabilities.

### 🔐 3. Authentication & Access Control
- **Multi-Provider Auth:** Firebase Authentication supporting Email/Password and Google OAuth 2.0.
- **MongoDB User Synchronization:** Background synchronization creating application user records and assigning Role-Based Access Control (RBAC) scopes (`user` vs `admin`).
- **Route Protection Middleware:** Auth gatekeeper protecting customer management routes (`/account/*`) and admin administrative panels (`/admin/*`).

### ⭐ 4. Reviews & Rating Engine
- **Verified Purchase Gating:** Restricted review submissions ensuring only confirmed buyers can post star ratings and text feedback.
- **Aggregated Rating Calculations:** Real-time calculation of average product star ratings and review tallies saved directly onto product documents.
- **Admin Moderation Panel:** Moderation dashboard for inspecting, approving, or removing customer reviews.

### ❤️ 5. Wishlist & Customer Favorites
- **Optimistic Heart Controls:** Interactive heart toggle on product cards with immediate UI responsiveness.
- **Dedicated Dashboard:** Responsive `/account/wishlist` view displaying saved items with one-click "Move to Cart" capabilities.

### 👤 6. Address Book & Profile Hub
- **Shipping Address CRUD:** Customer address manager supporting saved addresses with primary default designation.
- **Avatar Upload Pipeline:** Integrated **Uploadthing** image service with a circular progress indicator feedback loop.
- **Security Settings:** Password reset email triggers and account deletion with soft-delete PII anonymization workflows.

### 📧 7. Transactional Email Infrastructure
- **Component Templates:** Responsive HTML emails designed using `@react-email/components`.
- **Resend Service Layer:** Non-blocking async email delivery for Order Confirmations, Order Status Updates (Processing, Shipped, Delivered), and Welcome Onboarding.

### 📊 8. Admin Dashboard & Analytics
- **Dual Dashboard System:** Specialized layouts separating customer account portals (`/account`) from administration suites (`/admin`).
- **Revenue & Metrics Overview:** Recharts data visualizer displaying revenue velocity, monthly sales metrics, order counts, and top-selling items.
- **Paginated Admin Management:** Server-paginated product, order, and review management tables with real-time text search and status updates.

---

## 🏗 System Architecture Overview

```
+-------------------------------------------------------------------+
|                        Client / Browser                           |
+--------------------------------─┬────────────────────────────────-+
                                  │
                                  ▼
+-------------------------------------------------------------------+
|               Next.js 16 App Router (RSC / SSR / Edge)            |
+──────────────┬──────────────────┬──────────────────┬──────────────+
               │                  │                  │
               ▼                  ▼                  ▼
      +-----------------+  +--------------+  +---------------+
      |  Firebase Auth  |  | MongoDB Atlas|  | Stripe Engine |
      +-----------------+  +--------------+  +───────┬───────+
                                                     │
                                                     ▼ (Webhook)
                                             +---------------+
                                             | Resend Emails |
                                             +---------------+
```

---

## 🔬 Core Feature Architectures

### 1. Checkout & Stock Fulfillment Architecture

```
[Client Cart] ──> (PaymentIntent Upsert) ──> [Stripe API]
                                                   │
                                     (Payment Succeeded)
                                                   │
                                                   ▼
[MongoDB Atlas] <── (Atomic bulkWrite) <── [Stripe Webhook] ──> [Resend Email API]
```

- **Payment Intent Upserts:** Cart edits update existing Stripe `PaymentIntent` sessions on the fly without re-creating transactions.
- **Webhook Idempotency Guard:** `/api/webhooks/stripe` checks MongoDB to prevent duplicate order processing on network retries.
- **Atomic Bulk Stock Decrement:** Mongoose `bulkWrite` executes atomic `$inc: { stock: -quantity }` updates across purchased items in one roundtrip.

---

### 2. Transactional Email Notification Pipeline

```
[System Event] ──> [Email Service] ──> [React Email Template] ──> [Resend API]
(Order/Status/Auth)   (lib/email/)       (components/emails/)
```

- **Component-Driven Templates:** Built with `@react-email/components` sharing a responsive `BaseEmailLayout`.
- **Non-Blocking Background Delivery:** Async service layer prevents email delivery latencies from delaying core application workflows.
- **Automated Event Triggers:** Dispatches order receipts on webhook success, shipping updates on admin changes, and welcome onboarding on signup.

---

### 3. Dynamic URL-Driven State & Search Engine

```
[Filter Inputs] ──> (nuqs Sync) ──> [URL Query Params] ──> (MongoDB $text) ──> [Next.js RSC]
```

- **URL-Synchronized State (`nuqs`):** Search, category, price, sorting, and page params sync directly to browser query parameters.
- **Zero Client Overhead:** Replaces heavy client state (`useState` / `useEffect`) with server-rendered Next.js Server Components.
- **MongoDB Text Search:** Leverages `$text` indexes and `$regex` matching for instant catalog search with bookmarkable URLs.

---

### 4. Auth & User Profile Synchronization

```
[Firebase Auth] ──> (Sign In / Register) ──> [MongoDB Sync Handler] ──> [Uploadthing Media]
```

- **Dual-Sync User Records:** Syncs Firebase Auth (Email/Password & Google OAuth) into MongoDB application documents.
- **Role-Based Access Control (RBAC):** Middleware checks role claims (`user` vs `admin`) to protect administrative and account routes.
- **Uploadthing Media Pipeline:** Custom avatar uploads with circular progress feedback saving directly to user MongoDB profiles.

---

### 5. Verified Buyer Review Moderation Engine

```
[Review Submission] ──> [Purchase Verification Guard] ──> (Atomic Rating Recalculation) ──> [Admin Queue]
```

- **Purchase Verification Guard:** Restricts review submissions exclusively to users with verified, fulfilled order history for the product.
- **Atomic Rating Recalculation:** Database aggregation pipeline automatically recalculates average star ratings and total review counts on the Product document.
- **Admin Moderation Panel:** Dedicated moderation interface to review, approve, or remove published customer reviews.

---

### 6. Dual-Layer Cart State Synchronization

```
[Slide-Over Cart UI] ──> (Optimistic Local State) ──> (Sync Trigger) ──> [MongoDB Cart Store]
```

- **Sub-Millisecond UI Speed:** Local cart state powers instant slide-over drawer responses and quantity adjustments.
- **Cross-Device Persistence:** Authenticated user carts sync in the background with MongoDB for seamless cross-device persistence.
- **Automated Checkout Purge:** Clears both client cart state and server database records upon Stripe checkout completion.

---

## 🛠 Tech Stack Specification

| Category | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Core Framework** | Next.js (App Router) | `16.2.4` | Full-stack framework, SSR, Server Actions, & Route Handlers |
| **UI Library** | React | `19.2.5` | Component architecture & React Server Components (RSC) |
| **Language** | TypeScript | `5.7.3` | End-to-end static type checking |
| **Styling** | Tailwind CSS | `4.3.3` | Utility-first styling engine & CSS variables |
| **Component Library**| Shadcn UI / Lucide | `4.4.0` | Accessible UI primitives & vector icons |
| **Animations** | Framer Motion | `12.38.0` | Micro-interactions, drawers, and modal transitions |
| **Database & ORM** | MongoDB / Mongoose | `9.6.1` | NoSQL database with schema modeling & text indexing |
| **Authentication** | Firebase Auth | `12.12.1` | User authentication & OAuth provider integration |
| **Payments** | Stripe SDK | `22.1.1` | PaymentIntents, Stripe Elements, & webhook processing |
| **File Storage** | Uploadthing | `7.7.4` | Media upload infrastructure for avatars |
| **Email Service** | Resend & React Email | `6.18.1` | Transactional email generation and delivery |
| **URL State** | `nuqs` | `2.8.9` | Type-safe URL search parameter manager |
| **Form Validation** | React Hook Form & Zod | `4.4.3` | Schema validation and form handling |

---

## 📁 Project Directory Structure

```
odyssey-app/
├── app/                        # Next.js App Router Routes & Handlers
│   ├── (auth)/                 # Authentication Routes (Login, Register)
│   ├── (main)/                 # Storefront Views (Landing Page, Catalog, Product Detail)
│   │   ├── items/              # Catalog Listing & [slug] Product Detail Pages
│   │   ├── about/              # Brand Story Page
│   │   └── page.tsx            # High-Impact Editorial Landing Page
│   ├── (protected)/            # RBAC Protected Application Portals
│   │   ├── account/            # Customer Portal (Orders, Wishlist, Addresses, Settings)
│   │   └── admin/              # Administration Suite (Analytics, Products, Orders, Reviews)
│   ├── api/                    # API Route Handlers (Stripe Webhooks, Uploadthing Endpoint)
│   ├── layout.tsx              # Root App Layout (Providers, Navbar, Footer, Sonner Toaster)
│   └── globals.css             # Tailwind CSS v4 styling rules
├── components/                 # React Component Architecture
│   ├── emails/                 # React Email transactional templates
│   ├── form/                   # Form controls & Zod-validated inputs
│   ├── landing/                # Editorial landing sections (Hero, Bento, Craft, CTA)
│   ├── ui/                    # Shadcn UI primitives (Dialog, Button, Input, Table)
│   ├── Navbar.tsx              # Global Navbar with Auth dropdown & Slide-over Cart
│   └── ProductCard.tsx         # Product Card with optimistic Wishlist Heart toggle
├── contexts/                   # React Context Providers (AuthContext, CartContext)
├── hooks/                      # Custom Utility Hooks (useCart, useAuth, useDebounce)
├── lib/                        # Infrastructure Services & Utilities
│   ├── db/                     # MongoDB connection singleton (`mongoose.ts`)
│   ├── email/                  # Resend SDK client & notification service layer
│   ├── firebase/               # Firebase initialization & client config
│   ├── models/                 # Mongoose Schemas (Product, Order, User, Review, Coupon)
│   ├── stripe/                 # Stripe client & PaymentIntent utilities
│   └── utils/                  # Currency formatters, slugify helpers, & URL builders
├── public/                     # Static media assets & favicons
└── README.md                   # Project documentation
```

---

## 🗺 Route & Access Control Matrix

| Path | Access Scope | HTTP / Rendering | Purpose |
| :--- | :--- | :--- | :--- |
| `/` | Public | SSR | Editorial landing page & featured showcases |
| `/items` | Public | SSR + `nuqs` | Product catalog with text search & multi-faceted filters |
| `/items/[slug]` | Public | Dynamic SSR | Product page with reviews, gallery, & stock indicators |
| `/about` | Public | Static | Brand craftsmanship narrative |
| `/login` / `/register` | Public | Client Form | Firebase authentication entry points |
| `/account` | **Customer** | Protected | Customer dashboard overview & recent order history |
| `/account/wishlist` | **Customer** | Protected | Saved favorites with one-click "Move to Cart" |
| `/account/addresses`| **Customer** | Protected | Address manager (Add, Edit, Delete, Set Primary) |
| `/account/settings` | **Customer** | Protected | Profile editor (Uploadthing avatar, Name, Password) |
| `/admin` | **Admin** | Protected | Revenue metrics, order velocity charts, & sales analytics |
| `/admin/products` | **Admin** | Protected | Inventory management table with search & stock edits |
| `/admin/orders` | **Admin** | Protected | Order processing pipeline & status workflow updates |
| `/admin/reviews` | **Admin** | Protected | Moderation dashboard for product review approvals |

---

## 🔑 Environment Configuration

Create a `.env.local` file in the root project directory:

```env
# Application Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/odysseycart?retryWrites=true&w=majority

# Firebase Authentication Credentials
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Stripe Payment Gateway Secrets
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend Transactional Email Infrastructure
RESEND_API_KEY=re_...
EMAIL_FROM="OdysseyCart <orders@yourdomain.com>"

# Uploadthing Media Token
UPLOADTHING_TOKEN=eyJ...
```

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
- **Node.js**: `v18.17.0` or later
- **npm**: `v9.0.0` or later
- **MongoDB**: Active local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

### 2. Setup Guide

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/rakib8680/OdysseyCart.git
   cd OdysseyCart
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Populate `.env.local` with your database, Firebase, Stripe, and Resend credentials as shown above.

4. **Run Development Server:**
   ```bash
   npm run dev
   ```

5. **Access Application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Production Deployment & Infrastructure

OdysseyCart is optimized for deployment on **Vercel**:

1. **Vercel Project Setup:** Import the repository into Vercel and populate the Environment Variables tab with your `.env.local` keys.
2. **Stripe Webhook Configuration:**
   - In Stripe Dashboard → **Developers → Webhooks**, register your endpoint: `https://your-domain.vercel.app/api/webhooks/stripe`.
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`.
   - Copy the Signing Secret into Vercel as `STRIPE_WEBHOOK_SECRET`.
3. **Resend Domain Verification:**
   - Add your custom domain in Resend Dashboard.
   - Insert DKIM and SPF TXT records into your DNS provider.
   - Set `EMAIL_FROM` to use your verified domain address.

---

## 📄 License

Distributed under the **MIT License**. Engineered by [rakib8680](https://github.com/rakib8680).
