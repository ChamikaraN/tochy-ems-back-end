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
import { handleYoutube } from "../controllers/youtubeController.js";
import { protect } from "../middleware/authMiddleware.js";

// Employee route
router.route("/").post(handleYoutube);

export default router;
