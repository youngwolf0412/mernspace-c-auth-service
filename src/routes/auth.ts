import { Router } from "express";
import { AuthController } from "../controller/AuthController";
import { UserService } from "../services/UserService";
import logger from "../config/logger";

const router = Router();
// userService is an instance of UserService class
const userService = new UserService();
const authController = new AuthController(userService, logger);

router.post("/register", async (req, res, next) => {
  // authController calls the register method from AuthController
  await authController.register(req, res, next);
});

export default router;
