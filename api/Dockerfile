FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install


COPY . .
COPY .env .env

RUN npx prisma generate

EXPOSE 8000

CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then npm run build && node dist/main; else npm run start:dev; fi"]