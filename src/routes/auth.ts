import { Router, Response, Request, NextFunction } from "express";
import { AuthController } from "../controller/AuthController";
import { UserService } from "../services/UserService";
import logger from "../config/logger";
import { body } from "express-validator";

const router = Router();
// userService is an instance of UserService class
const userService = new UserService();
const authController = new AuthController(userService, logger);

router.post(
  "/register",
  body("email").isEmail(),
  async (req: Request, res: Response, next: NextFunction) => {
    // authController calls the register method from AuthController
    await authController.register(req, res, next);
  },
);

export default router;
