import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const isLoggedIn = async (req, res, next) => {
  const authToken = req.cookies.authToken;
  if (!authToken) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access: No token provided",
    });
  }

  try {
    const decodedToken = jwt.verify(authToken, process.env.JWTSECRET);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).json({
      success: false,
      message: "Unauthorized access: Token expired or invalid",
    });
  }
};

export const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.user?._id).select("-password");
  if (!user) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized user, please login",
    });
  }
  if (user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: "User has no permission",
    });
  }
  next();
};
