FROM node:16-alpine As development

# 设置Alpine镜像源
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

WORKDIR /usr/src/app

# 添加构建依赖
RUN apk add --no-cache python3 make g++ python3-dev

# 接收并设置npm镜像源
ARG NPM_REGISTRY=https://registry.npmmirror.com/
RUN npm config set registry $NPM_REGISTRY

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM node:16-alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# 设置Alpine镜像源
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

WORKDIR /usr/src/app

# 添加构建依赖
RUN apk add --no-cache python3 make g++

# 接收并设置npm镜像源
ARG NPM_REGISTRY=https://registry.npmmirror.com/
RUN npm config set registry $NPM_REGISTRY

COPY package*.json ./

RUN npm install --only=production --legacy-peer-deps

RUN npm install --save swagger-ui-express

COPY . .

COPY --from=development /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"] 