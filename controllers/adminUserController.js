import userModel from '../models/userModel.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.findAll();

    if (users) {
      return res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: users,
      });
    } else {
      return res.status(404).json({  
        success: false,
        message: 'No users found',
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


//update user role 

export const updateUserRole = async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;
  
    try {
      const user = await userModel.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      user.role = role;
      await user.save();
  
      return res.json({ success: true, message: 'User role updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
  

  //delete user


  export const deleteUser = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await userModel.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      await user.destroy();
  
      return res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };

