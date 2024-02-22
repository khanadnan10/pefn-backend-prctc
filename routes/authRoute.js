import { Router } from "express";
import AuthController from "../controller/authController.js";
import ProfileController from "../controller/profileController.js";
import authMiddleware from "../middleware/authentication.js";
import NewsController from "../controller/newsController.js";

//! Instance of router()
const router = Router();

//! Authentication routes
router
  .post("/auth/register", AuthController.register)
  .post("/auth/login", AuthController.login);

//! Profile Route
router
  .get("/profile", authMiddleware, ProfileController.getUser)
  .put("/profile/:id", authMiddleware, ProfileController.updateUser);

//! News Routes
router
  .post("/news", authMiddleware, NewsController.postNews)
  .get("/news", NewsController.getNews);

export default router;
