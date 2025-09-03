const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("../server/db/config.db.js");

app.use(express.json());

connectDB();

app.use("/api/register",  );

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
