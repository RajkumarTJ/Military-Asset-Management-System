const express = require('express');
const { Asset, Purchase, Transfer, Assignment } = require('../models');
const { verifyToken, checkRole } = require('../middleware/auth');

const router = express.Router();

// Assets routes
router.get('/assets', verifyToken, async (req, res) => {
    try {
        const assets = await Asset.findAll();
        res.json(assets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/assets', verifyToken, checkRole(['admin']), async (req, res) => {
    try {
        const asset = await Asset.create(req.body);
        res.status(201).json(asset);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Purchases routes
router.post('/purchases', verifyToken, checkRole(['admin', 'logistics_officer']), async (req, res) => {
    try {
        const { name, type, quantity, baseName, date } = req.body;
        if (!name || !type || !quantity || !baseName || !date) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const purchase = await Purchase.create({ name, type, quantity, baseName, date });
        res.status(201).json(purchase);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/purchases', verifyToken, async (req, res) => {
    try {
        const purchases = await Purchase.findAll();
        const filtered = req.user.role === 'base_commander' 
            ? purchases.filter(p => p.baseName === req.user.assignedBase) 
            : purchases;
        res.json(filtered);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Transfers routes
router.post('/transfers', verifyToken, checkRole(['admin', 'logistics_officer']), async (req, res) => {
    try {
        const { assetName, quantity, sourceBase, destinationBase } = req.body;
        if (!assetName || !quantity || !sourceBase || !destinationBase) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const transfer = await Transfer.create({ assetName, quantity, sourceBase, destinationBase });
        res.status(201).json(transfer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/transfers', verifyToken, async (req, res) => {
    try {
        const transfers = await Transfer.findAll();
        const filtered = req.user.role === 'base_commander' 
            ? transfers.filter(t => t.sourceBase === req.user.assignedBase || t.destinationBase === req.user.assignedBase) 
            : transfers;
        res.json(filtered);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Assignments routes
router.post('/assignments', verifyToken, async (req, res) => {
    try {
        const { assetName, personnel, assignedQuantity, expendedQuantity, baseName } = req.body;
        if (!assetName || !personnel || !assignedQuantity || !baseName) {
            return res.status(400).json({ error: 'Required fields missing' });
        }
        const assignment = await Assignment.create({ assetName, personnel, assignedQuantity, expendedQuantity, baseName });
        res.status(201).json(assignment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/assignments', verifyToken, async (req, res) => {
    try {
        const assignments = await Assignment.findAll();
        const filtered = req.user.role === 'base_commander' 
            ? assignments.filter(a => a.baseName === req.user.assignedBase) 
            : assignments;
        res.json(filtered);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 