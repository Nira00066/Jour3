// register.routes.js
const express = require("express");
const router = express.Router();

const { createUser } = require("../controllers/users.controller.js");


router.post("/", createUser);


router.post("/register", createUser);


module.exports = router;
