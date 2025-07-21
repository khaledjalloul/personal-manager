# Personal Manager

Web app to manage expenses, notes, and other personal items to keep track off.

## Development

1. Open the project in a VSCode devcontainer which will start the PostgreSQL and development containers.

2. Configure the ExpressJS backend's environment variables in `backend_expressjs/.env` then run it:

```bash
cd backend_expressjs
npm install
npx prisma migrate dev
npm start
```

3. Configure the ReactJS frontend's environment variables in `frontend_reactjs/.env.local` then run it:

```bash
cd frontend_reactjs
npm install
npm start
```

## Deployment

- Frontend: Hosted on [GitHub pages](https://khaledjalloul.github.io/personal-manager).
  - Trigger rebuild using `npm run deploy`.
- Backend: Hosted on [Render](https://render.com/).
  - Use `npx prisma migrate deploy` instead of `dev` during configuration.
  - Rebuild is automatically triggered on commit.
- PostgreSQL Database: Hosted on [Clever Cloud](https://www.clever-cloud.com/).
