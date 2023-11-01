import Sequelize from 'sequelize';
import sequelize from '../config/database.js';

const Category = sequelize.define('Category', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
});

Category.beforeCreate((category) => {
  if (category.name) {
    category.slug = category.name.toLowerCase().replace(/ /g, '-');
  }
});

export default Category;
