FROM node:12-buster

RUN mkdir -p /home/ubuntu/workspace/baldr-api/node_modules && chown -R node:node /home/ubuntu/workspace/baldr-api

WORKDIR /home/ubuntu/workspace/baldr-api/

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 3000

CMD [ "node", "app.js" ]

