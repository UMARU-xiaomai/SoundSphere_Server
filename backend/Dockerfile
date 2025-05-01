FROM node:16-alpine As development

WORKDIR /usr/src/app

RUN apk add --no-cache python3 make g++ python3-dev

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM node:16-alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm install --only=production --legacy-peer-deps

RUN npm install --save swagger-ui-express

COPY . .

COPY --from=development /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"] 