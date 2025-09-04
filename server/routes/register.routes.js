// register.routes.js
const express = require("express");
const router = express.Router();

const {
  createUser,
  verifyUser,
} = require("../controllers/users.controller.js");

const { forgotPassword } = require("../controllers/userPasswordController.js");

const { loginUser } = require("../controllers/userLoginController.js");

router.post("/", createUser);
router.post("/", loginUser);


router.get("/profile", (req, res) => {
  res.send('Hello world');
}); // Mettre le fait qu'il dois etre connecter pour le voire

// Validation middleware
router.post("/forgetPassword", forgotPassword);
router.get("/verify", verifyUser);

module.exports = router;
