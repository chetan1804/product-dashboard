# Node.js + MongoDB Backend Setup

## Quick Start

### 1. Install MongoDB

Download from: https://www.mongodb.com/try/download/community

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Seed Database

```bash
npm run seed
```

### 4. Start Server

```bash
npm run dev
```

Server runs on: **http://localhost:8000**

## API Documentation

All endpoints return JSON. MongoDB uses `_id` field for document IDs.

### Available Endpoints

- **Products**: `/api/products`
- **Categories**: `/api/categories`
- **Attributes**: `/api/attributes`
- **Orders**: `/api/orders`
- **Users**: `/api/users`
- **Stores**: `/api/stores`
- **Inventory**: `/api/inventory`
- **Analytics**: `/api/analytics`

Each endpoint supports full CRUD operations (GET, POST, PUT, DELETE).
