import { AppDataSource } from "../config/data-source";
import { Roles } from "../constants";
import { User } from "../entity/User";
import { UserData } from "../types";
import bcrypt from "bcrypt";

export class UserService {
  async create({ firstName, lastName, email, password }: UserData) {
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const userRepository = AppDataSource.getRepository(User);
    return await userRepository.save({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: Roles.CUSTOMER,
    });
  }
}
