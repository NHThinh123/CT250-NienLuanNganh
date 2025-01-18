const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational
    ? err.message
    : "Something went wrong, please try again later.";

  //console.error("Error stack:", err.stack); // Log lỗi chi tiết

  res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message,
  });
};

module.exports = errorHandler;
