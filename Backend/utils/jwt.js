import jwt from "jsonwebtoken";

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (user) => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET || process.env.REFRESH_SECRET;

  if (!refreshSecret) {
    throw new Error("JWT_REFRESH_SECRET is not configured");
  }

  return jwt.sign(
    { id: user._id },
    refreshSecret,
    { expiresIn: "7d" }
  );
};

export {generateAccessToken, generateRefreshToken};