# Jordan Admin — Frontend (Vite + React)

Quick start (development):

PowerShell (from `d:/Jordan/jordan/web`):

````powershell
npm install
npm run dev
# Jordan Admin — Frontend (Vite + React)

## Quick Start (Development)

**Prerequisites:** Node.js 16+

PowerShell (from `d:/Jordan/jordan/web`):

```powershell
npm install
npm run dev
````

Visit `http://localhost:5173` in your browser.

## Run Tests

```powershell
npm run test              # Run all tests
npm run test:coverage     # Generate coverage report
```

## Documentation

- **[TESTING.md](./TESTING.md)** — Comprehensive testing guide with patterns and examples
- **[ERROR_HANDLING.md](./ERROR_HANDLING.md)** — Error boundaries, error UI, and error logging
- **[DOCS_COMPONENTS.md](./DOCS_COMPONENTS.md)** — Component descriptions and responsibilities

## Architecture

### State Management

- **Redux** — Global state (products, orders, stores, categories, attributes, analytics, preferences, users)
- **Context API** — Authentication, Theme, Active Store
- **Custom Hooks** — useDebounce (search), useFetchData (generic API fetching)

### Features

- ✅ Multi-store management with store context
- ✅ Product CRUD with search, filters, pagination, optimistic updates
- ✅ Product categories and attributes management
- ✅ Order management with status filters, date range selection, inline editing
- ✅ Dashboard with Recharts visualizations, KPI cards, time range selector
- ✅ Settings page with theme toggle, preferences, profile management
- ✅ Error boundaries and comprehensive error handling
- ✅ Dark/light mode with localStorage persistence
- ✅ Form validation with React Hook Form
- ✅ Protected routes with role-based access control (superadmin, storeadmin)

### Error Handling

- Error Boundary component catches render-time errors
- LoadingError and ErrorAlert components for user feedback
- Error logging utility with getUserFriendlyMessage()
- Enhanced Redux thunks with rejectWithValue pattern
- API error messages mapped to user-friendly text

## Project Structure

```
src/
├── main.jsx                    # App entry with Redux + Contexts + Router
├── App.jsx                     # Routes and protected wrapper with ErrorBoundary
├── styles.css                  # Global styles + error component styles
├── components/
│   ├── Header.jsx              # App header with user info
│   ├── Sidebar.jsx             # Navigation sidebar
│   ├── ErrorBoundary.jsx       # React error boundary (catches render errors)
│   └── ErrorPage.jsx           # ErrorPage, LoadingError, ErrorAlert components
├── contexts/
│   ├── AuthContext.jsx         # User login state and functions
│   ├── ThemeContext.jsx        # Dark/light mode toggle
│   └── StoreContext.jsx        # Active store selection
├── pages/
│   ├── Login.jsx               # Login form with validation
│   ├── Dashboard.jsx           # Recharts charts, KPI cards, analytics
│   ├── Products.jsx            # Product CRUD with error handling
│   ├── Categories.jsx          # Category CRUD
│   ├── Attributes.jsx          # Attribute CRUD with type selector
│   ├── Orders.jsx              # Order management with filters
│   ├── Stores.jsx              # Store CRUD (superadmin only)
│   ├── Users.jsx               # User CRUD (superadmin only)
│   └── Settings.jsx            # Settings, theme, preferences
├── redux/
│   ├── store.js                # Redux store configuration
│   └── slices/
│       ├── usersSlice.js       # Users (fetch, add, delete)
│       ├── storesSlice.js      # Stores CRUD thunks
│       ├── productsSlice.js    # Products CRUD + optimistic updates + error handling
│       ├── categoriesSlice.js  # Categories CRUD
│       ├── attributesSlice.js  # Attributes CRUD
│       ├── ordersSlice.js      # Orders CRUD + optimistic status updates
│       ├── analyticsSlice.js   # Dashboard analytics data
│       └── preferencesSlice.js # User preferences with localStorage
├── hooks/
│   ├── useDebounce.js          # Debounce hook (300ms default)
│   └── useFetchData.js         # Generic data fetching hook
├── utils/
│   └── errorLogger.js          # Error logging and user-friendly messages
└── __tests__/
	├── Login.test.jsx          # Login component tests
	├── Products.test.jsx       # Products page tests
	├── Orders.test.jsx         # Orders page tests
	├── useDebounce.test.js     # Debounce hook tests
	├── useFetchData.test.js    # Fetch hook tests
	├── productsSlice.test.js   # Redux slice tests
	├── ordersSlice.test.js     # Redux slice tests
	└── ErrorBoundary.test.jsx  # Error handling tests
```

## Key Dependencies

- **Vite 4.5.0** — Fast build tool
- **React 18.2.0** — UI library
- **Redux Toolkit** — State management
- **React Router DOM 6.14.1** — Routing
- **React Hook Form 7.50.0** — Form handling
- **Recharts 2.5.0** — Charts and visualizations
- **Axios 1.5.0** — HTTP client
- **Jest 29.6.0** — Testing framework
- **React Testing Library 14.0.0** — Component testing

## Axios Configuration

Update the API base URL in thunks as needed:

```javascript
// Example: Change from localhost to production
const API_BASE = process.env.VITE_API_URL || "http://localhost:8000";
const res = await axios.get(`${API_BASE}/api/products`);
```

## Environment Variables

Create `.env` or `.env.local` for environment-specific config:

```
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Jordan Admin
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Notes

- This app is a scaffold. Implement backend API calls and adjust Axios base URL as needed.
- Default login: hardcoded mock login (update `AuthContext.jsx` for real JWT)
- In-memory Redux state (persists preferences/theme to localStorage)
- MySQL database schema available in backend: `/server/db/schema.sql`
- For production, set up proper error tracking (Sentry, LogRocket, etc.)

## Contact & Support

For issues, refer to [ERROR_HANDLING.md](./ERROR_HANDLING.md) for debugging tips.
