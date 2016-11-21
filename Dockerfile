FROM mhart/alpine-node:latest

RUN apk update && \
    apk add --no-cache git openssh make gcc g++ python && \
    mkdir -p /usr/src/buckless-admin

WORKDIR /usr/src/buckless-admin

COPY . /usr/src/buckless-admin/

RUN npm install && \
    npm build

EXPOSE 8082
CMD ["npm", "run", "serve"]
