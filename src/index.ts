import express from "express";
import dotenv from "dotenv";
import pool from "./db";
import userRoutes from "./routes/userRoutes";
import patientRouter from "./routes/patientRoutes";
import appointmentsRouter from "./routes/appointmentRoutes";
import proceduresRouter from "./routes/procedureRoutes";
import { authenticateJWT } from "./middleware/authMiddleware";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

pool
  .connect()
  .then(() => console.log("PostgreSQL connected"))
  .catch((err) => console.error("Connection error", err.stack));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bem-vindo à sua aplicação de gerenciamento de paciente!");
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/patients", authenticateJWT, patientRouter);
app.use("/appointments", authenticateJWT, appointmentsRouter);
app.use("/procedures", authenticateJWT, proceduresRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
