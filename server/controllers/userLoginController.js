const User = require("../models/users.model.js");

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouver!" });
    }
    if (!password) {
      return res.status(404).json({ message: " Mdp pas correct" });
    }
    const token = jxt.sign({ id: user._id, email: user.email }, SECRET_JWT, {
      expiresIn: "1h",
    });

    res.status(200).json({
      messsage: "connexion réussie ! ",
      token,
      user: { id: user_id, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  loginUser,
};
