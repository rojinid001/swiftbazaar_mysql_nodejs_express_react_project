import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import express from 'express';
import { addReview, createProduct, deleteProduct, getAllPhotos, getPhoto, getProduct, getReview, getSingleProduct, productCategoryController, productCount, productFilter, productList, productQuantity, relatedProduct, searchProduct, updateProduct } from "../controllers/productController.js";
import multer from 'multer';
import { deleteOrderController, orderStatus, searchOrderController } from "../controllers/orderController.js";
import { deleteReview, getAllReviews, searchReview } from "../controllers/reviewController.js";

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'client/public/images/'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop()); 
  },  
});       
    
const upload = multer({ storage });
//create product
router.post(      
  '/create-product',  
  requireSignIn,    
  isAdmin,
  upload.array('photo', 3), 
  createProduct
);
// update product route
router.put(
  '/update-product/:pid',
  requireSignIn,
  isAdmin,
  upload.array('photo', 3),  
  updateProduct
);
export default router;       
  
//get product

router.get('/get-product',getProduct)

//get single product

router.get('/get-product/:slug',getSingleProduct)

//get photo
 router.get('/get-photo/:pid',getPhoto)

 //delete product

 router.delete('/delete-product/:pid',deleteProduct)    

 //product filters

 router.post('/product-filter',productFilter) 
 
 //product count

 router.get('/product-count',productCount) 

 //product list
 router.get('/product-list/:page',productList) 

 //search product

 router.get('/search/:keyword',searchProduct)

 //similar products

 router.get('/related-products/:pid/:cid',relatedProduct)

 //category wise Product
 router.get('/product-category/:slug',productCategoryController)

 //add product review

// Add a route for adding reviews to a product
router.post('/add-review/:pid', requireSignIn, addReview);

// get reviews 

router.get('/reviews/:pid',getReview) 

//order status update

router.put('/order-status/:orderId',requireSignIn,isAdmin,orderStatus)      

//get all reviews

router.get('/get-reviews',requireSignIn,isAdmin,getAllReviews)                                      
          
//search review

router.get('/search-review/:searchProductId',requireSignIn,isAdmin,searchReview) 

//delete product review

router.delete('/delete-review/:reviewId', requireSignIn, isAdmin, deleteReview);    

//get all photos

router.get('/photos/:pid', getAllPhotos); 

//get product quantity

router.get('/product-quantity/:pid',requireSignIn,productQuantity)   


//delete order

router.delete('/delete-order/:orderId',requireSignIn,isAdmin,deleteOrderController)   

//search order

router.get('/search-order/:searchOrderId',requireSignIn,isAdmin,searchOrderController)

 

