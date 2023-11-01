import express from 'express';
import { requireSignIn } from '../middlewares/authMiddleware.js';
import { saveOrderDetails, stripePayment } from '../controllers/stripePaymentController.js';

const router = express.Router(); 

router.post("/create-checkout-session", requireSignIn, stripePayment);

// Route for creating a new order
router.post('/create-order', requireSignIn, saveOrderDetails);





export default router;   
