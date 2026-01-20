FROM node:20-bullseye

WORKDIR /backend

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 1337

CMD ["sh", "-c", "yarn db:generate && yarn db:push && yarn start:dev"]