const log = (req, res, next) => {
  console.log({
    Method: req.method,
    URL: req.originalUrl,
    UserId: req.user?._id || "Guest",
  });

  next();
};

export default log;