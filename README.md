# URL Inspector

This full-stack web app allows users to analyze websites by crawling pages and collecting data like HTML version, headings, link stats, login form detection, and more.

## Tech Stack

- **Frontend**: React 19 + TypeScript, Tailwind CSS, Vite
- **Backend**: Go (Gin), MySQL, SQLC, Golang-Migrate
- **Dev Tools**: Docker, Air, Vitest, React Testing Library

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/foyez/url-inspector.git
cd url-inspector
```

### 2. Environment Setup

- Copy and configure `.env` files:

```bash
cp backend/.env.example backend/.env
cp client/.env.example client/.env
```

---

## Run with Makefile

All actions are available using the top-level `Makefile`.

### Development Flow

```bash
make up_dev        # Start backend server in development mode (via Docker)
make up            # Start backend server in production mode (via Docker)
make migrateup     # Run DB migrations (via Docker)
make sqlc          # Generate Go DB code (via Docker)
make fe_dev        # Start frontend dev server
```

### Testing

```bash
make fe_test       # Run frontend tests (Vitest)
```

### Cleanup

```bash
make down          # Stop and remove dev containers in production mode
make down_dev      # Stop and remove dev containers in development mode
make migratedown   # Rollback last DB migration (via Docker)
```

---

## Authorization Token

All API requests require an auth token.

### Configuration

Set the token value in the environment files:

- **backend/.env**

  ```
  API_TOKEN=secret_token
  ```

- **client/.env**

  ```
  VITE_API_TOKEN=secret_token
  ```

> The frontend automatically injects the token from `VITE_API_TOKEN` using Axios in `client.ts`.

### Manual Testing (e.g., Postman/cURL)

Add the following HTTP header to every API request:

```
Authorization: Bearer secret_token
```

Make sure the value matches the one in your `backend/.env` files.

### Running the Project

#### 1. Start Backend and Frontend server

```bash
make up_dev
make fe_dev
```

#### 2. Seed demo data (optional)

```bash
make seed
```

> Make sure the MySQL container is fully running before running this command. This will populate the database with 20 demo URLs, related heading and link data for testing purposes.

---

## Project Structure

```
url-inspector/
├── backend/      # Go + Gin + SQLC + MySQL + Migrations
├── client/       # Vite + React + Tailwind + Vitest
├── Makefile       # Unified commands for all environments
└── README.md     # Setup instructions
```
