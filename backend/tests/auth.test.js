import request from "supertest";
import app from "../src/app.js";

// Helper: Get fresh token for each test (fixes 401 errors)
const getFreshToken = async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "test@example.com", password: "123456", role: "buyer" });
  return res.body.token;
};

describe("AUTH API TESTS", () => {
  test("Signup API should create a new user", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .field("name", "Test User")
      .field("username", `testuser_${Date.now()}`)  // Unique username
      .field("email", `test${Date.now()}@example.com`)  // Unique email
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
      .send({ email: "test@example.com", password: "123456", role: "buyer" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});

describe("PRODUCT API TESTS", () => {
  test("Get all products should return a list of products", async () => {
    const token = await getFreshToken();
    const res = await request(app)
      .get("/api/products")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Get product by ID should return product details", async () => {
    const token = await getFreshToken();
    const res = await request(app)
      .get("/api/products/1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("productName");  // Fixed: was "name"
  });
});

describe("CART API TESTS", () => {
  test("Get cart items should return cart contents", async () => {
    const token = await getFreshToken();
    const res = await request(app)
      .get("/api/cart")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("ORDER API TESTS", () => {
  test("Get user's orders should return a list of orders", async () => {
    const token = await getFreshToken();
    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("MESSAGE API TESTS", () => {
  test("Get messages should return a list of messages", async () => {
    const token = await getFreshToken();
    const res = await request(app)
      .get("/api/messages")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("WISHLIST API TESTS", () => {
  test("Get wishlist should return wishlist items", async () => {
    const token = await getFreshToken();
    const res = await request(app)
      .get("/api/wishlist")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
