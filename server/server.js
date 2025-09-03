const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./db/config.db.js");
const userRoutes = require("./routes/register.routes.js");
const verifyRoutes = require("./routes/verify.routes.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

app.use("/register", userRoutes);

app.use("/", verifyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
