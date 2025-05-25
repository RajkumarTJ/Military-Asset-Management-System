const express = require('express');
const router = express.Router();
const { Purchase, Transfer, Assignment } = require('../models');
const { verifyToken } = require('../middleware/auth');

// GET /api/purchases
router.get('/purchases', verifyToken, async (req, res) => {
  try {
    const purchases = await Purchase.findAll();
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/transfers
router.get('/transfers', verifyToken, async (req, res) => {
  try {
    const transfers = await Transfer.findAll();
    res.json(transfers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/assignments
router.get('/assignments', verifyToken, async (req, res) => {
  try {
    const assignments = await Assignment.findAll();
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/purchases
router.post('/purchases', verifyToken, async (req, res) => {
  try {
    const { name, type, quantity, baseName, date } = req.body;
    const purchase = await Purchase.create({ name, type, quantity, baseName, date });
    res.status(201).json(purchase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
