import request from "supertest";
import app from "../src/app.js";

let token;

beforeAll(async () => {
  // Log in and get a JWT token to use for authenticated routes
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "test@example.com", password: "123456", role: "buyer" });
  token = res.body.token;
});

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
        role: "buyer",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("Get current user API should return user profile", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email");
  });

  test("Update user API should update user profile", async () => {
    const res = await request(app)
      .put("/api/auth/me")
      .set("Authorization", `Bearer ${token}`)
      .field("name", "Updated Name")
      .field("phone", "0987654321");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Profile updated successfully");
  });
});

describe("PRODUCT API TESTS", () => {
  test("Upload product should return success", async () => {
    const res = await request(app)
      .post("/api/products/upload")
      .set("Authorization", `Bearer ${token}`)
      .field("name", "New Product")
      .field("description", "Product description")
      .field("price", 200)
      .field("category", "electronics")
      .attach("images", "path/to/your/image.jpg"); // Make sure to provide a valid path

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Product uploaded successfully");
  });

  test("Get all products should return a list of products", async () => {
    const res = await request(app)
      .get("/api/products")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  test("Get my products should return products from the current user", async () => {
    const res = await request(app)
      .get("/api/products/my-products")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  test("Get product recommendations should return related products", async () => {
    const res = await request(app)
      .get("/api/products/recommendations/1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  test("Mark product as sold should notify admin", async () => {
    const res = await request(app)
      .post("/api/products/inform-sold")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId: 1 });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Product marked as sold");
  });

  test("Get product by ID should return product details", async () => {
    const res = await request(app)
      .get("/api/products/1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("name");
  });
});

describe("CART API TESTS", () => {
  test("Add product to cart should return success", async () => {
    const res = await request(app)
      .post("/api/cart")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId: 1, quantity: 2 });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Product added to cart");
  });

  test("Get cart items should return cart contents", async () => {
    const res = await request(app)
      .get("/api/cart")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  test("Update cart item quantity should return updated cart", async () => {
    const res = await request(app)
      .put("/api/cart/update")
      .set("Authorization", `Bearer ${token}`)
      .send({ cartItemId: 1, quantity: 3 });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Cart item updated");
  });

  test("Remove item from cart should return success", async () => {
    const res = await request(app)
      .delete("/api/cart/1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Item removed from cart");
  });
});

describe("ORDER API TESTS", () => {
  test("Place an order should return order confirmation", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Order placed successfully");
  });

  test("Get user's orders should return a list of orders", async () => {
    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  test("Get order by ID should return the order details", async () => {
    const res = await request(app)
      .get("/api/orders/1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("orderId");
  });
});

describe("MESSAGE API TESTS", () => {
  test("Send message should return success", async () => {
    const res = await request(app)
      .post("/api/messages")
      .set("Authorization", `Bearer ${token}`)
      .send({ receiverId: 2, content: "Hello there!" });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Message sent");
  });

  test("Get messages should return a list of messages", async () => {
    const res = await request(app)
      .get("/api/messages")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  test("Get conversation with user should return message history", async () => {
    const res = await request(app)
      .get("/api/messages/conversation/2")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  test("Mark message as read should return success", async () => {
    const res = await request(app)
      .put("/api/messages/1/read")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Message marked as read");
  });
});

describe("WISHLIST API TESTS", () => {
  test("Get wishlist should return wishlist items", async () => {
    const res = await request(app)
      .get("/api/wishlist")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  test("Add to wishlist should return success", async () => {
    const res = await request(app)
      .post("/api/wishlist")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId: 1 });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Product added to wishlist");
  });

  test("Remove from wishlist should return success", async () => {
    const res = await request(app)
      .delete("/api/wishlist/1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Product removed from wishlist");
  });
});
