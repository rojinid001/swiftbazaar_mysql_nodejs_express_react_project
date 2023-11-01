import Category from '../models/Category.js';
import slugify from 'slugify'
export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if(!name){
        res.status(401).send({
            message:"name is required"
        })
    }
    const existingCategory = await Category.findOne({ where: { name } });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        error: 'Category already exists',
      });
    }
    const newCategory = await Category.create({ name,slug:slugify(name) });

    if (newCategory) {
      return res.status(201).json({
        success: true,
        message:"new category created",
        data: newCategory,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Category could not be created',
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Category ID is required',
      });
    }

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }
    category.name = name;
    category.slug = slugify(name);
    await category.save();

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};

//get all categories

export const categoryController=async (req, res) => {
  try {
    const categories = await Category.findAll();

    return res.status(200).json({
      success: true,
      data: categories,
      message:"all category list" 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};

//single category

export const singleCategory = async (req, res) => {      
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        error: 'Category slug is required',
      });
    }
    const category = await Category.findOne({ where: { slug } });   

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }
 
    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',  
    });
  }
};
//send category based on product id
export const singleCategoryId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Category slug is required',
      });
    }
    const category = await Category.findOne({ where: { id } });    

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }
    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};

//delete category 

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Category ID is required',
      });
    }
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }

    await category.destroy();

    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};
                                
