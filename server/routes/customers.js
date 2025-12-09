import express from "express";

const router = express.Router();

// Placeholder for customers endpoint
// You can expand this later with a Customer model if needed

router.get("/", async (req, res) => {
  res.json({
    customers: [],
    message: "Customers endpoint - to be implemented",
  });
});

export default router;
