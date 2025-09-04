const User = require("../models/users.model.js");
const nodemailer = require("nodemailer");
const forgotPasswordSchema = require("./../models/forgetPasswordShema.js");
const crypto = require("crypto");

const forgotPassword = async (req, res) => {
  const { error } = forgotPasswordSchema.validate(req.body);

  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    debug: true, // affiche les logs
    logger: true,
  });

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 heure

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    const resetUrl = `http://127.0.0.1:5500/src/page/resetPassword.html?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      html: `<p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p>
             <a href="${resetUrl}"}>Reset votre password </a>`,
    };
    console.log("User trouvé :", user.email);
    console.log("ResetToken :", resetToken);

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email envoyé !");
    } catch (mailErr) {
      console.error("Erreur Nodemailer :", mailErr);
      throw mailErr;
    }

    res.status(200).json({ message: "Email de réinitialisation envoyé !" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = { forgotPassword };
