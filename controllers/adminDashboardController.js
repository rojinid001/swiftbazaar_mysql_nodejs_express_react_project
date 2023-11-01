import Order from '../models/orderModel.js'; 
import Product from '../models/productModel.js'
import User from '../models/userModel.js'
import Sequelize from 'sequelize';
import sequelize from '../config/database.js';

//count products 

export const countProducts = async (req, res) => {
    try {
      const totalProducts = await Product.count();
      const products = await Product.findAll();
  
      res.status(200).json({
        success: true,
        total: totalProducts,
        products: products
      });
    } catch (error) {
      console.error(error);  
      res.status(500).json({
        success: false,
        error: 'Error in counting products',
      });
    }
  };


  //count users

  export const countUsers = async (req, res) => {
    try {
      const totalUsers = await User.count();
  
      res.status(200).json({
        success: true,
        total: totalUsers,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Error in counting users',
      });
    }
  };

  //count orders

  export const countOrders = async (req, res) => {
    try {
      const totalOrders = await Order.count();
      const totalAmountPaid = await Order.sum('totalAmountPaid');
  
      res.status(200).json({
        success: true,
        total: totalOrders,
        totalAmountPaid: totalAmountPaid,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Error in counting orders', 
      });
    }
  };


  //savings over time

  export const getEarningsOverTime = async (req, res) => {
    try {
      const earningsOverTime = await Order.findAll({
        attributes: [
          [sequelize.literal('DATE(created_at)'), 'date'], 
          [sequelize.fn('SUM', sequelize.col('totalAmountPaid')), 'earnings'], 
        ],
        group: [sequelize.literal('DATE(created_at)')],
        raw: true,
      });
  
      res.status(200).json({
        success: true,
        data: earningsOverTime,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Error fetching earnings over time',
      });
    }
  };