# Personal Manager

Web app to manage expenses, notes, and other collections using ReactJS and ExpressJS.

## Development

1. Open the project in a VSCode devcontainer which will start the PostgreSQL and development containers.

2. Configure the ExpressJS backend's environment variables in `backend_expressjs/.env` then run it:

```bash
cd backend_expressjs
npm install
npx prisma migrate dev
npm start

# In case of migration mess / errors, back up first then:
npx prisma migrate reset
```

3. Configure the ReactJS frontend's environment variables in `frontend_reactjs/.env.local` then run it:

```bash
cd frontend_reactjs
npm install
npm start
```

## Deployment

Frontend:
- Trigger rebuild using `npm run deploy`.

Backend:
  - Rebuild is automatically triggered on commit.

PostgreSQL Database:
  - Use `npx prisma migrate deploy` instead of `dev` during initial configuration or if the database models change.
