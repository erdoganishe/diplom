const allowedOrigins = require('./allowedOrigins');

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin) || true) {
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}

module.exports = credentials;