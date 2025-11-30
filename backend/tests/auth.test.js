import request from "supertest";

describe("AUTH API TESTS", () => {

  // ---------------------------
  // TEST CASE 1 – SIGNUP API
  // ---------------------------
  test("Signup API should create a new user", async () => {
    const res = await request("http://localhost:5000")
      .post("/api/auth/signup")
      .field("name", "Test User")
      .field("username", "testuser123")
      .field("email", "test_signup@gmail.com")
      .field("password", "123456")
      .field("role", "buyer")
      .field("preferredCategory", "electronics");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Signup successful");
  });

  // ---------------------------
  // TEST CASE 2 – LOGIN API
  // ---------------------------
  test("Login API should return JWT token", async () => {
    const res = await request("http://localhost:5000")
      .post("/api/auth/login")
      .send({
        email: "test_signup@gmail.com",
        password: "123456",
        role: "buyer"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.message).toBe("Login successful");
  });

});
