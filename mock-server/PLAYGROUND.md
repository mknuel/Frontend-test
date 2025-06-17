# API Playground for Policy Recommendations Mock Server

This playground provides examples for testing all endpoints of the TypeScript mock server.

## Base URL

```
http://localhost:3001
```

## 1. Get Recommendations with Search and Filters

### Basic Request

```http
GET /recommendations?limit=10 HTTP/1.1
Host: localhost:3001
```

### With Search

```http
GET /recommendations?search=security&limit=10 HTTP/1.1
Host: localhost:3001
```

### With Tags

```http
GET /recommendations?tags=AWS,COMPUTE_RECOMMENDATION&limit=10 HTTP/1.1
Host: localhost:3001
```

### Combined Search and Tags

```http
GET /recommendations?search=security&tags=AWS,COMPUTE_RECOMMENDATION&limit=10 HTTP/1.1
Host: localhost:3001
```

### cURL Examples

```bash
# Basic request
curl -X GET "http://localhost:3001/recommendations?limit=10"

# With search
curl -X GET "http://localhost:3001/recommendations?search=security&limit=10"

# With tags
curl -X GET "http://localhost:3001/recommendations?tags=AWS,COMPUTE_RECOMMENDATION&limit=10"

# Combined search and tags
curl -X GET "http://localhost:3001/recommendations?search=security&tags=AWS,COMPUTE_RECOMMENDATION&limit=10"
```

### Expected Response

```typescript
{
  "data": [
    {
      "recommendationId": "rec-041",
      "title": "AWS ECS Task Definition Security",
      "description": "Implement security best practices...",
      // ... other fields
    }
  ],
  "pagination": {
    "cursor": {
      "next": "rec-042"
    },
    "totalItems": 50
  },
  "availableTags": {
    "frameworks": ["CIS Docker", "NIST 800-53", ...],
    "reasons": ["Minimizes container attack surface", ...],
    "providers": ["AWS", "AZURE"],
    "classes": ["COMPUTE_RECOMMENDATION", "NETWORKING_RECOMMENDATION", ...]
  }
}
```

## 2. Get Archived Recommendations with Search and Filters

### Request

```http
GET /recommendations/archive?search=security&tags=AWS&limit=10 HTTP/1.1
Host: localhost:3001
```

### cURL

```bash
curl -X GET "http://localhost:3001/recommendations/archive?search=security&tags=AWS&limit=10"
```

## 3. Archive/Unarchive Operations

### Archive a Recommendation

```http
POST /recommendations/rec-042/archive HTTP/1.1
Host: localhost:3001
```

### cURL

```bash
curl -X POST "http://localhost:3001/recommendations/rec-042/archive"
```

### Unarchive a Recommendation

```http
POST /recommendations/rec-042/unarchive HTTP/1.1
Host: localhost:3001
```

### cURL

```bash
curl -X POST "http://localhost:3001/recommendations/rec-042/unarchive"
```

## Testing Script

```bash
#!/bin/bash

BASE_URL="http://localhost:3001"

# Function to make requests and format response
make_request() {
    echo "Testing: $1"
    echo "Request: $2"
    echo "Response:"
    eval $2
    echo -e "\n-------------------\n"
}

# Test basic recommendations
make_request "Get Basic Recommendations" \
    "curl -s \"$BASE_URL/recommendations?limit=10\" | json_pp"

# Test search
make_request "Search Recommendations" \
    "curl -s \"$BASE_URL/recommendations?search=security&limit=10\" | json_pp"

# Test tag filtering
make_request "Filter by Tags" \
    "curl -s \"$BASE_URL/recommendations?tags=AWS,COMPUTE_RECOMMENDATION&limit=10\" | json_pp"

# Test combined search and tags
make_request "Combined Search and Tags" \
    "curl -s \"$BASE_URL/recommendations?search=security&tags=AWS&limit=10\" | json_pp"

# Test archived recommendations
make_request "Get Archived with Search" \
    "curl -s \"$BASE_URL/recommendations/archive?search=security&limit=10\" | json_pp"

# Archive and unarchive test
make_request "Archive Recommendation" \
    "curl -s -X POST \"$BASE_URL/recommendations/rec-042/archive\" | json_pp"

make_request "Unarchive Recommendation" \
    "curl -s -X POST \"$BASE_URL/recommendations/rec-042/unarchive\" | json_pp"
```

## TypeScript/JavaScript Example

```typescript
const api = {
	async getRecommendations(params: {
		cursor?: string;
		limit?: number;
		search?: string;
		tags?: string[];
	}) {
		const queryParams = new URLSearchParams();
		if (params.cursor) queryParams.append("cursor", params.cursor);
		if (params.limit) queryParams.append("limit", params.limit.toString());
		if (params.search) queryParams.append("search", params.search);
		if (params.tags?.length) queryParams.append("tags", params.tags.join(","));

		const response = await fetch(
			`http://localhost:3001/recommendations?${queryParams}`
		);
		return response.json();
	},

	async getArchivedRecommendations(params: {
		cursor?: string;
		limit?: number;
		search?: string;
		tags?: string[];
	}) {
		const queryParams = new URLSearchParams();
		if (params.cursor) queryParams.append("cursor", params.cursor);
		if (params.limit) queryParams.append("limit", params.limit.toString());
		if (params.search) queryParams.append("search", params.search);
		if (params.tags?.length) queryParams.append("tags", params.tags.join(","));

		const response = await fetch(
			`http://localhost:3001/recommendations/archive?${queryParams}`
		);
		return response.json();
	},
};

// Example usage
async function testApi() {
	try {
		// Get recommendations with search and filters
		const result = await api.getRecommendations({
			search: "security",
			tags: ["AWS", "COMPUTE_RECOMMENDATION"],
			limit: 10,
		});
		console.log("Search results:", result);

		// Use available tags
		console.log("Available frameworks:", result.availableTags.frameworks);
		console.log("Available providers:", result.availableTags.providers);
	} catch (error) {
		console.error("API Error:", error);
	}
}

testApi();
```
