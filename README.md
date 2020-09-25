# fecli

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
yarn test:unit
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 镜像构建并上传腾讯云

参考构建脚本

docker-build.bat

```sh
npm run build && docker build -t 镜像tag . && docker login --username=你的镜像仓库用户名 --password=你的镜像仓库密码 ccr.ccs.tencentyun.com && docker images && docker_push.bat
```

docker-push.bat

```sh
set /p version=version:

docker tag 镜像tag 镜像仓库地址:%version% && docker push 镜像仓库地址
```

直接运行 docker-build.bat 即可

