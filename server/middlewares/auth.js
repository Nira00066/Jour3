const jwt = require("jsonwebtoken");
require("dotenv").config();

function validatorValidator(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer")) {
    return res.status(401).json({ message: "Token manquant ou mal formaté" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token invalide ou expiré" });
  }
}
module.exports = validatorValidator;
