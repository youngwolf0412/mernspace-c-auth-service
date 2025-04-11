import { NextFunction, Request, Response, Router } from "express";
import logger from "../config/logger";
import { AuthController } from "../controller/AuthController";
import { UserService } from "../services/UserService";
import registerValidator from "../validators/register-validator";
import { TokenService } from "../services/TokenService";
import loginValidator from "../validators/login-validator";
import { CredentialService } from "../services/CredentialService";

const router = Router();
// userService is an instance of UserService class
const userService = new UserService();
const tokenService = new TokenService();
const credentialService = new CredentialService();
const authController = new AuthController(
  userService,
  logger,
  tokenService,
  credentialService,
);

router.post(
  "/register",
  registerValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    // authController calls the register method from AuthController
    await authController.register(req, res, next);
  },
);

router.post(
  "/login",
  loginValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    await authController.login(req, res, next);
  },
);

export default router;
