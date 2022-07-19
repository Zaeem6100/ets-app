ARG NODE_VERSION=lts-alpine

FROM node:$NODE_VERSION

WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV production
ENV PORT 3000
ENV NEXT_TELEMETRY_DISABLED 1

RUN npx prisma generate

EXPOSE 3000

CMD npm run start
