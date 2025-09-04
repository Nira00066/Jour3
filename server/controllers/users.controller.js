const User = require("../models/users.model.js");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const forgotPasswordSchema = require('./../models/forgetPasswordShema.js')

const createUser = async (req, res) => {
  try {
    const { nom, prenom, email, password, confirmPassword } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "Email déjà utilisé." });

    const token = uuidv4();
    const expiration = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    const newUser = new User({
      nom,
      prenom,
      email,
      password,
      confirmPassword,
      verificationToken: token,
      tokenExpires: expiration,
    });

    await newUser.save();

    // Envoi de l'e-mail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

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

    res.send("Compte activé avec succès !");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur serveur.");
  }
};


const forgotPassword = async (req, res) => {
  const { error } = forgotPasswordSchema.validate(req.body);

  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

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


module.exports = {
  createUser,
  verifyUser,
  };
