FROM node:18

WORKDIR /usr/app

COPY package.json ./

COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

CMD ["./start.sh"]


