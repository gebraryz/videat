# VIDEAT

**VIDEAT** ("Video" + "eat", without the "o") is an app designed for people who like to watch something while eating. The goal of the project is to provide users with a convenient tool to browse and search for videos perfect for "meal time".

The project is under development.

---

## Prerequisites

- Node.js (version 18 or higher recommended)
- Docker
- Docker Compose (usually included with Docker Desktop)
- Yarn or npm

---

## Environment Variables Setup

Create a `.env` file in the project root based on `.env.example`.  
Fill in your credentials and API keys.

Example `.env`:

    NODE_ENV=development
    POSTGRES_USER=your_postgres_user
    POSTGRES_PASSWORD=your_postgres_password
    POSTGRES_DB=your_database_name
    DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@videat-db:5432/${POSTGRES_DB}?connect_timeout=300
    YOUTUBE_API_KEY=your_youtube_api_key_here
    APP_PORT=8000
    APP_ORIGIN=http://localhost:3000
    FALLBACK_LANGUAGE=en
    NEXT_PUBLIC_API_URL=http://api:8000
    AI_API_URL=http://ai:5000  # AI microservice endpoint for language detection and video analysis

---

## Running Services with Docker Compose

To start all services defined in `docker-compose.yml`, run:

    docker-compose up -d

This will:

- Launch the PostgreSQL database and other containers (API, AI service, frontend, etc.)
- Automatically create necessary Docker networks
- Run containers in detached mode

To stop and remove containers, run:

    docker-compose down

---

## Installing Dependencies

Using Yarn:

    yarn install

Or npm:

    npm install

---

## Running the Application

Start the back-end API (adjust the command as needed):

    npm run start

Start the Next.js front-end:

    npm run dev

Make sure both back-end and front-end are running concurrently and properly configured.
