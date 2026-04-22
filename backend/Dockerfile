FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY backend/package.json backend/package.json

RUN npm install

COPY tsconfig.base.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY backend ./backend

EXPOSE 8000

CMD ["npm", "run", "dev:api"]
