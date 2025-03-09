const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, sso: user.ssoCode }, 
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
      algorithm: "HS256", 
    }
  );
};

module.exports = generateToken;
