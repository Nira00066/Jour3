const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

require("dotenv").config();
const connectDB = require("./db/config.db.js");
const userRoutes = require("./routes/register.routes.js");
const loginRoutes = require("./routes/login.routes.js");
const cors = require("cors");

app.use(cors());

// Middlewares
app.use(cors()); // autorise toutes les origines (pour tests locaux)
app.use(express.json());

// Connexion à la DB
connectDB();

app.use("/", userRoutes);

app.use("/", loginRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
