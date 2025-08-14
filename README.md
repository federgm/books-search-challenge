# Book API Service

Backend API built with **Fastify + TypeScript** for searching, storing, and caching books using the OpenLibrary API, with persistence in **PostgreSQL** and caching in **Redis**.

## Features

- **Framework:** [Fastify](https://www.fastify.io/) with advanced typing (`FastifyTyped`).
- **Language:** [TypeScript](https://www.typescriptlang.org/).
- **Database:** [PostgreSQL](https://www.postgresql.org/).
- **Cache:** [Redis](https://redis.io/).
- **Testing:** [Jest](https://jestjs.io/) with coverage for controllers, services, and utilities.
- **Code style:** [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/).
- **Containers:** [Docker Compose](https://docs.docker.com/compose/).

## 📂 Project structure

```plaintext
src/
  modules/
    books/
      controller.ts
      services.ts
      dtos.ts
  libs/
    errors.ts
    fastify-interfaces.ts
  tests/
    unit/
    integration/
docker-compose.yml
tsconfig.json
jest.config.js
.eslintrc.js
.prettierrc
```

## 🛠 Architecture

- Controller: handles HTTP requests and validates parameters (getBook).

- Service: encapsulates business logic (BookEntityService).

- Infrastructure: PostgreSQL for persistence, Redis for caching, Docker Compose for orchestration.

- Tests: unit tests with mocks (DB, Redis, fetch) to isolate dependencies.

## 📦 Requirements

- Docker and Docker Compose installed.

- Node.js 22 required.

## 📄 Installation & usage

See the INSTALLATION.md file for detailed installation and execution steps.

## 🧪 Tests

Run all unit tests:

```plaintext
npm run test
```

With coverage report:

```plaintext
npm run test:ci:cov
```

🧹 Linter & formatting
Check style errors:

```plaintext
npm run lint
```

📝 License
This project is public and has no license.
