// register.routes.js
const express = require("express");
const router = express.Router();

const {
  createUser,
  verifyUser,
  forgotPassword
} = require("../controllers/users.controller.js");


// POST /api/register
router.post("/", createUser);

// Validation middleware
router.post("/forgetPassword", forgotPassword);


router.get("/verify", verifyUser);

module.exports = router;
