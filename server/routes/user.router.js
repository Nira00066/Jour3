// routes/user.js
const express = require("express");
const router = express.Router();
const User = require("../models/users.model");
const authMiddleware = require("../middleware/auth");
const upload = require("../middleware/upload");

// PUT /api/user/update
router.put(
  "/update",
  authMiddleware,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const user = await User.findById(req.userId);
      if (!user)
        return res.status(404).json({ message: "Utilisateur non trouvé" });

      // Mettre à jour les champs
      const { nom, prenom, email, password } = req.body;
      if (nom) user.nom = nom;
      if (prenom) user.prenom = prenom;
      if (email) user.email = email;
      if (password) user.password = password; // pense à hasher le mot de passe
      if (req.file) user.avatar = req.file.path; // url Cloudinary

      await user.save();
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }
);

module.exports = router;
