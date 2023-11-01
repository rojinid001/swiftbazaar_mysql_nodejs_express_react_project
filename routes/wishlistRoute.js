import { addItemToWishlist, getWishlistItems, removeItemFromWishlist } from "../controllers/wishlistController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import express from 'express';
const router = express.Router();

router.post('/add-to-wishlist',requireSignIn,addItemToWishlist) 

//get wishlist

router.get('/get-wishlist/:userId',getWishlistItems)

//remove from wishlist

router.delete('/remove-from-wishlist/:itemId',removeItemFromWishlist)  

export default router    
