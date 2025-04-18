import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";
import { isJwt } from "../utils";
import { Roles } from "../../src/constants";
import { RefreshToken } from "../../src/entity/RefreshToken";

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
  describe("Given All Fields", () => {
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

    it("should return access token and refesh token inside a cookie", async () => {
      // Arrange
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@gmail.com",
        password: "password123",
      };

      // Act
      const response = await request(app).post("/auth/register").send(userData);

      interface Headers {
        ["set-cookie"]: string[];
      }

      // Assert
      let accessToken: string | null = null;
      let refreshToken: string | null = null;
      const cookies =
        (response.headers as unknown as Headers)["set-cookie"] || [];
      // accessToken=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjkzOTA5Mjc2LCJleHAiOjE2OTM5MDkzMzYsImlzcyI6Im1lcm5zcGFjZSJ9.KetQMEzY36vxhO6WKwSR-P_feRU1yI-nJtp6RhCEZQTPlQlmVsNTP7mO-qfCdBr0gszxHi9Jd1mqf-hGhfiK8BRA_Zy2CH9xpPTBud_luqLMvfPiz3gYR24jPjDxfZJscdhE_AIL6Uv2fxCKvLba17X0WbefJSy4rtx3ZyLkbnnbelIqu5J5_7lz4aIkHjt-rb_sBaoQ0l8wE5KzyDNy7mGUf7cI_yR8D8VlO7x9llbhvCHF8ts6YSBRBt_e2Mjg5txtfBaDq5auCTXQ2lmnJtMb75t1nAFu8KwQPrDYmwtGZDkHUcpQhlP7R-y3H99YnrWpXbP8Zr_oO67hWnoCSw; Max-Age=43200; Domain=localhost; Path=/; Expires=Tue, 05 Sep 2023 22:21:16 GMT; HttpOnly; SameSite=Strict
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

    it("should store the refresh token in the database", async () => {
      // Arrange
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@gmail.com",
        password: "password123",
      };

      // Act
      const response = await request(app).post("/auth/register").send(userData);

      //Assert
      const refreshTokenRepo = connection.getRepository(RefreshToken);
      // const refreshTokens = await refreshTokenRepo.find();
      // expect(refreshTokens.length).toBe(1); // Check if one refresh token is created

      const tokens = await refreshTokenRepo
        .createQueryBuilder("refreshToken")
        .where("refreshToken.userId = :userId", {
          userId: (response.body as Record<string, string>).id,
        })
        .getMany();

      expect(tokens.length).toBe(1); // Check if one refresh token is created
    });
  });

  // when the user is not providing all the required fields in the request body
  describe("Fields are missing", () => {
    it("should return 400 if email is missing", async () => {
      // Arrange
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "ema",
        password: "password123",
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert
      expect(response.statusCode).toBe(400);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(users.length).toBe(0); // Check if no user is created
    });

    it("should return 400 if firstName is missing", async () => {
      // Arrange
      const userData = {
        firstName: "",
        lastName: "Doe",
        email: "john@email.com",
        password: "password123",
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);
      // console.log(response.body);

      // Assert
      expect(response.statusCode).toBe(400);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users.length).toBe(0); // Check if no user is created
    });

    it("Should return 400 status code if lastName is missing", async () => {
      // Arrange
      const userData = {
        firstName: "John",
        lastName: "",
        email: "john@email.com",
        password: "password123",
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert
      expect(response.statusCode).toBe(400);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users.length).toBe(0); // Check if no user is created
    });

    it("Should return 400 status code if password is missing", async () => {
      // Arrange
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@email.com",
        password: "",
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert
      expect(response.statusCode).toBe(400);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users.length).toBe(0); // Check if no user is created
    });
  });

  describe("Fields are not in proper format", () => {
    it("should trim the email field", async () => {
      // Arrange
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "  john@ewmail.com  ",
        password: "password123",
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);
      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(users[0].email).toBe("john@ewmail.com");
    });

    it("should return 400 status code if email is not a valid email", async () => {
      // Arrange
      const userData = {
        firstName: "Rakesh",
        lastName: "K",
        email: "rakesh_mern.space", // Invalid email
        password: "password",
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert
      expect(response.statusCode).toBe(400);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(0);
    });

    it("should return 400 status code if password length is less than 8 chars", async () => {
      // Arrange
      const userData = {
        firstName: "Rakesh",
        lastName: "K",
        email: "rakesh@mern.space",
        password: "pass", // less than 8 chars
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert
      expect(response.statusCode).toBe(400);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(0);
    });

    it("shoud return an array of error messages if email is missing", async () => {
      // Arrange
      const userData = {
        firstName: "Rakesh",
        lastName: "K",
        email: "",
        password: "password",
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert
      expect(response.body).toHaveProperty("errors");
      expect(
        (response.body as Record<string, string>).errors.length,
      ).toBeGreaterThan(0);
    });
  });
});
