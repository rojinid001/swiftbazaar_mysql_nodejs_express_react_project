import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { categoryController, createCategoryController, deleteCategory, singleCategory, singleCategoryId, updateCategory } from '../controllers/categoryController.js';
const router=express.Router()

//routes
router.post('/create-category',requireSignIn,isAdmin,createCategoryController)
export default router

//update category

router.put('/update-category/:id',requireSignIn,isAdmin,updateCategory)        

//category

router.get('/get-category',categoryController)

//single category

router.get('/single-category/:slug',singleCategory)     

//delete category

router.delete('/delete-category/:id',requireSignIn,isAdmin,deleteCategory)

//get category based on product id
router.get('/single-categoryId/:id',singleCategoryId)

