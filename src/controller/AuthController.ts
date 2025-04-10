import { NextFunction, Response } from "express";
import { UserService } from "../services/UserService";
import { RegisterUserRequest } from "../types";
import { Logger } from "winston";
import createHttpError from "http-errors";

// written controller class for authentication
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
    // get the user data from the request body
    const { firstName, lastName, email, password } = req.body;

    // check if the user data is valid
    if (!firstName || !lastName || !email || !password) {
      const err = createHttpError(400, "All fields are required");
      next(err);
      return;
    }

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

      res.status(201).json({ id: user.id });
    } catch (error) {
      next(error);
      return;
    }
  }
}
