import { DataSource } from "typeorm";

import { AppDataSource } from "../../src/config/data-source";
import request from "supertest";
import createJWKSMock from "mock-jwks";

import { Roles } from "../../src/constants";
import { User } from "../../src/entity/User";
import app from "../../src/app";
import { isJwt } from "../utils";

describe("GET /auth/self", () => {
  let connection: DataSource;
  let jwks: ReturnType<typeof createJWKSMock>;
  // beforeAll tells Jest to run this function before all tests in this file
  beforeAll(async () => {
    jwks = createJWKSMock("http://localhost:5501");
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    jwks.start(); // Start the JWKS server
    // console.log("Starting JWKS server...");

    await connection.dropDatabase(); // Drop the database before each test
    await connection.synchronize(); // Recreate the database schema
  });

  afterEach(() => {
    jwks.stop(); // Stop the JWKS server after each test
  });

  afterAll(async () => {
    // Close the database connection after all tests are done
    await connection.destroy();
  });

  describe("Given All Fields", () => {
    it("should return the 200 status code", async () => {
      // jwks.token is used to generate a JWT token for the user
      // with the specified payload (sub and role)
      const accessToken = jwks.token({
        sub: "1",
        role: Roles.CUSTOMER,
      });
      // console.log("setting access token--------", accessToken);

      const response = await request(app)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send();

      // accessToken is set in request

      expect(response.statusCode).toBe(200);
    });
    it("should return the user data", async () => {
      // Register user
      const userData = {
        firstName: "Rakesh",
        lastName: "K",
        email: "rakesh@mern.space",
        password: "password",
      };
      const userRepository = connection.getRepository(User);
      const data = await userRepository.save({
        ...userData,
        role: Roles.CUSTOMER,
      });
      // Generate token
      const accessToken = jwks.token({
        sub: String(data.id),
        role: data.role,
      });

      // Add token to cookie
      const response = await request(app)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken};`])
        .send();
      // Assert
      // Check if user id matches with registered user
      expect((response.body as Record<string, string>).id).toBe(data.id);
    });
    // it("should not return the password field", async () => {
    //   // register a user
    //   const userData = {
    //     firstName: "Rakesh",
    //     lastName: "K",
    //     email: "rakesh@mern.space",
    //     password: "password",
    //   };
    //   const userRepository = connection.getRepository(User);
    //   const data = await userRepository.save({
    //     ...userData,
    //     role: Roles.CUSTOMER,
    //   });

    //   // generate token
    //   const accessToken = jwks.token({ sub: String(data.id), role: data.role });
    //   // add token to cookie
    //   const response = await request(app)
    //     .get("/api/self")
    //     .set("Cookie", [`accessToken=${accessToken};`])
    //     .send();
    //   // Assert
    //   expect(
    //     (response.body as Record<string, string>).password,
    //   ).not.toHaveProperty("password");
    // });
  });
});
