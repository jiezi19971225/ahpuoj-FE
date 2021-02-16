## AHPUOJ-FE

Vue,@vue/composition-api,typescript,Vue-cli4,Element UI

## 目录说明

分为用户界面和后台管理界面
用户部分位于 src/user 目录下
后台管理部分位于 src/admin 目录下
通用逻辑部分位于 src/common 目录下

## 开发工具

推荐使用 Visual Code，并安装 eslint，editor config，prettier 扩展程序，以获得 eslint 检测以及自动格式化代码的支持

## 部署说明

基于 docker-compose 的方式容器化部署，可以使用 jenkins 实现基本的 CI\CD

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Run your unit tests

```
yarn test
```

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/)
