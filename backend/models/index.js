const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Define User model
const User = sequelize.define('User', {
    username: { 
        type: DataTypes.STRING, 
        allowNull: false,
        unique: true
    },
    password: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    role: { 
        type: DataTypes.ENUM('admin', 'base_commander', 'logistics_officer'),
        allowNull: false
    },
    assignedBase: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

// Define Asset model
const Asset = sequelize.define('Asset', {
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    openingBalance: { type: DataTypes.INTEGER, defaultValue: 0 },
    closingBalance: { type: DataTypes.INTEGER, defaultValue: 0 },
    assigned: { type: DataTypes.INTEGER, defaultValue: 0 },
    expended: { type: DataTypes.INTEGER, defaultValue: 0 }
});

// Define Purchase model
const Purchase = sequelize.define('Purchase', {
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    baseName: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false }
});

// Define Transfer model
const Transfer = sequelize.define('Transfer', {
    assetName: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    sourceBase: { type: DataTypes.STRING, allowNull: false },
    destinationBase: { type: DataTypes.STRING, allowNull: false }
});

// Define Assignment model
const Assignment = sequelize.define('Assignment', {
    personnel: { type: DataTypes.STRING, allowNull: false },
    assetName: { type: DataTypes.STRING, allowNull: false },
    assignedQuantity: { type: DataTypes.INTEGER, allowNull: false },
    expendedQuantity: { type: DataTypes.INTEGER, defaultValue: 0 },
    baseName: { type: DataTypes.STRING, allowNull: false }
});

// Define relationships
Asset.hasMany(Purchase);
Purchase.belongsTo(Asset);

Asset.hasMany(Transfer);
Transfer.belongsTo(Asset);

Asset.hasMany(Assignment);
Assignment.belongsTo(Asset);

module.exports = {
    sequelize,
    User,
    Asset,
    Purchase,
    Transfer,
    Assignment
};
