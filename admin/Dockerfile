FROM node:16-alpine

WORKDIR /app

# COPY package*.json ./
COPY package.json package-lock.json ./


RUN npm ci

COPY . .

CMD ["npm", "run", "dev" ]

USER node