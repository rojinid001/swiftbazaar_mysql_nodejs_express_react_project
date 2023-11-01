import express from 'express';
import {registerController,loginController,testController, forgotPasswordController, resetPasswordController, updateProfile} from '../controllers/authController.js';
import { requireSignIn,isAdmin } from '../middlewares/authMiddleware.js';
import { getAllOrdersController, getOrdersController } from '../controllers/orderController.js';
import { deleteUser, getAllUsers, updateUserRole } from '../controllers/adminUserController.js';
//router object
const router =express.Router()
//routing


//REGISTER 

router.post('/register',registerController)

//login
router.post('/login',loginController)

//forgot password
router.post('/forgot-password',forgotPasswordController)

//test
router.get('/test',requireSignIn,isAdmin,testController)       
//reset password
router.get('/reset-password')

//updatepasswoord
router.post('/reset-password',resetPasswordController)

//user-auth
router.get('/user-auth',requireSignIn,(req,res)=>{
    res.status(200).send({ok:true})
})
//admin-auth
router.get('/admin-auth',requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true})
})
//update profile

router.put('/profile',requireSignIn,updateProfile)


//order route

router.get('/orders',requireSignIn,getOrdersController)

//all orders

router.get('/all-orders',requireSignIn,isAdmin,getAllOrdersController)


//admin User Routes

router.get('/all-users',requireSignIn,isAdmin,getAllUsers)


//update user role

router.put('/update-role/:userId',requireSignIn,isAdmin,updateUserRole);

//delete user

router.delete('/delete-user/:userId',requireSignIn,isAdmin,deleteUser)





export default router  