# STEP 1: Build
FROM node:14

LABEL authors="jiezi19971225@gmail.com"

# 通过

COPY package.json /app/package.json

RUN cd /app && yarn

COPY ./ /app

WORKDIR /app

RUN yarn build

# STEP 2: Setup
FROM nginx:latest

COPY --from=0 /app/dist /usr/share/nginx/ahpuoj
COPY nginx/nginx.conf /etc/nginx/nginx.conf

CMD [ "nginx", "-g", "daemon off;"]