const express = require("express");
const router = express.Router();
const { upload } = require("../cloudinary/cloudinary.js");
const validatorValidator = require("../middlewares/auth.js");

const {
  createUser,
  verifyUser,
  forgotPassword,
  submitCandidature,
} = require("../controllers/users.controller.js");

// POST /api/register
router.post("/register", createUser);

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
