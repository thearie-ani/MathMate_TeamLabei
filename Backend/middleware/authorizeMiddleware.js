export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    const role = req.user?.role || "guest";

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    next();
  };
};