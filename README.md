<h1 style="text-align: center">基于VUE的BAMBOO业务层前端项目</h1>

## 一、项目简介
#### 致力于提供bamboo框架的前端解决方案，构建企业级各类产品项目的落地。快速为企业项目提供一套完整的可用的项目实践方案。

## 二、项目系统介绍
#### 1、admin-vue（后台权限管理系统）
> 基于国内优秀的开源后台集成方案[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)来进行二次开发。
> 以bamboo框架支持的后端服务器项目[business-admin](https://github.com/jiefangen/bamboo/tree/master/bamboo-business/business-admin)来进行交互。

    1.登录/注销、权限验证
    2.系统管理（用户管理、角色管理、菜单管理、权限管理）
    3.监控模块（日志操作、API文档、数据源监控）
#### 2、official-vue（技术官网系统）
    1.技术内容管理
    2.技术文档库
    3.优秀案例和经验分享

### 三、前端项目目录结构
    ├── build                      # 构建相关
    ├── mock                       # 项目mock 模拟数据
    ├── plop-templates             # 基本模板
    ├── public                     # 静态资源
    │   │── favicon.ico            # favicon图标
    │   └── index.html             # html模板
    ├── src                        # 源代码
    │   ├── api                    # 所有请求
    │   ├── assets                 # 主题 字体等静态资源
    │   ├── components             # 全局公用组件
    │   ├── directive              # 全局指令
    │   ├── filters                # 全局 filter
    │   ├── icons                  # 项目所有 svg icons
    │   ├── lang                   # 国际化 language
    │   ├── layout                 # 全局 layout
    │   ├── router                 # 路由
    │   ├── store                  # 全局 store管理
    │   ├── styles                 # 全局样式
    │   ├── utils                  # 全局公用方法
    │   ├── vendor                 # 公用vendor
    │   ├── views                  # views 所有页面
    │   ├── App.vue                # 入口页面
    │   ├── main.js                # 入口文件 加载组件 初始化等
    │   └── permission.js          # 权限管理
    ├── tests                      # 测试
    ├── .env.xxx                   # 环境变量配置
    ├── .eslintrc.js               # eslint 配置项
    ├── .babelrc                   # babel-loader 配置
    ├── .travis.yml                # 自动化CI配置
    ├── vue.config.js              # vue-cli 配置
    ├── postcss.config.js          # postcss 配置
    └── package.json               # package.json
