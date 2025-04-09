import { Response } from "express";
import { UserService } from "../services/UserService";
import { RegisterUserRequest } from "../types";

// written controller class for authentication
export class AuthController {
  // userService is a property of the AuthController class
  userService: UserService;

  // constructor is used to initialize the userService instance
  // when the AuthController class is instantiated
  constructor(userService: UserService) {
    this.userService = userService;
  }

  async register(req: RegisterUserRequest, res: Response) {
    // get the user data from the request body
    const { firstName, lastName, email, password } = req.body;
    // create a new user in the database
    // using the userService instance
    await this.userService.create({
      firstName,
      lastName,
      email,
      password,
    });

    res.status(201).json();
  }
}
