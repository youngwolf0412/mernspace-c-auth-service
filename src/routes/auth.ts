import { NextFunction, Request, Response, Router } from "express";
import logger from "../config/logger";
import { AuthController } from "../controller/AuthController";
import { UserService } from "../services/UserService";
import registerValidator from "../validators/register-validator";

const router = Router();
// userService is an instance of UserService class
const userService = new UserService();
const authController = new AuthController(userService, logger);

router.post(
  "/register",
  registerValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    // authController calls the register method from AuthController
    await authController.register(req, res, next);
  },
);

export default router;
