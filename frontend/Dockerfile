FROM node:18

WORKDIR /app

# COPY package*.json ./
COPY package.json package-lock.json ./


RUN npm ci

COPY . .

CMD ["npm", "start" ]

USER node