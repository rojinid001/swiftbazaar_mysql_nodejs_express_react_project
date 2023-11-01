import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { applyCoupon, createCoupon, deleteCoupon, getAllCoupons, searchCoupon } from '../controllers/couponController.js';

const router = express.Router(); 

//create coupon

router.post('/create-coupon',requireSignIn,isAdmin,createCoupon)

//get all coupon

router.get('/get-coupon',requireSignIn,isAdmin,getAllCoupons)

//search coupon by name
  
router.get('/search-coupon/:couponName',requireSignIn,isAdmin,searchCoupon)

//delete coupon

router.delete('/delete-coupon/:couponName', requireSignIn, isAdmin, deleteCoupon);    

//aplly coupon

router.post('/apply-coupon',requireSignIn,applyCoupon)

export default router;   