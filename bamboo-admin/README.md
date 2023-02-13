# bamboo-admin-vue
BAMBOO后台管理系统--前端项目

> 这是一个极简的 vue admin 管理后台的前端项目。它基于优秀的开源模版
[vue-admin-template](https://github.com/PanJiaChen/vue-admin-template)进行定制化开发。

目前版本为 `v4.0+` 基于 `vue-cli` 进行构建。

## 相关项目

- [bamboo-admin](https://github.com/jiefangen/bamboo-admin)

## 项目构建

```bash
# 克隆项目
git clone https://github.com/jiefangen/bamboo-admin-vue.git

# 进入项目目录
cd bamboo-vue

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 [http://localhost:9528](http://localhost:9528)

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

## Demo演示图例

- 登录模块
![](mock/diagram/login.png)
- 首页--代办事项（可快速添加删除修改代办，拖拽以修改代办状态）
![](mock/diagram/facade.png)
- 系统管理--用户管理（除了增删查改等，还包括给用户授权等能力）
![](mock/diagram/user.png)
- 系统管理--角色管理（相应的角色授权菜单权限）
![](mock/diagram/role.png)
- 系统管理--菜单管理
![](mock/diagram/menu.png)
- 监控管理--日志操作
![](mock/diagram/log.png)
## License

[MIT](https://github.com/jiefangen/bamboo-vue/blob/main/LICENSE) license.

Copyright (c) 2022-present JieFangen
