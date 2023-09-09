FROM node:20-alpine
RUN apk add g++ make py3-pip
WORKDIR /usr/app
COPY ./package.json .
RUN npm install
COPY . /usr/app
CMD ["npm","run","start"]