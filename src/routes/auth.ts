import { NextFunction, Request, Response, Router } from "express";
import logger from "../config/logger";
import { AuthController } from "../controller/AuthController";
import { UserService } from "../services/UserService";
import registerValidator from "../validators/register-validator";
import { TokenService } from "../services/TokenService";
import loginValidator from "../validators/login-validator";
import { CredentialService } from "../services/CredentialService";
import authenticate from "../middlewares/authenticate";
import { AuthRequest } from "../types";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import validateRefreshToken from "../middlewares/validateRefreshToken";

import parseRefreshToken from "../controller/parseRefreshToken";

const router = Router();
// userService is an instance of UserService class
const userRepository = AppDataSource.getRepository(User);

const userService = new UserService(userRepository);
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

// this route is now a protected route
// it requires authentication to access it

router.get("/self", authenticate, (req: Request, res: Response) =>
  authController.self(req as AuthRequest, res),
);

router.post(
  "/refresh",
  validateRefreshToken,
  (req: Request, res: Response, next: NextFunction) =>
    authController.refresh(req as AuthRequest, res, next),
);

router.post(
  "/logout",
  authenticate,
  parseRefreshToken,
  (req: Request, res: Response, next: NextFunction) =>
    authController.logout(req as AuthRequest, res, next),
);
export default router;
