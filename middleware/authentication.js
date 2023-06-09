const CustomErr = require("../errors");

const { isTokenValid } = require("../utils/index");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new CustomErr.UnauthenticatedError("Authentication Invalid.");
  }
  try {
    const { name, userId, role } = isTokenValid({ token });
    req.user = {
      name,
      userId,
      role,
    };
    next();
  } catch (error) {
    throw new CustomErr.UnauthenticatedError("Authentication Invalid.");
  }
};

const authorizePermission = (...roles) => {
  console.log(roles);
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomErr.UnauthorizedError(
        "Unauthorized to access this route."
      );
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermission,
};
