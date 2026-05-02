const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    status: err.status || "error",
    message: err.message || "Internal server error",
  });
};

export default errorMiddleware;
