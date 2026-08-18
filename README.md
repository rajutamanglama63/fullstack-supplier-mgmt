# Supplier Management — Full-Stack Challenge

End-to-end supplier creation and four-eyes approval workflow: React frontend, Express API, and PostgreSQL persistence. Business rules (unique VAT ID, status transitions, self-approval, mandatory rejection reason) are enforced on the backend, not only in the UI.

## Prerequisites

- Node.js 20 or newer
- npm
- Docker (for PostgreSQL)

## Database

PostgreSQL 16 runs locally via Docker Compose. Connection settings live in `backend/.env` (copy from the example; `.env` is gitignored).

```bash
cd backend
cp .env.example .env
npm install
npm run db:up
npm run prisma:generate
npm run prisma:migrate
```

This starts a container on port `5432` with database `supplier_mgmt`, generates the Prisma client, and applies the supplier table migration. VAT ID uniqueness is enforced by a unique index.

Stop the database with `npm run db:down` from `backend/`. Data is kept in a Docker volume unless you remove the volume.

Default connection string:

```
postgresql://postgres:password@localhost:5432/supplier_mgmt
```

## Start the backend

From `backend/` (after the database steps above):

```bash
npm run dev
```

The API listens on `http://localhost:3001`. The current user is simulated with the `X-User-Id` header (`anna` or `max`). There is no login.

## Start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite (default `http://localhost:5173`). Vite proxies `/api` to `http://localhost:3001`, so the backend must be running.

## Users

Switch the active user in the header. No authentication is implemented.

| User | `X-User-Id` | Role | Can do |
| --- | --- | --- | --- |
| Anna | `anna` | requester | Create suppliers, save local drafts, submit a request |
| Max | `max` | approver | Approve or reject suppliers in `PENDING_APPROVAL` |

Typical flow: stay as Anna, create a supplier with **Request** (stored as `PENDING_APPROVAL`) or **Save draft** (browser-only `DRAFT`). Click a row to open the detail page. Switch to Max to approve or reject.

## Tests

Backend API tests (Jest + Supertest). From `backend/`:

```bash
npm test
```

These tests cover the HTTP routes with the service layer mocked: list/get suppliers, create, approve, reject, and a missing `X-User-Id` header. They do not require the database.

There are no frontend automated tests in this repository.

## Architecture

```
frontend/          React + Vite + TypeScript
  pages/           list, create, detail (loading / empty / error UI)
  components/      table, form, actions, user switcher
  api/             fetch client; screens do not call fetch directly
  storage/         local drafts (localStorage)
  context/         active user (UserProvider)

backend/           Express + TypeScript + Prisma
  routes/          HTTP handlers
  services/        validation and workflow rules
  middleware/      current user, consistent JSON responses, errors
  prisma/          schema and migrations
```

- **Frontend** owns presentation, client-side required-field checks, and local drafts. **Request** / **Approve** / **Reject** go through `frontend/src/api/suppliers.ts`.
- **Backend** owns persistence and business rules in `supplierService`. Invalid transitions, duplicate VAT IDs, missing rejection reasons, and self-approval fail even if the API is called without the UI.
- **Identity** is the `X-User-Id` header, mapped to two fixed users in `backend/src/users.ts`.

### API

| Method | Path | Effect |
| --- | --- | --- |
| `GET` | `/api/suppliers` | List suppliers (newest first) |
| `GET` | `/api/suppliers/:id` | Get one supplier |
| `POST` | `/api/suppliers` | Create as `PENDING_APPROVAL` |
| `POST` | `/api/suppliers/:id/approve` | Approve (approver, not the creator) |
| `POST` | `/api/suppliers/:id/reject` | Reject with `{ "reason": "..." }` |

All `/api` routes require `X-User-Id: anna` or `X-User-Id: max`.

Responses use `{ success, message, data }` on success. Failures return `{ success: false, message }` with an HTTP status such as 400, 401, 403, 404, or 409. Error codes are logged on the server.

### Workflow

```
DRAFT (frontend localStorage only)
        |
        |  Request  →  POST /api/suppliers
        v
PENDING_APPROVAL  (PostgreSQL)
        |        \
        |         \
    Approve      Reject
        v          v
   APPROVED     REJECTED
```

Approved or rejected suppliers cannot be processed again.

## Assumptions

- Anna is the only requester and Max is the only approver, matching the challenge brief.
- **Request** persists the supplier immediately as `PENDING_APPROVAL`. There is no backend `DRAFT` row and no `POST /submit` endpoint.
- **Save draft** stores the form in `localStorage` under `supplier-mgmt-drafts`. Drafts are per browser and per creator; they are not shared with Max and are dropped after a successful Request.
- VAT IDs must be unique in the database. Comparison is case-sensitive and applied after trim.
- Country is free text.
- Approvers cannot open the create form; the UI redirects them home.
- A complete login system is out of scope; switching the header user is enough for the demo.

## Known limitations

- Drafts live only in the browser. Restarting the API does not restore them, and VAT uniqueness is not checked until Request.
- API error bodies use a generic client message. Specific codes (`VAT_ID_ALREADY_EXISTS`, `SELF_APPROVAL_NOT_ALLOWED`, and so on) are logged server-side but not returned to the frontend.
- Backend tests mock `supplierService`, so duplicate VAT, self-approval, and invalid transitions are not exercised against the real service or database.
- No frontend tests.
- No edit or delete for drafts beyond Request.
- No overview search, filter, or pagination.
- Self-approval is enforced in the service, but the two demo users cannot trigger it from the UI (Anna cannot approve; Max never creates).

## Production improvements

- Persist drafts as `DRAFT` in PostgreSQL and add `POST /api/suppliers/:id/submit` so the full status machine lives on the server.
- Return structured error codes to the client and map them to field-level messages (especially duplicate VAT ID).
- Add service-layer tests for the workflow rules, plus at least one frontend test for validation and role-based actions.
- Replace the user header with real authentication and authorization.
- Normalize VAT IDs (trim + consistent casing) before the uniqueness check.
- Add an audit log of status changes, optimistic locking for concurrent review, and pagination on the list endpoint.
- Keep secrets and origins in environment config only; add rate limiting and request validation middleware.

Out of scope for this time-boxed exercise: real auth, user administration, notifications, cloud deployment, and a full design system.
