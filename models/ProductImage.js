import Sequelize from 'sequelize';

import sequelize from '../config/database.js'; 


const ProductImage = sequelize.define('ProductImage', {
  photo: {
    type: Sequelize.BLOB('long'), 
    allowNull: false,
  },
  created_at: {
    type: Sequelize.DATE, 
    defaultValue: Sequelize.NOW,   
  },
  updated_at: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  }
});


export default ProductImage; 

