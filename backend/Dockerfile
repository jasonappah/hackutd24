FROM node:alpine AS ts-compiler
WORKDIR /home/container

COPY . .

RUN yarn install
RUN yarn run build

FROM node:alpine AS ts-remover
WORKDIR /home/container

COPY --from=ts-compiler /home/container/package.json ./
COPY --from=ts-compiler /home/container/dist ./dist
COPY --from=ts-compiler /home/container/baseline.jpg ./

RUN yarn install --production
CMD ["node", "dist/server.js"]