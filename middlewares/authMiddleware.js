import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

export const requireSignIn = async (req, res, next) => {
  try {
    
    const decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    console.log("middleware", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error); 
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',  
    });
  }
};

// admin access
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findByPk(req.user.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'You do not have admin access',
      });
    }
    next();
  } catch (error) {
    console.error(error); 
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};
