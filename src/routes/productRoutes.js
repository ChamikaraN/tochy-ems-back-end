import express from "express";
const router = express.Router();
import {
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getAllTemplates,
  getSentEmail,
  makeEmailRead,
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";

// Template route
router.route("/").get(getAllTemplates);
router.route("/sentemail").get(protect, getSentEmail);
router.route("/readmail").put(makeEmailRead);
router.route("/add").post(protect,createTemplate);
router.route("/delete/:id").delete(deleteTemplate);
router.route("/update/:id").put(updateTemplate);

export default router;
