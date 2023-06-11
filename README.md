# react18-dev-template

模板项目

# 在线文档

## 设计方案

#### todo

# 使用说明

## &emsp; 开发

#### &emsp; &emsp; yarn start

## &emsp; 打包

#### &emsp; &emsp; yarn build

## &emsp; 启动静态资源服务

#### &emsp; &emsp; yarn serve

## &emsp; 部署

#### &emsp; &emsp; yarn build （可能时间较长，请耐心等待）

# 目录介绍

-dist 打包后的文件

-src js 源码，主要在这里开发

-----assets 静态资源 png jpg 等等

-----components 自己定义的组件

-----layouts 布局组件

-----mock mock 模拟数据，后端未提供接口时使用

-----pages 页面组件

-----recoil 全局状态管理

-----services 所有的网络请求 API

-----utils 工具类例如 发送网络请求

-----App.js 顶级组件

-----bootstrap.js 入口中间处理

-----global.less 全局样式

-----index.js 顶级入口

-static 不需要 webpack 转换的静态资源，例如 favicon.ico，注意 你项目中需要用到的图片应该放到 src/assets 中，而不是这里

-template 单页应用的入口 html

-webpack.config.js webpack 配置文件，大部分你需要改动的配置都在这里

# 添加依赖

添加依赖

yarn add antd

添加 dev 依赖

yarn add typescript -D

# 保存不会自动格式化代码？

查看 xxx/.vscode 文件夹是否存在，不存在请找回，或者自己修改 vscode ,打开设置搜索 save，勾选 auto format

# 浏览器中区分生产/开发环境

//它不是全局变量，不能在浏览器 console 中使用，只能在项目的 src/\*.js 中才能获取到

console.info(process.env.NODE_ENV);

# 维护记录(零散记录 不一定准确)

yarn add typescript ts-loader

yarn add @types/react -D
yarn add @types/react-dom -D
