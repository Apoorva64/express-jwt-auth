FROM node:18

WORKDIR /usr/app

COPY package.json ./

COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

RUN chmod +x ./start.sh

CMD ["./start.sh"]


