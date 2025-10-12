cd /workspace/personal-manager/backend_expressjs
npm install
npx prisma migrate dev

cd /workspace/personal-manager/frontend_reactjs
npm install

echo "alias start-frontend='npm --prefix /workspace/personal-manager/frontend_reactjs start'" >> ~/.bashrc
echo "alias start-backend='npm --prefix /workspace/personal-manager/backend_expressjs start'" >> ~/.bashrc
echo 'alias start-all="npm --prefix /workspace/personal-manager/frontend_reactjs start & npm --prefix /workspace/personal-manager/backend_expressjs start"' >> ~/.bashrc
source ~/.bashrc