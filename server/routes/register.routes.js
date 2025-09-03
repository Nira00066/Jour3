const express = require("express");
const router = express.Router();

 // POST /api/register

router.post("/", (req, res) => {
  const { name, email, message = "" } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: "Champs 'name' et 'email' sont requis.",
    });
  }

  
  return res.status(201).json({
    success: true,
    message: "Inscription reçue.",
    data: { name, email, message },
  });
});

 

module.exports = router;
