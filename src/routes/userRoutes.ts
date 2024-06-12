import { Router } from "express";
import {
  getUsers,
  createUser,
  deleteUser,
  getUserById,
  updateUser,
} from "../controllers/userController";
import { patientRouter } from "./patientRoutes";

const router: Router = Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.post("/", createUser);
router.delete("/:id", deleteUser);
router.use("/", patientRouter);

export default router;
