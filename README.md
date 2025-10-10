# 🧠 Backend & Database Documentation

## Overview

The backend for **Campus Event Finder** is built with **Node.js + Express** and connected to a **PostgreSQL** database hosted on **Supabase**.
It provides REST API endpoints for managing campus events — allowing the frontend to fetch, display, and eventually create or RSVP to events.

---

## 📂 Folder Structure

```
backend/
├── index.js        # Main Express server
├── db.js           # Database connection (via pg + dotenv)
├── seed.sql        # SQL file for initial schema and seed data
├── package.json    # Dependencies and scripts
└── .env            # Environment variables (not committed)
frontend/
├── components      # smaller components on pages (ex: navbar)
├── pages           # Main files for pages (ex: events list)
```

---

## ⚙️ Backend Setup

### 1 Install Dependencies

From the root of the project:

```bash
cd backend
npm install
```

```env
DATABASE_URL=postgres://postgres:<YOUR_PASSWORD>@db.<PROJECT_ID>.supabase.co:5432/postgres
```

> * This connection string comes from **Supabase → Settings → Database → Connection Info**.
> * Never commit `.env` files to GitHub.

---

### 2 Run the Backend

Start the server:

```bash
npm run dev
```

By default, the backend runs at:

```
http://localhost:5000
```

---

## 🧩 API Endpoints

| Method | Endpoint                 | Description                          | Example Response                             |
| ------ | ------------------------ | ------------------------------------ | -------------------------------------------- |
| GET    | `/api/health`            | Check if the server is running.      | `{ "status": "API working" }`                |
| GET    | `/api/events`            | Returns all events.                  | `[ { "id": 1, "title": "Hackathon", ... } ]` |
| GET    | `/api/events/:id`        | Returns details for one event.       | `{ "id": 1, "title": "Hackathon", ... }`     |
| POST   | `/api/events` *(future)* | Create a new event (for organizers). | `{ "message": "Event created" }`             |

---

## 🗄️ Database

### Hosted on Supabase

* Database engine: **PostgreSQL 16**
* Default database name: `postgres`
* Default user: `postgres`
* Managed by Supabase; accessible via both:

  * The **Supabase SQL Editor** (web)
  * The **connection string** in `.env`

---

### Table Schema

`database.sql` creates and populates the main table:

```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date TIMESTAMP NOT NULL,
  location VARCHAR(255) NOT NULL,
  category VARCHAR(100)
);
```

Sample data includes 5–6 example events (Hackathon, Career Fair, etc.).

---

### Connecting to the Database (Optional)

You can connect to Supabase directly using `psql`:

```bash
psql <YOUR_SUPABASE_CONNECTION_URL>
```

or use the SQL Editor in the Supabase dashboard to run queries.

---

## 🧑‍🤝‍🧑 For Teammates

### Running Locally

1. Pull the latest code from GitHub.
2. Add the `.env` file (shared privately by the team lead).
3. Run:

   ```bash
   cd backend
   npm run dev
   ```
4. Visit [http://localhost:5000/api/events](http://localhost:5000/api/events) to confirm connection.

### Common Issues

| Error                              | Cause                                    | Fix                                               |
| ---------------------------------- | ---------------------------------------- | ------------------------------------------------- |
| `password authentication failed`   | Wrong password in `.env`                 | Update to match Supabase password                 |
| `The server does not support SSL`  | Using local Postgres                     | Ensure `ssl: false` in `db.js`                    |
| `database "events" does not exist` | Wrong database name in connection string | Use `/postgres` at the end of your `DATABASE_URL` |

---

## 🔮 Future Expansion (Sprint 2+)

* Add `/api/rsvp` endpoint and `rsvps` table.
* Implement user authentication and login routes.
* Add role-based permissions (student, organizer, admin).

---

✅ **In short:**

* The backend runs with `npm run dev` on port 5000.
* It connects to Supabase via `DATABASE_URL` from `.env`.
* Frontend fetches event data from `/api/events`.
* All teammates share the same database; no local setup needed.
