import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface RegisterUserRequest extends Request {
  body: UserData;
}
// written controller class for authentication
export class AuthController {
  async register(req: RegisterUserRequest, res: Response) {
    // get the user data from the request body
    const { firstName, lastName, email, password } = req.body;
    // userRepositry is get from User entity
    // and save the user data in the database
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.save({ firstName, lastName, email, password });
    res.status(201).json();
  }
}
