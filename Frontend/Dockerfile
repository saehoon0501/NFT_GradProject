FROM node:20-alpine3.17 as builder
RUN apk add g++ make py3-pip
WORKDIR /usr/app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

#FROM statement를 작성할 때마다 이전에 FROM Block은 정리된다.
FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
#이전 단계인 builder에서 build폴더에 있는 내용을 가져와 nginx가 기본적으로 제공하는 html 위치에 저장
COPY --from=builder /usr/app/build /usr/share/nginx/html