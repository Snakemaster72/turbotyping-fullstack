const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || res.statusCode || 500;

  res.status(statusCode).json({
    msg: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
