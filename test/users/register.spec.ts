import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";

import { Roles } from "../../src/constants";

describe("POST /auth/register", () => {
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

  // given all fields means that the user is providing all the required fields in the request body
  // and the server is expected to create a new user in the database
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
      // This will trigger the registration process
      const response = await request(app).post("/auth/register").send(userData);
      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users.length).toBe(1); // Check if one user is created
      expect(users[0].firstName).toBe(userData.firstName); // Check if the first name is correct
      expect(users[0].lastName).toBe(userData.lastName); // Check if the last name is correct
      expect(users[0].email).toBe(userData.email); // Check if the email is correct
    });

    it("should return an id of the created user", async () => {
      // Arrange
      const userData = {
        firstName: "Rakesh",
        lastName: "K",
        email: "rakesh@mern.space",
        password: "password",
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert

      expect(response.body).toHaveProperty("id");
      const repository = connection.getRepository(User);
      const users = await repository.find();
      expect((response.body as Record<string, string>).id).toBe(users[0].id); //jo id database me gyi wahi id response me bhejo, ye expectation hai
    });

    it("should assign a customer role", async () => {
      // Arrange
      const userData = {
        firstName: "Rakesh",
        lastName: "K",
        email: "rakesh@mern.space",
        password: "password",
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users[0]).toHaveProperty("role"); // Check if the role property exists
      expect(users[0].role).toBe(Roles.CUSTOMER); // Check if the role is correct
    });

    it("should store the hashed password in the database", async () => {
      // Arrange
      const userData = {
        firstName: "Rakesh",
        lastName: "K",
        email: "rakesh@mern.space",
        password: "password",
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users[0].password).not.toBe(userData.password); // Check if the password is hashed
      expect(users[0].password).toHaveLength(60); // Check if the hashed password has a length of 60 characters
      expect(users[0].password).toMatch(/^\$2[a|b]\$\d+\$/); // Check if the password is hashed using bcrypt
    });

    it("should return 400 status code if the email is already in use", async () => {
      // Arrange
      const userData = {
        firstName: "Rakesh",
        lastName: "K",
        email: "rakesh@mern.space",
        password: "password",
      };
      const userRepository = connection.getRepository(User);
      await userRepository.save({ ...userData, role: Roles.CUSTOMER }); // Save the user to the database
      // Act
      const response = await request(app).post("/auth/register").send(userData);
      const users = await userRepository.find(); // Fetch all users from the database
      // Assert
      expect(response.statusCode).toBe(400); // Check if the status code is 400
      expect(users).toHaveLength(1); // Check if the number of users is still 1
    });
  });
  describe("Fields are missing", () => {
    it("shoudl return 400 if email is missing", async () => {
      // Arrange
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "",
        password: "password123",
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);
      // Assert
      expect(response.statusCode).toBe(400);
    });
  });
});
