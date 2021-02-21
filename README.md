## AHPUOJ-FE

技术栈

- Vue
- @vue/composition-api
- Typescript
- Vue-cli4
- Element UI

## 目录说明

分为用户界面和后台管理界面
用户部分位于 src/user 目录下
后台管理部分位于 src/admin 目录下
通用逻辑部分位于 src/common 目录下

## 开发工具

推荐使用 Visual Code，并安装 eslint，editor config，prettier 扩展程序，以获得 eslint 检测以及自动格式化代码的支持

## 部署说明

基于 docker-compose 的方式容器化部署，可以使用 jenkins 实现基本的 CI\CD

## 测试说明

采用了 jest 编写接口自动化测试用例，保证后端接口的正确性，目前覆盖了以下场景

- [x] 后台新闻管理增删改查
- [x] 后台团队管理增删改查
- [x] 后台问题管理增删改查 设置问题数据
- [x] 私有个人竞赛
  - [x] 未开始时，竞赛不可见
  - [x] 进行中，授权用户可见题目，可提交评测，未登录/未授权用户不可见
  - [x] 结束后，所有用户可见，不可提交评测

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
