import crypto from "crypto";
import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken
} from "../utils/jwt.js";
import { sendEmail } from "../utils/email.js";
import jwt from "jsonwebtoken";
import registerService from "../services/register-service.js";

// token
import {generateAccessToken} from "../utils/jwt.js";

// repository
import * as userRepo from "../repository/userReposity.js";

// secure password
import * as passwordSecure from "../utils/password.js"

  const result = await registerService({ name, email, password });

  const accessToken = generateAccessToken(result.user);
  const refreshToken = generateRefreshToken(result.user);

  result.user.refreshToken = refreshToken;
  await result.user.save();

    if (existingUser) {
      return res.status(400).json({
        message: "User already existed!"
      });
    }

  res.json({ accessToken, user: result.user });
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userRepo.findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "Not found" });

    const match = await passwordSecure.comparePassword(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    const token = generateAccessToken(user);

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ 
      here: "here",
      error: err.message });
  }
};

// LOGOUT
// export const logout = async (req, res) => {
//   const token = req.cookies.refreshToken;
//   if (token) {
//     const user = await User.findOne({ refreshToken: token });
//     if (user) {
//       user.refreshToken = null;
//       await user.save();
//     }
//   }

//   res.clearCookie("refreshToken");
//   res.json({ message: "Logged out" });
// };


// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userRepo.findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    await verifyMail.sendEmail({
        to: user.email,
        subject: "Password Reset",
        html: `<p>Reset here: ${resetUrl}</p>`
      }
    );

    res.json({ message: "Email sent" });

    console.log("SAVED TOKEN:", resetToken);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  console.log("PARAM TOKEN:", req.params.token);
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await userRepo.findUserByResetToken(token);

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await passwordSecure.hashPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password reset success" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

