import { Router } from "express";
import {
  createProcedure,
  getProcedures,
  getProcedureById,
  updateProcedure,
  deleteProcedure,
  getProceduresByPatientId,
} from "../controllers/procedureController";

const router = Router();

router.post("/", createProcedure);
router.get("/", getProcedures);
router.get("/:id", getProcedureById);
router.get("/patient/:patient_id", getProceduresByPatientId);
router.put("/:id", updateProcedure);
router.delete("/:id", deleteProcedure);

export default router;
