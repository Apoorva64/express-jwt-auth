FROM node:18 as builder

WORKDIR /usr/app

COPY package.json ./

COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

FROM node:18-alpine as runner

WORKDIR /usr/app
COPY --from=builder /usr/app/package.json ./
COPY --from=builder /usr/app/yarn.lock ./
RUN yarn install --production
COPY --from=builder /usr/app/dist ./dist
COPY --from=builder /usr/app/start.sh ./
COPY --from=builder /usr/app/config ./config
RUN chmod +x ./start.sh
CMD ["./start.sh"]