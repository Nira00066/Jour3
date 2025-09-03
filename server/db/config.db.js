const mongoose = require("mongoose");

function connectDB() {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("Connexion à la base de données réussie !");
  } catch (error) {
    console.error(
      "Erreur de connexion à la base de données du TP_Nodemailer :" +
        error.message
    );
  }
}

module.exports = connectDB;
