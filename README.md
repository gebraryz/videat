# Project Setup and Run Instructions

## Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/) (usually comes with Docker Desktop)
- [Yarn](https://yarnpkg.com/) or npm

## Environment Variables

1. Create a `.env` file in the project root based on `.env.example`.
2. Fill in your credentials and keys in the `.env` file.

Example:

```env
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
```

## Running Services with Docker Compose

Start all services defined in your `docker-compose.yml` file with:

```bash
docker-compose up -d
```

This will:

- Launch the PostgreSQL database container (and any other services you have defined).
- Create necessary Docker networks automatically.
- Run containers in detached mode.

To stop and remove containers, run:

```bash
docker-compose down
```

## Install Dependencies

Using Yarn:

```bash
yarn install
```

Or using npm:

```bash
npm install
```

## Run the Application

Start your backend API (adjust command if needed):

```bash
yarn start
```

Or for the Next.js frontend:

```bash
yarn dev
```

Make sure both backend and frontend are running as per your setup.

## Notes

- Ensure your `.env` variables are properly set and loaded.
- `DATABASE_URL` should point to the correct hostname (`videat-db` if using Docker Compose network, or `localhost` if running locally).
- Replace `YOUTUBE_API_KEY` with your own API key from Google Cloud Console.
- `APP_ORIGIN` should match your frontend URL.

---

Feel free to customize these instructions according to your project specifics.
