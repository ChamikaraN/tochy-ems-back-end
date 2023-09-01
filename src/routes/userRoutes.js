import express from "express";
const router = express.Router();
import {
  userAuth,
  getUser,
  getProfileById,
  updateMyProfile,
  userRegister,
  getUsersList,
  userUpdate,
  getAllBusiness,
  businessUpdate,
  businessDelete,
  businessApprove,
  selectTemplate,
  removeselectTemplate,
  verifyaccount,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/", userRegister);
router.route("/").get(protect, getUsersList);
router.route("/template/select").put(protect, selectTemplate);
router.route("/template/remove/:id").put(protect, removeselectTemplate);
router.route("/business").get(getAllBusiness);
router.route("/business/update/:id").put(businessUpdate);
router.route("/business/approve/:id").put(businessApprove);
router.route("/business/delete/:id").delete(businessDelete);
router.route("/profile").get(protect, getUser);
router.route("/verifyaccount/:id").put(verifyaccount);
router.route("/roleupdate/:id").put(protect, userUpdate);
router.route("/profile/update").put(protect, updateMyProfile);
router.post("/login", userAuth);
router.get("/:id", getProfileById);

export default router;
