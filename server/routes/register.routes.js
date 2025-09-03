const express = require("express");
const router = express.Router();

const { createUser } = require("../controllers/"); // chemin fichier

// POST /api/register

router.post("/", createUser);

router.post("/forget-password", forgetPassword);

module.exports = router;
