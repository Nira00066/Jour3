const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./db/config.db.js");
const userRoutes = require("./routes/register.routes.js");
const loginRoutes = require("./routes/login.routes.js");
const cors = require("cors");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

app.use("/", userRoutes);

app.use("/", loginRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
