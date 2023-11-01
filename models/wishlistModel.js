import Sequelize from 'sequelize';
import sequelize from '../config/database.js';
import User from './userModel.js';
import Product from './productModel.js';

const Wishlist = sequelize.define('Wishlist', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ItemName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.DECIMAL(10, 2),
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  productId: {
    type: Sequelize.INTEGER,  
    references: {
      model: Product,
      key: 'id'

    }
  },
  userId: {
    type: Sequelize.INTEGER,        
    references: {
      model: User,
      key: 'id'
    }
  }
});
Wishlist.belongsTo(User, { foreignKey: 'id' });             

export default Wishlist;   
