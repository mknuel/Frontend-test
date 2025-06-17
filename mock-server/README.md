# TypeScript Mock Server for Policy Recommendations

This TypeScript-based mock server implements the API endpoints required for the policy recommendations dashboard.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Build the TypeScript code:

```bash
npm run build
```

3. Start the server:

Development mode with auto-reload:

```bash
npm run dev          # Without authentication
npm run dev:auth    # With authentication enabled
```

Production mode:

```bash
npm start           # Without authentication
npm run start:auth  # With authentication enabled
```

4. Run tests:

```bash
# In a separate terminal, with the server running
npm test
```

The server will run on http://localhost:3001 by default.

## Project Structure

```
src/
  ├── types.ts     # Type definitions
  ├── data.ts      # Mock data generation
  ├── server.ts    # Server implementation
  └── test.ts      # Integration tests
```

## API Endpoints

### Get Recommendations

```typescript
GET /recommendations?cursor={cursor}&limit={limit}

Response: {
  data: Recommendation[];
  pagination: {
    cursor: {
      next: string | null;
    };
    totalItems: number;
  };
}
```

### Get Archived Recommendations

```typescript
GET /recommendations/archive?cursor={cursor}&limit={limit}

// Same response format as above
```

### Archive Recommendation

```typescript
POST / recommendations / { id } / archive;

Response: {
  success: boolean;
}
```

### Unarchive Recommendation

```typescript
POST / recommendations / { id } / unarchive;

Response: {
  success: boolean;
}
```

### Authentication (when enabled)

```typescript
POST / login;
Body: {
  username: string;
  password: string;
}

Response: {
  token: string;
}
```

## Authentication

When running with authentication (`npm run start:auth` or `npm run dev:auth`), all `/recommendations` endpoints require a valid JWT token in the Authorization header:

```typescript
headers: {
  'Authorization': 'Bearer <token>'
}
```

## Type Definitions

The server includes TypeScript definitions for all models:

```typescript
interface Recommendation {
  tenantId: string;
  recommendationId: string;
  title: string;
  slug: string;
  description: string;
  score: number;
  provider: CloudProvider[];
  frameworks: Framework[];
  reasons: string[];
  furtherReading: URL[];
  totalHistoricalViolations: number;
  affectedResources: AffectedResource[];
  impactAssessment: ImpactAssessment;
  class: RecommendationClass;
}

// See src/types.ts for complete type definitions
```

## Development

### Building

```bash
npm run build          # Compiles TypeScript to JavaScript
```

### Testing

The project includes both manual testing tools and automated tests:

1. Automated Tests:

```bash
# Start the server in one terminal
npm run dev

# Run tests in another terminal
npm test
```

2. Manual Testing:
   Use the provided PLAYGROUND.md file for testing examples and the test script.

## Error Handling

The server returns appropriate HTTP status codes and error messages:

```typescript
interface ErrorResponse {
  error: string;
}

// Status codes:
200: Successful request
401: Authentication required
403: Invalid or expired token
404: Resource not found
500: Server error
```

## Example Usage

### Fetch Recommendations

```typescript
// Using fetch
const fetchRecommendations = async (cursor?: string, limit: number = 10) => {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.append('cursor', cursor);

  const response = await fetch(`http://localhost:3001/recommendations?${params}`);
  return response.json();
};

// With authentication
const fetchWithAuth = async (token: string) => {
  const response = await fetch('http://localhost:3001/recommendations', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};
```

### Authentication

```typescript
// Login
const login = async (username: string, password: string) => {
  const response = await fetch('http://localhost:3001/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
};
```
