# TCP Websocket Chat Application
The application is architected based on Object-Oriented Programming (OOP) and SOLID principles, resulting in a high degree of maintainability, scalability, and readability. It employs modular design and layered architecture, integrating Dependency Injection (DI) for optimal functionality. Here are the core aspects of the architecture:

- `Modular Design`: The application is segmented into self-contained modules (app.module, auth.module, discussion.module, etc.). This ensures code readability and ease of maintenance.
- `Layered Architecture`: The codebase is stratified into Controllers, Services, and Modules, each responsible for specific tasks. This approach enhances scalability as it allows each layer to evolve independently.
- `Dependency Injection`: Dependencies are supplied to classes via constructors, promoting flexible, testable code with loosely coupled components.
- `Router`: This pattern facilitates task delegation based on request routes, enhancing scalability by allowing new routes without modifying the Router class.
- `Singleton Pattern`: Applied in SessionsService, this pattern provides global access to a single instance for consistent session management across the application.
- `Data Access Layer`: By utilizing the Prisma Client for database operations, the application ensures maintainability and flexibility, segregating the logic for database interactions.


## Dependencies
- `prisma`: An open-source database toolkit and type-safe query builder for Node.js & TypeScript.
- `typescript`: A statically typed superset of JavaScript, providing early error detection and compiling to plain JavaScript.
- `vitest`: A modern test runner with support for JavaScript, TypeScript, and fast, isolated test environments.
- `prettier`: An opinionated code formatter, enforcing a consistent code style across your project.
- `eslint`: A static code analysis tool for identifying problematic patterns in JavaScript code and ensuring code quality.
- `tsup`: A simple, zero-config bundler for TypeScript and JavaScript, providing fast and reliable development.
- `tsx`: A CLI command for seamlessly running TypeScript & ECMAScript modules, both in CommonJS and module package types.


## Prerequisites
- Docker and Docker Compose (for running with Docker)
- Node.js (for running without Docker)
- PostgreSQL (for running without Docker)

## Installation
### With Docker
1. Run `docker-compose up -d` in the root directory of the repository
2. The application will be available at `http://localhost:3000`

### Without Docker
1. Run `npm install` in the root directory of the repository
2. Make sure PostgreSQL is running on your local machine.
3. Create `.env` file in the root directory using the `.env.example` file as a template
2. Run `npm run db:migrate` to run the database migrations
3. Run `npm run dev` to start the application
4. The application will be available at `http://localhost:3000`

## Scripts
- `dev`: Starts the development server with ts-node-dev.
- `build`: Compiles the TypeScript code to JavaScript.
- `start`: Starts the production server.
- `test`: Runs the tests.
- `test:watch`: Runs the tests in watch mode.
- `test:coverage`: Generates test coverage.
- `test:ui`: Starts the test user interface.
- `db:migrate`: Runs the database migrations.



## Author
- [GitHub](https://www.github.com/henriquealbert)
- [LinkedIn](https://www.linkedin.com/in/henrique-albert-schmaiske/)
- [Email](mailto:ishenriquealbert@gmail.com)