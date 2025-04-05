import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import { UserData } from "../types";

export class UserService {
  async create({ firstName, lastName, email, password }: UserData) {
    // userRepository is an instance of the User entity
    // which is used to interact with the database
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.save({ firstName, lastName, email, password });
  }
}
