import { Request, Response } from "express";
import pool from "../db";
import { IPatient } from "../models/Patients";

export async function createPatient(
  req: Request,
  res: Response
): Promise<void> {
  const { name, email, phone, date_of_birth }: IPatient = req.body;

  try {
    const { rows } = await pool.query(
      "INSERT INTO patients (name, email, phone, date_of_birth) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, phone, date_of_birth]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error creating patient:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getPatients(req: Request, res: Response): Promise<void> {
  try {
    const { rows } = await pool.query("SELECT * FROM patients");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getPatientById(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  try {
    const { rows } = await pool.query("SELECT * FROM patients WHERE id = $1", [
      id,
    ]);
    if (rows.length === 0) {
      res.status(404).json({ message: "Patient not found" });
      return;
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updatePatient(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  const { name, email, phone, date_of_birth }: IPatient = req.body;

  try {
    const { rows } = await pool.query(
      "UPDATE patients SET name = $1, email = $2, phone = $3, date_of_birth = $4 WHERE id = $5 RETURNING *",
      [name, email, phone, date_of_birth, id]
    );
    if (rows.length === 0) {
      res.status(404).json({ message: "Patient not found" });
      return;
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deletePatient(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query(
      "DELETE FROM patients WHERE id = $1",
      [id]
    );
    if (rowCount === 0) {
      res.status(404).json({ message: "Patient not found" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
