const express = require("express");
const router = express.Router();
const { verifyUser } = require("../controllers/users.controller.js");

router.get("/verify", verifyUser);

module.exports = router;
