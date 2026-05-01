# 🍔 Food Delivery Order Management System

A full-stack food delivery application built with **Next.js (App Router)**, **MongoDB**, and **TypeScript**.
It supports menu browsing, cart management, order placement, and real-time order status updates.

---

## 🚀 Features

* Browse menu with category filters and search
* Add/remove items from cart (with persistence)
* Checkout with form validation (Zod)
* Real-time order status updates
* Responsive UI using Tailwind CSS
* Clean architecture with separation of concerns

---

## 🧱 Tech Stack

* **Frontend:** Next.js 14+, React, Tailwind CSS
* **Backend:** Next.js API Routes
* **Database:** MongoDB (Mongoose)
* **State Management:** Zustand
* **Validation:** Zod
* **Real-time (simulated):** Socket-style updates

---

## 📁 Project Structure

```
app/
  api/            # API routes
  menu/           # Menu page
  cart/           # Cart page
  checkout/       # Checkout page
  order/[id]/     # Order tracking page

components/       # UI components
store/            # Zustand stores
hooks/            # Custom hooks
services/         # Business logic
models/           # MongoDB schemas
lib/              # DB + utilities
utils/            # Validation schemas
tests/            # Unit tests
```

---

## ⚙️ Setup

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd food-delivery
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create `.env.local`:

```env
MONGODB_URI=your_mongodb_connection
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

---

### 4. Run the app

```bash
npm run dev
```

Visit:
👉 http://localhost:3000

---

## 🌱 Seed Data

Populate menu items:

```bash
http://localhost:3000/api/seed
```

---

## 📡 API Overview

### Menu

* `GET /api/menu` → Get all items
* Supports: `?category=main&search=pizza`

### Orders

* `POST /api/orders` → Create order
* `GET /api/orders/[id]` → Get order
* `PATCH /api/orders/[id]` → Update status

---

## 🔄 Order Flow

```
Pending → Preparing → Ready → Delivered
```

Status updates are simulated on the backend to demonstrate real-time behavior.

---

## 🧠 Notes

* Cart is stored on the client (Zustand + localStorage)
* Real-time updates are simulated (no external event system)
* Images are external URLs (fallback handling recommended)

---

## 🧪 Testing

```bash
npm test
```

Includes:

* API tests
* Validation tests
* Store tests
* Component tests

---

## 🚀 Deployment

You can deploy easily on **Vercel**:

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

---

## ⚖️ Design Decisions

* **Zustand** → simpler than Redux
* **MongoDB** → flexible schema
* **Zod** → strong validation + TS support
* **Next.js API** → no separate backend needed

---

## 🤝 About

This project focuses on **clean architecture**, **scalability**, and **real-world patterns** in a simple food delivery system.
