const log = (req, res, next) => {
  console.log({
    method: req.method,
    url: req.originalUrl,
    userId: req.user?._id || "Guest",
  });

  next();
};

export default log;