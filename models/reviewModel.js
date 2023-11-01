import Sequelize from 'sequelize';
import sequelize from '../config/database.js'; 
import User from './userModel.js';
import Product from './productModel.js';

const Review = sequelize.define('Review', {
   
    name: {
        type: Sequelize.STRING,
        allowNull: false, 
    },
    rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        },
    },
    comment: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    userId:{
        type:Sequelize.INTEGER,
        references: {
            model: User, 
            key: 'id'

    }},
    productId:{   
        type:Sequelize.INTEGER, 
        references: {
            model: Product, 
            key: 'id'

    }},
    average_rating: {
        type: Sequelize.DECIMAL(3, 2), 
        defaultValue: 0,
    },

 
});
Review.belongsTo(User, { foreignKey: 'id' }); 
Review.belongsTo(Product, { foreignKey: 'id' }); 



export default Review; 
