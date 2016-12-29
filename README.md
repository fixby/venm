> A Blog CMS Powered By Vuejs+Nodejs+Express+Mongodb

>  全栈开发之博客内容管理系统:一个前端基于Vuejs2.0，后端基于Nodejs，数据库基于Mongod的博客内容管理器

> 开发环境: MACpro

## Feauter

* 资源的CURD，筛选，排序
* 密码使用MD5加密
* 登录使用passport验证登录
* 用户会话记录
* 随机生成测试数据


## 前端
* Vue.js2.0
* Vue-Router2.0
* Vue-resource
* Vue-loader

## 后端
* Node.js
* Express

## 数据库
* mongoDB
* mongoose

## 工具和语言
* Bootstrap
* Webpack
* ES2015
* HTML5
* vue-cli

## 主要依赖包
* vue-html-loader css-loader vue-style-loader
* vue-hot-reload-api
* babel-loader
* babel-core
* babel-plugin-transform-runtime
* babel-preset-es2015
* babel-runtime
* copy-webpack-plugin
* extract-text-webpack-plugin
* Bootstrap
* FontAwesome
* express-session
* express-validator
* slug
* pinyin
* md5
* passport
* connection-mongo
* moment


## 本地测试
* 安装node环境，
* 安装mongodb数据库并开启服务（mac命令：mongod --dbpath "/usr/local/var/mongodb" （前提是没有修改默认路径））


克隆远程库
```
git clone https://github.com/wangzhongjie/BlogCms.git
```
进入项目目录
```
cd BlogCms
```
安装依赖
```
npm install
```
进入服务器所在文件夹并运行服务器
```
cd server
node server
```
打开浏览器输入http://localhost:3300/

#### 感谢该感谢的人


