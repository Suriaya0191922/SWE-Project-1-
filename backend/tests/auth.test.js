import request from "supertest";
import app from "../src/app.js";

describe("AUTH API TESTS", () => {

  test("Signup API should create a new user", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .field("name", "Test User")
      .field("username", "testuser")
      .field("email", "test@example.com")
      .field("password", "123456")
      .field("phone", "1234567890")
      .field("address", "Dhaka")
      .field("role", "buyer")
      .field("preferredCategory", "electronics");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Signup successful");
  });

  test("Login API should return JWT token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "123456",
        role: "buyer"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

});
