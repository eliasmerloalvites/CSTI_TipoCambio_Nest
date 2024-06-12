FROM node:18
WORKDIR /api-gateway
COPY package.json /api-gateway
RUN yarn install
COPY . /api-gateway
RUN yarn run build
EXPOSE 3000
CMD ["node", "dist/main"]