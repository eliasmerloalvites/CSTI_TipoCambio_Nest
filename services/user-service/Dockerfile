FROM node:18
WORKDIR /company
COPY package.json /company
RUN yarn install
COPY . /company
RUN yarn run build
EXPOSE 3002
CMD ["node", "dist/main"]