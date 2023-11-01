import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { countOrders, countProducts, countUsers, getEarningsOverTime } from '../controllers/adminDashboardController.js';
import { createBanner, deleteBannerById, getAllBanners, getBannerById, updateBannerById } from '../controllers/bannerController.js';
const router = express.Router();
import multer from 'multer';
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

//count product

router.get('/get-product-count',requireSignIn,isAdmin,countProducts)

//count orders

router.get('/get-order-count',requireSignIn,isAdmin,countOrders)

//count users

router.get('/get-user-count',requireSignIn,isAdmin,countUsers) 

//create banner

router.post(
    '/create-banner',
    requireSignIn,
    isAdmin,
    upload.single('banner'), 
    createBanner
  );

//get banner

router.get('/get-banner/:bannerId', requireSignIn, getBannerById); 

//get all banners

router.get('/get-all-banner',getAllBanners)     

//delete banner

router.delete('/delete-banner/:bannerId',requireSignIn,isAdmin,deleteBannerById)

//update banner

router.put('/update-banner/:bannerId', upload.single('banner'), requireSignIn,isAdmin,updateBannerById) 
  

export default router 