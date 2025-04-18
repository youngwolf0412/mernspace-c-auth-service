import { DataSource } from "typeorm";
import bcrypt from "bcrypt";
import { AppDataSource } from "../../src/config/data-source";
import request from "supertest";

import { Roles } from "../../src/constants";
import { User } from "../../src/entity/User";
import app from "../../src/app";
import { isJwt } from "../utils";

describe("POST /auth/login", () => {
  let connection: DataSource;

  // beforeAll tells Jest to run this function before all tests in this file
  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    await connection.dropDatabase(); // Drop the database before each test
    await connection.synchronize(); // Recreate the database schema
  });

  afterAll(async () => {
    // Close the database connection after all tests are done
    await connection.destroy();
  });

  describe("Given All Fields", () => {
    it("should return 400 and if email or password is wrong", async () => {
      // Arrange
      const userData = {
        firstName: "Rakesh",
        lastName: "K",
        email: "rakesh@mern.space",
        password: "password",
      };
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const userRepository = connection.getRepository(User);
      await userRepository.save({
        ...userData,
        password: hashedPassword,
        role: Roles.CUSTOMER,
      });

      // Act
      const response = await request(app)
        .post("/auth/login")
        .send({ email: userData.email, password: "wrongpassword" });

      // Assert
      expect(response.status).toBe(400);
    });

    it("should return the access token and refresh token inside a cookie", async () => {
      // Arrange
      const userData = {
        firstName: "Rakesh",
        lastName: "K",
        email: "rakesh@mern.space",
        password: "password",
      };

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const userRepository = connection.getRepository(User);
      await userRepository.save({
        ...userData,
        password: hashedPassword,
        role: Roles.CUSTOMER,
      });

      // Act
      const response = await request(app)
        .post("/auth/login")
        .send({ email: userData.email, password: userData.password });

      interface Headers {
        ["set-cookie"]: string[];
      }
      // Assert
      let accessToken = null;
      let refreshToken = null;
      const cookies =
        (response.headers as unknown as Headers)["set-cookie"] || [];
      cookies.forEach((cookie) => {
        if (cookie.startsWith("accessToken=")) {
          accessToken = cookie.split(";")[0].split("=")[1];
        }

        if (cookie.startsWith("refreshToken=")) {
          refreshToken = cookie.split(";")[0].split("=")[1];
        }
      });
      expect(accessToken).not.toBeNull();
      expect(refreshToken).not.toBeNull();

      expect(isJwt(accessToken)).toBeTruthy();
      expect(isJwt(refreshToken)).toBeTruthy();
    });
  });
});
