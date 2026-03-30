# Job Application Pipeline API

A RESTful API for managing a job application pipeline — track companies, applications, and contacts across your job search. Built with **Next.js 16 App Router** and **TypeScript**.

**Live URL:** [job-tracker-api-phi.vercel.app](https://job-tracker-api-phi.vercel.app)

---

## Why This Project

Most job seekers track applications in scattered spreadsheets with no structure. This API provides a clean, relational data model with full CRUD operations, nested resources, and an aggregation endpoint — the same patterns used in production SaaS applications.

**Skills demonstrated:**
- REST API design with proper resource relationships
- Full CRUD with input validation and consistent error handling
- Nested resource routing (applications and contacts under companies)
- Cascade delete across related resources
- Data aggregation endpoint computing derived statistics
- TypeScript type safety with full/input type separation
- Next.js 16 App Router API routes

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | App Router API routes |
| TypeScript | Type safety, interfaces, enums |
| Vercel | Deployment |
| Postman | API testing |

---

## Data Model

Three resources with clear relationships:

```
Company (1) ──→ (many) Application
Company (1) ──→ (many) Contact
Application (optional) ──→ (1) Contact (via referralContactId)
```

**Company** — The organization you're tracking  
**Application** — A specific role at a company (status, priority, salary range)  
**Contact** — A person at the company (recruiter, alumni, referral)

---

## API Endpoints

### Companies

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `POST` | `/api/companies` | Create a company | `201`, `400` |
| `GET` | `/api/companies` | List all companies | `200` |
| `GET` | `/api/companies/:id` | Get a single company | `200`, `404` |
| `PATCH` | `/api/companies/:id` | Update a company | `200`, `400`, `404` |
| `DELETE` | `/api/companies/:id` | Delete company + cascade | `204`, `404` |

### Applications

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `POST` | `/api/companies/:id/applications` | Create application under company | `201`, `400`, `404` |
| `GET` | `/api/applications` | List all applications (cross-company) | `200` |
| `PATCH` | `/api/applications/:id` | Update an application | `200`, `400`, `404` |
| `GET` | `/api/applications/stats` | Aggregated application statistics | `200` |

### Contacts

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `POST` | `/api/companies/:id/contacts` | Add contact at a company | `201`, `400`, `404` |
| `GET` | `/api/companies/:id/contacts` | List contacts at a company | `200`, `404` |

---

## Request & Response Examples

### Create a Company

```bash
POST /api/companies
```

```json
{
  "name": "Google",
  "location": "Mountain View, CA",
  "industry": "Tech",
  "websiteUrl": "https://google.com"
}
```

**Response — 201 Created:**

```json
{
  "data": {
    "name": "Google",
    "location": "Mountain View, CA",
    "industry": "Tech",
    "websiteUrl": "https://google.com",
    "id": "f7348d19-7c78-4e34-9324-b22d20046472",
    "createdAt": "2026-03-28T23:20:01.062Z",
    "updatedAt": "2026-03-28T23:20:01.062Z"
  }
}
```

### Create an Application

```bash
POST /api/companies/:companyId/applications
```

```json
{
  "roleTitle": "Frontend Engineer",
  "jobUrl": "https://careers.google.com/frontend",
  "techStack": ["React", "TypeScript"]
}
```

**Response — 201 Created:**

```json
{
  "data": {
    "roleTitle": "Frontend Engineer",
    "jobUrl": "https://careers.google.com/frontend",
    "techStack": ["React", "TypeScript"],
    "id": "e33c4949-1d96-4cbf-b6a0-2991e6f963d5",
    "companyId": "f7348d19-7c78-4e34-9324-b22d20046472",
    "status": "not_applied",
    "priority": "medium",
    "workModel": "on_site",
    "createdAt": "2026-03-29T06:38:53.274Z",
    "updatedAt": "2026-03-29T06:38:53.274Z"
  }
}
```

### Application Stats

```bash
GET /api/applications/stats
```

**Response — 200 OK:**

```json
{
  "data": {
    "totalApplications": 3,
    "byStatus": {
      "applied": 1,
      "phone_screen": 1,
      "not_applied": 1
    },
    "byPriority": {
      "high": 1,
      "medium": 1,
      "low": 1
    },
    "withReferrals": 0
  }
}
```

### Error Response

All errors follow a consistent format:

```json
{
  "error": {
    "message": "Company with id: abc123 was not found",
    "code": "NOT_FOUND",
    "status": 404
  }
}
```

---

## Design Decisions

**Consistent error format** — Every error returns `{ error: { message, code, status } }`. Consumers can branch logic on `code` and display `message` to users.

**PATCH over PUT** — Partial updates only. Clients send only the fields they want to change. Server-controlled fields (`id`, `createdAt`, `companyId`) are protected from client override.

**Nested + flat routes** — Applications are created under `/companies/:id/applications` (shows the parent relationship) but listed at `/applications` (enables cross-company views and filtering).

**Cascade delete** — Deleting a company removes all associated applications and contacts. No orphaned records.

**Server-generated defaults** — `status` defaults to `"not_applied"`, `priority` to `"medium"`, `workModel` to `"on_site"`. Clients can override these or let the server handle it.

**Spread operator ordering** — `{ ...body, id, createdAt, updatedAt }` ensures client-sent fields are applied first, then server fields overwrite any attempted overrides.

---

## Enums

**Application Status:** `not_applied` | `applied` | `phone_screen` | `interview` | `offer` | `rejected` | `ghosted`

**Work Model:** `on_site` | `remote` | `hybrid`

**Priority:** `high` | `medium` | `low`

**Connection Type:** `alumni` | `referral` | `recruiter` | `meetup` | `cold_outreach` | `other`

---

## Project Structure

```
src/
├── app/
│   └── api/
│       ├── companies/
│       │   ├── route.ts                    # POST, GET all
│       │   └── [id]/
│       │       ├── route.ts                # GET, PATCH, DELETE by id
│       │       ├── applications/
│       │       │   └── route.ts            # POST application
│       │       └── contacts/
│       │           └── route.ts            # POST, GET contacts
│       └── applications/
│           ├── route.ts                    # GET all applications
│           ├── [id]/
│           │   └── route.ts               # PATCH application
│           └── stats/
│               └── route.ts               # GET aggregated stats
├── lib/
│   └── memory.ts                           # In-memory data store
└── types/
    └── index.ts                            # TypeScript types & enums
```

---

## Running Locally

```bash
# Clone the repo
git clone https://github.com/stevenpartida/job-tracker-api.git
cd job-tracker-api

# Install dependencies
npm install

# Start dev server
npm run dev
```

API available at `http://localhost:3000`

---

## Known Limitations

**In-memory storage** — Data resets on server restart and between serverless function invocations on Vercel. This is intentional for the current scope. A PostgreSQL database will replace the in-memory store in the next iteration.

**No authentication** — All endpoints are public. Auth will be added in a future version.

**No query param filtering** — GET endpoints return all records. Status/priority filtering and sorting are planned additions.

---

## Next Steps

- [ ] Replace in-memory storage with PostgreSQL (Neon/Supabase)
- [ ] Add query param filtering and sorting on GET endpoints
- [ ] Add authentication (JWT)
- [ ] Add DELETE for individual applications and contacts
- [ ] Add search across companies by name

---

## Author

**Steven** — CS graduate, Cal State LA (2025)  
Stack: React, Next.js, TypeScript, Python
