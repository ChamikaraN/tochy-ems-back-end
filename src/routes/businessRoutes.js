import express from "express";
const router = express.Router();
import {
  addReview,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getAllBusiness,
  getItemByID,
} from "../controllers/businessController.js";
import { protect } from "../middleware/authMiddleware.js";

// Business route
router.route("/").get(getAllBusiness);
router.route("/add").post(createEmployee);
router.route("/delete/:id").delete(deleteEmployee);
router.route("/update/:id").put(updateEmployee);
router.route("/:id").get(getItemByID);
router.route("/review/add/:id").post(protect, addReview);

export default router;
