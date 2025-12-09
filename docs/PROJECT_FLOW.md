# Project Flow Documentation

## System Architecture Overview

This document describes the complete flow of the multi-store e-commerce admin dashboard, from user interaction to data persistence.

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                    (React + Vite - Port 5173)                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP/HTTPS
                             │ REST API Calls
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                       API GATEWAY                               │
│                  (Vite Proxy in Dev)                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Proxied to /api
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      BACKEND SERVER                             │
│                 (Express.js - Port 8000)                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Routes Layer                                             │  │
│  │  - Authentication                                         │  │
│  │  - Request Validation                                     │  │
│  │  - Authorization                                          │  │
│  └────────────────┬─────────────────────────────────────────┘  │
│                   │                                             │
│  ┌────────────────▼─────────────────────────────────────────┐  │
│  │  Business Logic Layer                                     │  │
│  │  - Data processing                                        │  │
│  │  - Business rules                                         │  │
│  │  - Calculations                                           │  │
│  └────────────────┬─────────────────────────────────────────┘  │
│                   │                                             │
│  ┌────────────────▼─────────────────────────────────────────┐  │
│  │  Data Access Layer (Mongoose Models)                     │  │
│  │  - Product, Order, User, Store, etc.                     │  │
│  └────────────────┬─────────────────────────────────────────┘  │
└───────────────────┼─────────────────────────────────────────────┘
                    │
                    │ MongoDB Driver
                    │
┌───────────────────▼─────────────────────────────────────────────┐
│                     DATABASE LAYER                              │
│                  (MongoDB - Port 27017)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Collections:                                             │  │
│  │  - products, orders, users, stores                        │  │
│  │  - categories, attributes, inventory                      │  │
│  │  - customers, analytics                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Request Flow - Complete Lifecycle

### 1. User Authentication Flow

```
User Login Attempt
       ↓
[Login Page Component]
       ↓
Dispatch loginUser action
       ↓
[Redux Auth Slice]
       ↓
POST /api/users/login
       ↓
[Express Server - Auth Route]
       ↓
Validate credentials
       ↓
[User Model] Query MongoDB
       ↓
Compare password (bcrypt)
       ↓
Generate JWT Token
       ↓
Return { token, user }
       ↓
[Frontend] Store in localStorage
       ↓
[AuthContext] Update global state
       ↓
Redirect to Dashboard
```

### 2. Product Management Flow

#### Fetching Products

```
User navigates to /products
       ↓
[Products Page Component]
       ↓
useEffect → dispatch fetchProducts()
       ↓
[Redux productsSlice]
       ↓
GET /api/products?storeId=xxx
       ↓
[Express Server - Products Route]
       ↓
Extract JWT token
       ↓
Verify authentication
       ↓
[Product Model] Query MongoDB
       ↓
Filter by storeId
       ↓
Apply pagination
       ↓
Return products array
       ↓
[Redux] Update products state
       ↓
[React] Component re-renders
       ↓
Display products in table
```

#### Creating a Product

```
User fills product form
       ↓
Click "Save Product"
       ↓
[Product Form Component]
       ↓
Validate form data (React Hook Form)
       ↓
dispatch createProduct(data)
       ↓
[Redux productsSlice]
       ↓
POST /api/products
       ↓
[Express Server - Products Route]
       ↓
Verify JWT token
       ↓
Validate request body (express-validator)
       ↓
Check permissions
       ↓
[Product Model] Create document
       ↓
MongoDB insert operation
       ↓
Return created product
       ↓
[Redux] Add to products array
       ↓
[React] Update UI
       ↓
Show success notification
       ↓
Redirect or refresh list
```

### 3. Order Processing Flow

```
Customer places order (External)
       ↓
Order created in database
       ↓
Admin opens /orders page
       ↓
[Orders Page Component]
       ↓
dispatch fetchOrders()
       ↓
GET /api/orders?status=pending
       ↓
[Express Server - Orders Route]
       ↓
[Order Model] Query with filters
       ↓
Populate customer & product refs
       ↓
Return orders with full data
       ↓
[Redux] Update orders state
       ↓
Display in orders table
       ↓
Admin clicks "View Details"
       ↓
Navigate to /orders/:id
       ↓
[OrderDetails Component]
       ↓
dispatch fetchOrderById(id)
       ↓
GET /api/orders/:id
       ↓
Return full order details
       ↓
Display order information
       ↓
Admin updates status
       ↓
dispatch updateOrderStatus(id, status)
       ↓
PUT /api/orders/:id
       ↓
[Order Model] Update status
       ↓
Save to MongoDB
       ↓
Return updated order
       ↓
[Redux] Update state
       ↓
Show success message
```

### 4. Multi-Store Flow

```
Admin logs in
       ↓
[AuthContext] Load user & assigned stores
       ↓
[StoreContext] Initialize with stores
       ↓
Display store switcher in header
       ↓
Admin selects different store
       ↓
[StoreSwitcher Component]
       ↓
dispatch setActiveStore(storeId)
       ↓
[Redux storesSlice]
       ↓
Update activeStoreId in state
       ↓
Save to localStorage
       ↓
[StoreContext] Broadcast change
       ↓
All data components re-fetch
       ↓
Products, Orders, Inventory, etc.
       ↓
Include storeId in API calls
       ↓
Backend filters data by storeId
       ↓
Return store-specific data
       ↓
UI updates with new store data
```

### 5. Real-Time Dashboard Updates

```
User navigates to /dashboard
       ↓
[Dashboard Component]
       ↓
Multiple parallel data fetches:
  ├─→ dispatch fetchAnalytics()
  ├─→ dispatch fetchOrders({ limit: 10 })
  ├─→ dispatch fetchProducts({ limit: 5 })
  └─→ dispatch fetchInventoryAlerts()
       ↓
Multiple API calls in parallel:
  ├─→ GET /api/analytics/dashboard
  ├─→ GET /api/orders?limit=10&sort=newest
  ├─→ GET /api/products?limit=5&sort=popular
  └─→ GET /api/inventory/low-stock
       ↓
[Express Server] Handle each request
       ↓
[MongoDB] Execute queries
       ↓
Return aggregated data
       ↓
[Redux] Update multiple slices
       ↓
[Dashboard] Render widgets:
  ├─→ Sales chart (Recharts)
  ├─→ Recent orders table
  ├─→ Top products list
  ├─→ Inventory alerts
  └─→ Revenue stats
       ↓
Auto-refresh every 30 seconds (optional)
```

## State Management Flow

### Redux Store Structure

```javascript
{
  auth: {
    user: { id, name, email, role },
    token: "jwt_token",
    isAuthenticated: true
  },
  products: {
    items: [...],
    loading: false,
    error: null,
    currentProduct: {...}
  },
  orders: {
    items: [...],
    loading: false,
    error: null,
    filters: { status, dateRange }
  },
  stores: {
    items: [...],
    activeStoreId: "store_123",
    loading: false
  },
  categories: {...},
  attributes: {...},
  users: {...},
  analytics: {...}
}
```

### Context vs Redux Decision

**Use Redux for:**

- Data that needs to be cached
- Data fetched from API
- Complex state with many actions
- State shared across many components
- State that needs to persist

**Use Context for:**

- Authentication state (AuthContext)
- Theme settings (ThemeContext)
- Active store selection (StoreContext)
- Simple cross-cutting concerns

## Error Handling Flow

### Frontend Error Handling

```
Error occurs in component
       ↓
Is it a React render error?
  YES → [ErrorBoundary] catches it
      ↓
      Display ErrorPage component
      ↓
      Log to error logger
      ↓
      Show user-friendly message

  NO → Is it an API error?
      ↓
      [Axios interceptor] catches it
      ↓
      Check error status code
      ↓
      401/403 → Redirect to login
      404 → Show not found message
      500 → Show server error message
      ↓
      [Redux] Set error state
      ↓
      Component displays error UI
      ↓
      Provide retry option
```

### Backend Error Handling

```
Error occurs in route handler
       ↓
Is it a validation error?
  YES → express-validator catches it
      ↓
      Return 400 with error details

  NO → Is it a Mongoose error?
      ↓
      Duplicate key → 409 Conflict
      Validation → 400 Bad Request
      Cast error → 400 Invalid ID
      ↓
      [Error middleware] processes error
      ↓
      Log error details
      ↓
      Return structured error response:
      {
        error: "message",
        details: "...",
        statusCode: xxx
      }
```

## Data Flow Patterns

### Optimistic Updates

```
User clicks "Delete Product"
       ↓
[React] Immediately remove from UI
       ↓
dispatch deleteProduct(id)
       ↓
DELETE /api/products/:id
       ↓
If successful:
  ↓
  [Redux] Confirm deletion
  ↓
  Show success message

If failed:
  ↓
  [Redux] Restore item
  ↓
  Show error message
  ↓
  UI reverts to previous state
```

### Lazy Loading

```
User scrolls to bottom of products list
       ↓
[IntersectionObserver] detects scroll
       ↓
Check if more data available
       ↓
dispatch fetchProducts({ page: nextPage })
       ↓
GET /api/products?page=2&limit=20
       ↓
[Express] Query next page
       ↓
Return additional products
       ↓
[Redux] Append to existing array
       ↓
[React] Render new items
```

### Real-Time Search

```
User types in search box
       ↓
[useDebounce hook] Wait 500ms
       ↓
dispatch searchProducts(query)
       ↓
GET /api/products?search=query
       ↓
[Express] MongoDB text search
       ↓
Return filtered results
       ↓
[Redux] Replace products array
       ↓
[React] Display search results
       ↓
User clears search
       ↓
Restore original products list
```

## Security Flow

### Authentication & Authorization

```
Request sent to protected endpoint
       ↓
[Express Middleware] Extract token from header
       ↓
Authorization: Bearer <token>
       ↓
Verify JWT signature
       ↓
Invalid/Expired?
  YES → Return 401 Unauthorized

  NO → Decode token payload
      ↓
      Extract userId & role
      ↓
      Check route permissions
      ↓
      Admin-only route?
        YES → Is user admin?
            NO → Return 403 Forbidden

      Store-specific route?
        YES → Does user belong to store?
            NO → Return 403 Forbidden

      ↓
      [Next()] Continue to route handler
```

### CORS & Security Headers

```
Browser makes request
       ↓
[CORS Middleware] Check origin
       ↓
Allowed origin?
  YES → Add CORS headers
      ↓
      Access-Control-Allow-Origin
      Access-Control-Allow-Methods
      Access-Control-Allow-Headers

  NO → Block request
       ↓
[Express] Process request
       ↓
Return response with security headers
```

## Deployment Flow

### Development

```
1. Start MongoDB
   mongod

2. Start Backend Server
   cd server
   npm run dev
   → Running on http://localhost:8000

3. Start Frontend Dev Server
   cd web
   npm run dev
   → Running on http://localhost:5173

4. Open browser
   http://localhost:5173
   → Vite proxy forwards /api to :8000
```

### Production Build

```
1. Build Frontend
   cd web
   npm run build
   → Creates dist/ folder

2. Test Production Build
   npm run preview

3. Deploy Frontend
   → Upload dist/ to static host
   → Configure API endpoint

4. Deploy Backend
   → Set environment variables
   → Start with npm start
   → Use process manager (PM2)

5. Configure Reverse Proxy
   → Nginx/Apache
   → Route /api to backend
   → Serve static files from dist/
```

## Performance Optimization Flow

### Code Splitting

```
User visits site
       ↓
Load main bundle
       ↓
Render Login/Dashboard
       ↓
User navigates to /products
       ↓
[React.lazy] Dynamically import Products component
       ↓
Load products chunk
       ↓
Render Products page
       ↓
Subsequent visits use cached chunk
```

### Caching Strategy

```
API Request
       ↓
Check Redux cache
       ↓
Data exists & fresh?
  YES → Return from cache

  NO → Make API call
      ↓
      Return data
      ↓
      Cache in Redux
      ↓
      Set timestamp
      ↓
      Future requests check cache first
```

## Testing Flow

### Component Testing

```
Import component
       ↓
Render with Testing Library
       ↓
Mock dependencies:
  - Redux store
  - Router
  - API calls
       ↓
Simulate user interactions
       ↓
Assert expected behavior
       ↓
Verify DOM changes
       ↓
Check accessibility
```

### API Testing

```
Setup test database
       ↓
Seed test data
       ↓
Make API request
       ↓
Assert response status
       ↓
Verify response data
       ↓
Check database state
       ↓
Cleanup test data
```

## Future Enhancements

### WebSocket Integration

```
User opens dashboard
       ↓
Establish WebSocket connection
       ↓
Subscribe to store events
       ↓
New order created
       ↓
Server broadcasts event
       ↓
Client receives notification
       ↓
Update UI in real-time
       ↓
Show toast notification
```

### PWA Offline Support

```
User installs PWA
       ↓
Service Worker installed
       ↓
Cache static assets
       ↓
User goes offline
       ↓
App still loads from cache
       ↓
Queue API requests
       ↓
User comes online
       ↓
Sync queued requests
       ↓
Update UI with synced data
```

## Conclusion

This flow documentation provides a comprehensive overview of how data moves through the system, from user interaction to database persistence. Understanding these flows is crucial for:

- Debugging issues
- Adding new features
- Optimizing performance
- Maintaining security
- Scaling the application

For specific implementation details, refer to:

- [SERVER.md](./SERVER.md) - Backend API documentation
- [WEB.md](./WEB.md) - Frontend application documentation
- [SETUP.md](./SETUP.md) - Complete setup instructions
