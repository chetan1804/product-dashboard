# Web Application Documentation

## Overview

The web application is a modern React-based admin dashboard for managing multi-store e-commerce operations. Built with Vite, React 18, Redux Toolkit, and React Router, it provides a comprehensive interface for managing products, orders, inventory, customers, and analytics.

## Technology Stack

- **Build Tool:** Vite 5.3.0
- **Framework:** React 18.2.0
- **State Management:** Redux Toolkit 1.9.5 + React Redux 8.1.0
- **Routing:** React Router DOM 6.14.1
- **HTTP Client:** Axios 1.5.0
- **Forms:** React Hook Form 7.50.0
- **Charts:** Recharts 2.5.0
- **Testing:** Jest 29.6.0 + Testing Library

## Project Structure

```
web/
├── index.html              # Entry HTML file
├── vite.config.js         # Vite configuration
├── jest.config.js         # Jest test configuration
├── package.json           # Dependencies and scripts
├── src/
│   ├── main.js           # Application entry point
│   ├── App.js            # Root component with routes
│   ├── styles.css        # Global styles
│   ├── components/       # Reusable UI components
│   │   ├── Header.js
│   │   ├── Sidebar.js
│   │   ├── ErrorBoundary.js
│   │   ├── ErrorPage.js
│   │   ├── Protected.js
│   │   └── StoreSwitcher.js
│   ├── pages/           # Page components
│   │   ├── Dashboard.js
│   │   ├── Login.js
│   │   ├── Products.js
│   │   ├── Orders.js
│   │   ├── Inventory.js
│   │   ├── Customers.js
│   │   ├── Users.js
│   │   ├── Categories.js
│   │   ├── Attributes.js
│   │   ├── StoreManagement.js
│   │   ├── Reports.js
│   │   └── Settings.js
│   ├── contexts/        # React Context providers
│   │   ├── AuthContext.js
│   │   ├── StoreContext.js
│   │   └── ThemeContext.js
│   ├── redux/           # Redux state management
│   │   ├── store.js
│   │   └── slices/
│   │       ├── productsSlice.js
│   │       ├── ordersSlice.js
│   │       ├── usersSlice.js
│   │       ├── storesSlice.js
│   │       ├── categoriesSlice.js
│   │       ├── attributesSlice.js
│   │       ├── analyticsSlice.js
│   │       └── preferencesSlice.js
│   ├── hooks/           # Custom React hooks
│   │   ├── useFetchData.js
│   │   └── useDebounce.js
│   ├── utils/           # Utility functions
│   │   ├── formatters.js
│   │   ├── idHelpers.js
│   │   └── errorLogger.js
│   └── __tests__/       # Test files
│       ├── Products.test.js
│       ├── Orders.test.js
│       ├── Login.test.js
│       └── ErrorBoundary.test.js
└── dist/               # Production build output
```

## Setup Instructions

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- Backend server running on `http://localhost:8000`

### Installation Steps

1. **Navigate to web directory:**

   ```powershell
   cd web
   ```

2. **Install dependencies:**

   ```powershell
   npm install
   ```

3. **Configure environment (optional):**

   Create a `.env` file if needed:

   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. **Start development server:**

   ```powershell
   npm run dev
   ```

5. **Open browser:**
   Navigate to `http://localhost:5173`

## Available Scripts

| Script      | Command           | Description                        |
| ----------- | ----------------- | ---------------------------------- |
| Development | `npm run dev`     | Start Vite dev server with HMR     |
| Build       | `npm run build`   | Create production build in `dist/` |
| Preview     | `npm run preview` | Preview production build locally   |
| Test        | `npm run test`    | Run Jest test suite                |

## Application Architecture

### State Management

The application uses a hybrid approach:

1. **Redux Toolkit** - Global application state

   - Products, Orders, Users
   - Store selection and management
   - Analytics data
   - User preferences

2. **React Context** - Cross-cutting concerns

   - Authentication (`AuthContext`)
   - Store selection (`StoreContext`)
   - Theme settings (`ThemeContext`)

3. **Local State** - Component-specific state
   - Form inputs
   - UI toggles
   - Temporary data

### Routing Structure

```
/login                     → Login page (public)
/                          → Dashboard (protected)
/products                  → Product management
/products/variants         → Product variants
/categories                → Category management
/attributes                → Attribute management
/inventory                 → Inventory tracking
/inventory/alerts          → Low stock alerts
/orders                    → Order management
/orders/:id                → Order details
/customers                 → Customer management
/customers/segmentation    → Customer segmentation
/users                     → User management
/stores                    → Store management
/stores/admin              → Store admin panel
/stores/users              → Store users
/reports                   → Reports & analytics
/settings                  → Application settings
/reviews                   → Product reviews
/coupons                   → Coupon management
/shipping                  → Shipping settings
/returns                   → Return management
/email-notifications       → Email settings
/activity-logs             → Activity logs
/seo-tools                 → SEO tools
```

### Component Hierarchy

```
App
├── Header
│   ├── User Profile
│   ├── Notifications
│   └── Store Switcher
├── Sidebar
│   └── Navigation Menu
└── Main Content
    ├── Protected Route Wrapper
    └── Page Components
        ├── ErrorBoundary
        └── Page Content
```

## Key Features

### Authentication & Authorization

- JWT-based authentication
- Protected routes with `Protected` component
- Role-based access control
- Persistent login with localStorage
- Automatic token refresh

### Multi-Store Management

- Switch between stores dynamically
- Store-specific data filtering
- Store admin panel
- Store user management

### Product Management

- CRUD operations for products
- Category and attribute assignment
- Bulk actions
- Product variants
- Image management
- Inventory tracking

### Order Management

- View and filter orders
- Order status updates
- Order details view
- Customer information
- Payment tracking
- Shipping management

### Dashboard & Analytics

- Sales overview
- Revenue charts
- Product performance
- Order statistics
- Real-time updates
- Interactive charts (Recharts)

### User Interface

- Responsive design
- Dark/Light theme toggle
- Search and filtering
- Pagination
- Sorting
- Export functionality
- Error boundaries
- Loading states

## Custom Hooks

### useFetchData

Generic data fetching hook with loading and error states:

```javascript
const { data, loading, error, refetch } = useFetchData("/api/products");
```

### useDebounce

Debounce value changes (useful for search):

```javascript
const debouncedSearch = useDebounce(searchTerm, 500);
```

## Redux Slices

### productsSlice

- `fetchProducts` - Get all products
- `fetchProductById` - Get single product
- `createProduct` - Create new product
- `updateProduct` - Update product
- `deleteProduct` - Delete product

### ordersSlice

- `fetchOrders` - Get all orders
- `fetchOrderById` - Get order details
- `updateOrderStatus` - Change order status
- `createOrder` - Create new order

### usersSlice

- `fetchUsers` - Get all users
- `createUser` - Add new user
- `updateUser` - Update user
- `deleteUser` - Remove user

### storesSlice

- `fetchStores` - Get all stores
- `setActiveStore` - Switch active store
- `createStore` - Create new store
- `updateStore` - Update store

## API Integration

### Axios Configuration

API calls are proxied through Vite dev server:

```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      secure: false,
    }
  }
}
```

### Error Handling

Centralized error handling with:

- Error boundaries for React component errors
- Global error logger
- User-friendly error messages
- Retry mechanisms
- Fallback UI

## Styling

- CSS with custom properties (CSS variables)
- Responsive design (mobile-first)
- Flexbox and Grid layouts
- Theme system (light/dark modes)
- Component-scoped styles

## Testing

### Test Structure

```
__tests__/
├── Components tests
├── Redux slice tests
├── Hook tests
└── Integration tests
```

### Running Tests

```powershell
# Run all tests
npm run test

# Run with coverage
npm run test -- --coverage

# Run specific test
npm run test Login.test.js

# Watch mode
npm run test -- --watch
```

### Testing Libraries

- **Jest** - Test runner
- **@testing-library/react** - Component testing
- **@testing-library/user-event** - User interaction simulation
- **@testing-library/jest-dom** - Custom matchers

## Build & Deployment

### Production Build

```powershell
npm run build
```

This creates optimized production files in `dist/`:

- Minified JavaScript
- Minified CSS
- Optimized assets
- Source maps (optional)

### Build Output

```
dist/
├── index.html           # Entry HTML
├── assets/
│   ├── index.[hash].js  # Main bundle (~860KB, 237KB gzipped)
│   └── index.[hash].css # Styles (~18KB, 3.6KB gzipped)
```

### Preview Production Build

```powershell
npm run preview
```

### Deployment Options

1. **Static Hosting:**

   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3 + CloudFront

2. **Traditional Hosting:**

   - Nginx
   - Apache
   - IIS

3. **Container:**
   - Docker with Nginx
   - Kubernetes

### Environment Configuration

For production, set environment variables:

```env
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Your Store Admin
```

## Performance Optimization

### Current Optimizations

- Code splitting with React.lazy
- Asset optimization via Vite
- Image lazy loading
- Debounced search inputs
- Memoized components

### Recommended Improvements

- [ ] Route-based code splitting
- [ ] Virtual scrolling for large lists
- [ ] Service worker for caching
- [ ] Progressive Web App (PWA)
- [ ] CDN for static assets
- [ ] Bundle analysis and optimization

## Vite Configuration

### JSX in .js Files

The configuration supports JSX syntax in `.js` files:

```javascript
export default defineConfig({
  plugins: [
    react({
      include: "**/*.{jsx,js}",
    }),
  ],
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.js$/,
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
});
```

## Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Focus management
- Screen reader compatibility

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Dev Server Won't Start

**Issue:** Port 5173 already in use
**Solution:** Kill the process or change port in `vite.config.js`

### Build Fails

**Issue:** Module not found
**Solution:** Run `npm install` and clear node_modules if needed

### API Calls Fail

**Issue:** CORS or 404 errors
**Solution:** Verify backend is running on port 8000 and proxy is configured

### Tests Fail

**Issue:** Import errors or syntax issues
**Solution:** Check `jest.config.js` and `jest.setup.js` configuration

## Documentation References

- **[TESTING.md](../web/TESTING.md)** - Comprehensive testing guide
- **[ERROR_HANDLING.md](../web/ERROR_HANDLING.md)** - Error handling patterns
- **[DOCS_COMPONENTS.md](../web/DOCS_COMPONENTS.md)** - Component documentation

## Future Enhancements

- [ ] Add Storybook for component documentation
- [ ] Implement E2E tests with Playwright
- [ ] Add internationalization (i18n)
- [ ] Progressive Web App features
- [ ] Advanced analytics dashboard
- [ ] Real-time notifications via WebSocket
- [ ] Offline support
- [ ] Advanced search with filters
- [ ] Bulk operations improvements
- [ ] Export data to CSV/Excel
