const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { asyncHandler, HttpError } = require("./helpers");

// Verifies the JWT and loads the current account from the DB (role comes from the DB, never the client)
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) throw new HttpError(401, "Not authenticated");

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    throw new HttpError(401, "Invalid or expired token");
  }

  const user = await User.findById(payload.id);
  if (!user || !user.isActive) throw new HttpError(401, "Account not found or deactivated");
  req.user = user;
  next();
});

// Role check: authorize("HR", "Manager")
const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new HttpError(403, "You do not have permission to perform this action"));
    }
    next();
  };

module.exports = { protect, authorize };
