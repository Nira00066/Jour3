const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./db/config.db.js");
const userRoutes = require("./routes/register.routes.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

app.use("/register", userRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
