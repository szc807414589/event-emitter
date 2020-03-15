require('@babel/register')({
	presets: ['@babel/env']
});

// 导入初始的启动文件
module.exports = require('./src/index');
