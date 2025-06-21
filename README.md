# 📊 Recommendation Dashboard

This is a web application designed to display, filter, and manage a list of security and cost-saving recommendations. It features a modern, responsive interface with a robust set of functionalities including infinite scrolling, multi-tag filtering, search, user authentication, and a dark/light theme. The application is built with a focus on maintainability, testability, and a clean separation of concerns.

> 👤 By Emmanuel Onyekponwane

---

## 🔗 Preview

**Login Credentials:**\
Username: `admin`\
Password: `password`

---

## ✨ Features

- **Secure Authentication**: Login system with token-based authentication (JWT).
- **Infinite Scroll**: Automatically loads more recommendations as the user scrolls.
- **Advanced Filtering & Search**:
  - Full-text search across titles, descriptions, and reasons.
  - Multi-tag filtering for cloud providers, frameworks, risk classes, and reasons.
  - Dynamic tag counts based on filtered results.
- **Recommendation Management**: View, archive/unarchive recommendations.
- **Detailed Side Panel**: Detailed view for selected recommendations.
- **Dark/Light Theme**: Theme toggle with user preference saved.
- **Responsive Design**: Works across mobile, tablet, and desktop.
- **User Notifications**: Friendly toast messages for all key actions.
- 

---

## 🧱 Tech Stack & Architecture

- **Frontend**: React + TypeScript
- **Routing**: React Router
- **State Management & Data Fetching**: TanStack Query (React Query)
- **Styling**: Tailwind CSS
- **Testing**:
  - Jest
  - React Testing Library
- **Mock Backend**: json-server

---

## ⚙️ Project Setup

### 🔧 Prerequisites

- Node.js (v18 or later)
- npm or Yarn

### 🛠 Installation & Setup

```bash
git clone https://your-repository-url.git](https://github.com/mknuel/Frontend-test.git
cd frontend-test

# Install dependencies
npm install
# or
yarn install
```

### 🌐 Environment Variables

Create a `.env` file in the root:

```bash
REACT_APP_BASE_URL=http://localhost:3001
```

### 🚀 Start Servers

**Mock Backend:**

```bash
npm run server
# or
yarn server
```

Runs at `http://localhost:3001`

**Frontend:**

```bash
npm start
# or
yarn start
```

App available at `http://localhost:3000`

---

## 🧠 Key Architectural Decisions

### 📦 Create React App vs Vite

- CRA provides:
  - Stable and battle-tested tooling
  - Better Jest support
  - More conservative ecosystem for long-term projects

### 🌐 Centralized State with Context API

- **AuthContext**: Manages token, login/logout, and auth state.
- **FilterContext**: Centralized filtering state for search, categories, etc.

### 📡 Declarative Server State with TanStack Query

- **useInfiniteQuery**: For cursor-based pagination and infinite scroll
- **Caching**: Instant UI feedback and background refetching

### 🧩 Component-Based Structure

- Container (`RecommendationsPage`) + Content (`RecommendationsContent`) separation
- Reusable components like `RecommendationCard`, `FilterDropdown`, etc.

### 📁 Abstracted Service Layer

- All API logic in `recommendationService.ts`, `authService.ts`, etc.
- No direct fetch calls in components

---
## 🧪 Testing Approach

This project uses **Jest** and **React Testing Library** to ensure a reliable and maintainable codebase through both unit and integration testing.

### ✅ Unit Tests
- Cover **components**,**utility functions**, **services**, and **context providers** (e.g., authentication logic).
- Focus on **isolated logic correctness**, independent of the DOM or UI.
- **Examples**:
  - Ensuring `AuthContext` sets and clears tokens correctly.
  - Verifying data transformation or filtering helpers return the expected values.

### ✅ Integration Tests
- Use **React Testing Library** to simulate **real user interactions**.
- Validate interaction between components, UI, and state.
- **Examples**:
  - Toggling filters in a dropdown updates the UI as expected.
  - Verifying a user is redirected when not authenticated.

### 🧩 Routing & Context Mocks
- **Auth** and **Theme** contexts are wrapped or mocked to provide controlled values during tests.
- This enables testing components in isolation without external dependencies breaking the flow.

---

> To run the test suite:

```bash
npm test
# or
yarn test


Run all tests:

```bash
npm test
# or
yarn test
```

---

## ⚡ Performance Considerations

- **Infinite Scrolling**: Reduces memory and improves UX
- **Aggressive Caching**: Data loads from cache instantly
- **Memoization**: Optimize expensive calculations using `useMemo`
- **Skeleton Loaders**: Prevent jarring blank states
- **Debounced Inputs**: Prevents excessive API calls
- **Code Splitting**: Load chunks only when needed
- **Dynamic imports**
- 

---

## 📜 Available Scripts

In the project directory:

### `npm start`

Starts the development server.

### `npm test`

Launches the test runner.

### `npm run build`

Builds the app for production.

### `npm run server`

Starts the JSON mock server


## Comprehensive Documentation here
https://docs.google.com/document/d/1ozn5JkHvZvDMJLaq2lCzn95ZCQ2uZB2C6rnyJLb1ecM/edit?usp=sharing
---

## 📖 License

MIT — Feel free to use, modify, and distribute.

