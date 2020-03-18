# Javascript 自定义事件代理
[![Build Status](https://www.travis-ci.org/JohnApache/events-proxy.svg?branch=master)](https://www.travis-ci.org/JohnApache/events-proxy)
[![codecov](https://codecov.io/gh/JohnApache/events-proxy/branch/master/graph/badge.svg)](https://codecov.io/gh/JohnApache/events-proxy)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

[![NPM](https://nodei.co/npm/eventsproxy.png)](https://nodei.co/npm/eventsproxy/)
*****
+ 插件主要特点：
    - 深层嵌套回调函数，以事件模式完全解除了嵌套的问题, 解耦复杂业务逻辑
    - 在不同场景里多个异步同时完成时即执行某个函数，且多个异步执行并行执行 不会堵塞
    - 提供了before after wait等 特殊场景api ，应用场景更丰富 
    - 全局监听事件，订阅模式
    - 兼容node端 浏览器端
    - 遵循umd规范
*****

## 安装方法
```javascript
    npm install eventsproxy
```
