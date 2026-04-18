# URL Shortener Express

A TypeScript Express server that shortens URLs and stores them in a PostgreSQL database.

## Prerequisites

- Node.js (v14+)
- PostgreSQL database
- npm or yarn

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_HOST=your_db_host
   DB_NAME=your_database_name
   SHORT_URL_BASE_DEV=http://localhost:3000
   SHORT_URL_BASE_PROD=https://your-domain.com
   PORT=3000
   NODE_ENV=development
   ```

3. **Database Initialization**
   The database schema is automatically created on server startup. The `sql/init.sql` file defines the `urls` table with:
   - `id` (SERIAL PRIMARY KEY) - Auto-incrementing ID
   - `short_url` (VARCHAR, UNIQUE) - The shortened URL slug
   - `long_url` (TEXT) - The original long URL
   - `created_at` (TIMESTAMP) - Creation timestamp
   - `expires_at` (TIMESTAMP, nullable) - Optional expiration date

4. **Development**
   ```bash
   npm run dev
   ```
   The dev server will auto-restart when you save changes on port 3000.

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Create Shortened URL
**POST** `/api/shorten`

Request body:
```json
{
  "originalUrl": "https://example.com/very/long/url"
}
```

Response (201 Created):
```json
{
  "message": "URL shortened successfully",
  "shortenedURL": "http://localhost:3000/abc123"
}
```

Error responses:
- `400 Bad Request` - Missing `originalUrl` parameter
- `500 Internal Server Error` - Server error

### Get Shortened URL
**GET** `/api/shorten/:hashValue`

Response (200 OK):
```json
[
  {
    "id": 1,
    "short_url": "http://localhost:3000/abc123",
    "long_url": "https://example.com/very/long/url",
    "created_at": "2026-04-18T12:00:00.000Z",
    "expires_at": null
  }
]
```

Error responses:
- `400 Bad Request` - Missing `hashValue` parameter
- `404 Not Found` - URL not found in database
- `500 Internal Server Error` - Server error

## Scripts

- `npm run dev` - Start development server with nodemon + ts-node (auto-restarts on file changes)
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled JavaScript
- `npm run lint` - Run ESLint to check for code issues
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is properly formatted

## Project Structure

```
src/
  ├── app.ts                    # Express app configuration
  ├── server.ts                 # Server entry point with DB initialization
  ├── controllers/
  │   └── shorten.controller.ts # Request handlers
  ├── routes/
  │   └── shorten.route.ts      # Route definitions
  ├── service/
  │   └── shorten.service.ts    # Business logic
  └── db/
      └── db.ts                 # Database connection & schema setup
sql/
  └── init.sql                  # Database schema definition
package.json                    # Project dependencies and scripts
tsconfig.json                   # TypeScript configuration
```

## Configuration Files

### TypeScript (tsconfig.json)
- Strict mode enabled for type safety
- Target ES2020
- ES2020 module format (ES modules)
- Module resolution set to "node"
- Output to `dist/` directory

### ESLint (.eslintrc.json)
- TypeScript support via `@typescript-eslint`
- Recommended rules enabled
- Return types required for functions
- Single quotes enforced
- Semicolons required

### Prettier (.prettierrc)
- Single quotes
- Semicolons enabled
- Trailing commas for multiline
- 2-space indentation
- 100 character line width

## VS Code Integration

Install these extensions for the best experience:
- ESLint
- Prettier - Code formatter

Add to `.vscode/settings.json`:
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```
