import { Request, Response } from "express";
import pool from "../db";
import { IAppointment } from "../models/Appointments";

export async function createAppointment(
  req: Request,
  res: Response
): Promise<void> {
  const { patient_id, date, description }: IAppointment = req.body;

  try {
    const { rows } = await pool.query(
      "INSERT INTO appointments (patient_id, date, description) VALUES ($1, $2, $3) RETURNING *",
      [patient_id, date, description]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAppointments(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { rows } = await pool.query("SELECT * FROM appointments");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAppointmentById(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      "SELECT * FROM appointments WHERE id = $1",
      [id]
    );
    if (rows.length === 0) {
      res.status(404).json({ message: "Appointment not found" });
      return;
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateAppointment(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  const { patient_id, date, description }: IAppointment = req.body;

  try {
    const { rows } = await pool.query(
      "UPDATE appointments SET patient_id = $1, date = $2, description = $3 WHERE id = $4 RETURNING *",
      [patient_id, date, description, id]
    );
    if (rows.length === 0) {
      res.status(404).json({ message: "Appointment not found" });
      return;
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteAppointment(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query(
      "DELETE FROM appointments WHERE id = $1",
      [id]
    );
    if (rowCount === 0) {
      res.status(404).json({ message: "Appointment not found" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
