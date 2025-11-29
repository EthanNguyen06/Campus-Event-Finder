/**
 * Authentication API Tests
 * Uses Jest + Supertest
 */

const request = require("supertest");
const app = require("../index");
const pool = require("../db");

// Store cookies for authenticated requests
let loginCookie;

/* ------------------------------------------------------------
   Helper: register a TEMP user
-------------------------------------------------------------*/
async function registerTempUser(email) {
  const uniqueUser = `temp${Date.now()}${Math.floor(Math.random() * 1000)}`;

  const res = await request(app)
    .post("/api/auth/register")
    .send({
      username: uniqueUser,
      email,
      password: "temp12345",
    });

  return res;
}


/* ------------------------------------------------------------
   Helper: login default test user
-------------------------------------------------------------*/
async function loginDefaultUser() {
  const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: "isabelle@example.com",
      password: "mypassword123",
    });

  loginCookie = res.headers["set-cookie"];
  return res;
}

beforeAll(async () => {
  // Login known seeded test user
  await loginDefaultUser();
});

afterAll(async () => {
  await pool.end();
});

/* ------------------------------------------------------------
   REGISTER
-------------------------------------------------------------*/
describe("POST /api/auth/register", () => {
  test("should register a new user", async () => {
    const uniqueEmail = `test${Date.now()}@example.com`;

    const res = await registerTempUser(uniqueEmail);

    expect(res.statusCode).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(uniqueEmail);

    // Should auto-set cookie
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  test("should reject duplicate email", async () => {
    const res = await registerTempUser("duplicate@example.com");
    expect(res.statusCode).toBe(201);

    const res2 = await registerTempUser("duplicate@example.com");
    expect(res2.statusCode).toBe(409);
    expect(res2.body.message).toMatch(/Email already registered/i);
  });

  test("should reject missing fields", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "", password: "" });

    expect(res.statusCode).toBe(400);
  });
});

/* ------------------------------------------------------------
   LOGIN
-------------------------------------------------------------*/
describe("POST /api/auth/login", () => {
  test("should login with valid credentials", async () => {
    const res = await loginDefaultUser();

    expect(res.statusCode).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
    expect(res.body.email).toBe("isabelle@example.com");
  });

  test("should reject invalid password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "isabelle@example.com",
        password: "wrongpass",
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/Invalid/i);
  });

  test("should reject unknown email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "random123@nope.com",
        password: "whatever",
      });

    expect(res.statusCode).toBe(401);
  });
});

/* ------------------------------------------------------------
   WHO AM I
-------------------------------------------------------------*/
describe("GET /api/auth/me", () => {
  test("should return user info when logged in", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Cookie", loginCookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBeDefined();
  });

  test("should reject when no auth cookie", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.statusCode).toBe(401);
  });

  test("should reject when token is invalid", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Cookie", ["token=INVALIDTOKEN123"]);

    expect(res.statusCode).toBe(401);
  });
});

/* ------------------------------------------------------------
   LOGOUT
-------------------------------------------------------------*/
describe("POST /api/auth/logout", () => {
  test("should clear cookie on logout", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", loginCookie);

    expect(res.statusCode).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  test("logout should still respond even with no cookie set", async () => {
    const res = await request(app).post("/api/auth/logout");
    expect(res.statusCode).toBe(200);
  });
});
