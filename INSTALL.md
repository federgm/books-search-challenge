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
API_SERVER_PORT=<select-your-port-for-the-api>
LOG_LEVEL=info

DATABASE_HOST=host.docker.internal
DATABASE_PORT=<db-port>
DATABASE_NAME=<db-name>
DATABASE_USERNAME=<db-username>
DATABASE_PASSWORD=<db-pwd>
DATABASE_SSL=false
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

REDIS_HOST=redis
REDIS_PORT=<redis-port>
REDIS_INSIGHT_PORT=<redis-insight-port>

PGADMIN_DEFAULT_EMAIL=<your-email>
PGADMIN_DEFAULT_PASSWORD=<your-password>
PGADMIN_HOST_PORT=<pgadmin-host-port>
```

Notes:

There are some configurations that are needed for the application to be able to interact with postgres and redis containers

- API_SERVER_HOST needs to be "0.0.0.0"
- DATABASE_HOST needs to be "host.docker.internal"
- DATABASE_PORT, REDIS_PORT, REDIS_INSIGHT_PORT and PGADMIN_HOST_PORT are the ones being used to get your app up and running,
  please select ports that you're not using on your local machine
- REDIS_HOST needs to be "redis"

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
