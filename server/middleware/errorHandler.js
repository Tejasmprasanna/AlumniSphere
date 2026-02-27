const errorHandler = (err, req, res, next) => {
    // We do not console logging in production
    // console.error(err.stack);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        // Do not leak stack trace in production unless strictly needed
        // stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { errorHandler };
