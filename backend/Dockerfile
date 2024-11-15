FROM node:16-alpine

WORKDIR /app

# COPY package*.json ./
COPY package.json package-lock.json ./


RUN npm ci

COPY . .

CMD ["node", "./index.js" ]