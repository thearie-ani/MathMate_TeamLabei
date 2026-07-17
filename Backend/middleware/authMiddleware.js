import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = header.split(" ")[1];
    // console.log("Received token:", token);
    // console.log("Decoded:", jwt.decode(token));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists.",
      });
    }

    // Update last seen (don't block the request)
    User.findByIdAndUpdate(user._id, {
      lastSeen: new Date(),
    }).catch(console.error);

    req.user = user;
    next();
  } catch (err) {
    console.error(err);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};