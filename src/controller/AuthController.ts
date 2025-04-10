import fs from "fs";
import path from "path";
import { NextFunction, Response } from "express";
import { UserService } from "../services/UserService";
import { RegisterUserRequest } from "../types";
import { Logger } from "winston";
import { JwtPayload, sign } from "jsonwebtoken";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Config } from "../config";

export class AuthController {
  // userService is a property of the AuthController class
  userService: UserService;

  // constructor is used to initialize the userService instance
  // when the AuthController class is instantiated
  constructor(
    userService: UserService,
    private logger: Logger,
  ) {
    this.userService = userService;
  }

  async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
    const result = validationResult(req);
    // check if there are validation errors
    // if there are, return a 400 response with the errors
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    // get the user data from the request body
    const { firstName, lastName, email, password } = req.body;

    this.logger.debug("New request to register a user", {
      firstName,
      lastName,
      email,
      password: "******",
    });

    try {
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
      });

      this.logger.info("User registered successfully", { id: user.id });

      let privateKey: Buffer;
      try {
        privateKey = fs.readFileSync(
          path.join(__dirname, "../../certs/privateKey.pem"),
        );
      } catch (err) {
        const error = createHttpError(500, "Error reading private key file");
        next(error);
        return;
      }
      const payload: JwtPayload = {
        sub: String(user.id),
        role: user.role,
      };

      const accessToken = sign(payload, privateKey, {
        algorithm: "RS256",
        expiresIn: "1h",
        issuer: "auth-service",
      });
      // console.log(accessToken);

      const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
        algorithm: "HS256",
        expiresIn: "1y",
        issuer: "auth-service",
      });

      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60, //1h
        httpOnly: true,
      });

      res.cookie("refreshToken", refreshToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 365, //1y
        httpOnly: true,
      });

      res.status(201).json({ id: user.id });
    } catch (error) {
      next(error);
      return;
    }
  }
}
