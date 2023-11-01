import Sequelize from 'sequelize';
import sequelize from '../config/database.js' 

const User = sequelize.define('User', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: true, 
  },
  address: {
    type: Sequelize.STRING,
    allowNull: true, 
  },
  role: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: 'user', 
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
   
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  
  },
});

User.sync();

export default User;
