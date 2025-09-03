const express = require("express");
const router = express.Router();

const {
  createUser,
  verifyUser,
} = require("../controllers/users.controller.js");
const { forgetPassword } = require("../controllers/controller_forgetPass.js");

// POST /api/register

router.post("/", createUser);

router.post("/forget-password", forgetPassword);

router.get("/verify", verifyUser); // mettre me contoller
module.exports = router;
