import createHttpError from "http-errors";
import { AppDataSource } from "../config/data-source";
import { Roles } from "../constants";
import { User } from "../entity/User";
import { LimitedUserData, UserData, UserQueryParams } from "../types";
import bcrypt from "bcrypt";
import { Brackets, Repository } from "typeorm";

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  async create({ firstName, lastName, email, password, role }: UserData) {
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
      role,
    });
  }

  async update(
    userId: number,
    { firstName, lastName, role, email, tenantId }: LimitedUserData,
  ) {
    try {
      return await this.userRepository.update(userId, {
        firstName,
        lastName,
        role,
        email,
        tenant: tenantId ? { id: tenantId } : undefined,
      });
    } catch (err) {
      const error = createHttpError(
        500,
        "Failed to update the user in the database",
      );
      throw error;
    }
  }

  async findByEmailWithPassword(email: string) {
    return await this.userRepository.findOne({
      where: {
        email,
      },
      select: ["id", "firstName", "lastName", "email", "role", "password"],
      relations: {
        tenant: true,
      },
    });
  }

  async findByEmail(email: string) {
    const userRepository = AppDataSource.getRepository(User);
    return await userRepository.findOne({ where: { email } });
  }

  async findById(id: number) {
    // console.log(userRepository);
    return await this.userRepository.findOne({
      where: { id },
      // this relations is used to load the related tenant entity
      // when we fetch the user entity from the database
      relations: { tenant: true },
    });
  }
  async getAll(validatedQuery: UserQueryParams) {
    const queryBuilder = this.userRepository.createQueryBuilder("user");

    if (validatedQuery.q) {
      const searchTerm = `%${validatedQuery.q}%`;
      queryBuilder.where(
        new Brackets((qb) => {
          qb.where("CONCAT(user.firstName, ' ', user.lastName) ILike :q", {
            q: searchTerm,
          }).orWhere("user.email ILike :q", { q: searchTerm });
        }),
      );
    }

    if (validatedQuery.role) {
      queryBuilder.andWhere("user.role = :role", {
        role: validatedQuery.role,
      });
    }

    const result = await queryBuilder
      .leftJoinAndSelect("user.tenant", "tenant")
      .skip((validatedQuery.currentPage - 1) * validatedQuery.perPage)
      .take(validatedQuery.perPage)
      .orderBy("user.id", "DESC")
      .getManyAndCount();
    return result;
  }
}
