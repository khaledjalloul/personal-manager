FROM node:latest
COPY . node-server

WORKDIR node-server
RUN npm install

EXPOSE 3737
CMD ["npm", "start"]  