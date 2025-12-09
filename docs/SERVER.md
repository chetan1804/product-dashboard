# Server Documentation

## Overview

The server is a Node.js + Express + MongoDB backend API that powers the multi-store e-commerce admin dashboard. It provides RESTful endpoints for managing products, orders, users, stores, inventory, and analytics.

## Technology Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js 4.18.2
- **Database:** MongoDB with Mongoose ODM 8.0.3
- **Authentication:** JWT (jsonwebtoken 9.0.2) + bcryptjs 2.4.3
- **Validation:** express-validator 7.0.1
- **Environment:** dotenv 16.3.1
- **CORS:** cors 2.8.5

## Project Structure

```
server/
├── server.js           # Main application entry point
├── package.json        # Dependencies and scripts
├── seed.js            # Database seeding script
├── models/            # Mongoose data models
│   ├── Product.js
│   ├── Category.js
│   ├── Attribute.js
│   ├── Order.js
│   ├── User.js
│   ├── Store.js
│   └── Inventory.js
├── routes/            # API route handlers
│   ├── products.js
│   ├── categories.js
│   ├── attributes.js
│   ├── orders.js
│   ├── users.js
│   ├── customers.js
│   ├── stores.js
│   ├── inventory.js
│   └── analytics.js
├── api/              # Legacy PHP API files (migration reference)
└── db/
    └── schema.sql    # Database schema reference
```

## Setup Instructions

### Prerequisites

- Node.js 16+ installed
- MongoDB instance running (local or cloud)
- npm or yarn package manager

### Installation Steps

1. **Navigate to server directory:**

   ```powershell
   cd server
   ```

2. **Install dependencies:**

   ```powershell
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the server directory:

   ```env
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/ecommerce-admin
   JWT_SECRET=your_secure_jwt_secret_here
   NODE_ENV=development
   ```

4. **Start MongoDB:**

   - If using local MongoDB:
     ```powershell
     mongod
     ```
   - Or use MongoDB Atlas connection string

5. **Seed the database (optional):**
   ```powershell
   npm run seed
   ```

### Running the Server

**Development mode (with auto-reload):**

```powershell
npm run dev
```

**Production mode:**

```powershell
npm start
```

The server will start on `http://localhost:8000` (or the PORT specified in `.env`)

## API Endpoints

### Products

- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Categories

- `GET /api/categories` - List all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Attributes

- `GET /api/attributes` - List all attributes
- `GET /api/attributes/:id` - Get attribute by ID
- `POST /api/attributes` - Create new attribute
- `PUT /api/attributes/:id` - Update attribute
- `DELETE /api/attributes/:id` - Delete attribute

### Orders

- `GET /api/orders` - List all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status
- `DELETE /api/orders/:id` - Cancel order

### Users

- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/login` - User authentication
- `POST /api/users/register` - User registration

### Customers

- `GET /api/customers` - List all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Stores

- `GET /api/stores` - List all stores
- `GET /api/stores/:id` - Get store by ID
- `POST /api/stores` - Create new store
- `PUT /api/stores/:id` - Update store
- `DELETE /api/stores/:id` - Delete store

### Inventory

- `GET /api/inventory` - List inventory items
- `GET /api/inventory/:id` - Get inventory by ID
- `PUT /api/inventory/:id` - Update inventory levels
- `GET /api/inventory/low-stock` - Get low stock alerts

### Analytics

- `GET /api/analytics/dashboard` - Dashboard metrics
- `GET /api/analytics/sales` - Sales statistics
- `GET /api/analytics/products` - Product performance
- `GET /api/analytics/orders` - Order analytics

## Data Models

### Product Model

```javascript
{
  name: String,
  sku: String,
  description: String,
  price: Number,
  comparePrice: Number,
  category: ObjectId (ref: Category),
  attributes: [ObjectId] (ref: Attribute),
  images: [String],
  stock: Number,
  status: String (active/inactive),
  storeId: ObjectId (ref: Store),
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model

```javascript
{
  orderNumber: String,
  customer: ObjectId (ref: Customer),
  items: [{
    product: ObjectId,
    quantity: Number,
    price: Number
  }],
  total: Number,
  status: String (pending/processing/shipped/delivered/cancelled),
  shippingAddress: Object,
  storeId: ObjectId (ref: Store),
  createdAt: Date,
  updatedAt: Date
}
```

### User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin/manager/staff),
  storeId: ObjectId (ref: Store),
  permissions: [String],
  active: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Authentication & Authorization

The server uses JWT (JSON Web Tokens) for authentication:

1. **Login:** User sends credentials to `/api/users/login`
2. **Token Generation:** Server validates credentials and returns JWT token
3. **Protected Routes:** Client includes token in `Authorization` header
4. **Token Verification:** Middleware validates token for protected routes

Example token usage:

```
Authorization: Bearer <jwt_token>
```

## Middleware

- **CORS:** Configured to allow cross-origin requests from frontend
- **Body Parser:** JSON and URL-encoded request parsing
- **Request Logging:** Logs all incoming requests with timestamp
- **Error Handling:** Centralized error handling middleware

## Environment Variables

| Variable      | Description                          | Default     |
| ------------- | ------------------------------------ | ----------- |
| `PORT`        | Server port number                   | 8000        |
| `MONGODB_URI` | MongoDB connection string            | -           |
| `JWT_SECRET`  | Secret key for JWT signing           | -           |
| `NODE_ENV`    | Environment (development/production) | development |

## Database Seeding

The `seed.js` script populates the database with sample data:

```powershell
npm run seed
```

This creates:

- Sample products
- Categories
- Attributes
- Stores
- Users
- Orders

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional error details",
  "statusCode": 400
}
```

Common status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Testing

Currently, the server does not have automated tests. Consider adding:

- Unit tests for models and utilities
- Integration tests for API endpoints
- End-to-end tests for workflows

## Deployment

### Production Checklist

1. Set `NODE_ENV=production` in environment
2. Use strong `JWT_SECRET`
3. Configure MongoDB Atlas or production database
4. Enable HTTPS/SSL
5. Set up proper logging and monitoring
6. Configure rate limiting
7. Enable compression middleware
8. Set up backup strategies

### Deployment Options

- **Heroku:** Simple deployment with MongoDB Atlas
- **AWS EC2:** Full control over server configuration
- **DigitalOcean:** Easy droplet setup
- **Vercel/Railway:** Serverless options
- **Docker:** Containerized deployment

## Performance Considerations

- Implement caching (Redis) for frequently accessed data
- Add database indexes for common queries
- Use connection pooling for MongoDB
- Implement pagination for large datasets
- Add response compression
- Consider load balancing for high traffic

## Security Best Practices

- ✅ Environment variables for sensitive data
- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ⚠️ Add rate limiting middleware
- ⚠️ Implement request validation
- ⚠️ Add helmet.js for security headers
- ⚠️ Sanitize user inputs
- ⚠️ Add CSRF protection

## Troubleshooting

### MongoDB Connection Issues

```
Error: MongoDB Connection Error
```

**Solution:** Verify MongoDB is running and `MONGODB_URI` is correct

### Port Already in Use

```
Error: Port 8000 is already in use
```

**Solution:** Change PORT in `.env` or stop the process using port 8000

### Module Not Found

```
Error: Cannot find module
```

**Solution:** Run `npm install` to install dependencies

## Future Enhancements

- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Implement WebSocket for real-time updates
- [ ] Add email notification service
- [ ] Implement file upload service
- [ ] Add comprehensive logging (Winston/Morgan)
- [ ] Create automated test suite
- [ ] Add API versioning
- [ ] Implement GraphQL endpoint option
