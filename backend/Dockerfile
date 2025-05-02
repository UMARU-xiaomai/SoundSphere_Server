FROM node:16-alpine As development

# 设置Alpine镜像源
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

WORKDIR /usr/src/app

# 添加构建依赖和运行时依赖
RUN apk add --no-cache python3 make g++ python3-dev ffmpeg sox

# 接收并设置npm镜像源
ARG NPM_REGISTRY=https://registry.npmmirror.com/
RUN npm config set registry $NPM_REGISTRY

COPY package*.json ./

# 安装所有依赖，包括开发依赖
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM node:16-alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# 设置Alpine镜像源
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

WORKDIR /usr/src/app

# 添加构建依赖和运行时依赖
RUN apk add --no-cache python3 make g++ ffmpeg sox

# 接收并设置npm镜像源
ARG NPM_REGISTRY=https://registry.npmmirror.com/
RUN npm config set registry $NPM_REGISTRY

COPY package*.json ./

# 使用--production标志代替旧的--only=production
RUN npm install --production --legacy-peer-deps

COPY . .

COPY --from=development /usr/src/app/dist ./dist

# 创建上传目录及子目录
RUN mkdir -p /usr/src/app/uploads/music \
    /usr/src/app/uploads/covers \
    /usr/src/app/uploads/products \
    /usr/src/app/uploads/previews \
    /usr/src/app/uploads/product-covers \
    /usr/src/app/uploads/article-covers \
    && chmod -R 777 /usr/src/app/uploads

# 设置生产环境变量
ENV PORT=3000
ENV JWT_SECRET=soundsphere_production_secret_key
ENV JWT_EXPIRES_IN=7d
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/main"]