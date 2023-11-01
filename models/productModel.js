import Sequelize from 'sequelize';
import sequelize from '../config/database.js'; 
import Category from './Category.js'; 
import ProductImage from './ProductImage.js';

const Product = sequelize.define('Product', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: Sequelize.TEXT, 
    allowNull: false,
  },
  price: {
    type: Sequelize.DECIMAL(10, 2), 
  },
  photo: {
    type: Sequelize.ARRAY(Sequelize.INTEGER),
    allowNull: true,
  },
  quantity: {
    type: Sequelize.INTEGER,  
    allowNull: false,
  },

  shipping: {
    type: Sequelize.BOOLEAN, 
    allowNull: true, 
  },
  sizes: {
    type: Sequelize.ARRAY(Sequelize.STRING), 
    allowNull: true,
  },
  category: {    
    type: Sequelize.INTEGER,
    references: {
      model: Category,
      key: 'id', 
    },
    allowNull: false,      
  },
  created: {
    type: Sequelize.DATE, 
    defaultValue: Sequelize.NOW,   
  },
  updated: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,    
  },
});

Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' });

Product.belongsTo(Category, { foreignKey: 'category' });            

export default Product;           
      

  