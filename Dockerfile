# STEP 1: Build
FROM node:12

LABEL authors="jiezi19971225@gmail.com"

# 通过

COPY package.json /app/package.json

RUN cd /app && npm install --registry=https://registry.npm.taobao.org

COPY ./ /app

WORKDIR /app

RUN npm run build

# STEP 2: Setup
FROM nginx:latest

COPY --from=0 /app/dist /usr/share/nginx/ahpuoj
COPY nginx/nginx.conf /etc/nginx/nginx.conf

CMD [ "nginx", "-g", "daemon off;"]