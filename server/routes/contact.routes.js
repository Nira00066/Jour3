const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
require("dotenv").config();

fs.mkdirSync("uploads", { recursive: true });

// stratégie de stockage : disque local + nom de fichier "timestamp-nomOriginal"
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

// limite taille (5 Mo) + filtre d’extensions autorisées (.pdf .jpg .jpeg .png)
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const ok = [".pdf", ".jpg", ".jpeg", ".png"];
    ok.includes(ext) ? cb(null, true) : cb(new Error("Extension non autorisée (.pdf .jpg .png)")); // refuse
  },
});

// Pour passer en SMTP réel plus tard, remplace par createTransport({ host, port, auth, ... })

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ============================
//  POST /api/contact
//  Le front envoie : nom, prenom, email, cv (fichier)
//  Pas de JS côté front : le formulaire HTML envoie directement ici.
// ============================
router.post("/", upload.single("cv"), async (req, res) => {
  // Récupère les champs envoyés par le formulaire
  const { nom, prenom, email } = req.body || {};

  // Vérifie si un fichier a été reçu par Multer (req.file est défini si OK)
  const hasFile = Boolean(req.file);

  // Construit un "name" lisible à partir de prénom + nom
  const name = `${prenom ?? ""} ${nom ?? ""}`.trim();

  // Message simple pour l’admin / l’accusé
  const message = `Candidature de ${name}`;

  // Validation minimale : tous les champs requis + le fichier
  if (!nom || !prenom || !email || !hasFile) {
    // si un fichier a été posé, on le supprime (nettoyage)
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ success: false, message: "Champs manquants ou fichier absent." });
  }

  try {
    // 1) E-mail à l’ADMIN avec la pièce jointe (le CV)

    const fileBuf = await fs.promises.readFile(req.file.path);

    await transporter.sendMail({
      from: `"Contact" <${process.env.EMAIL_USER}>`, // émetteur (debug)
      to: process.env.ADMIN_EMAIL || "admin@example.com", // destinataire admin (à mettre dans .env)
      subject: "Nouvelle candidature", // sujet
      text: `Nom complet: ${name}\nEmail: ${email}\n\n${message}`, // contenu texte
      attachments: [
        // pièce jointe : le fichier uploadé
        {
          filename: req.file.originalname, // nom d'origine
          content: fileBuf, // chemin temporaire sur le disque
          contentType: req.file.mimetype, // type MIME détecté
        },
      ],
    });

    // 2) Accusé de réception au candidat (sans pièce jointe)
    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`, // émetteur (debug)
      to: email, // e-mail du candidat
      subject: "Accusé de réception", // sujet
      text: `Bonjour ${name},

Nous avons bien reçu votre candidature.
Cordialement.`,
    });

    // Réponse OK au navigateur
    return res.json({ success: true, message: "Candidature envoyée. Merci !" });
  } catch (err) {
    // En cas d'erreur d’envoi (même en debug), on logge l’erreur
    console.error("contact error:", err);
    return res.status(500).json({ success: false, message: "Erreur lors de l’envoi." });
  } finally {
    // Quoi qu’il arrive, on supprime le fichier temporaire côté serveur
    if (req.file) fs.unlink(req.file.path, () => {});
  }
});

module.exports = router; // exporte le routeur pour server.js
