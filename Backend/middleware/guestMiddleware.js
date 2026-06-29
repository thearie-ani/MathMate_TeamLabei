import jwt from "jsonwebtoken";

export const optionalAuth = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      req.user = {
        id: null,
        role: "guest"
      };
      return next();
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (err) {
    // If token is invalid → treat as guest
    req.user = {
      id: null,
      role: "guest"
    };
    next();
  }
};