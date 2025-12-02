# Campus Event Finder
## Backend Setup

The backend for **Campus Event Finder** is built with **Node.js + Express** and connected to a **PostgreSQL** database.
It provides REST API endpoints for managing campus events, allowing the frontend to fetch, display, create and RSVP to events.

From the root of the project:

```bash
cd backend
npm install
```

Create a .env file with: 

```env
DATABASE_URL="postgresql://campus_admin:<PASSWORD>@campus-event-finder.postgres.database.azure.com:5432/postgres?sslmode=require"
JWT_SECRET=<JWT_SECRET should be a long random string (at least 32 chars)>
```
> * Never commit `.env` files to GitHub.


### Run the Backend

Start the erver:

```bash
npm run dev
```

By default, the backend runs at:

```
http://localhost:5000
```
---

## Frontend Setup
From the root of the project:

```bash
cd frontend
npm install
```

### Run the Frontend

Start the server:

```bash
npm run dev
```

The frontend runs at:

```
http://localhost:5173/
```
---

## How to Run Unit Tests
From the root of the project:

```bash
cd backend
npm test
```