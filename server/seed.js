import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import Category from "./models/Category.js";
import Attribute from "./models/Attribute.js";
import Order from "./models/Order.js";
import User from "./models/User.js";
import Store from "./models/Store.js";
import Inventory from "./models/Inventory.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Attribute.deleteMany({});
    await Order.deleteMany({});
    await User.deleteMany({});
    await Store.deleteMany({});
    await Inventory.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Seed Stores
    const stores = await Store.insertMany([
      {
        id: 1,
        name: "Main Store NY",
        slug: "main-store-ny",
        location: "123 Broadway, New York",
        address: "123 Broadway",
        city: "New York",
        state: "NY",
        zip: "10001",
        phone: "+1-212-555-0001",
        email: "ny@jordanstore.com",
        status: "active",
        storeAdminId: 2,
        storeAdminName: "John Store Admin",
        totalOrders: 1250,
        totalRevenue: 125000,
        activeEditors: 3,
      },
      {
        id: 2,
        name: "Boston Store",
        slug: "boston-store",
        location: "456 Market St, Boston",
        address: "456 Market St",
        city: "Boston",
        state: "MA",
        zip: "02101",
        phone: "+1-617-555-0002",
        email: "boston@jordanstore.com",
        status: "active",
        storeAdminId: 3,
        storeAdminName: "Sarah Manager",
        totalOrders: 890,
        totalRevenue: 89000,
        activeEditors: 2,
      },
      {
        id: 3,
        name: "LA Store",
        slug: "la-store",
        location: "789 Sunset Blvd, Los Angeles",
        address: "789 Sunset Blvd",
        city: "Los Angeles",
        state: "CA",
        zip: "90001",
        phone: "+1-323-555-0003",
        email: "la@jordanstore.com",
        status: "active",
        storeAdminId: 4,
        storeAdminName: "Mike Johnson",
        totalOrders: 1560,
        totalRevenue: 156000,
        activeEditors: 4,
      },
    ]);
    console.log("✅ Seeded Stores:", stores.length);

    // Seed Categories (with slugs)
    const categories = await Category.insertMany([
      {
        name: "Electronics",
        slug: "electronics",
        description: "Electronic devices and gadgets",
        status: "active",
      },
      {
        name: "Clothing",
        slug: "clothing",
        description: "Fashion and apparel",
        status: "active",
      },
      {
        name: "Home & Kitchen",
        slug: "home-kitchen",
        description: "Home essentials and kitchen items",
        status: "active",
      },
      {
        name: "Books",
        slug: "books",
        description: "Books and publications",
        status: "active",
      },
      {
        name: "Sports",
        slug: "sports",
        description: "Sports equipment and gear",
        status: "active",
      },
    ]);
    console.log("✅ Seeded Categories:", categories.length);

    // Seed Attributes
    const attributes = await Attribute.insertMany([
      {
        name: "Color",
        type: "color",
        options: "Red,Blue,Green,Black,White",
        status: "active",
      },
      { name: "Size", type: "size", options: "S,M,L,XL,XXL", status: "active" },
      {
        name: "Material",
        type: "text",
        options: "Cotton,Polyester,Leather,Metal",
        status: "active",
      },
      {
        name: "Brand",
        type: "select",
        options: "Apple,Samsung,Nike,Adidas",
        status: "active",
      },
    ]);
    console.log("✅ Seeded Attributes:", attributes.length);

    // Seed Products
    const products = await Product.insertMany([
      {
        title: "Laptop Pro 15",
        description: "High-performance laptop for professionals",
        price: 1299.99,
        salePrice: 1199.99,
        costPrice: 900,
        stock: 45,
        sku: "LAP-PRO-15",
        category: "Electronics",
        brand: "TechBrand",
        weight: 2.5,
        status: "active",
        featured: true,
      },
      {
        title: "Wireless Mouse",
        description: "Ergonomic wireless mouse",
        price: 29.99,
        stock: 120,
        sku: "MOUSE-WL-01",
        category: "Electronics",
        brand: "TechBrand",
        status: "active",
      },
      {
        title: "Running Shoes",
        description: "Comfortable running shoes",
        price: 89.99,
        salePrice: 79.99,
        stock: 80,
        sku: "SHOE-RUN-01",
        category: "Sports",
        brand: "SportsBrand",
        status: "active",
      },
      {
        title: "Coffee Maker",
        description: "Automatic coffee maker",
        price: 149.99,
        stock: 35,
        sku: "COFFEE-AUTO-01",
        category: "Home & Kitchen",
        status: "active",
      },
      {
        title: "USB-C Cable",
        description: "Fast charging USB-C cable",
        price: 9.99,
        stock: 200,
        sku: "CABLE-USBC-01",
        category: "Electronics",
        status: "active",
      },
    ]);
    console.log("✅ Seeded Products:", products.length);

    // Seed Orders
    const orders = await Order.insertMany([
      {
        customer_name: "John Doe",
        customer_email: "john@example.com",
        customer_phone: "+1-555-0001",
        total: 99.99,
        status: "pending",
        storeId: 1,
        items: [
          {
            productId: products[1]._id,
            productName: "Wireless Mouse",
            quantity: 1,
            price: 29.99,
          },
        ],
        paymentStatus: "paid",
      },
      {
        customer_name: "Jane Smith",
        customer_email: "jane@example.com",
        customer_phone: "+1-555-0002",
        total: 249.99,
        status: "shipped",
        storeId: 2,
        items: [
          {
            productId: products[2]._id,
            productName: "Running Shoes",
            quantity: 2,
            price: 79.99,
          },
        ],
        paymentStatus: "paid",
      },
      {
        customer_name: "Bob Johnson",
        customer_email: "bob@example.com",
        customer_phone: "+1-555-0003",
        total: 149.99,
        status: "delivered",
        storeId: 1,
        items: [
          {
            productId: products[3]._id,
            productName: "Coffee Maker",
            quantity: 1,
            price: 149.99,
          },
        ],
        paymentStatus: "paid",
      },
      {
        customer_name: "Sarah Williams",
        customer_email: "sarah@example.com",
        customer_phone: "+1-555-0004",
        total: 179.99,
        status: "processing",
        storeId: 3,
        items: [
          {
            productId: products[2]._id,
            productName: "Running Shoes",
            quantity: 2,
            price: 79.99,
          },
        ],
        paymentStatus: "pending",
      },
    ]);
    console.log("✅ Seeded Orders:", orders.length);

    // Seed Users
    const users = await User.insertMany([
      {
        name: "Super Admin",
        email: "admin@example.com",
        password: "admin123", // In production, hash this!
        role: "super_admin",
        storeId: null,
        status: "active",
      },
      {
        name: "John Store Admin",
        email: "john@store.com",
        password: "store123",
        role: "store_admin",
        storeId: 1,
        status: "active",
      },
      {
        name: "Sarah Manager",
        email: "sarah@store.com",
        password: "store123",
        role: "store_admin",
        storeId: 2,
        status: "active",
      },
      {
        name: "Editor User",
        email: "editor@store.com",
        password: "editor123",
        role: "editor",
        storeId: 1,
        status: "active",
      },
    ]);
    console.log("✅ Seeded Users:", users.length);

    // Seed Inventory
    const inventory = await Inventory.insertMany([
      {
        productId: products[0]._id,
        sku: products[0].sku,
        stock: products[0].stock,
        location: "Warehouse A",
        lowStockThreshold: 10,
        status: "in_stock",
      },
      {
        productId: products[1]._id,
        sku: products[1].sku,
        stock: products[1].stock,
        location: "Warehouse A",
        lowStockThreshold: 20,
        status: "in_stock",
      },
      {
        productId: products[4]._id,
        sku: products[4].sku,
        stock: products[4].stock,
        location: "Warehouse B",
        lowStockThreshold: 50,
        status: "in_stock",
      },
    ]);
    console.log("✅ Seeded Inventory:", inventory.length);

    console.log("✨ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
