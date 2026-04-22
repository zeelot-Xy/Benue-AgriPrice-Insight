FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY frontend/package.json frontend/package.json

RUN npm install

COPY tsconfig.base.json ./
COPY frontend ./frontend

EXPOSE 5173

CMD ["npm", "run", "dev:web", "--", "--host", "0.0.0.0"]
