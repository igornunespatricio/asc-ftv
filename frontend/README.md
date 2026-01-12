# ASC Futevôlei – Frontend

Static web application built with HTML, CSS, and TypeScript for managing futevolei games and users.

## Organization

- src/pages/: HTML pages (index.html, login.html, users.html)
- src/partials/: Reusable HTML components (navbar.html)
- src/typescript/: TypeScript modules (auth.ts, forms.ts, main.ts, ranking.ts, userManagement.ts, users.ts, utils.ts)
- src/typescript/modules/: Game-specific logic (games.ts)
- src/typescript/types/: Type definitions (api.d.ts, index.d.ts)
- src/css/: Stylesheets (styles.css, navbar.css, permissions.css, variables.css)
- src/static/: Static assets (config.js.tpl)
- dist/: Build output directory

## How it Works

- Single-page application with navigation between different views
- TypeScript for type safety and modular code organization
- CSS for styling with variables for consistency
- Interacts with backend API via fetch requests
- Handles user authentication, game management, and rankings
- Uses webpack for bundling and building

## TODOs

- Don't allow inactive users to be selected in the game form
- Create validation for winner and loser scores where winner score needs to be higher than loser and at least 18
- Make the score optional
- Create a toggle for dark mode
