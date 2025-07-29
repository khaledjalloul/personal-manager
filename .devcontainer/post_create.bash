cd /workspaces/personal-manager/backend_expressjs
npm install
npx prisma migrate dev

cd /workspaces/personal-manager/frontend_reactjs
npm install

echo "alias start-frontend='npm --prefix /workspaces/personal-manager/frontend_reactjs start'" >> ~/.bashrc
echo "alias start-backend='npm --prefix /workspaces/personal-manager/backend_expressjs start'" >> ~/.bashrc
echo 'alias start-all="npm --prefix /workspaces/personal-manager/frontend_reactjs start & npm --prefix /workspaces/personal-manager/backend_expressjs start"' >> ~/.bashrc
source ~/.bashrc