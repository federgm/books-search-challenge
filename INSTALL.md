# Project Installation & Execution

This document explains how to install, configure, and run the project locally using **Docker Compose**, as well as how to run it directly on your machine.

---

## 1. Clone the repository

```plaintext
git clone https://github.com/federgm/books-search-challenge
cd books-search-challenge
```

## 2. Environment variables

Create a .env file in the project root:

```plaintext
API_SERVER_HOST=0.0.0.0
API_SERVER_PORT=3001
LOG_LEVEL=info

DATABASE_HOST=<db-host>
DATABASE_PORT=<db-port>
DATABASE_NAME=<db-name>
DATABASE_USERNAME=<db-username>
DATABASE_PASSWORD=<db-pwd>
DATABASE_SSL=false
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

REDIS_HOST=<redis-host>
REDIS_PORT=<redis-port>

PGADMIN_DEFAULT_EMAIL=<your-email>
PGADMIN_DEFAULT_PASSWORD=<your-password>
```

## 3. Run with Docker Compose

```plaintext
docker-compose up --build
```

This will automatically create the schema, the "books" table and the "searchKey" index.

This will start:

```plaintext
App at: http://localhost:3000
Postgres on port 5432
Redis on port 6379
```

Run in detached mode:

```plaintext
docker-compose up -d
```

Stop services:

```plaintext
docker-compose down
```

## 4. Run without Docker (local mode)

To run in local mode, you'll need a library that's called [.dotenv](https://www.npmjs.com/package/dotenv)

```plaintext
npm install dotenv
npm install --save-dev @types/dotenv
```

You'll also need to create a .env.local for the environment variables to be loaded so you didn't get
an "variable not found" error

```plaintext
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
```

Finally, you'll need to import this to get access to the variables using process.env

```plaintext
import dotenv from 'dotenv';
```

### Requirements:

Node.js 20+

PostgreSQL and Redis installed and running locally

Install dependencies:

```plaintext
npm install
```

Compile TypeScript:

```plaintext
npm run build
```

Start the server:

```plaintext
npm start
```

## 5. Run tests

```plaintext
npm run test
```

With coverage report:

```plaintext
npm run test:coverage
```

---

## Initiate PG Database structure

- Connect to your local docker postgres instance on localhost:5000 and once inside run the SQL located at the "init-local" folder in this repo.

---

## Linter & formatting

```plaintext
Check style:
npm run lint

Format code:
npm run format
```

---

## Useful Docker commands

Check app logs:

```plaintext
docker-compose logs -f app
```

Access the database:

```plaintext
docker exec -it your_db_container_name psql -U book_user -d book_db
```

Clean volumes and cache:

```plaintext
docker-compose down -v
docker system prune -f
```

---

## Access to PGAdmin and Redis Insight on browser (UI Experience)

```plaintext
Postgres: http://localhost:5050
username and password are the ones settled in your configuration .env file

Redis: http://localhost:5540
no password provided by default
```

---
