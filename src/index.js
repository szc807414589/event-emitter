import { isString, isArray, joinArrayKey, isEmpty } from './utils';

class EventEmitter {
	constructor () {
		this.list = {};//事件缓存列表
	}

	_addEvent (key, fn, waitTimes = 1) {

	}

	/*
	* 注册事件
	* @params key 可以传String(单个注册) Array(多个注册)
	* @params fn 回调函数
	* 单个注册直接push,多个需要遍历然后每个添加
	* */
	register (key, fn) {
		if (!this.list[key]) this.list[key] = [];
		if (isString(key)) {
			this.list[key].push(fn);
			// } else {
			// key.forEach(v => this.list[v].push(fn));
		}
	}

	//触发事件
	emit (key, args) {
		const fns = this.list[key];
		// 如果缓存列表里没有函数就代表还未注册
		if (!fns || fns.length === 0) return false;
		// 遍历key值对应的缓存列表 依次执行函数的方法
		fns.forEach(fn => fn(args));
	}

	//删除事件
	remove (key, fn) {
		const fns = this.list[key];
		if (!fns && fns.length === 0) return false;
		if (fn) {
			fns.filter(cb => cb !== fn);
		} else {
			fns && (fns.length = 0);
		}
	}

	//只触发一次就删除
	once (key, fn) {
		if (isString(key)) {
			this.register(key, (...args) => {
				fn && fn(...args);
				this.remove(key, fn);
			});
		}
	}

	//等待事件触发 time次 之后才执行回调
	wait (key, time, fn) {

	}
}

const createEventEmitter = (event, cb) => {
	if (!isArray(event) || !isString(event)) {
		throw new Error('传入的事件必须为 String 或者 Array');
	}
	const eventEmitter = new EventEmitter();
	if (event && cb) {
		eventEmitter.register(event, cb);
	}
	return eventEmitter;
};

export default createEventEmitter;