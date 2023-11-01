import userModel from '../models/userModel.js';
import { hashedPassword } from '../helpers/authHelper.js'; 
import transporter from '../helpers/mailer.js';
import JWT from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import randomstring from 'randomstring';


export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
  
    if (!name || !email || !password || !phone || !address) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required',
      });
    }
    const existingUser = await userModel.findOne({ where: { email } });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists, please login to continue',
      });
    }
    const hashedPasswordValue = await hashedPassword(password);
    const user = await userModel.create({
      name,
      email,
      password: hashedPasswordValue,
      phone,
      address,
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error in registration',
      error: error.message,
    });
  }
};
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }
    const user = await userModel.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }
    const passwordMatch = await bcrypt.compare(password, user.password); 
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,    
        error: 'Invalid email or password',
      });
    }
    const token = JWT.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '10h', 
    });
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token, 
      data: user,
      role:user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error in login',
      error: error.message,
    });
  }
};
export const testController=(req,res)=>{
  res.send({message:"route is protected"})
}

//forgot password

export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required', 
      });           
    }
    const user = await userModel.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }
    const resetToken = randomstring.generate({
      length: 20,
      charset: 'alphanumeric'
    }); 
    const resetLink = `http://localhost:3000/reset-password/${email}/${resetToken}`;

    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 3600000; 
    await user.save();

    const mailOptions = {
      from: 'www.rojindevadaso2@gmail.com', 
      to: email, 
      subject: 'Password Reset Request',
      html: `Click <a href="${resetLink}">here</a> to reset your password.`,
    };

   
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: 'Password reset email sent successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error in sending password reset email',
      error: error.message,
    });
  }
};

// reset password 

export const resetPasswordController = async (req, res) => {
  try {
    const { email,token,newPassword,confirmPassword } = req.body;

    if (!token||!email||!newPassword|| !confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Email, token, and new password are required',
      });
    }
    
    const user = await userModel.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired reset token',
      });
    }

    const hashedPasswordValue = await bcrypt.hash(newPassword, 10);

    user.password = hashedPasswordValue;
    user.resetToken = null;
    user.resetTokenExpires = null;
    try {
      await user.save();
      return res.status(200).json({
        success: true,
        message: 'Password reset successfully',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Error in saving the updated password',
        error: error.message,
      });
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error in resetting the password',
      error: error.message,
    });
  }
};

//update profile

export const updateProfile = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;

    const userId = req.user.userId; 
    const user = await userModel.findByPk(userId); 

    if (password && password.length < 6) {
      return res.json({
        error: "Password is required and must be at least 6 characters long",
      });
    }

    let newhashedPassword = user.password; 

    if (password) {
      newhashedPassword = await hashedPassword(password);
    }

    await user.update({
      name: name || user.name,
      email: email || user.email,
      password: newhashedPassword, 
      phone: phone || user.phone,
      address: address || user.address,
    });

    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser: user,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      success: false,
      message: "Error While Updating Profile",
      error: error.message,
    });
  }
};




