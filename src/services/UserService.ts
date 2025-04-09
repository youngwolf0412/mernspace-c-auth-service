import { AppDataSource } from "../config/data-source";
import { Roles } from "../constants";
import { User } from "../entity/User";
import { UserData } from "../types";

export class UserService {
  async create({ firstName, lastName, email, password }: UserData) {
    const userRepository = AppDataSource.getRepository(User);
    return await userRepository.save({
      firstName,
      lastName,
      email,
      password,
      role: Roles.CUSTOMER,
    });
  }
}
