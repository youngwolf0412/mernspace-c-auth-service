import createHttpError from "http-errors";
import { AppDataSource } from "../config/data-source";
import { Roles } from "../constants";
import { User } from "../entity/User";
import { UserData } from "../types";
import bcrypt from "bcrypt";

export class UserService {
  async create({ firstName, lastName, email, password }: UserData) {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({ where: { email } });
    if (user) {
      const err = createHttpError(400, "User already exists");
      throw err;
    }
    // Hash the password before saving it to the database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return await userRepository.save({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: Roles.CUSTOMER,
    });
  }

  async findByEmail(email: string) {
    const userRepository = AppDataSource.getRepository(User);
    return await userRepository.findOne({ where: { email } });
  }
}
