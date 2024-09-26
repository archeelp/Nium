const { v4: uuidv4 } = require('uuid');

const requestIdMiddleware = (req, res, next) => {
    req.requestId = uuidv4();
    res.setHeader('X-Request-Id', req.requestId);  // Include request ID in response headers
    next();
};

module.exports = requestIdMiddleware;
