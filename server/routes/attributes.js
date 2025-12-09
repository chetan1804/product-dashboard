import express from "express";
import Attribute from "../models/Attribute.js";

const router = express.Router();

// GET /api/attributes - Get all attributes
router.get("/", async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const attributes = await Attribute.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Attribute.countDocuments(query);

    res.json({
      attributes,
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

// GET /api/attributes/:id - Get single attribute
router.get("/:id", async (req, res) => {
  try {
    const attribute = await Attribute.findById(req.params.id);
    if (!attribute) {
      return res.status(404).json({ error: "Attribute not found" });
    }
    res.json(attribute);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/attributes - Create new attribute
router.post("/", async (req, res) => {
  try {
    const attribute = new Attribute(req.body);
    await attribute.save();
    res.status(201).json(attribute);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/attributes/:id - Update attribute
router.put("/:id", async (req, res) => {
  try {
    const attribute = await Attribute.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!attribute) {
      return res.status(404).json({ error: "Attribute not found" });
    }
    res.json(attribute);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/attributes/:id - Delete attribute
router.delete("/:id", async (req, res) => {
  try {
    const attribute = await Attribute.findByIdAndDelete(req.params.id);
    if (!attribute) {
      return res.status(404).json({ error: "Attribute not found" });
    }
    res.json({ message: "Attribute deleted successfully", id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
