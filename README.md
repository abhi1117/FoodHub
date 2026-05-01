# Food Delivery Order Management System

A production-grade full-stack food delivery application built with Next.js 14+ (App Router), TypeScript, MongoDB, and real-time Socket.io integration.

## 🚀 Features

- **Menu Management**: Browse food items with category filtering and search
- **Shopping Cart**: Add/remove items, quantity management, persistent cart (localStorage)
- **Checkout**: Customer information form with strict Zod validation
- **Order Tracking**: Real-time order status updates via Socket.io
- **Real-time Updates**: Live order status progression (Pending → Preparing → Ready → Delivered)
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **Error Boundary**: Global error handling with fallback UI
- **Test-Driven Development**: Comprehensive Jest tests for validation and components



### Tech Stack Justification

| Technology | Purpose | Why This Choice |
|------------|---------|-----------------|
| **Next.js 14+** | Framework (App Router) | Server-side rendering, API routes, excellent performance |
| **TypeScript** | Type safety | Catch errors at compile time, better IDE support |
| **MongoDB + Mongoose** | Database | Flexible schema, JSON-like documents, great for rapid development |
| **Zustand** | State management | Simple, minimal boilerplate, works great with React |
| **Zod** | Validation | TypeScript-first, composable schemas, excellent error messages |
| **Socket.io** | Real-time updates | Reliable WebSocket implementation, automatic reconnection |
| **Tailwind CSS** | Styling | Utility-first, consistent design system, fast development |
| **Jest** | Testing | Facebook-maintained, excellent integration with React |

## 📁 Project Structure

```
/app                    # Next.js App Router pages
  /api                  # API routes (Backend)
    /menu               # Menu API endpoints
    /orders             # Orders API endpoints
  /menu                 # Menu page (Frontend)
  /cart                 # Cart page (Frontend)
  /checkout             # Checkout page (Frontend)
  /order/[id]           # Order details page (Frontend)
  layout.tsx            # Root layout with Error Boundary
  globals.css           # Global styles and Tailwind
/components             # React components
  MenuCard.tsx          # Menu item card component
  CartItem.tsx          # Cart item component
  OrderCard.tsx         # Order card component
  Navbar.tsx            # Navigation bar
  ErrorBoundary.tsx     # Global error boundary
/store                  # Zustand stores
  cartStore.ts          # Cart state management
  menuStore.ts          # Menu state management
  orderStore.ts         # Order state management
/hooks                  # Custom React hooks
  useMenu.ts            # Menu data fetching hook
  useCart.ts            # Cart operations hook
  useOrder.ts           # Order operations hook
  useSocket.ts          # Socket.io connection hook
/services               # Business logic layer
  menuService.ts        # Menu CRUD operations
  orderService.ts       # Order CRUD operations
/models                 # Mongoose models
  menuItem.ts           # Menu item schema
  order.ts              # Order schema
/lib                    # Utilities
  db.ts                 # MongoDB connection
  socket.ts             # Socket.io server
  orderStatusSimulator.ts # Real-time status simulation
/utils                  # Validation schemas
  validation.ts         # Menu item validation
  orderValidation.ts    # Order validation (Zod)
/tests                  # Jest tests
  cartStore.test.ts     # Cart store tests
  validation.test.ts   # Validation tests
  api.test.ts          # API endpoint tests
  components.test.tsx # Component tests
/scripts                # Utility scripts
  seed.ts               # Database seeding script
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local installation or MongoDB Atlas cloud)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd food-delivery

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your MongoDB URI
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/food-delivery

# Socket.io Configuration
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

For MongoDB Atlas, use the connection string provided in your Atlas dashboard:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/food-delivery?retryWrites=true&w=majority
```

### Development

```bash
# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at `http://localhost:3000`

### Seeding the Database

```bash
# Run the seed script to populate menu items
npx ts-node scripts/seed.ts
```

Or use the API endpoint:
```bash
curl -X POST http://localhost:3000/api/menu/seed
```

## 📡 API Documentation

### Menu API

#### GET /api/menu

Get all menu items with optional filtering.

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| category | string | Filter by category | `?category=main` |
| search | string | Search by name/description | `?search=pizza` |

**Request Example:**
```bash
curl -X GET "http://localhost:3000/api/menu?category=main"
```

**Response Example:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799440011",
      "name": "Grilled Salmon",
      "description": "Fresh Atlantic salmon with lemon herb butter",
      "price": 24.99,
      "category": "main",
      "image": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800",
      "available": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### Orders API

#### GET /api/orders

Get all orders with optional filtering.

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| status | string | Filter by order status | `?status=preparing` |
| phone | string | Filter by customer phone | `?phone=123-456-7890` |

**Request Example:**
```bash
curl -X GET "http://localhost:3000/api/orders?status=pending"
```

**Response Example:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799440012",
      "orderNumber": "ORD-LZ3M2X-A1B2",
      "customer": {
        "name": "John Doe",
        "phone": "123-456-7890",
        "address": "123 Main Street, City, State 12345"
      },
      "items": [
        {
          "menuItem": "507f1f77bcf86cd799440011",
          "name": "Grilled Salmon",
          "price": 24.99,
          "quantity": 2
        }
      ],
      "subtotal": 49.98,
      "tax": 4.00,
      "total": 53.98,
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### POST /api/orders

Create a new order.

**Request Body:**

```json
{
  "customer": {
    "name": "John Doe",
    "phone": "123-456-7890",
    "address": "123 Main Street, City, State 12345",
    "notes": "Leave at door"
  },
  "items": [
    {
      "menuItem": "507f1f77bcf86cd799440011",
      "name": "Grilled Salmon",
      "price": 24.99,
      "quantity": 2
    }
  ],
  "subtotal": 49.98,
  "tax": 4.00,
  "total": 53.98
}
```

**Validation Rules:**

- `customer.name`: Required, 1-100 characters
- `customer.phone`: Required, must match regex `^(\+1)?[\s.-]?\(?[0-9]{3}\)?[\s.-]?[0-9]{3}[\s.-]?[0-9]{4}$`
- `customer.address`: Required, 1-500 characters
- `items`: Required, minimum 1 item
- `items[].quantity`: Required, positive integer
- `subtotal`, `total`: Required, positive numbers
- `tax`: Required, non-negative number

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799440012",
    "orderNumber": "ORD-LZ3M2X-A1B2",
    "customer": { ... },
    "items": [ ... ],
    "subtotal": 49.98,
    "tax": 4.00,
    "total": 53.98,
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "invalid_string",
      "message": "Invalid phone format",
      "path": ["customer", "phone"]
    }
  ]
}
```

#### GET /api/orders/[id]

Get order by ID.

**Response Example:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799440012",
    "orderNumber": "ORD-LZ3M2X-A1B2",
    "status": "preparing",
    "customer": { ... },
    "items": [ ... ],
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### PATCH /api/orders/[id]

Update order status.

**Request Body:**
```json
{
  "status": "preparing"
}
```

**Valid Status Values:**
- `pending` - Order received, waiting for preparation
- `preparing` - Kitchen is preparing the order
- `ready` - Order ready for pickup/delivery
- `delivered` - Order delivered to customer
- `cancelled` - Order cancelled

## 🔄 Real-time Events (Socket.io)

### Server-side Events

| Event | Description | Payload |
|-------|-------------|---------|
| `order:created` | New order placed | Order object |
| `order:updated` | Order updated | Order object |
| `order:status` | Status change (room-specific) | `{ orderId, status, order, updatedAt }` |
| `order:status:broadcast` | Status change (broadcast) | `{ orderId, status, order, updatedAt }` |

### Client-side Events

| Event | Description |
|-------|-------------|
| `connect` | Socket connected |
| `disconnect` | Socket disconnected |
| `order:status` | Listen for order status updates |
| `order:status:broadcast` | Listen for all order status updates |

### Order Status Simulation

The backend automatically simulates order status progression:

```
pending (0s) → preparing (5s) → ready (15s) → delivered (30s)
```

This is implemented in `lib/orderStatusSimulator.ts` and can be customized by modifying the delay times.

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
```

### Test Coverage

- **Validation Tests**: Zod schema validation for menu items and orders
- **API Tests**: Endpoint validation and error handling
- **Component Tests**: React component rendering and interactions
- **Store Tests**: Zustand store state management

## 📝 Validation Schemas

### Customer Schema
```typescript
{
  name: string;        // Required, 1-100 chars
  phone: string;       // Required, regex: ^(\+1)?[\s.-]?\(?[0-9]{3}\)?[\s.-]?[0-9]{3}[\s.-]?[0-9]{4}$
  address: string;     // Required, 1-500 chars
  notes?: string;      // Optional, max 500 chars
}
```

### Order Item Schema
```typescript
{
  menuItem: string;   // Required, MongoDB ObjectId
  name: string;       // Required
  price: number;      // Required, positive
  quantity: number;   // Required, positive integer
}
```

### Order Schema
```typescript
{
  customer: Customer;
  items: OrderItem[]; // Min 1 item
  subtotal: number;   // Positive
  tax: number;        // Non-negative
  total: number;      // Positive
}
```

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `MONGODB_URI` = Your MongoDB connection string
     - `NEXT_PUBLIC_SOCKET_URL` = Your Socket.io server URL
   - Click "Deploy"

3. **Configure MongoDB Atlas**
   - Create a free cluster on MongoDB Atlas
   - Get your connection string
   - Add it to Vercel environment variables

### Environment Variables for Production

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/food-delivery?retryWrites=true&w=majority
NEXT_PUBLIC_SOCKET_URL=https://your-project.vercel.app
```

## 🔧 Trade-offs and Design Decisions

### 1. Real-time Implementation
- **Decision**: Use Socket.io for real-time updates
- **Trade-off**: Requires a separate Socket.io server or integration with Next.js
- **Alternative Considered**: Polling (rejected due to latency and inefficiency)

### 2. Database Choice
- **Decision**: MongoDB with Mongoose
- **Trade-off**: Less strict schema validation compared to SQL
- **Benefit**: Flexible schema for rapid development, JSON-like documents

### 3. State Management
- **Decision**: Zustand for global state
- **Trade-off**: No built-in persistence (solved with zustand/middleware persist)
- **Benefit**: Minimal boilerplate, TypeScript-friendly

### 4. Validation
- **Decision**: Zod for schema validation
- **Trade-off**: Additional dependency
- **Benefit**: TypeScript-first, composable, excellent error messages

### 5. Order Status Simulation
- **Decision**: Backend simulation with setTimeout
- **Trade-off**: Not suitable for production (should be triggered by actual kitchen events)
- **Benefit**: Demonstrates real-time functionality without external systems

## 🤖 How AI Was Used

### Where Copilot Was Used

1. **Code Generation**
   - Initial project structure and scaffolding
   - Component templates (MenuCard, CartItem, OrderCard)
   - API route handlers
   - Zustand store implementations

2. **TypeScript Types**
   - Interface definitions for models
   - Type inference from Zod schemas
   - Prop types for components

3. **Testing**
   - Test file scaffolding
   - Validation test cases
   - Component test templates

### What Was Auto-generated

- Project configuration files (tsconfig.json, next.config.js, tailwind.config.js)
- Basic component structure
- Initial API route handlers
- Store setup with basic CRUD operations

### What Was Manually Improved

1. **Real-time Implementation**
   - Added `orderStatusSimulator.ts` for backend status simulation
   - Enhanced Socket.io events with proper room-based broadcasting
   - Implemented real-time status updates in order page

2. **Validation Enhancement**
   - Added phone regex validation to customer schema
   - Implemented strict quantity validation
   - Added empty cart rejection

3. **Error Handling**
   - Created ErrorBoundary component
   - Added comprehensive error states in UI

4. **Testing**
   - Expanded test coverage with more comprehensive cases
   - Added API validation tests
   - Created component interaction tests

### Limitations of AI

1. **Database Setup**: Cannot create actual MongoDB instance
2. **Environment Configuration**: Requires manual setup of .env.local
3. **Socket.io Server**: Next.js App Router doesn't support custom server easily; simulation demonstrates the concept
4. **Live Testing**: Cannot test real-time Socket.io connections in development

### Debugging with AI

- Used AI to identify issues with type inference
- Received suggestions for proper error handling patterns
- Got help with debugging Socket.io connection issues
- Obtained guidance on proper Zustand store patterns

## 📹 Loom Video Script

### Introduction (0:00 - 1:00)
```
"Welcome to the Food Delivery Order Management System walkthrough.
In this video, I'll explain the architecture, key features, and how
the real-time order tracking works."
```

### Project Overview (1:00 - 3:00)
```
" This is a full-stack food delivery application built with:
- Next.js 14+ with App Router
- MongoDB for data persistence
- Socket.io for real-time updates
- Zustand for state management
- Zod for validation

Let me show you the folder structure and explain each component."
```

### Architecture Explanation (3:00 - 6:00)
```
" The application follows a layered architecture:
- Presentation Layer: Pages and Components
- State Layer: Zustand stores
- Service Layer: Business logic
- Data Layer: Mongoose models

This separation ensures maintainability and scalability."
```

### Code Walkthrough (6:00 - 10:00)
```
" Let's look at the key files:

1. First, the menu API - handles GET requests with filtering
2. The order API - creates orders with strict validation
3. The real-time simulation - automatically progresses order status
4. The Socket.io hook - connects frontend to backend

I'll show you each of these in detail."
```

### API Explanation (10:00 - 12:00)
```
" The API follows RESTful conventions:
- GET /api/menu - returns menu items
- POST /api/orders - creates new order
- GET /api/orders/[id] - gets order details
- PATCH /api/orders/[id] - updates status

All endpoints include validation using Zod schemas."
```

### Real-time Logic (12:00 - 14:00)
```
" One of the key features is real-time order tracking:

1. When an order is created, the backend starts a simulation
2. Every few seconds, the status progresses: pending → preparing → ready → delivered
3. Socket.io emits these updates to the frontend
4. The order page listens and updates the UI automatically

This demonstrates how you'd integrate with a real kitchen system."
```

### Challenges & Solutions (14:00 - 15:00)
```
" Some challenges I faced:
- Phone validation: Added regex pattern for US phone numbers
- Real-time: Created a simulation since we don't have a real kitchen
- Error handling: Added ErrorBoundary for graceful failures

Each challenge led to better solutions."
```

### AI Usage (15:00 - 16:00)
```
" AI (GitHub Copilot) helped significantly with:
- Initial scaffolding and project setup
- Type definitions and interfaces
- Test file generation
- Code suggestions and autocomplete

But manual improvements were needed for:
- Real-time implementation details
- Enhanced validation rules
- Error boundary component
"
```

### Conclusion (16:00 - 17:00)
```
" To get started:
1. Clone the repository
2. Set up MongoDB
3. Run npm install && npm run dev
4. Visit localhost:3000

Thanks for watching! Please like and subscribe for more content."
```

## 📄 License

MIT License - see LICENSE file for details

## 👤 Author

Built with ❤️ by GitHub Copilot

---

## 📌 Quick Links

- [Documentation](./docs/)
- [API Reference](#-api-endpoints)
- [Contributing](./CONTRIBUTING.md)
- [License](./LICENSE)#   F o o d H u b 
 
 