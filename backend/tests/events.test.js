const request = require("supertest");
const app = require("../index"); // export your express app
const pool = require("../db");

let authCookie;      // stores login session cookie
let createdEventId;  // id of event created during tests

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

// Utility: login and get cookie
async function loginTestUser() {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "isabellevu@vt.edu", password: "password" });

  authCookie = res.headers["set-cookie"];
  expect(res.statusCode).toBe(200);
}

beforeAll(async () => {
  await loginTestUser();
});

afterAll(async () => {
  await pool.end();
});

/* -------------------------------------------------------------
   CREATE EVENT
--------------------------------------------------------------*/
describe("POST /api/events (Create Event)", () => {
  test("should create an event with valid data", async () => {
    const res = await request(app)
      .post("/api/events")
      .set("Cookie", authCookie)
      .send({
        title: "Test Event",
        description: "Testing event creation",
        category: "Testing",
        location: "VT Campus",
        start_time: "2025-12-01 10:00:00",
        end_time: "2025-12-01 12:00:00"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.title).toBe("Test Event");
    expect(res.body.image_url).toBeDefined(); // default image

    createdEventId = res.body.id;
  });

  test("should reject event missing required fields", async () => {
    const res = await request(app)
      .post("/api/events")
      .set("Cookie", authCookie)
      .send({ title: "Bad Event" });

    expect(res.statusCode).toBe(400);
  });
});

/* -------------------------------------------------------------
   GET EVENT
--------------------------------------------------------------*/
describe("GET /api/events/:id", () => {
  test("should fetch the created event", async () => {
    const res = await request(app).get(`/api/events/${createdEventId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Test Event");
    expect(res.body.created_by_username).toBeDefined();
  });

  test("should return 404 for non-existent event", async () => {
    const res = await request(app).get("/api/events/999999");
    expect(res.statusCode).toBe(404);
  });
});

/* -------------------------------------------------------------
   UPDATE EVENT
--------------------------------------------------------------*/
describe("PATCH /api/events/:id", () => {
  test("should update the event title", async () => {
    const res = await request(app)
      .patch(`/api/events/${createdEventId}`)
      .set("Cookie", authCookie)
      .send({ title: "Updated Event Title" });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Event Title");
  });

  test("should reject updating someone else's event", async () => {
    // login as a second user (must exist in DB)
    const otherLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: "other@example.com", password: "password123" });

    const otherCookie = otherLogin.headers["set-cookie"];

    const res = await request(app)
      .patch(`/api/events/${createdEventId}`)
      .set("Cookie", otherCookie)
      .send({ title: "Hacked Event" });

    expect(res.statusCode).toBe(403);
  });
});

/* -------------------------------------------------------------
   RSVP TESTS
--------------------------------------------------------------*/
describe("POST /api/events/:id/rsvp", () => {
  test("should allow a non-owner to RSVP", async () => {
    // Use "other user" to RSVP, not the creator
    const otherLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: "other@example.com", password: "password123" });

    const otherCookie = otherLogin.headers["set-cookie"];

    const res = await request(app)
      .post(`/api/events/${createdEventId}/rsvp`)
      .set("Cookie", otherCookie)
      .send({ attending: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.attending).toBe(true);
  });

  test("should reject RSVP with invalid attending value", async () => {
    const res = await request(app)
      .post(`/api/events/${createdEventId}/rsvp`)
      .set("Cookie", authCookie)
      .send({ attending: "yes" }); // invalid

    expect(res.statusCode).toBe(400);
  });

  test("should prevent event owner from RSVPing to their own event", async () => {
    const res = await request(app)
      .post(`/api/events/${createdEventId}/rsvp`)
      .set("Cookie", authCookie)
      .send({ attending: true });

    expect(res.statusCode).toBe(403);
  });
});

/* -------------------------------------------------------------
   GET ATTENDEES (CREATOR ONLY)
--------------------------------------------------------------*/
describe("GET /api/events/:id/attendees", () => {
  test("should allow event owner to view attendees", async () => {
    const res = await request(app)
      .get(`/api/events/${createdEventId}/attendees`)
      .set("Cookie", authCookie);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("should prevent non-owner from viewing attendees", async () => {
    const otherLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: "other@example.com", password: "password123" });

    const otherCookie = otherLogin.headers["set-cookie"];

    const res = await request(app)
      .get(`/api/events/${createdEventId}/attendees`)
      .set("Cookie", otherCookie);

    expect(res.statusCode).toBe(403);
  });
});

/* -------------------------------------------------------------
   DELETE EVENT
--------------------------------------------------------------*/
describe("DELETE /api/events/:id", () => {
  test("should delete the event as owner", async () => {
    const res = await request(app)
      .delete(`/api/events/${createdEventId}`)
      .set("Cookie", authCookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Event deleted successfully");
  });

  test("should return 404 when deleting non-existent event", async () => {
    const res = await request(app)
      .delete(`/api/events/999999`)
      .set("Cookie", authCookie);

    expect(res.statusCode).toBe(404);
  });
});