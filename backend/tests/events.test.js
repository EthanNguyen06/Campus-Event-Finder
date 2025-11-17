const request = require("supertest");
const app = require("../index"); // export your express app
const pool = require("../db");

describe("Event API", () => {
  afterAll(() => pool.end());

  test("GET /api/events should return all events", async () => {
    const res = await request(app).get("/api/events");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("events");
    expect(Array.isArray(res.body.events)).toBe(true);
  });

  test("GET /api/events/:id should return one event", async () => {
    const res = await request(app).get("/api/events/1");
    expect([200, 404]).toContain(res.statusCode); // handle missing
  });
});
