import express from "express";
import Store from "../models/Store.js";

const router = express.Router();

// GET /api/stores - Get all stores
router.get("/", async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const stores = await Store.find(query)
      .sort({ id: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Store.countDocuments(query);

    res.json({
      stores,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/stores/:id - Get single store
router.get("/:id", async (req, res) => {
  try {
    const store = await Store.findOne({ id: parseInt(req.params.id) });
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }
    res.json(store);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/stores - Create new store
router.post("/", async (req, res) => {
  try {
    const store = new Store(req.body);
    await store.save();
    res.status(201).json(store);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/stores/:id - Update store
router.put("/:id", async (req, res) => {
  try {
    const store = await Store.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      req.body,
      { new: true, runValidators: true }
    );
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }
    res.json(store);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/stores/:id - Delete store
router.delete("/:id", async (req, res) => {
  try {
    const store = await Store.findOneAndDelete({ id: parseInt(req.params.id) });
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }
    res.json({ message: "Store deleted successfully", id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
