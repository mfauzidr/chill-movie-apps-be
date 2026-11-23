# Chill Movie Apps Backend

## Phase 01 — Project Initialization & Database Connection

### 1. Objective

The objective of this phase is to initialize the backend project, configure the development environment, establish a connection to the MySQL database, and implement a basic REST API health check.

### 2. Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| TypeScript | Type-safe development |
| Express.js | Backend framework |
| Knex.js | SQL Query Builder |
| MySQL2 | MySQL database driver |
| dotenv | Environment variable management |
| tsx | TypeScript development runtime |

### 3. Project Structure

The project uses a layered architecture to separate application responsibilities.

- `config/`: Application and database configuration.
- `database/`: Database connection and Knex instance.
- `handlers/`: HTTP request and response handling.
- `middlewares/`: Express middleware.
- `repositories/`: Database query operations.
- `routes/`: API endpoint definitions.
- `services/`: Business logic.
- `types/`: TypeScript type definitions.
- `app.ts`: Express application configuration.
- `server.ts`: Application entry point and server initialization.

### 4. Database Configuration

The application uses Knex.js with the MySQL2 driver to establish database connectivity.

Database configuration is separated into `database.config.ts`, while the Knex instance is initialized centrally in `database/knex.ts`.

Environment variables are used to manage database credentials and connection settings without hardcoding sensitive information.

**Evidence:** `docs/screenshots/phase-01/01-database-configuration.png`

### 5. Server Initialization

The application initializes the database connection before starting the Express HTTP server.

A simple `SELECT 1` query is executed to verify database connectivity.

If the connection succeeds, the Express server starts listening on the configured port. If the connection fails, the application terminates its startup process.

**Evidence:** `docs/screenshots/phase-01/02-server-initialization.png`

### 6. Health Check API

A health check endpoint is implemented to verify that the backend API is running and responding to HTTP requests.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/health` | Check API availability |

**Test Result:**

- HTTP Status: `200 OK`
- Response Status: `success`
- Message: `Chill Movie Apps API is running`

**Evidence:** `docs/screenshots/phase-01/03-health-check-postman.png`

### 7. TypeScript Validation

The project provides scripts for development, compilation, and type checking.

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Compile TypeScript |
| `npm start` | Run compiled application |
| `npm run typecheck` | Validate TypeScript types |

Both TypeScript type checking and compilation completed successfully.

### 8. Phase 01 Result

The initial backend setup has been completed successfully.

- Node.js and Express environment initialized.
- TypeScript configuration established.
- Knex.js configured with MySQL2.
- Database connection verified successfully.
- Express server running on port 3000.
- Health check endpoint tested successfully using Postman.

**Phase 01 Status: Completed.**