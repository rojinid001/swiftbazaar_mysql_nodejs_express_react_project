import Product from '../models/productModel.js';
import slugify from 'slugify';
import fs from 'fs';
import { Op } from 'sequelize';
import Category from '../models/Category.js';
import Review from '../models/reviewModel.js';
import ProductImage from '../models/ProductImage.js'


export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping, sizes } = req.body;
    const photos = req.files; 
    if (!photos || photos.length === 0) {
      return res.status(400).json({ error: 'At least one photo is required' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }
    if (!price || isNaN(price)) {
      return res.status(400).json({ error: 'Valid price is required' });
    }
    if (!category || isNaN(category)) {
      return res.status(400).json({ error: 'Valid category is required' });
    }
    if (!quantity || isNaN(quantity)) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }
    if (photos.some((photo) => photo.size > 1000000)) {
      return res.status(400).json({ error: 'Photos should be less than 1MB each' });
    }

    const sizesArray = sizes.split(',').map(size => size.trim());

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      quantity,
      shipping,
      sizes: sizesArray,
      slug: slugify(name),
    });

    await newProduct.save();

    for (const photo of photos) {
   
      const imageBinaryData = fs.readFileSync(photo.path);

   
      await ProductImage.create({
        photo: imageBinaryData, 
        productId: newProduct.id, 
      });

      
      fs.unlinkSync(photo.path);
    }

    return res.status(201).json({
      success: true,
      message: 'Product Created Successfully',
      product: newProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Error in creating product',
    });
  }
};




//get product
export const getProduct = async (req, res) => {
  try {
  
    const products = await Product.findAll({
      attributes: { exclude: ['photo'] },
    });

    return res.status(200).json({
      success: true,
      message: 'All products retrieved successfully',
      data: products,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};

//get single Product

export const getSingleProduct = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({
      where: { slug },
      attributes: { exclude: ['photo'] },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};


//get photo
export const getPhoto = async (req, res) => {
  try {
    const { pid } = req.params;
    const productImage = await ProductImage.findOne({
      where: { productId: pid },
    });

    if (!productImage) {
      return res.status(404).json({
        success: false,
        error: 'Product image not found', 
      });
    }

    res.setHeader('Content-Type', 'image/jpeg');

     return res.status(200).send(productImage.photo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Error while getting photo',
    });
  }
};



//delete product
export const deleteProduct = async (req, res) => {
  try {

    const productId = req.params.pid;

    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    if (product.photo && product.photo.path) {
      fs.unlinkSync(product.photo.path);
    }

    await ProductImage.destroy({ where: { productId } }); 

    await Review.destroy({ where: { productId } });

    await product.destroy();

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully', 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error', 
    });
  }
};


//update product

export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping, sizes } = req.body;
    const productId = req.params.pid;
    const photo = req.file;

    switch (true) {
      case !name:
        return res.status(400).json({ error: 'Name is required' });
      case !description:
        return res.status(400).json({ error: 'Description is required' });
      case !price:
        return res.status(400).json({ error: 'Price is required' });
      case !category:
        return res.status(400).json({ error: 'Category is required' });
      case !quantity:
        return res.status(400).json({ error: 'Quantity is required' });
    }

    const sizesArray = sizes ? sizes.split(',').map(size => size.trim()) : [];

    const existingProduct = await Product.findByPk(productId);

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    existingProduct.name = name;
    existingProduct.description = description;
    existingProduct.price = price;
    existingProduct.category = category;
    existingProduct.quantity = quantity;
    existingProduct.shipping = shipping;
    existingProduct.sizes = sizesArray;

    if (photo) {
      existingProduct.photo = fs.readFileSync(photo.path);
    }

    await existingProduct.save();

    return res.status(200).json({
      success: true,
      message: 'Product Updated Successfully',
      product: existingProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Error in updating product',
    });
  }
};


//product filter
export const productFilter = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    const where = {};

    if (checked.length > 0) {
      where.category = { [Op.in]: checked };
    }

    if (radio.length === 2) {
      where.price = { [Op.between]: radio };
    }

    const products = await Product.findAll({ 
      where,
    });

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while filtering products",
      error: error.message,
    });
  }
};

//product count
export const productCount = async (req, res) => {
  try {
    const totalProducts = await Product.count();

    res.status(200).json({
      success: true,
      total: totalProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Error in counting products',
    });
  }
};

//product list

export const productList = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;

    const offset = (page - 1) * perPage;

    const products = await Product.findAll({
      attributes: { exclude: ['photo'] }, 
      limit: perPage,
      offset: offset,
      order: [['created', 'DESC']], 
    });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: 'Error in per page ctrl',
      error,
    });
  }
};
//search product
export const searchProduct = async (req, res) => {
  try {
    const { keyword } = req.params;
    const products = await Product.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${keyword}%`,
            },
          },
          {
            description: {
              [Op.like]: `%${keyword}%`,
            },
          },
        ],
      },
      attributes: { exclude: ['photo'] }, 
    });


    return res.status(200).json({
      success: true,
      message: 'Product search completed successfully',
      data: products,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};

//related product

export const relatedProduct = async (req, res) => {
  try {
    const { pid, cid } = req.params;

    const relatedProducts = await Product.findAll({
      where: {
        category: cid,
        id: {
          [Op.not]: pid,
        },
      },
      attributes: { exclude: ['photo'] }, 
      limit: 3, 
    });

    return res.status(200).json({
      success: true,
      message: 'Related products retrieved successfully',
      data: relatedProducts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};
// product on category

export const productCategoryController = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({
      where: { slug },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }
    const products = await Product.findAll({
      where: { category: category.id },
    });

    return res.status(200).json({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Error while getting products',
    });
  }
};

export const addReview = async (req, res) => {
  try {
    const { name, rating, comment } = req.body;
    const productId = req.params.pid;
    const userId = req.user.userId;

    const review = await Review.create({
      name,
      rating,
      comment,
      userId,
      productId,
    });

    const reviews = await Review.findAll({
      where: { productId: productId },
    });

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    await Review.update(
      { average_rating: averageRating },
      { where: { productId: productId } }
    );

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review,
      averageRating, 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Error in adding review',
    });
  }
};


//get review with average rating

export const getReview = async (req, res) => {
  try {
    const productId = req.params.pid;
    const reviews = await Review.findAll({
      where: { productId: productId },
    });

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    res.status(200).json({
      success: true,
      message: 'Reviews retrieved successfully',
      reviews,
      averageRating, 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Error in retrieving reviews',
    });
  }
};

// get all photos
export const getAllPhotos = async (req, res) => {
  try {
    const productId = req.params.pid; 

    const photos = await ProductImage.findAll({
      where: { productId: productId },
    });

    const photoURLs = photos.map((photo) => ({     
      id: photo.id,
      photo:photo.photo
    }));
    res.status(200).json({
      success: true,
      message: 'Photos retrieved successfully',
      photos: photoURLs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Error in retrieving photos',
    });
  }
};

//product quantity

export const productQuantity=async (req, res) => {
  try {
    const { pid} = req.params;
    const product = await Product.findByPk(pid, {
      attributes: ['quantity'],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const productQuantity = product.quantity;

    res.status(200).json({
      success: true,
      message: 'Product quantity retrieved successfully', 
      data: {
        pid,
        quantity: productQuantity,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
}






