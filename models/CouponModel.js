import Sequelize from 'sequelize';
import sequelize from '../config/database.js'; 

const Coupon = sequelize.define('Coupon', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  expiry: {
    type: Sequelize.DATE, 
    allowNull: false,
  },
  discount: {
    type: Sequelize.INTEGER, 
    allowNull: false,
  },
});

export default Coupon;  