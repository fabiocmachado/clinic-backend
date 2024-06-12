import express from "express";
//import { Pool } from "pg";
import dotenv from "dotenv";
import { constants } from "buffer";
import { send } from "process";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
