FROM --platform=linux/amd64 node:18
WORKDIR /usr/app
COPY ./package.json .
RUN npm install    
COPY ./dist ./dist
COPY ./public ./public
CMD ["npm","run","start"]