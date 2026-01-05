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

- [x] **Feature Branch: backend-refactor**
  - [x] Commit: Create shared utilities module for CORS headers and common responses
  - [x] Commit: Create authentication utility module for role checking
  - [x] Commit: Migrate add_game lambda to AWS SDK v3
  - [x] Commit: Update all lambdas to use shared CORS utilities
  - [x] Commit: Standardize error response formats across all lambdas
  - [x] Commit: Create shared database client configuration
  - [x] Commit: Refactor input validation into shared utilities

## Priority 3: Frontend Architecture Refactoring

Break down main.js into modular components following SRP.

- [x] **Feature Branch: frontend-modularization**
  - [x] Commit: Extract game management logic into games.js module
  - [x] Commit: Extract ranking display logic into ranking.js module
  - [x] Commit: Extract form handling logic into forms.js module
  - [x] Commit: Extract user management logic into userManagement.js module
  - [x] Commit: Refactor main.js to orchestrate modules without business logic
  - [x] Commit: Create shared DOM manipulation utilities
  - [x] Commit: Update imports and module dependencies

## Priority 4: Public Ranking Feature

Allow viewing ranking without authentication.

- [x] **Feature Branch: public-ranking-view**
  - [x] Commit: Verify existing ranking endpoint allows public access (no auth required)
  - [x] Commit: Create public fetch utility in utils.js for API calls without authentication
  - [x] Commit: Add ranking display section to login.html below the login form
  - [x] Commit: Implement ranking table display in login.js with loading states
  - [x] Commit: Add error handling for ranking fetch failures on login page
  - [x] Commit: Style the ranking section to match login page design and ensure responsiveness

## Priority 5: UI/UX Modernization

New color scheme (black opaque primary, modern yellow) and layout improvements with DRY CSS foundation.

- [ ] **Feature Branch: ui-modernization**
  - [x] Commit: Implement DRY CSS foundation with unified color system and component variables
  - [x] Commit: Extract shared component styles (buttons, forms, tables)
  - [x] Commit: Consolidate table styling and responsive behavior
  - [ ] Commit: Modernize form styling and user interactions
  - [ ] Commit: Update navbar and navigation styling
  - [ ] Commit: Redesign main layout structure for better responsiveness
  - [ ] Commit: Add smooth transitions and hover effects throughout

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
