const express = require("express");
const router = express.Router();
const { upload } = require("../cloudinary/cloudinary.js");
const validatorValidator = require("../middlewares/auth.js");

const {
  createUser,
  verifyUser,
} = require("../controllers/users.controller.js");

const { forgotPassword } = require("../controllers/userPasswordController.js");

const { loginUser } = require("../controllers/userLoginController.js");

// POST /api/register
router.post("/register", createUser);
router.post("/", createUser);
router.post("/", loginUser);


router.get("/profile", (req, res) => {
  res.send('Hello world');
}); // Mettre le fait qu'il dois etre connecter pour le voire

// Validation middleware
router.post("/forgetPassword", forgotPassword);
router.get("/verify", verifyUser);

router.post(
  "/candidature",
  validatorValidator,
  upload.single("cv"),
  submitCandidature
);

module.exports = router;
