const User = require("../models/users.model.js");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const forgotPasswordSchema = require("../models/forgetPasswordShema.js");
const { cloudinary } = require("../cloudinary/cloudinary.js");

// Transporteur d'e-mail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
     debug: true, // affiche les logs
      logger: true,
});

// Création de compte avec hachage
const createUser = async (req, res) => {
  try {
    let { nom, prenom, email, password, confirmPassword } = req.body;

    // Nettoyage des entrées
    if (
      typeof password !== "string" ||
      typeof confirmPassword !== "string" ||
      password.trim() !== confirmPassword.trim()
    ) {
      return res
        .status(400)
        .json({ message: "Les mots de passe ne correspondent pas." });
    }

    password = password.trim();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = uuidv4();
    const expiration = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

    const newUser = new User({
      nom,
      prenom,
      email,
      password: hashedPassword,
      verificationToken: token,
      tokenExpires: expiration,
    });

    await newUser.save();


    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Validation de votre compte",
      html: `<p>Bonjour ${prenom},</p>
             <p>Merci de vous être inscrit. Cliquez sur le lien pour valider votre compte :</p>
             <a href="http://localhost:3000/verify?token=${token}">Valider mon compte</a>`,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(201)
      .json({ message: "Compte créé. Vérifiez votre e-mail pour valider." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Vérification du compte
const verifyUser = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ verificationToken: token });

    if (!user) return res.status(400).send("Token invalide.");
    if (user.status === "active")
      return res.status(400).send("Compte déjà activé.");
    if (user.tokenExpires < Date.now())
      return res.status(400).send("Token expiré.");

    user.status = "active";
    user.verificationToken = undefined;
    user.tokenExpires = undefined;
    await user.save();

    res.redirect("http://localhost:5500/src/page/connexion.html?success=true");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur serveur.");
  }
};

// Réinitialisation du mot de passe
const forgotPassword = async (req, res) => {
  const { error } = forgotPasswordSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 heure

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    const resetUrl = `http://localhost:3000/resetPassword?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      html: `<p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p>
             <a href="${resetUrl}">${resetUrl}</a>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email de réinitialisation envoyé !" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Soumission de candidature avec fichier Cloudinary
const submitCandidature = async (req, res) => {
  try {
    const { nom, prenom, email } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Fichier manquant." });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "candidatures",
    });

    const fileUrl = result.secure_url;

    // Mise à jour du user sans stocker le résultat
    await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          nom,
          prenom,
          email,
          cvUrl: fileUrl,
          candidatureValidee: true,
        },
      },
      { new: true }
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "Nouvelle candidature",
      html: `
        <p>Nom: ${nom} ${prenom}</p>
        <p>Email: ${email}</p>
        <p><a href="${fileUrl}">Télécharger le fichier</a></p>
      `,
    });

    res.status(200).json({ message: "Candidature envoyée avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = {
  createUser,
  verifyUser,

  submitCandidature,
};
