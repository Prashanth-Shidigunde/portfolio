/**
 * Lightweight Rate Limiter Middleware
 */
const requestsMap = new Map();

module.exports = function rateLimiter(windowMs = 60000, maxRequests = 30) {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const windowData = requestsMap.get(ip) || { count: 0, resetTime: now + windowMs };

    if (now > windowData.resetTime) {
      windowData.count = 1;
      windowData.resetTime = now + windowMs;
    } else {
      windowData.count += 1;
    }

    requestsMap.set(ip, windowData);

    if (windowData.count > maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please slow down and try again later.',
        errorCode: 'RATE_LIMIT_EXCEEDED'
      });
    }

    next();
  };
};
