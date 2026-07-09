import crypto from "crypto";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import * as userRepo from "../repository/userReposity.js";

import { hashPassword, comparePassword,} from "../utils/password.js";

import { sendPasswordResetEmail, sendVerificationEmail } from "../utils/email.js";

// register

export const register = async (req, res) => {
  try {
    const { username, email, password} = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email, and password are required",
      });
    }

    const existingUser = await userRepo.findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // hash password
    const hashedPassword = await hashPassword(password);

    const user = await userRepo.createUser({
      username,
      email,
      password: hashedPassword,
      role: "student",
      isVerified: false,
    });

    const verifyToken =
      user.createEmailVerificationToken();

    await user.save({
        validateBeforeSave: false,
    });
    await sendVerificationEmail(
      user.email,
      verifyToken,
      user.username
    );

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email.",
      data: {
        user: {
          id: user._id,
          name: user.username,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatar?.url || "",
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// login

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await userRepo.findUserByEmail(email, "+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isVerified) {

      return res.status(403).json({

          success: false,
          message:
              "Please verify your email before logging in.",

      });
    }
    //  compare passord input with database
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // update activity
    user.updateStreak();
    user.lastSeen = new Date();
    await user.save({ validateBeforeSave: false });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );

    console.log("Login success");
    
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          bio: user.bio,
          avatarUrl: user.avatar?.url || "",
          learningStreak: user.learningStreak,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// logout
export const logout = async (req, res) => {
  try {
    // update user
    await userRepo.updateUser(req.user._id, {
      lastSeen: new Date(),
    });


    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json({
      success: true,
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await userRepo.findUserByEmail(email);

    // always same response (security)
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If email exists, reset link sent",
      });
    }

    const resetToken = user.createPasswordResetToken(); 

    await user.save({ validateBeforeSave: false });

    await sendPasswordResetEmail(user.email, resetToken, user.username);

    return res.status(200).json({
      success: true,
      message: "If email exists, reset link sent",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// reset password

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token invalid or expired",
      });
    }

    // hash new password before saving 
    user.password = await hashPassword(password);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    const newToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
      data: {
        token: newToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try{
    const { token } = req.params;

    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await User.findOne({

        emailVerificationToken: hashedToken,

        emailVerificationExpires: {
            $gt: Date.now(),
        },

    }).select("+emailVerificationToken +emailVerificationExpires");

    if (!user) {

        return res.status(400).json({

            success: false,

            message:
                "Invalid or expired verification link",

        });

    }

    user.isVerified = true;

    user.emailVerificationToken = undefined;

    user.emailVerificationExpires = undefined;

    await user.save();

    return res.json({

        success: true,

        message: "Email verified successfully",

    });
  }catch(error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};