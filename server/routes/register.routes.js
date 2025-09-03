const express = require("express");
const router = express.Router();

const { createUser } = require("../controllers/users.controller.js");

// POST /api/register

router.post("/", createUser);

module.exports = router;
