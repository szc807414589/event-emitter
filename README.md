# Javascript 自定义事件代理
[![Build Status](https://travis-ci.org/szc807414589/event-emitter.svg?branch=master)](https://travis-ci.org/szc807414589/event-emitter)
[![codecov](https://codecov.io/gh/szc807414589/event-emitter/branch/master/graph/badge.svg)](https://codecov.io/gh/szc807414589/event-emitter)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

[![NPM](https://nodei.co/npm/event-emitter-zz.png)](https://nodei.co/npm/event-emitter-zz/)

*****
+ 插件主要特点：
    - 深层嵌套回调函数，以发布订阅模式完全解除了嵌套的问题, 解耦复杂业务逻辑
    - 在不同场景里多个异步同时完成时即执行某个函数
    - 提供了bindNTimes once wait等 特殊场景api ，应用场景更丰富 
    - 全局监听事件，订阅模式
    - 兼容node端 浏览器端
    - 遵循umd规范
*****

## 安装方法
```javascript
    npm install event-emitter-zz
```
## 示例

### 单事件绑定
```javascript
    const createEventsEmitter = require('event-emitter-zz');
    const ee = createEventsEmitter();
    fetch(url, options).then(function(response) {
        {`... 复杂业务 ...`}
        ee.emit('Test1', response);
    })
    ee.register('Test1', (data) => {
        {`... 处理data ...`}
    })

```