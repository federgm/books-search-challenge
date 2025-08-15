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
plugins/
  db.ts
  redis.ts
src/
  books/
    v1/
      search/
        controller.ts
        dtos.ts
        routes.ts
        services.ts
  libs/
    config-interfaces.ts
    constants.ts
    dtos.ts
    errors.ts
    fastify-interfaces.ts
    logger.ts
  migrations/
    <all-knex-migrations-will-be-hosted-here>
  types/
    types.d.ts
  bootstrap.ts
  config.ts
  index.ts
tests/
    unit/
      books/
        v1/
          search/
            controllers.spec.ts
            services.spec.ts
      libs/
        errors.spec.ts
<more-configuration-and-setting-files>
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

📝 License
This project is public and has no license.
