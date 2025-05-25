const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { verifyToken, checkRole, JWT_SECRET } = require('../middleware/auth');

// Register new user (admin only)
router.post('/register', verifyToken, checkRole(['admin']), async (req, res) => {
    try {
        const { username, password, role, assignedBase } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            username,
            password: hashedPassword,
            role,
            assignedBase
        });

        res.status(201).json({
            message: 'User created successfully',
            user: {
                username: user.username,
                role: user.role,
                assignedBase: user.assignedBase
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ where: { username } });
        
        // If user not found or password doesn't match
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username, 
                role: user.role, 
                assignedBase: user.assignedBase 
            },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Send response
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                assignedBase: user.assignedBase
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get current user
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                assignedBase: user.assignedBase
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
