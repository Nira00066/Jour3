const express = require("express");
const router = express.Router();

const { createUser } = require("../controllers/users.controller.js");

// POST /api/register

router.post("/", createUser);

router.post("/forget-password", forgetPassword);

router.get('/verify',) // mettre me contoller 
module.exports = router;
