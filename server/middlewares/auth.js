const jwt = require("jsonwebtoken");
require("doten").config();

function validatorValidator(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startWith("Bearer")) {
    return res.status(401).json({ message: "Token manquant ou mal formaté" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "token invalid ou expiré" });
  }
}

module.exports = validatorValidator;
