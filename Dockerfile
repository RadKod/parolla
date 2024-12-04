FROM node:18-alpine

RUN apk add --no-cache tzdata ca-certificates curl nginx nginx-mod-http-image-filter

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install

COPY . .

RUN yarn build

EXPOSE 8081
CMD nginx && yarn start
