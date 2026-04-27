# Install dependencies for the backend and run database migrations
cd /workspace/personal-manager/backend_expressjs
npm install
npx prisma migrate dev

# Install dependencies for the frontend
cd /workspace/personal-manager/frontend_reactjs
npm install

# Add aliases to start the frontend and backend easily
echo "alias start-frontend='npm --prefix /workspace/personal-manager/frontend_reactjs start'" >> ~/.bashrc
echo "alias start-backend='npm --prefix /workspace/personal-manager/backend_expressjs start'" >> ~/.bashrc
echo 'alias start-all="npm --prefix /workspace/personal-manager/frontend_reactjs start & npm --prefix /workspace/personal-manager/backend_expressjs start"' >> ~/.bashrc