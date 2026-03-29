const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res
      .status(401)
      .json({ status: "error", message: "No token provided" });
  }

  const token = header.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Token not found in authorization header",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ status: "error", message: "Invalid or expired token" });
  }
};

const allowRoles = (...roles) => {
  console.log("Allowed roles for this route:", roles);

  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: "Access denied: insufficient permissions",
      });
    }
    next();
  };
};

module.exports = { authMiddleware, allowRoles };
