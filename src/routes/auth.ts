import { Router } from "express";
import { AuthController } from "../controller/AuthController";
import { UserService } from "../services/UserService";

const router = Router();
// userService is an instance of UserService class
const userService = new UserService();
const authController = new AuthController(userService);

router.post("/register", async (req, res) => {
  // authController calls the register method from AuthController
  await authController.register(req, res);
});

export default router;
