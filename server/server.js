const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

require("dotenv").config();
const connectDB = require("./db/config.db.js");
const userRoutes = require("./routes/register.routes.js");
const { forgotPassword } = require("./controllers/users.controller.js");

// Middlewares
app.use(cors()); // autorise toutes les origines (pour tests locaux)
app.use(express.json());

// Connexion à la DB
connectDB();

// Routes
app.use("/register", userRoutes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
