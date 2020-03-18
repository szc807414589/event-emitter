# Javascript 自定义事件代理
[![Build Status](https://travis-ci.org/szc807414589/event-emitter.svg?branch=master)](https://travis-ci.org/szc807414589/event-emitter)
[![codecov](https://codecov.io/gh/szc807414589/event-emitter/branch/master/graph/badge.svg)](https://codecov.io/gh/szc807414589/event-emitter)

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
