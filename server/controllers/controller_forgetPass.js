const db = require("./../db/config.db");
const nodemailer = require("nodemailer");
// c'est le module qui permet d'envoyer un mail pour le reset et bien d'autre
const crypto = require("crypto"); // C'est le une module de node et utilie pour cree le token ou clée
const forgetPasswordShema = require("./../models/forgetPasswordShema");


const forgetPassword = async (req, res) => {
  const { error } = forgetPasswordShema.validate(req.boby);
  if (error) return res.status(400).jso, { message: error.details[0].message };
  //   si le validator ne passe pas error
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "utilisateur non trouvé" });
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 heures
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    const resetUrl = process.env.URL_reset;

    await transporter.sendMail({
      from: "notreemail@gamil.com",
      to: email,
      subject: "Réinstalisation de votre mot de passe",
      html: `<p> Cliquez sur ce lien pour réinitialiser votre mot de passe : </p>
         <a href="${resetUrl}">${resetUrl}</a>`,
    });
    res.status(200).json({ message: "Email de réeinialisation envoyer !" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = forgetPassword;