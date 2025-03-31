import request from "supertest";
import { calculateDiscount } from "./src/utils";
import app from "./src/app";

describe("App", () => {
  test("should return correct discount amount", () => {
    const discount = calculateDiscount(100, 10);
    expect(discount).toBe(10);
  });

  test("should return 200 status code", async () => {
    const response = await request(app).get("/").send();
    expect(response.statusCode).toBe(200);
  });
});
