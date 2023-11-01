import Sequelize from 'sequelize';
import sequelize from '../config/database.js';
import Products from './productModel.js'; 
import Users from './userModel.js'

const Order = sequelize.define('Order', {
    OrderId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    products: {
        type: Sequelize.JSON, 
        references: {
            model: Products, 
            key: 'id', 
          }
    },
    payment: {
        type: Sequelize.JSON,
    },
    buyer: {
        type: Sequelize.STRING(36), 
        references: {
            model: Users, 
            key: 'id',
          },

    },
    totalAmountPaid: {
        type: Sequelize.DECIMAL(10, 2), 
        allowNull: false,
    },
    payment_mode: {
        type: Sequelize.ENUM('Online', 'COD'),
        defaultValue: 'Online', 
      },

    status: {
        type: Sequelize.ENUM('Not Process', 'Processing', 'Shipped', 'Delivered', 'Cancel'),   
        defaultValue: 'Not Process',
    },
    created_at: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    updated_at: {
        type: Sequelize.DATE,  
        allowNull: false,
    },
}, {
    tableName: 'Orders', 
    timestamps: true,  
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

Order.belongsTo(Products, { foreignKey: 'id' }); 
Order.belongsTo(Users, { foreignKey: 'id' }); 

export default Order;  
