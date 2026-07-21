const log = (req, res, next) => {
  console.log({
    Method: req.method,
    URL: req.originalUrl,
    Username: req.user?.username || "Guest",
  });

  next();
};

export default log;