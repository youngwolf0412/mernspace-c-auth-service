import { Router } from "express";
import { AuthController } from "../controller/AuthController";

const router = Router();

const authController = new AuthController();

router.post("/register", async (req, res) => {
  // authController calls the register method from AuthController
  await authController.register(req, res);
});

export default router;
