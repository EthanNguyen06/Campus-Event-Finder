const jwt = require("jsonwebtoken");

function optionalAuth(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, username }
    next();
  } catch (err) {
    console.error("JWT verify failed (optional auth):", err.message);
    next();
  }
}

module.exports = optionalAuth;
