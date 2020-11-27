# STEP 1: Build
FROM node:12

LABEL authors="jiezi19971225@gmail.com"

COPY ./ /app

WORKDIR /app

RUN npm install --registry=https://registry.npm.taobao.org && npm run build

# STEP 2: Setup
FROM nginx:latest

COPY --from=0 /app/dist /usr/share/nginx/ahpuoj
COPY nginx/nginx.conf /etc/nginx/nginx.conf

CMD [ "nginx", "-g", "daemon off;"]