FROM mhart/alpine-node:latest

WORKDIR /usr/src/buckless-admin

EXPOSE 8082

CMD ["npm", "run", "serve"]

RUN apk update && \
    apk add --no-cache git openssh make gcc g++ python && \
    mkdir -p /usr/src/buckless-admin

COPY package.json /usr/src/buckless-admin/

RUN npm install

COPY . /usr/src/buckless-admin/

RUN npm run build
