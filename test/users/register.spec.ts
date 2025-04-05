import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";
import { truncateTables } from "../utils";

describe("POST /auth/register", () => {
  let connection: DataSource;

  // beforeAll tells Jest to run this function before all tests in this file
  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    // Clear the database before each test
    await truncateTables(connection);
  });

  afterAll(async () => {
    // Close the database connection after all tests are done
    await connection.destroy();
  });

  describe("given all fields", () => {
    it("should return 201 status code", async () => {
      // AAA
      // Arrange
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@gmail.com",
        password: "password123",
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);
      // Assert
      expect(response.statusCode).toBe(201);
    });

    it("should return json", async () => {
      // AAA
      // Arrange
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@gmail.com",
        password: "password123",
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);
      // Assert
      expect(response.header["content-type"]).toEqual(
        expect.stringContaining("json"),
      );
    });

    it("should persist the user in the database", async () => {
      // AAA
      // Arrange
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@gmail.com",
        password: "password123",
      };
      // Act
      // Make a request to the endpoint
      // This will trigger the registration process and save the user in the database
      const response = await request(app).post("/auth/register").send(userData);
      // Assert
      const userRepository = connection.getRepository(User);
      const user = await userRepository.find();
      expect(user.length).toBe(1); // Check if one user is created
    });
  });
  describe("happy path", () => {});
});
