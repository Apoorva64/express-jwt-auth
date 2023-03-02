FROM node:18

WORKDIR /usr/app

COPY package.json ./

RUN yarn install

COPY . .

RUN yarn build

CMD ["./start.sh"]


