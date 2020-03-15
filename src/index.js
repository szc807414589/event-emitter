import { isString, isArray, joinArrayKey, isEmpty } from './utils';
import createEvent from './event';

class EventEmitter {
	constructor() {
		this.list = {};//事件缓存列表
	}

	//私有方法,注册事件
	_addEvent(key, fn, waitTimes = 1) {
		if (!this.list[key]) this.list[key] = [];
		this.list[key].push(createEvent(key, fn, waitTimes));
	}

	/*
	* 注册事件
	* @params key 可以传String(单个注册) Array(多个注册)
	* @params fn 回调函数
	* 单个注册直接push,多个需要遍历然后每个添加
	* */
	register(key, fn, waitTimes = 1) {
		if (isString(key)) {
			this._addEvent(key, fn, waitTimes);
		}
	}

	//触发事件
	emit(key, args) {
		const fns = this.list[key];
		// 如果缓存列表里没有函数就代表还未注册
		if (!fns || fns.length === 0) return false;
		// 遍历key值对应的缓存列表 依次执行函数的方法
		fns.forEach(fn => {
			return fn.callback(args);
		});
	}

	//删除事件
	remove(key, fn) {
		const fns = this.list[key];
		if (!fns && fns.length === 0) return false;
		if (fn) {
			this.list[key] =
				this.list[key].filter(cb => {
					return cb.callback !== fn;
				});
		} else {
			fns && (fns.length = 0);
		}
	}

	//只触发一次就删除
	once(key, fn) {
		if (isString(key)) {
			const cb = (...args) => {
				fn(...args);
				this.remove(key, cb);
			};
			this.register(key, cb);
		}
	}

	//等待事件触发 time次 之后才执行回调
	wait(key, time, fn) {
		if (isString(key)) {
			if (time <= 0) throw new Error('wait 次数必须大于0');
			//wait主要维护这个waitList,
			//要是time < waitList.length 就return,缓存args
			//达到 time次 的时候才把waitList 传入fn
			let waitList = [];
			this.register(key, (...args) => {
				waitList.push(...args);
				if (waitList.length < time) return;
				fn(...waitList);
				waitList = [];
			});
		}
	}

	//事件触发 指定 次数后 解绑
	bindNTimes(key, time, fn) {
		if (isString(key)) {
			if (time <= 0) throw new Error('bindNTimes 次数必须大于0');
			//bindNTimes 主要维护这个 count,
			//emit一次,count++ 当time === count的时候,this.remove
			let count = 0;
			this.register(key, (...args) => {
				count++;
				fn(...args);
				if (count === time) this.remove(key, fn);
			});
		}
	}
}

const createEventEmitter = (event, cb) => {
	const eventEmitter = new EventEmitter();
	if (event && cb) {
		eventEmitter.register(event, cb);
	}
	return eventEmitter;
};

const ee = createEventEmitter();
const fn1 = function (...data) {
	console.log('--------------------fn1-log-start--------------------');
	console.log(data);
	console.log('--------------------fn1-log-end--------------------');
};
const fn2 = function (data) {
	console.log('fn2: ' + data);
};
// ee.register('test', fn1);
// ee.register('test', fn2);
// ee.register('test1', (data) => {
// 	console.log(data + '123');
// });
// ee.emit('test', 'test');
// ee.remove('test', fn1);
// ee.emit('test', 'test1');

// register emit remove ==========> ok

// ee.once('test-once', fn1);
// ee.emit('test-once', 'once22');
// ee.emit('test-once', 'once1');

// register emit remove once ==========> ok
// ee.wait('test-wait', 2, fn1);

// register emit remove once wait ==========> ok

// ee.wait('test-wait', 3, (res) => {
// 	console.log(res);
// });
// ee.register('test-wait', (data) => {
// 	console.log(data);
// });


ee.bindNTimes('test-bindNTimes', 3, fn1);
ee.emit('test-bindNTimes', 'hi bindNTimes');
ee.emit('test-bindNTimes', 'hi bindNTimes');
ee.emit('test-bindNTimes', 'hi bindNTimes');
ee.emit('test-bindNTimes', 'hi bindNTimes');

// ee.remove('test1');
// ee.emit('test', 'test222');
console.log('------------end------------');
// console.log(ee.list.test[0]);
console.log(ee);


// export default createEventEmitter;
