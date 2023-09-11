import express from "express";
const router = express.Router();
import {
  addReview,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getAllEmployees,
  getItemByID,
  importEmployee,
} from "../controllers/employeeController.js";
import { protect } from "../middleware/authMiddleware.js";

// Employee route
router.route("/").get(protect, getAllEmployees);
router.route("/add").post(protect, createEmployee);
router.route("/import").post(protect, importEmployee);
router.route("/delete/:id").delete(deleteEmployee);
router.route("/update/:id").put(updateEmployee);
router.route("/:id").get(getItemByID);
router.route("/review/add/:id").post(protect, addReview);

export default router;
