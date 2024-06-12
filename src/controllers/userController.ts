import { Request, Response } from "express";
import pool from "../db";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users");
    res.json(rows);
  } catch (error) {
    console.error("Error executing getUsers query", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, password]
    );
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error executing createUser query", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error executing deleteUser query", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error executing getUserById query", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  try {
    await pool.query(
      "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4",
      [name, email, password, id]
    );
    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error executing updateUser query", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
