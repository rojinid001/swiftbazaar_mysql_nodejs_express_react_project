import Sequelize from 'sequelize';
import sequelize from '../config/database.js';

const Banner = sequelize.define('Banner', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  banner: {
    type: Sequelize.BLOB('long'), 
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
  },
  created_at: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),  
  },
})

export default Banner; 