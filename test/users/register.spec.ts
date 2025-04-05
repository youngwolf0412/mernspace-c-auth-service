import request from "supertest";
import app from "../../src/app";

describe("POST /auth/register", () => {
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
      const response = await request(app).post("/auth/register").send(userData);
      // Assert
      expect(response.statusCode).toBe(201);
    });
  });
  describe("happy path", () => {});
});
