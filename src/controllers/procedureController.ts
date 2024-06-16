import { Request, Response } from "express";
import pool from "../db";
import { IProcedure } from "../models/procedure";

export async function createProcedure(
  req: Request,
  res: Response
): Promise<void> {
  const { patient_id, name, date, amount_paid }: IProcedure = req.body;

  try {
    const { rows } = await pool.query(
      "INSERT INTO procedures (patient_id, name, date, amount_paid) VALUES ($1, $2, $3, $4) RETURNING *",
      [patient_id, name, date, amount_paid]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error creating procedure:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getProcedures(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { rows } = await pool.query("SELECT * FROM procedures");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching procedures:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getProcedureById(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      "SELECT * FROM procedures WHERE id = $1",
      [id]
    );
    if (rows.length === 0) {
      res.status(404).json({ message: "Procedure not found" });
      return;
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching procedure:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getProceduresByPatientId(
  req: Request,
  res: Response
): Promise<void> {
  const { patient_id } = req.params;

  try {
    const { rows } = await pool.query(
      "SELECT * FROM procedures WHERE patient_id = $1",
      [patient_id]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching procedures by patient id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateProcedure(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  const { patient_id, name, date, amount_paid }: IProcedure = req.body;

  try {
    const { rows } = await pool.query(
      "UPDATE procedures SET patient_id = $1, name = $2, date = $3, amount_paid = $4 WHERE id = $5 RETURNING *",
      [patient_id, name, date, amount_paid, id]
    );
    if (rows.length === 0) {
      res.status(404).json({ message: "Procedure not found" });
      return;
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error updating procedure:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteProcedure(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query(
      "DELETE FROM procedures WHERE id = $1",
      [id]
    );
    if (rowCount === 0) {
      res.status(404).json({ message: "Procedure not found" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting procedure:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
