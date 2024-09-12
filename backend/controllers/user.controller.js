import User from "../models/user.model.js";
import { uploadAtCloudinary } from "../utils/cloudinary.js";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: "None",
};

/* Registration controller */

export const register = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Avatar is required",
      });
    }
    const localPath = req.file.path;
    const avatar = await uploadAtCloudinary(localPath);
    if (!avatar) {
      return res.status(400).json({
        success: false,
        message: "Avatar is required",
      });
    }
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }
    const user = await User.create({
      name,
      email,
      password,
      avatar: avatar?.data?.secure_url,
    });
    await user.save();
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* Login Controller */

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered, please sign up",
      });
    }
    const checkPassword = await user.comparePassword(password);
    if (!checkPassword) {
      return res.status(401).json({
        success: false,
        message: "Wrong password",
      });
    }
    const authToken = user.generateJwt();
    if (!authToken) {
      return res.status(500).json({
        success: false,
        message: "Unable to login, please try again",
      });
    }
    const currentUser = await User.findById(user._id).select("-password")
    res.cookie("authToken", authToken, cookieOptions);
    return res.status(200).json({
      success: true,
      data : currentUser,
      message: "User logged in successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* Update password */

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access,Please login first",
    });
  }

  if (oldPassword === newPassword) {
    return res.status(401).json({
      success: false,
      message: "Oldpassword and newPassword must be different",
    });
  }
  if (!oldPassword || !newPassword) {
    return res.status(401).json({
      success: false,
      message: "All fields are required",
    });
  }
  try {
    const checkPassword = await user.comparePassword(oldPassword);
    if (!checkPassword) {
      return res.status(401).json({
        success: false,
        message: "Wrong old password",
      });
    }
    user.password = newPassword;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* Logout User */

export const logout = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is already loggedout",
      });
    }
    return res.status(200).clearCookie("authToken", cookieOptions).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* Get user data */

export const getUserData = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    const user = await User.findById(userId).select("-password");
    console.log(user);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }
    return res.status(200).json({
      success: true,
      data: user,
      message: "User data fetched successfully",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const changeUserName = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }
    user.name = name;
    await user.save();
    return res.status(200).json({
      success: true,
      data: user,
      message: "User name updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getTotalUsers = async (req, res) => {
    try{
        const users = await User.find()
        return res.status(200).json({
            success : true,
            count : users.length,
            message : "Total courses fetched successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
};
