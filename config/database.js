import Sequelize from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

//  database connection parameters
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST, 
  dialect: 'mysql',  
  port: 3306,         
  define: {
    timestamps: false 
  }
});

export default sequelize; 
