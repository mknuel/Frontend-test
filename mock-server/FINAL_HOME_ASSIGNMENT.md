# Policy Recommendations Dashboard

## Senior Frontend Developer Home Assignment

### Overview

Create a React-based dashboard that enables security teams to efficiently manage and review security rules recommendations. The application should provide an intuitive interface for viewing, searching, and managing security policy rules while handling large datasets efficiently.

### Setup Instructions

1. Mock Server Setup:

```bash
cd mock-server
npm install
npm run dev  # Starts server on http://localhost:3001
```

2. Create Frontend Project:

### Core Requirements

#### 1. Main Dashboard View

- Infinite scrolling list of recommendations
- Each recommendation card displays:
  - Title and description
  - Risk score indicator
  - Cloud provider icons
  - Framework compliance badges
  - Quick archive action
- Responsive flex layout
- Loading states and error handling

#### 2. Search & Filter System

- Debounced search (300ms) across:
  - Title
  - Description
  - Reasons
  - Framework names
- Multi-tag filtering:
  - Framework filters
  - Cloud provider filters
  - Risk class filters
  - Reason filters
- Real-time results updates
- Clear loading states
- "No results" handling

#### 3. Detail View

- Side panel implementation
- Complete recommendation details:
  - Full description
  - Impact assessment
  - Resource implications (Resources enforced by policy)
  - Framework compliance
  - Implementation reasons
- Archive/unarchive functionality
- Smooth transitions

#### 4. Archive Management

- Separate archived items view
- Unarchive capability
- Maintained filter/search state
- Success/error messaging

#### 5. Authentication & Authorization

- Login page with form validation
- Protected routes implementation
- Session management
- Logout functionality
- Auth state persistence

### Technical Requirements

1. TypeScript Implementation:

- Strict mode enabled
- Full type coverage
- Proper interface definitions

2. State Management:

- React Context for:
  - Auth state
  - User preferences
  - Filter state
- Clean state organization
- Proper state persistence

3. Routing & Navigation:

- Protected route implementation
- Route-based code splitting
- Deep linking support
- Navigation state management

4. Session Management (Bonus):

- JWT token handling
- Session timeout handling
- Auth state synchronization

1. Styling:

- CSS-in-JS/TailwindCSS
- Responsive design
- Consistent theming
- Dark/light mode support

6. Performance:

- Code splitting
- Lazy loading
- Proper memoization
- Loading state management

7. Testing:

- Unit tests for components
- Integration tests
- Hook testing
- Error boundary testing

### API Documentation

```typescript
// Authentication
POST /login
Body: { username: string, password: string }
Response: { token: string }

// Get recommendations
GET /recommendations
Headers: { Authorization: 'Bearer <token>' }
Query Parameters:
  cursor?: string        // Pagination cursor
  limit?: number        // Items per page (default: 10)
  search?: string       // Search term
  tags?: string        // Comma-separated tags

Response: {
  data: Recommendation[];
  pagination: {
    cursor: {
      next: string | null;
    };
    totalItems: number;
  };
  availableTags: {
    frameworks: string[];
    reasons: string[];
    providers: string[];
    classes: string[];
  };
}

// Archive endpoints
POST /recommendations/{id}/archive
POST /recommendations/{id}/unarchive
Headers: { Authorization: 'Bearer <token>' }
Response: { success: boolean }
```

### Data Models

```typescript
interface Recommendation {
  recommendationId: string;
  title: string;
  description: string;
  score: number;
  provider: CloudProvider[];
  frameworks: Framework[];
  reasons: string[];
  class: RecommendationClass;
  // See types.ts for complete definition
}
```

### Bonus Features

1. Advanced Routing:

- Nested routes for detail views
- Route-based code splitting
- URL-based filtering
- Route transitions
- Browser history management

2. Session Management:

- Token refresh mechanism
- Session timeout notifications
- Multiple tab synchronization
- Secure token storage
- Auth state persistence

3. Protected Routes:

- Role-based access control
- Auth state synchronization
- Login redirect handling
- Deep linking support
- Route guards

4. Performance:

- Component virtualization
- Request caching
- Optimistic updates
- Debounced actions
- Progressive loading

5. User Experience:

- Keyboard navigation
- Smooth animations
- Toast notifications
- Error recovery
- Loading skeletons

6. Testing:

- E2E tests with Cypress
- Component tests
- Integration tests
- Performance tests
- Accessibility tests

### Submission Guidelines

1. Repository:

- Create a private GitHub repository
- Include mock server
- Clear commit history
- Branch organization

2. Documentation:

- Comprehensive README
- Setup instructions
- Architecture decisions
- Testing approach
- Performance considerations

3. Code Quality:

- Clean code practices
- Proper TypeScript usage
- Consistent styling
- Error handling
- Code comments

### Timeline

- Expected time: 4-5 hours
- Maximum time: 1 week

### Notes

- Focus on code quality and user experience
- Consider security best practices
- Implement proper error handling
- Ensure responsive design
- Document key decisions
- Write maintainable code

For questions or clarifications, please reach out to the hiring team.
