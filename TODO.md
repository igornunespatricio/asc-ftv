# ASC-FTV Project Improvements Todo List

This list ranks improvements from 1 (most critical) to 10 (enhancement). Each improvement is organized into feature branches with incremental commits for better tracking and review.

## Priority 1: Security & Role Management Overhaul

Remove viewer role, add game inputer role (CRUD on games), keep admin role with full access.

- [x] **Feature Branch: security-role-refactor**
  - [x] Commit: Create database migration script to update user roles (remove viewer, add game_inputer)
  - [x] Commit: Update jwt_authorizer lambda to handle new role permissions
  - [x] Commit: Modify lambda functions to check for game_inputer role instead of viewer
  - [x] Commit: Update frontend authentication and role-checking logic
  - [x] Commit: Remove all viewer role references from UI components
  - [x] Commit: Add role validation in user creation/update lambdas
  - [x] Commit: Update API Gateway permissions for new role structure

## Priority 2: Backend Architecture Refactoring

Eliminate code duplication in lambdas, standardize AWS SDK v3, create shared utilities.

- [ ] **Feature Branch: backend-refactor**
  - [x] Commit: Create shared utilities module for CORS headers and common responses
  - [x] Commit: Create authentication utility module for role checking
  - [x] Commit: Migrate add_game lambda to AWS SDK v3
  - [x] Commit: Update all lambdas to use shared CORS utilities
  - [x] Commit: Standardize error response formats across all lambdas
  - [ ] Commit: Create shared database client configuration
  - [ ] Commit: Refactor input validation into shared utilities

## Priority 3: Frontend Architecture Refactoring

Break down main.js into modular components following SRP.

- [ ] **Feature Branch: frontend-modularization**
  - [ ] Commit: Extract game management logic into games.js module
  - [ ] Commit: Extract ranking display logic into ranking.js module
  - [ ] Commit: Extract form handling logic into forms.js module
  - [ ] Commit: Extract user management logic into userManagement.js module
  - [ ] Commit: Refactor main.js to orchestrate modules without business logic
  - [ ] Commit: Create shared DOM manipulation utilities
  - [ ] Commit: Update imports and module dependencies

## Priority 4: Public Ranking Feature

Allow viewing ranking without authentication.

- [ ] **Feature Branch: public-ranking-view**
  - [ ] Commit: Create new public API endpoint for ranking (no auth required)
  - [ ] Commit: Add public ranking page/route in frontend
  - [ ] Commit: Update navigation to show ranking link for all users
  - [ ] Commit: Implement conditional UI elements based on authentication status
  - [ ] Commit: Add loading states and error handling for public ranking
  - [ ] Commit: Update CORS configuration for public endpoints

## Priority 5: UI/UX Modernization

New color scheme (black opaque primary, modern yellow) and layout improvements.

- [ ] **Feature Branch: ui-modernization**
  - [ ] Commit: Update CSS variables with new color palette (black opaque, modern yellow)
  - [ ] Commit: Redesign main layout structure for better responsiveness
  - [ ] Commit: Modernize form styling and user interactions
  - [ ] Commit: Update table designs for ranking and games lists
  - [ ] Commit: Improve mobile responsiveness across all pages
  - [ ] Commit: Add smooth transitions and hover effects
  - [ ] Commit: Update navbar and navigation styling

## Priority 6: Type Safety Implementation

Add TypeScript support for better code quality.

- [ ] **Feature Branch: typescript-migration**
  - [ ] Commit: Set up TypeScript configuration for frontend
  - [ ] Commit: Set up TypeScript configuration for lambdas
  - [ ] Commit: Create type definitions for API responses
  - [ ] Commit: Convert utils.js to TypeScript with proper types
  - [ ] Commit: Convert auth.js to TypeScript
  - [ ] Commit: Convert main component modules to TypeScript
  - [ ] Commit: Update build process for TypeScript compilation

## Priority 7: Testing Framework Setup

Implement unit and integration tests.

- [ ] **Feature Branch: testing-framework**
  - [ ] Commit: Set up Jest for frontend unit tests
  - [ ] Commit: Set up testing framework for lambda functions
  - [ ] Commit: Create unit tests for utility functions
  - [ ] Commit: Create integration tests for API endpoints
  - [ ] Commit: Add test coverage reporting
  - [ ] Commit: Create end-to-end test scenarios
  - [ ] Commit: Set up CI/CD pipeline for automated testing

## Priority 8: Error Handling Standardization

Consistent error responses and user feedback.

- [ ] **Feature Branch: error-handling**
  - [ ] Commit: Create standardized error response format
  - [ ] Commit: Implement global error boundary in frontend
  - [ ] Commit: Add user-friendly error messages for common scenarios
  - [ ] Commit: Implement proper logging in lambdas
  - [ ] Commit: Add retry mechanisms for network failures
  - [ ] Commit: Create error tracking and monitoring
  - [ ] Commit: Update all error handling to follow new patterns

## Priority 9: Performance Optimizations

Database query improvements and caching.

- [ ] **Feature Branch: performance-optimization**
  - [ ] Commit: Optimize DynamoDB queries with proper indexing
  - [ ] Commit: Implement caching for frequently accessed data
  - [ ] Commit: Add pagination for large data sets
  - [ ] Commit: Optimize frontend bundle size
  - [ ] Commit: Implement lazy loading for components
  - [ ] Commit: Add database connection pooling
  - [ ] Commit: Performance monitoring and metrics

## Priority 10: Documentation Updates

API documentation and code documentation.

- [ ] **Feature Branch: documentation-update**
  - [ ] Commit: Create OpenAPI/Swagger documentation for all endpoints
  - [ ] Commit: Update README with new features and setup instructions
  - [ ] Commit: Add inline code documentation for complex functions
  - [ ] Commit: Create architecture diagrams and decision records
  - [ ] Commit: Document database schema and relationships
  - [ ] Commit: Create user guide and API usage examples
  - [ ] Commit: Set up automated documentation generation
