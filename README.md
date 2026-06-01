# Bharat Matrimony Website

Full-stack matrimonial website with a React frontend, PHP backend API, and MySQL database schema.

## Demo Credentials

- User: `user@example.com` / `User@123`
- Admin: `admin@matrimony.local` / `Admin@123`

The React app includes a demo fallback so every button remains usable even before PHP/MySQL are configured.

## Project Structure

```text
frontend/                 React user interface
frontend/src/App.jsx      Main app state and view switching
frontend/src/components/  Reusable React components
frontend/src/css/         Section-based CSS files
frontend/src/pages/       Page-level React screens
frontend/src/user/        User app modules from the PRD
frontend/src/admin/       Separate admin frontend modules
frontend/src/data/        Demo data and navigation config
frontend/src/services/    API client
frontend/src/utils/       Shared utilities
backend/                  PHP backend
backend/api/              PHP JSON API
backend/api/admin/        Admin-only backend endpoints
backend/config/           Database configuration
backend/core/             Bootstrap and shared helpers
backend/database/         MySQL schema and seed data
```

## PRD Coverage Added

- User: dashboard, discovery, matches, interests, chat, notifications, subscriptions, profile, privacy/settings, safety center.
- Admin: dashboard, users, verification, reports, moderation, payments, analytics, CMS, marketing.
- Backend modules: auth, profiles, interests, messages, matches, calls, subscriptions, reports, verification, notifications, admin users, admin verification, admin reports, admin payments, admin analytics, admin CMS, admin marketing.
- Database modules: users, profiles via users table, interests, shortlists, messages, calls, subscriptions, payments, verification, reports, notifications, family accounts, CMS, campaigns, audit logs.

Third-party integrations such as Aadhaar/PAN verification, Google/Apple login, payment gateway, WebRTC calls, push/SMS providers, AI moderation, and real OTP delivery are scaffolded as UI/API/database workflows and need provider credentials to become live.

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Admin URL:

```text
http://localhost:5173/admin
```

Admin credentials:

```text
admin@matrimony.local / Admin@123
```

Create `frontend/.env` if your PHP API is hosted elsewhere:

```text
VITE_API_BASE_URL=http://localhost/matrimonial/backend/api
```

## Setup Backend

1. Create a MySQL database, for example `matrimonial_db`.
2. Import:

```sql
SOURCE backend/database/schema.sql;
SOURCE backend/database/seed.sql;
```

3. Copy `backend/api/.env.example` to `backend/api/.env` and update DB settings.
4. Serve `backend/api` through Apache, XAMPP, WAMP, or PHP's built-in server:

```bash
php -S localhost:8080 -t backend/api
```

Then set:

```text
VITE_API_BASE_URL=http://localhost:8080
```
