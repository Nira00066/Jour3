const express = require("express");
const app = express();
require("dotenv").config();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/contact", require("./routes/contact.routes"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
