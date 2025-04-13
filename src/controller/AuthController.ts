import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import { JwtPayload } from "jsonwebtoken";
import { Logger } from "winston";
import { TokenService } from "../services/TokenService";
import { UserService } from "../services/UserService";
import { AuthRequest, LoginUserRequest, RegisterUserRequest } from "../types";
import createHttpError from "http-errors";
import { CredentialService } from "../services/CredentialService";

export class AuthController {
  // userService is a property of the AuthController class

  // constructor is used to initialize the userService instance
  // when the AuthController class is instantiated
  constructor(
    private userService: UserService,
    private logger: Logger,
    private tokenService: TokenService,
    private credentialService: CredentialService,
  ) {}

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

      const payload: JwtPayload = {
        sub: String(user.id),
        role: user.role,
      };

      const accessToken = this.tokenService.generateAccessToken(payload);

      // persist the refresh token in the database
      const newRefreshToken = await this.tokenService.persistRefreshToken(user);

      const refreshToken = this.tokenService.generateRefreshToken({
        ...payload,
        id: newRefreshToken.id,
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

  async login(req: LoginUserRequest, res: Response, next: NextFunction) {
    const result = validationResult(req);
    // check if there are validation errors
    // if there are, return a 400 response with the errors
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    const { email, password } = req.body;

    this.logger.debug("New request to login a user", {
      email,
      password: "******",
    });

    try {
      // check if email exists in the database
      const user = await this.userService.findByEmail(email);
      if (!user) {
        const error = createHttpError(400, "Email or password not match");
        next(error);
        return;
      }
      // check if password is correct
      const passwordMatch = await this.credentialService.comparePassword(
        password,
        user.password,
      );
      if (!passwordMatch) {
        const error = createHttpError(400, "Email or password not match");
        next(error);
        return;
      }

      // generate access token and refresh token
      const payload: JwtPayload = {
        sub: String(user.id),
        role: user.role,
      };

      const accessToken = this.tokenService.generateAccessToken(payload);
      // persist the refresh token in the database
      const newRefreshToken = await this.tokenService.persistRefreshToken(user);

      const refreshToken = this.tokenService.generateRefreshToken({
        ...payload,
        id: newRefreshToken.id,
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
      this.logger.info("User logged in successfully", { id: user.id });
      res.status(200).json({ id: user.id });
    } catch (error) {
      next(error);
      return;
    }
  }

  async self(req: AuthRequest, res: Response) {
    // console.log("self called", req.auth.sub);

    const user = await this.userService.findById(Number(req.auth.sub));
    console.log("user data", user);

    res.json(user);
    // res.json({});
  }
}
