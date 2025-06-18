Recommendation Dashboard
Overview
This is a sophisticated web application designed to display, filter, and manage a list of security and cost-saving recommendations. It features a modern, responsive interface with a robust set of functionalities including infinite scrolling, multi-tag filtering, search, user authentication, and a dark/light theme. The application is built with a focus on maintainability, testability, and a clean separation of concerns.
Table of Contents
Live Demo
Features
Tech Stack & Architecture
Project Setup
Key Architectural Decisions
Testing Approach
Performance Considerations
Available Scripts

Demo
Login Credentials:
Username: admin
Password: password


Features
Secure Authentication: Login system with token-based authentication (JWT).
Infinite Scroll: Recommendations are loaded automatically as the user scrolls, ensuring a smooth and performant user experience.
Advanced Filtering & Search:
Full-text search across recommendation titles, descriptions, and reasons.
Multi-category filtering for Cloud Providers, Frameworks, Risk Classes, and Reasons.
Dynamic counts for each filter tag based on the current search results.
Recommendation Management: Users can view, select, and archive/unarchive recommendations.
Detailed View: A side panel provides a detailed view of any selected recommendation.
Theming: Seamlessly switch between a light and dark theme, with user preference persisted.
Responsive Design: A clean, modern UI that works across all screen sizes, from mobile to desktop.
Notifications: User-friendly toast notifications for all key actions (login, archive, errors).


Tech Stack & Architecture
This project is built with a modern and robust stack, chosen for its scalability and developer experience.
Frontend Library: React
Language: TypeScript
Routing: React Router for declarative, client-side routing.
Data Fetching & State Management: TanStack Query (React Query) for managing asynchronous server state, caching, and background refetching.
Styling: Tailwind CSS for a utility-first approach to building a responsive UI.
Testing:
Jest: As the core testing framework.
React Testing Library: For writing tests that simulate real user interactions.
Backend (Mock): json-server is used to provide a realistic mock API for development and testing.
Project Setup
To get the project up and running on your local machine, follow these steps.
Prerequisites
Node.js (v18.x or later)
npm or yarn
Installation & Setup
Clone the repository:
git clone [https://your-repository-url.git](https://your-repository-url.git)
cd your-project-directory


Install dependencies:
npm install
# or
yarn install


Set up environment variables:
Create a .env file in the root of the project and add the URL for your backend API:
REACT_APP_BASE_URL=http://localhost:3001


Start the mock backend server:
The project uses json-server for a mock API. To start it, go into the directory, mock-server
run:
npm run server
# or
yarn server

This will start the backend on http://localhost:3001.
Start the frontend development server:
In a new terminal window, run:
npm start
# or
yarn start

The application will be available at http://localhost:3000.

Key Architectural Decisions
Separation of Concerns with Context API:
AuthContext: Encapsulates all authentication logic, including the user's state, token management in localStorage, and login/logout functions. This keeps auth logic completely decoupled from the UI components.
FilterContext: Manages the state for all search and filter operations across the application (Recommendations and Archive pages). This prevents "prop drilling" and provides a single source of truth for all filtering parameters.
