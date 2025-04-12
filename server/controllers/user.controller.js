import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";


import dotenv from 'dotenv';
import { UserModel } from "../model/user.model.js";

dotenv.config();


export const Register = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, role } = req.body;

    if (!name || !email || !password || !phoneNumber || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required including role"
      });
    }

    if (!['Owner', 'Seeker'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be either 'Owner' or 'Seeker'"
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address"
      });
    }

    if (phoneNumber.length !== 10 || !validator.isMobilePhone(phoneNumber, 'any')) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number"
      });
    }

    if (!validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })) {
      return res.status(400).json({
        success: false,
        message: "Password must be strong with 8 characters, uppercase, lowercase, number, and symbol"
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      role
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully"
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to register user"
    });
  }
};



export const Login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and role are required"
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Email or Password"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch || user.role !== role) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Email, Password or Role"
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res.status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
      })
      .json({
        success: true,
        message: `Welcome back, ${user.name}`,
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
          phoneNumber: user.phoneNumber
        }
      });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to login user"
    });
  }
};




export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to logout user"
    });
  }
};


export const getUserProfile = async (req, res) => {
  try {

    const userData = req.userData
    
    const userId=userData._id
   
    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User profile fetched",
      user
    });

  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

export const updateProfile = async (req, res) => {
    try {
      const userData = req.userData
    
      const userId=userData._id
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        req.body, 
        { new: true, runValidators: true }
      ).select('-password'); 
      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Profile update error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to update profile",
      });
    }
  };
  
