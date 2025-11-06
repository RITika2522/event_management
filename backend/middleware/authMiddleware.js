const jwt = require("jsonwebtoken");

// Simple middleware to check token from cookie or header
const authMiddleware = (req, res, next) => {
  // First check cookie
  let token = req.cookies?.token;

  // If not found in cookie, check in header
  if (!token) {
    token = req.header("Authorization")?.replace("Bearer ", "");
  }

  if (!token) {
    return res.status(401).json({ message: "No token found. Please login first." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key");
    req.user = {
            id: decoded.id,
            name: decoded.name, // make sure this is included in token when you login
            role: decoded.role,
        };
    next();
  } catch (error) {
    console.log("Token verification failed:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;