// all test cases generated with ChatGPT with prompt "Generate Jest test cases for Express.js REST API with Supertest"
const request = require("supertest");
const app = require("../index"); // export your express app
const pool = require("../db");

let userCookie = null;
let secondUserCookie = null;
let createdEventId = null;

/* -------------------------------------------------------------
   Helper: Register + Login + Return cookie
------------------------------------------------------------- */
async function registerAndLogin(email, password, username = "user") {
  await request(app).post("/api/auth/register").send({
    email,
    password,
    username,
  });

  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({ email, password });

  const cookie = loginRes.headers["set-cookie"]?.[0];
  expect(cookie).toBeDefined();

  return cookie;
}

/* -------------------------------------------------------------
   Helper: Create an event (must be authenticated)
------------------------------------------------------------- */
async function createEvent(authCookie, overrides = {}) {
  const payload = {
    title: "Test Event",
    description: "A scheduled event",
    location: "Test Hall",
    category: "General",
    start_time: "2025-11-01T10:00",
    end_time: "2025-11-01T12:00",
    image_url: "",
    ...overrides,
  };

  const res = await request(app)
    .post("/api/events")
    .set("Cookie", authCookie)
    .send(payload);

  expect(res.statusCode).toBe(201);
  expect(res.body.id).toBeDefined();

  return res.body;
}

/* -------------------------------------------------------------
   Test Lifecycle
------------------------------------------------------------- */
beforeAll(async () => {
  // Create users for testing
  userCookie = await registerAndLogin(
    "user1@example.com",
    "password123",
    "user1"
  );

  secondUserCookie = await registerAndLogin(
    "user2@example.com",
    "password123",
    "user2"
  );
});

afterAll(async () => {
  await pool.end();
});

/* -------------------------------------------------------------
   Tests
------------------------------------------------------------- */

describe("EVENTS API ENDPOINTS", () => {
  /* ---------------------------------------------------------
     CREATE EVENT
  --------------------------------------------------------- */
  test("POST /api/events - create event", async () => {
    const created = await createEvent(userCookie);
    createdEventId = created.id;

    expect(created.title).toBe("Test Event");
    expect(created.created_by_username).toBeDefined();
  });

  /* ---------------------------------------------------------
     GET ONE EVENT
  --------------------------------------------------------- */
  test("GET /api/events/:id - fetch event", async () => {
    const res = await request(app)
      .get(`/api/events/${createdEventId}`)
      .set("Cookie", userCookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(createdEventId);
    expect(res.body.title).toBe("Test Event");
  });

  test("GET /api/events/:id - 404 for missing event", async () => {
    const res = await request(app).get("/api/events/999999");
    expect(res.statusCode).toBe(404);
  });

  /* ---------------------------------------------------------
     UPDATE EVENT
  --------------------------------------------------------- */
  test("PATCH /api/events/:id - update event as owner", async () => {
    const res = await request(app)
      .patch(`/api/events/${createdEventId}`)
      .set("Cookie", userCookie)
      .send({ title: "Updated Title" });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Title");
  });

  test("PATCH /api/events/:id - reject update by non-owner", async () => {
    const res = await request(app)
      .patch(`/api/events/${createdEventId}`)
      .set("Cookie", secondUserCookie)
      .send({ title: "Hacked" });

    expect(res.statusCode).toBe(403);
  });

  /* ---------------------------------------------------------
     RSVP TESTS
  --------------------------------------------------------- */
  test("POST /api/events/:id/rsvp - non-owner can RSVP", async () => {
    const res = await request(app)
      .post(`/api/events/${createdEventId}/rsvp`)
      .set("Cookie", secondUserCookie)
      .send({ attending: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.attending).toBe(true);
  });

  test("POST /api/events/:id/rsvp - owner cannot RSVP to own event", async () => {
    const res = await request(app)
      .post(`/api/events/${createdEventId}/rsvp`)
      .set("Cookie", userCookie)
      .send({ attending: true });

    expect(res.statusCode).toBe(403);
  });

  /* ---------------------------------------------------------
     GET ATTENDEES
  --------------------------------------------------------- */
  test("GET /api/events/:id/attendees - owner can view attendees", async () => {
    const res = await request(app)
      .get(`/api/events/${createdEventId}/attendees`)
      .set("Cookie", userCookie);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /api/events/:id/attendees - non-owner blocked", async () => {
    const res = await request(app)
      .get(`/api/events/${createdEventId}/attendees`)
      .set("Cookie", secondUserCookie);

    expect(res.statusCode).toBe(403);
  });

  /* ---------------------------------------------------------
     DELETE EVENT
  --------------------------------------------------------- */
  test("DELETE /api/events/:id - owner deletes event", async () => {
    const res = await request(app)
      .delete(`/api/events/${createdEventId}`)
      .set("Cookie", userCookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Event deleted successfully");
  });

  test("DELETE /api/events/:id - 404 deleting missing event", async () => {
    const res = await request(app)
      .delete(`/api/events/999999`)
      .set("Cookie", userCookie);

    expect(res.statusCode).toBe(404);
  });
});
