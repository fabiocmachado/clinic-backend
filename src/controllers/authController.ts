import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db";

const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const query =
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *";
  const values = [name, email, hashedPassword];

  try {
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json(error);
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM users WHERE email = $1";

  try {
    const result = await pool.query(query, [email]);
    const user = result.rows[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "8h" }
      );
      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export { register, login };
