# Food Delivery Order Management System - Specification

## 1. Project Overview

**Project Name:** Food Delivery Order Management System  
**Project Type:** Full-stack Web Application  
**Core Functionality:** A comprehensive order management system for food delivery with real-time updates, menu management, cart functionality, and order tracking.  
**Target Users:** Restaurant customers, delivery personnel, and restaurant administrators

---

## 2. Technical Architecture

### Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Database:** MongoDB + Mongoose
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Validation:** Zod
- **Real-time:** Socket.io
- **Testing:** Jest + React Testing Library + Supertest

### Layered Architecture
```
Controller (API Routes) → Service → Model
```

### Folder Structure
```
/app
  /api
    /menu/route.ts
    /orders/route.ts
    /orders/[id]/route.ts
  /menu/page.tsx
  /cart/page.tsx
  /checkout/page.tsx
  /order/[id]/page.tsx
/components
/store
/hooks
/services
/models
/lib
/utils
/middleware
/tests
/docs
```

---

## 3. UI/UX Specification

### Color Palette
- **Primary:** #FF6B35 (Vibrant Orange)
- **Primary Dark:** #E55A2B
- **Secondary:** #2D3436 (Dark Charcoal)
- **Accent:** #00B894 (Mint Green)
- **Background:** #FAFAFA (Off-white)
- **Surface:** #FFFFFF (White)
- **Text Primary:** #2D3436
- **Text Secondary:** #636E72
- **Error:** #E74C3C
- **Success:** #00B894
- **Warning:** #FDCB6E
- **Border:** #DFE6E9

### Typography
- **Font Family:** "Inter", system-ui, sans-serif
- **Headings:**
  - H1: 32px, font-weight: 700
  - H2: 24px, font-weight: 600
  - H3: 20px, font-weight: 600
  - H4: 16px, font-weight: 600
- **Body:** 14px, font-weight: 400
- **Small:** 12px, font-weight: 400

### Spacing System
- **Base unit:** 4px
- **Spacing scale:** 4, 8, 12, 16, 24, 32, 48, 64px

### Responsive Breakpoints
- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

### Components

#### Navigation Bar
- Fixed top position
- Logo on left
- Navigation links center
- Cart icon with badge on right
- Height: 64px
- Background: white with shadow

#### Menu Card
- Image (aspect ratio 16:9)
- Title, description, price
- Add to cart button
- Hover: scale(1.02), shadow increase
- Border radius: 12px

#### Cart Item
- Thumbnail image
- Item name, quantity controls
- Price, remove button
- Border radius: 8px

#### Order Card
- Order ID, status badge
- Items list with quantities
- Total price, timestamp
- Status colors:
  - Pending: #FDCB6E (yellow)
  - Preparing: #74B9FF (blue)
  - Ready: #00B894 (green)
  - Delivered: #2D3436 (dark)
  - Cancelled: #E74C3C (red)

#### Form Inputs
- Height: 48px
- Border: 1px solid #DFE6E9
- Border radius: 8px
- Focus: border-color #FF6B35
- Error: border-color #E74C3C

#### Buttons
- **Primary:** Background #FF6B35, text white
- **Secondary:** Background transparent, border #FF6B35, text #FF6B35
- **Disabled:** Background #DFE6E9, text #636E72
- Height: 48px
- Border radius: 8px
- Hover: brightness(1.1)

---

## 4. Functionality Specification

### 4.1 Menu Management

#### Features
- Display all available food items
- Filter by category (Appetizers, Main Course, Desserts, Beverages)
- Search functionality
- Item details modal

#### Data Model - MenuItem
```typescript
{
  _id: ObjectId,
  name: string,
  description: string,
  price: number,
  category: 'appetizer' | 'main' | 'dessert' | 'beverage',
  image: string,
  available: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 4.2 Shopping Cart

#### Features
- Add items to cart
- Update quantity (increment/decrement)
- Remove items from cart
- Calculate subtotal, tax, total
- Persist cart in localStorage
- Clear cart after order placement

#### Data Model - CartItem
```typescript
{
  menuItem: MenuItem,
  quantity: number
}
```

### 4.3 Checkout

#### Features
- Customer information form (name, phone, address)
- Order notes field
- Order summary display
- Form validation with Zod
- Order confirmation

#### Data Model - Customer
```typescript
{
  name: string,
  phone: string,
  address: string,
  notes?: string
}
```

### 4.4 Order Management

#### Features
- Create new order
- View order details
- Order status tracking
- Order history
- Real-time status updates via Socket.io

#### Data Model - Order
```typescript
{
  _id: ObjectId,
  orderNumber: string,
  customer: Customer,
  items: Array<{
    menuItem: ObjectId,
    name: string,
    price: number,
    quantity: number
  }>,
  subtotal: number,
  tax: number,
  total: number,
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled',
  createdAt: Date,
  updatedAt: Date
}
```

### 4.5 Real-time Updates (Socket.io)

#### Events
- `order:created` - New order placed
- `order:updated` - Order status changed
- `order:status` - Status specific update

#### Implementation
- Server-side Socket.io server
- Client-side Socket.io client
- Auto-reconnection
- Optimistic UI updates

---

## 5. API Endpoints

### Menu API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/menu | Get all menu items |
| GET | /api/menu?category={category} | Filter by category |
| GET | /api/menu?search={query} | Search menu items |

### Orders API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/orders | Get all orders |
| POST | /api/orders | Create new order |
| GET | /api/orders/[id] | Get order by ID |
| PATCH | /api/orders/[id] | Update order status |

---

## 6. Pages

### 6.1 Menu Page (`/menu`)
- Hero section with restaurant name
- Category filter tabs
- Search bar
- Grid of menu cards (3 columns desktop, 2 tablet, 1 mobile)
- Floating cart button

### 6.2 Cart Page (`/cart`)
- List of cart items with quantity controls
- Order summary sidebar
- Proceed to checkout button

### 6.3 Checkout Page (`/checkout`)
- Customer information form
- Order summary
- Place order button

### 6.4 Order Details Page (`/order/[id]`)
- Order information
- Status timeline
- Items list
- Real-time status updates

---

## 7. State Management (Zustand)

### Stores
1. **cartStore** - Cart items, quantities, totals
2. **orderStore** - Orders, current order, loading states
3. **menuStore** - Menu items, categories, filters

---

## 8. Validation (Zod)

### Schemas
1. **menuItemSchema** - Menu item validation
2. **customerSchema** - Customer info validation
3. **orderSchema** - Order creation validation

---

## 9. Testing Requirements

### Unit Tests
- Utility functions
- Zod validation schemas
- Zustand store actions

### Component Tests
- Menu card rendering
- Cart item interactions
- Form validation

### Integration Tests
- API route handlers
- Full user flows

---

## 10. Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/food-delivery
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
PORT=3001
NODE_ENV=development
```

---

## 11. Acceptance Criteria

### Functional
- [ ] Menu displays all items with images
- [ ] Category filtering works
- [ ] Search returns relevant results
- [ ] Cart persists across sessions
- [ ] Checkout form validates correctly
- [ ] Orders are created and stored
- [ ] Order status updates in real-time

### Technical
- [ ] TypeScript strict mode passes
- [ ] No linting errors
- [ ] All tests pass
- [ ] Build completes successfully

### UI/UX
- [ ] Responsive on all breakpoints
- [ ] Loading states displayed
- [ ] Error states handled
- [ ] Animations smooth

---

## 12. Deliverables Checklist

- [ ] Complete Next.js application
- [ ] MongoDB models and connection
- [ ] RESTful API routes
- [ ] Real-time Socket.io integration
- [ ] Zustand state management
- [ ] Zod validation schemas
- [ ] Tailwind styled components
- [ ] Jest test suite
- [ ] Documentation (README.md)
- [ ] Environment configuration