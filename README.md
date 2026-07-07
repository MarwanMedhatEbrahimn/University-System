# University System

A university management system built with **Express** and server-rendered **EJS** views, using **Prisma** with a SQLite database. It supports three roles — Admin, Doctor, and Student.

## Tech stack

- **Backend:** [Express](https://expressjs.com/)
- **Views:** [EJS](https://ejs.co/) (server-rendered)
- **ORM / Database:** [Prisma](https://www.prisma.io/) + SQLite
- **Auth/session:** express-session, bcrypt
- **File uploads:** multer

## Prerequisites

- [Node.js](https://nodejs.org/) 16+ and npm
- Git

## Setup & running

Run the following commands from the project root.

**1. Clone and enter the project**

```bash
git clone https://github.com/MarwanMedhatEbrahimn/University-System.git
cd University-System
```

**2. Create your environment file**

Copy the example env file and fill in the values (see [Environment variables](#environment-variables) below).

```bash
cp .env.example .env
```

Generate a strong `SESSION_SECRET` and paste it into `.env`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**3. Install dependencies**

```bash
npm install
```

**4. Create the uploads directory**

Uploaded files are stored here (the folder is git-ignored).

```bash
mkdir uploads
```

**5. Run the database migration**

This creates the SQLite database and applies the schema. When asked to reset the database, answer `n` to keep existing data.

```bash
npx prisma migrate dev --name init
```

**6. Seed the database** (optional, for the default demo accounts below)

```bash
npx prisma db seed
```

**7. Start the server**

For development (auto-reload on changes):

```bash
npm run dev
```

Or for production:

```bash
npm start
```

The server runs at [http://localhost:8000](http://localhost:8000) (or the `PORT` set in `.env`).

## Environment variables

Copy `.env.example` to `.env` and set the following:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Prisma connection string. Defaults to the local SQLite file `file:./dev.db`. |
| `SESSION_SECRET` | Secret used to sign the session cookie. Generate one with the command in step 2. |
| `PORT` | Port the server listens on. Defaults to `8000` if omitted. |

## Default account

The database seed (step 6) creates a single admin account:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@gmail.com` | `password` |

Log in as the admin to create doctors and students from the app.
