# Complete Setup & Run Guide

## Multi-Store E-Commerce Admin Dashboard

This guide provides complete step-by-step instructions to set up and run the product dashboard application.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Database Setup](#database-setup)
4. [Backend Server Setup](#backend-server-setup)
5. [Frontend Application Setup](#frontend-application-setup)
6. [Running the Application](#running-the-application)
7. [Verification Steps](#verification-steps)
8. [Common Issues & Solutions](#common-issues--solutions)
9. [Production Deployment](#production-deployment)

---

## Prerequisites

Before starting, ensure you have the following installed on your system:

### Required Software

| Software | Minimum Version | Download Link                                  |
| -------- | --------------- | ---------------------------------------------- |
| Node.js  | 16.x or higher  | https://nodejs.org/                            |
| npm      | 8.x or higher   | (comes with Node.js)                           |
| MongoDB  | 4.4 or higher   | https://www.mongodb.com/try/download/community |
| Git      | Latest          | https://git-scm.com/                           |

### Verify Installation

Open PowerShell and verify installations:

```powershell
# Check Node.js version
node --version
# Expected: v16.x.x or higher

# Check npm version
npm --version
# Expected: 8.x.x or higher

# Check MongoDB
mongod --version
# Expected: db version v4.4.x or higher

# Check Git
git --version
# Expected: git version 2.x.x
```

---

## Initial Setup

### 1. Clone or Download the Project

If using Git:

```powershell
cd d:\Projects\dashboard
git clone <repository-url> product-dashboard
cd product-dashboard
```

If you already have the project:

```powershell
cd d:\Projects\dashboard\product-dashboard
```

### 2. Project Structure Verification

Verify the project structure:

```powershell
dir
```

You should see:

```
├── server/          # Backend API
├── web/            # Frontend React app
├── docs/           # Documentation
├── README.md
└── .gitignore
```

---

## Database Setup

### Option 1: Local MongoDB (Recommended for Development)

#### Step 1: Start MongoDB Service

**Windows:**

```powershell
# Start MongoDB as a service
net start MongoDB

# Or start manually
mongod --dbpath C:\data\db
```

**Verify MongoDB is running:**

```powershell
# Connect to MongoDB shell
mongosh

# You should see MongoDB shell prompt
# Type 'exit' to quit
```

#### Step 2: Create Database

MongoDB will automatically create the database when first accessed, but you can create it manually:

```powershell
mongosh

# In MongoDB shell:
use ecommerce-admin
db.createCollection("products")
exit
```

### Option 2: MongoDB Atlas (Cloud - Recommended for Production)

1. **Create Account:**

   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free tier

2. **Create Cluster:**

   - Create a new cluster (Free tier available)
   - Choose your cloud provider and region
   - Wait for cluster deployment (2-5 minutes)

3. **Setup Database Access:**

   - Go to "Database Access"
   - Add new database user
   - Set username and password
   - Grant "Read and write to any database"

4. **Setup Network Access:**

   - Go to "Network Access"
   - Add IP Address
   - Allow access from anywhere: `0.0.0.0/0` (for development)
   - Or add your specific IP

5. **Get Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password

---

## Backend Server Setup

### Step 1: Navigate to Server Directory

```powershell
cd server
```

### Step 2: Install Dependencies

```powershell
npm install
```

This will install:

- express
- mongoose
- cors
- dotenv
- bcryptjs
- jsonwebtoken
- express-validator
- nodemon (dev dependency)

### Step 3: Configure Environment Variables

Create a `.env` file in the `server` directory:

```powershell
# Create .env file
New-Item -Path .env -ItemType File
```

Edit the `.env` file and add:

**For Local MongoDB:**

```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/ecommerce-admin
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**For MongoDB Atlas:**

```env
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ecommerce-admin?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**Important:** Replace placeholders with actual values!

### Step 4: Verify Server Configuration

Check that the `.env` file is created correctly:

```powershell
Get-Content .env
```

### Step 5: Seed Database (Optional but Recommended)

Populate the database with sample data:

```powershell
npm run seed
```

Expected output:

```
✅ MongoDB Connected Successfully
✅ Database seeded successfully
   - Created X products
   - Created X categories
   - Created X users
   - Created X stores
   - Created X orders
```

### Step 6: Test Server

Start the server in development mode:

```powershell
npm run dev
```

Expected output:

```
✅ MongoDB Connected Successfully
Server running on http://localhost:8000
```

**Test API endpoint:**

Open a browser and visit:

```
http://localhost:8000/api/products
```

You should see JSON data or an empty array.

**Stop the server:** Press `Ctrl+C`

---

## Frontend Application Setup

### Step 1: Navigate to Web Directory

Open a new PowerShell window and navigate to the web directory:

```powershell
cd d:\Projects\dashboard\product-dashboard\web
```

### Step 2: Install Dependencies

```powershell
npm install
```

This will install:

- react
- react-dom
- react-router-dom
- @reduxjs/toolkit
- react-redux
- axios
- recharts
- vite
- Testing libraries
- And other dependencies

**Note:** This may take 2-5 minutes.

### Step 3: Configure Environment (Optional)

If you need custom API URL:

```powershell
New-Item -Path .env -ItemType File
```

Add to `.env`:

```env
VITE_API_URL=http://localhost:8000
```

**Default:** Vite is already configured to proxy `/api` to `http://localhost:8000`

### Step 4: Verify Frontend Configuration

Check `vite.config.js`:

```powershell
Get-Content vite.config.js
```

Verify the proxy configuration is present.

---

## Running the Application

### Full Application Startup

You need **TWO** PowerShell windows running simultaneously.

#### Window 1: Backend Server

```powershell
# Navigate to server directory
cd d:\Projects\dashboard\product-dashboard\server

# Start the server
npm run dev
```

**Expected output:**

```
[nodemon] starting `node server.js`
✅ MongoDB Connected Successfully
Server running on http://localhost:8000
```

**Keep this window running!**

#### Window 2: Frontend Application

```powershell
# Navigate to web directory
cd d:\Projects\dashboard\product-dashboard\web

# Start the development server
npm run dev
```

**Expected output:**

```
VITE v5.x.x ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

**Keep this window running!**

### Step 5: Open Application

Open your browser and navigate to:

```
http://localhost:5173
```

You should see the login page!

---

## Verification Steps

### ✅ Checklist

Complete this checklist to ensure everything is working:

- [ ] **MongoDB is running**

  ```powershell
  mongosh
  show dbs
  ```

  You should see `ecommerce-admin` in the list

- [ ] **Backend server is running**

  - PowerShell shows: "MongoDB Connected Successfully"
  - Visit: http://localhost:8000/api/products
  - Should return JSON data

- [ ] **Frontend is running**

  - PowerShell shows: "Local: http://localhost:5173"
  - No compilation errors

- [ ] **Login page loads**

  - Visit: http://localhost:5173
  - Login form is visible

- [ ] **Can login** (if database is seeded)

  - Use seeded user credentials
  - Successfully redirects to dashboard

- [ ] **Dashboard displays data**
  - Widgets show data
  - No console errors (F12 → Console)

### Test API Endpoints

Use PowerShell to test API:

```powershell
# Test products endpoint
Invoke-RestMethod -Uri "http://localhost:8000/api/products" -Method Get

# Test stores endpoint
Invoke-RestMethod -Uri "http://localhost:8000/api/stores" -Method Get
```

---

## Common Issues & Solutions

### Issue 1: MongoDB Connection Error

**Error:**

```
MongooseServerSelectionError: connect ECONNREFUSED
```

**Solutions:**

1. **Check if MongoDB is running:**

   ```powershell
   # Windows - check service
   Get-Service MongoDB

   # If not running, start it
   net start MongoDB
   ```

2. **Verify MongoDB URI in `.env`:**

   - Check for typos
   - Ensure port is correct (27017)
   - For Atlas, verify credentials

3. **Test MongoDB connection:**
   ```powershell
   mongosh mongodb://localhost:27017
   ```

### Issue 2: Port Already in Use

**Error:**

```
Error: listen EADDRINUSE: address already in use :::8000
```

**Solutions:**

1. **Find process using the port:**

   ```powershell
   netstat -ano | findstr :8000
   ```

2. **Kill the process:**

   ```powershell
   # Replace <PID> with the process ID from previous command
   taskkill /PID <PID> /F
   ```

3. **Or change the port:**
   - Edit `server/.env`
   - Change `PORT=8000` to `PORT=8001`
   - Update frontend proxy in `web/vite.config.js`

### Issue 3: npm install Fails

**Error:**

```
npm ERR! code ENOENT
```

**Solutions:**

1. **Clear npm cache:**

   ```powershell
   npm cache clean --force
   ```

2. **Delete node_modules and reinstall:**

   ```powershell
   Remove-Item -Recurse -Force node_modules
   Remove-Item package-lock.json
   npm install
   ```

3. **Update npm:**
   ```powershell
   npm install -g npm@latest
   ```

### Issue 4: Frontend Shows Blank Page

**Solutions:**

1. **Check browser console (F12):**

   - Look for JavaScript errors
   - Check for CORS errors

2. **Verify backend is running:**

   ```powershell
   # Test API endpoint
   curl http://localhost:8000/api/products
   ```

3. **Clear browser cache:**

   - Hard refresh: `Ctrl + Shift + R`

4. **Rebuild frontend:**
   ```powershell
   cd web
   Remove-Item -Recurse -Force dist
   npm run dev
   ```

### Issue 5: CORS Errors

**Error:**

```
Access to fetch at 'http://localhost:8000/api/...' has been blocked by CORS policy
```

**Solutions:**

1. **Verify proxy in `vite.config.js`:**

   - Should proxy `/api` to backend

2. **Check backend CORS configuration:**

   - Ensure `cors()` middleware is enabled in `server.js`

3. **Restart both servers:**
   - Stop both PowerShell windows (Ctrl+C)
   - Restart backend, then frontend

### Issue 6: Module Not Found Errors

**Error:**

```
Error: Cannot find module './pages/Login'
```

**Solution:**

This might happen after renaming `.jsx` to `.js` files.

1. **Clear Vite cache:**

   ```powershell
   cd web
   Remove-Item -Recurse -Force node_modules/.vite
   npm run dev
   ```

2. **Verify file exists:**
   ```powershell
   Test-Path src/pages/Login.js
   ```

---

## Production Deployment

### Building for Production

#### Step 1: Build Frontend

```powershell
cd web
npm run build
```

This creates optimized files in `web/dist/` folder.

#### Step 2: Test Production Build Locally

```powershell
npm run preview
```

Visit: http://localhost:4173

#### Step 3: Prepare Backend for Production

Update `server/.env` for production:

```env
PORT=8000
MONGODB_URI=<production_mongodb_uri>
JWT_SECRET=<strong_random_secret>
NODE_ENV=production
```

### Deployment Options

#### Option 1: Traditional Hosting (VPS/Dedicated Server)

**Backend:**

1. Upload server files to server
2. Install Node.js and MongoDB
3. Run: `npm install --production`
4. Start with PM2: `pm2 start server.js`

**Frontend:**

1. Upload `web/dist` contents to web server
2. Configure Nginx or Apache
3. Set up reverse proxy for API calls

#### Option 2: Cloud Platforms

**Frontend:**

- Vercel (Recommended)
- Netlify
- AWS S3 + CloudFront

**Backend:**

- Heroku
- Railway
- AWS EC2 / DigitalOcean
- Azure App Service

**Database:**

- MongoDB Atlas (Recommended)

### Environment Variables for Production

**Backend:**

- Set via hosting platform's dashboard
- Never commit `.env` to git

**Frontend:**

- Set `VITE_API_URL` to production API URL
- Rebuild after changing environment variables

---

## Quick Reference Commands

### Daily Development Workflow

```powershell
# Terminal 1: Start Backend
cd d:\Projects\dashboard\product-dashboard\server
npm run dev

# Terminal 2: Start Frontend
cd d:\Projects\dashboard\product-dashboard\web
npm run dev

# Open browser to: http://localhost:5173
```

### Useful Commands

```powershell
# Check what's running on port
netstat -ano | findstr :8000

# MongoDB commands
mongosh                          # Connect to MongoDB
show dbs                         # List databases
use ecommerce-admin              # Switch to database
db.products.find()              # Query products
exit                            # Exit MongoDB shell

# Git commands
git status                      # Check changes
git add .                       # Stage changes
git commit -m "message"         # Commit changes
git push                        # Push to remote

# npm commands
npm install                     # Install dependencies
npm run dev                     # Start development
npm run build                   # Build for production
npm test                        # Run tests
```

---

## Next Steps

After successfully running the application:

1. **Explore the Interface:**

   - Login with seeded credentials
   - Navigate through different pages
   - Test CRUD operations

2. **Read Documentation:**

   - [SERVER.md](./SERVER.md) - Backend API details
   - [WEB.md](./WEB.md) - Frontend architecture
   - [PROJECT_FLOW.md](./PROJECT_FLOW.md) - Complete system flow

3. **Start Development:**

   - Create new features
   - Add custom components
   - Extend API endpoints

4. **Testing:**
   - Write unit tests
   - Test API endpoints
   - Perform integration testing

---

## Getting Help

### Resources

- **Project Documentation:** Check `docs/` folder
- **Backend Issues:** See [SERVER.md](./SERVER.md)
- **Frontend Issues:** See [WEB.md](./WEB.md)
- **Workflow Issues:** See [PROJECT_FLOW.md](./PROJECT_FLOW.md)

### Troubleshooting Steps

1. Check both server logs for errors
2. Verify all services are running
3. Check browser console for errors
4. Review relevant documentation
5. Check MongoDB connection and data

---

## Summary

You should now have:

✅ MongoDB running and accessible  
✅ Backend server running on http://localhost:8000  
✅ Frontend application running on http://localhost:5173  
✅ Ability to login and navigate the application  
✅ Understanding of project structure and flow

**Happy Coding! 🚀**
