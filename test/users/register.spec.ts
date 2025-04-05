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
  });
  describe("happy path", () => {});
});
