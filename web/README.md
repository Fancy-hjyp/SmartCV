# 说明
本项目是`Vue`的模板工程，内置`导航栏`、`路由`、`状态管理`、`HTTP请求`、`构建工具`、`代码格式化`，开箱即用，旨在快速开发`Vue`项目。

# 技术栈
项目使用`TypeScript`开发，使用`Vue3`作为前端框架，使用`Element Plus`作为UI组件库，使用`Axios`作为`HTTP请求库`，使用`Vite`作为项目管理工具。各功能依赖版本如下：
| 技术栈                     | 描述                               | 版本    |
| :------------------------ | :--------------------------------- | :------ |
| Vue                        | 渐进式 JavaScript 框架             | ^3.5.22 |
| Vue Router                 | 官方路由管理器                     | ^4.6.3  |
| Pinia                      | Vue 状态管理库                     | ^2.3.1  |
| TypeScript                 | JavaScript 的超集                  | ^5.0.0  |
| Element Plus               | 桌面端 UI 组件库                   | ^2.11.7 |
| Axios                      | 基于 Promise 的 HTTP 客户端        | ^1.13.2 |
| Vite                       | 下一代前端构建工具                 | ^7.1.11 |
| ESLint                     | JavaScript/TypeScript 代码检查工具 | ^8.57.0 |
| Prettier                   | 代码格式化工具                     | ^3.2.5  |
| @element-plus/icons-vue    | Element Plus 图标库                | ^2.3.2  |

# 快速开始
1. 克隆项目，下载模板工程
```
git clone https://github.com/Fancy-hjyp/template-vue.git
```
2. 安装依赖
```
npm install
```
3. 启动项目
```
npm run server
```
启动项目成功后，打开浏览器访问 http://localhost:5173，即可访问模板。


# 项目架构
项目初始化了良好的代码结构，包括`components`、`views`、`router`、`store`、`api`等目录，分别存放`组件`、`页面`、`路由`、`状态管理`、`接口请求`等文件。各目录结构和逻辑如下：
```
src/
├── api/ # 接口请求文件
│   ├── apiClient.ts  # axios封装客户端
│   ├── exampleApi.ts  # 示例接口
│   └── index.ts  # 接口请求入口文件
├── components/  # 组件文件
│   ├── BottomBar.vue  # 底部导航栏
│   └── LoadingSpinner.vue # 加载中组件
├── router/ # 路由文件
│   └── index.ts # 路由入口文件
├── stores/ # 状态管理文件
│   ├── index.ts # 状态管理入口文件
│   └── main.ts # 状态管理文件
├── views/ # 页面文件
│   └── Home.vue # 首页
├── utils/ # 工具类文件
├── asserts/ # 静态资源文件
├── App.vue # 应用入口文件
├── main.ts # 项目入口文件
├── shims-vue.d.ts # vue类型声明文件
└── vite-env.d.ts # 环境变量类型声明文件
```
具体地
* `App.vue`是整个页面的入口文件，包含顶部导航栏，中间路由组件`RouterView`，底部导航组件`BottomBar`。

* `views`目录存放页面，页面之间通过`router`进行跳转。

* `components`目录存放组件，组件可以被多个页面复用。

* `router/index.ts`是路由配置文件，包含所有的路由配置。

* `router/index.ts`是状态管理文件，创建状态管理对象，并导出所有状态管理。

* `api`包下是所有的接口请求文件，包含所有的接口请求。

# 定制开发
## 替换项目名称
项目名称默认为`vue-template`，如果需要替换，请修改`package.json`中的`name`字段。

## 代码格式化
项目使用`Prettier`作为代码格式化和代码语法检查工具，编写代码后，请执行如下命令进行代码格式化
```
# 格式化代码
npm run format

# 检查代码语法
npm run lint
```
