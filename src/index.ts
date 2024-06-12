import express from "express";
import dotenv from "dotenv";
import pool from "./db";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

pool
  .connect()
  .then(() => console.log("PostgreSQL connected"))
  .catch((err) => console.error("Connection error", err.stack));

app.get("/", (req, res) => {
  res.send("Bem-vindo à sua aplicação de gerenciamento de paciente!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
