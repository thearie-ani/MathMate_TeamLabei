import crypto from "crypto";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import * as userRepo from "../repository/userReposity.js";

import { hashPassword, comparePassword,} from "../utils/password.js";

import { sendPasswordResetEmail, sendVerificationEmail } from "../utils/email.js";

// register

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email and password are required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await userRepo.findUserByEmail(normalizedEmail);

    /**
     * ==========================
     * User already exists
     * ==========================
     */
    if (existingUser) {
      // Already verified
      if (existingUser.isVerified) {
        return res.status(409).json({
          success: false,
          message: "An account with this email already exists.",
        });
      }

      // Unverified account
      // Generate a fresh verification code

      const verificationCode =
        existingUser.createEmailVerificationCode();

      // Optional:
      // allow updating username/password if user registers again

      existingUser.username = username;
      existingUser.password = await hashPassword(password);

      await existingUser.save({
        validateBeforeSave: false,
      });

      await sendVerificationEmail(
        existingUser.email,
        verificationCode,
        existingUser.username
      );

      return res.status(200).json({
        success: true,
        message:
          "Your account already exists but is not verified. A new verification code has been sent.",
      });
    }

    /**
     * ==========================
     * Create new account
     * ==========================
     */

    const hashedPassword = await hashPassword(password);

    const user = await userRepo.createUser({
      username,
      email: normalizedEmail,
      password: hashedPassword,
      role: "student",
      isVerified: false,
    });

    const verificationCode =
      user.createEmailVerificationCode();

    await user.save({
      validateBeforeSave: false,
    });

    await sendVerificationEmail(
      user.email,
      verificationCode,
      user.username
    );

    return res.status(201).json({
      success: true,
      message:
        "Registration successful. Please check your email for the verification code.",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error.",
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

// console.log("Generated token:", token);
// console.log("Decoded:", jwt.decode(token));

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

export const verifyEmail = async (req,res)=>{

    const {email,code}=req.body;

    const user = await User.findOne({
        email
    }).select("+emailVerificationCode +emailVerificationExpires +emailVerificationAttempts +emailVerificationLockedUntil");

    if(!user){

        return res.status(400).json({
            success:false,
            message:"Invalid verification code."
        });

    }

    if(user.isVerified){

        return res.json({
            success:true,
            message:"Email already verified."
        });

    }

    if(
        user.emailVerificationLockedUntil &&
        user.emailVerificationLockedUntil > Date.now()
    ){

        return res.status(429).json({
            success:false,
            message:"Too many incorrect attempts. Please try again later."
        });

    }

    if(user.emailVerificationExpires < Date.now()){

        return res.status(400).json({
            success:false,
            code:"CODE_EXPIRED",
            message:"Verification code expired."
        });

    }

    const hashedCode = crypto
        .createHash("sha256")
        .update(code)
        .digest("hex");

    if(hashedCode !== user.emailVerificationCode){

        user.emailVerificationAttempts += 1;

        if(user.emailVerificationAttempts >= 5){

            user.emailVerificationLockedUntil =
                Date.now() + 5 * 60 * 1000;

            user.emailVerificationAttempts = 0;

        }

        await user.save({
            validateBeforeSave:false
        });

        return res.status(400).json({
            success:false,
            message:"Invalid verification code."
        });

    }

    user.isVerified = true;

    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;
    user.emailVerificationAttempts = undefined;
    user.emailVerificationLockedUntil = undefined;

    await user.save();

    return res.json({
        success:true,
        message:"Email verified successfully."
    });

};

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    // Always return same response for security
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If the account exists and is not verified, a verification code has been sent.",
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message:
          "If the account exists and is not verified, a verification code has been sent.",
      });
    }

    /**
     * Optional resend cooldown
     */

    if (
      user.emailVerificationExpires &&
      user.emailVerificationExpires.getTime() - Date.now() >
        9 * 60 * 1000
    ) {
      return res.status(429).json({
        success: false,
        message:
          "Please wait before requesting another verification code.",
      });
    }

    const verificationCode =
      user.createEmailVerificationCode();

    await user.save({
      validateBeforeSave: false,
    });

    await sendVerificationEmail(
      user.email,
      verificationCode,
      user.username
    );

    return res.status(200).json({
      success: true,
      message:
        "If the account exists and is not verified, a verification code has been sent.",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};