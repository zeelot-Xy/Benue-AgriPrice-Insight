FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY apps/api/package.json apps/api/package.json

RUN npm install

COPY tsconfig.base.json ./
COPY apps/api ./apps/api

EXPOSE 8000

CMD ["npm", "run", "dev:api"]
