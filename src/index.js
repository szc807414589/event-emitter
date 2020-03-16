import {
	isString,
	isArray,
	joinArrayKey,
	isKeyInList,
	isArrayIncludes,
	deleteChild,
	getPayload,
	isEmpty
} from './utils';
import { JOIN_STRING } from './constant';
import createEvent from './event';

class EventEmitter {
	constructor() {
		this.list = {};//事件缓存列表
	}

	//私有方法,注册事件
	_addEvent(key, fn, wait = 1) {
		// if (!this.list[key]) this.list[key] = [];
		// this.list[key].push(createEvent(key, fn));
		if (!this.list[key]) this.list[key] = createEvent(key, wait);
		this.list[key].events.push(fn);
	}

	/*
	* 注册事件
	* @params key 可以传String(单个注册) Array(多个注册)
	* @params fn 回调函数
	* 单个注册直接push,多个需要遍历然后每个添加
	* */
	register(key, fn, wait = 1) {
		if (isString(key)) {
			this._addEvent(key, fn, wait);
		} else if (isArray(key)) {
			this._addEvent(joinArrayKey(key), fn, wait);
		}
	}

	//触发事件
	emit(key, args) {
		// 如果缓存列表里没有函数就代表还未注册
		if (!isString(key)) throw new Error('emit key 必须是 string');
		//获取
		let curKey = isKeyInList(this.list, key);
		if (!curKey) return;

		const fns = this.list[curKey].events;
		const cur = this.list[curKey];
		this.list[curKey].emittedTime++;
		// 进入函数,首先 把key push到 emitted
		this.list[curKey].emitted.push(key);
		// 缓存参数到 payload ,return
		cur.payload[key] ?
			this.list[curKey].payload[key].push(args) :
			this.list[curKey].payload[key] = [];
		// 判断emittedArr 是否包含 eventArr(包含的意思就是,把eventArr中的事件都执行了一次)
		// 此时要考虑wait,每次执行emit 需要emittedTime++
		// 当wait===emittedTime的时候,才继续执行
		if (isArrayIncludes(cur.emitted, cur.eventKeyArr)) {
			// 如果包含,就从payload 获取data
			// 传入data 执行fn
			// 并且在emittedArr中删除第一份eventArr
			if(cur.emittedTime < cur.wait) return;
			const data = getPayload(cur.payload, cur.eventKeyArr, cur.wait);
			// console.log('--------------------- in emit ---------------------');
			// console.log(data);
			// console.log('--------------------- in emit ---------------------');
			fns.forEach(fn => fn(...data));
			this.list[curKey].emitted = deleteChild(cur.emitted, cur.eventKeyArr);
		}
		// 如果register是string
		// 遍历key值对应的缓存列表 依次执行函数的方法
		// fns.forEach(fn => fn(args));
	}

	//删除事件
	remove(key, fn) {
		/*
		* 可以删除单个事件
		* 可以删除整个联合事件
		* 不可以删除联合事件中的某一个
		* */
		let curKey = isString(key) ? key : joinArrayKey(key);
		if (!curKey) return;
		const fns = this.list[curKey].events;
		if (!fns && fns.length === 0) return;
		if (fn) {
			this.list[curKey].events =
				this.list[curKey].events.filter(cb => cb !== fn);
		} else {
			fns && (fns.length = 0);
		}
	}

	//只触发一次就删除
	once(key, fn) {
		const cb = (...args) => {
			fn(...args);
			this.remove(key, cb);
		};
		this.register(key, cb);
	}

	//等待事件触发 time次 之后才执行回调
	wait(key, time, fn) {
		// if (isString(key)) {
		if (time <= 0) throw new Error('wait 次数必须是大于0的整数');
		//wait主要维护这个waitList,
		//要是time < waitList.length 就return,缓存args
		//达到 time次 的时候才把waitList 传入fn
		let waitList = [];
		const cb = (...args) => {

			waitList.push(...args);
			// if (waitList.length < time) return;
			// console.log('--------------------- in wait ---------------------');
			// console.log(...args);
			// console.log(waitList);
			// console.log('--------------------- in wait ---------------------');
			fn(...waitList);
			waitList = [];
		};
		this.register(key, fn, time);
		// }
	}

	//事件触发 指定 次数后 解绑
	bindNTimes(key, time, fn) {
		// if (isString(key)) {
		if (time <= 0) throw new Error('bindNTimes 次数必须大于0');
		//bindNTimes 主要维护这个 count,
		//emit一次,count++ 当time === count的时候,this.remove
		let count = 0;
		const cb = (...args) => {
			count++;
			fn(...args);
			if (count >= time) {
				this.remove(key, cb);
			}
		};
		this.register(key, cb);
	}

	// }
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
	console.log(...data);
	console.log('--------------------fn1-log-end--------------------');
};
const fn2 = function (data) {
	console.log('fn2: ' + data);
};
// ee.register('test', fn1);
// ee.register('test', fn2);
// ee.emit('test', 'testArgs');
// ee.remove('test', fn1);
// ee.emit('test', 'test1');

// ee.register(['test1', 'test2'], fn1);
// ee.emit('test1', 'test-array1');
// ee.emit('test2', 'test-array2');


// register emit remove ==========> ok

// ee.once(['test-once1', 'test-once2'], fn1);
// ee.emit('test-once1', 'once22');
// ee.emit('test-once2', 'once1');
// ee.emit('test-once1', 'once22');
// ee.emit('test-once2', 'once1');

// register emit remove once ==========> ok

/********************/
/********************/
/********************/
ee.wait('test-wait', 2, fn1);
ee.emit('test-wait', 'test-wait1');
ee.emit('test-wait', 'test-wait2');
// ee.emit('test-wait','test-wait3');
// ee.emit('test-wait','test-wait4');
//  wait ==========> no ok
/********************/
/********************/
/********************/

// ee.bindNTimes(['bindNTimes', 'bindNTimes1'], 3, fn1);
// ee.emit('bindNTimes', 'hi bindNTimes');
// ee.emit('bindNTimes1', 'hi bindNTimes1');
// ee.emit('bindNTimes', 'hi bindNTimes');
// ee.emit('bindNTimes1', 'hi bindNTimes1');
// ee.emit('bindNTimes', 'hi bindNTimes');
// ee.emit('bindNTimes1', 'hi bindNTimes1');
// ee.emit('bindNTimes', 'hi bindNTimes');
// ee.emit('bindNTimes1', 'hi bindNTimes1');
// ee.emit('test-bindNTimes', 'hi bindNTimes');
// ee.emit('test-bindNTimes', 'hi bindNTimes');

// register emit remove once bindNTimes ==========> ok

// ee.remove('test1');
// ee.emit('test', 'test222');
console.log('------------end------------');
// console.log(ee.list.test[0]);
console.log(ee);
// console.log(ee.list.test.events);
// console.log(ee.list.test.eventKeyArr);
// console.log(ee.list.test.emitted);
// console.log(ee.list['test1__EVENT_EMITTER_SPLIT_BY_SZC__test2'].payload);


// export default createEventEmitter;
