// register.routes.js
const express = require("express");
const router = express.Router();

const { createUser } = require("../controllers/users.controller.js");

router.post("/", createUser);

// Validation middleware
router.post("/forgetPassword", forgotPassword);


router.get("/verify", verifyUser);

module.exports = router;
