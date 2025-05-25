const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { sequelize, Asset, Purchase, Transfer, Assignment, User } = require('./models');
const { testConnection } = require('./config/database');
const { verifyToken, checkRole } = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const dashboardRoutes = require('./routes/dashboardData');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', verifyToken, apiRoutes);
app.use('/api', verifyToken, dashboardRoutes);

// Initialize database and create initial data
const initializeDatabase = async () => {
    try {
        // Test database connection
        await testConnection();

        // Sync all models with force:true to recreate tables
        await sequelize.sync({ force: true });
        console.log('✅ Database synced and tables recreated');

        // Create default users if they don't exist
        const defaultUsers = [
            { username: 'boss', password: 'admin123', role: 'admin', assignedBase: 'Alpha Base' },
            { username: 'commander1', password: 'commander123', role: 'base_commander', assignedBase: 'Bravo Base' },
            { username: 'logistics1', password: 'logistics123', role: 'logistics_officer', assignedBase: 'Charlie Base' }
        ];

        for (const userData of defaultUsers) {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            await User.create({
                ...userData,
                password: hashedPassword
            });
            console.log(`✅ User ${userData.username} created`);
        }

        // Create sample assets
        const sampleAssets = [
            { name: "Jeep", type: "Vehicle", openingBalance: 100, closingBalance: 85, assigned: 10, expended: 5 },
            { name: "Tank", type: "Vehicle", openingBalance: 20, closingBalance: 18, assigned: 1, expended: 1 },
            { name: "Truck", type: "Vehicle", openingBalance: 50, closingBalance: 45, assigned: 3, expended: 2 },
            { name: "Rifle", type: "Weapon", openingBalance: 200, closingBalance: 180, assigned: 15, expended: 5 },
            { name: "Pistol", type: "Weapon", openingBalance: 150, closingBalance: 140, assigned: 7, expended: 3 },
            { name: "9mm Rounds", type: "Ammunition", openingBalance: 1000, closingBalance: 800, assigned: 150, expended: 50 },
            { name: "Grenades", type: "Ammunition", openingBalance: 100, closingBalance: 90, assigned: 5, expended: 5 }
        ];

        await Asset.bulkCreate(sampleAssets);
        console.log("✅ Sample assets created");

        // Create sample purchases
        const samplePurchases = [
            { name: "Jeep", type: "Vehicle", quantity: 10, baseName: "Alpha Base", date: new Date() },
            { name: "Rifle", type: "Weapon", quantity: 20, baseName: "Bravo Base", date: new Date() },
            { name: "9mm Rounds", type: "Ammunition", quantity: 1000, baseName: "Charlie Base", date: new Date() }
        ];

        await Purchase.bulkCreate(samplePurchases);
        console.log("✅ Sample purchases created");

        // Create sample transfers
        const sampleTransfers = [
            { assetName: "Jeep", quantity: 2, sourceBase: "Alpha Base", destinationBase: "Bravo Base" },
            { assetName: "Rifle", quantity: 5, sourceBase: "Bravo Base", destinationBase: "Charlie Base" }
        ];

        await Transfer.bulkCreate(sampleTransfers);
        console.log("✅ Sample transfers created");

        // Create sample assignments
        const sampleAssignments = [
            { assetName: "Jeep", personnel: "Squad A", assignedQuantity: 2, expendedQuantity: 0, baseName: "Alpha Base" },
            { assetName: "Rifle", personnel: "Squad B", assignedQuantity: 10, expendedQuantity: 2, baseName: "Bravo Base" }
        ];

        await Assignment.bulkCreate(sampleAssignments);
        console.log("✅ Sample assignments created");

    } catch (error) {
        console.error('❌ Database initialization error:', error);
        process.exit(1);
    }
};

// Start server and initialize database
const startServer = async () => {
    try {
        await initializeDatabase();
        
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Server startup error:', error);
        process.exit(1);
    }
};

startServer();
