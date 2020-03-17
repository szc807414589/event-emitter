import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import createEventEmitter from '../src';

describe('createEventEmitter 测试,emit触发', function () {
	let ee;
	beforeEach(() => {
		ee = new createEventEmitter();
	});
	it('ee.register 注册单个事件', () => {
		const EVENT_NAME = 'test';
		const EMIT_DATA = 'test-emit-data';
		ee.register(EVENT_NAME, (data) => {
			expect(data).to.be.equal(EMIT_DATA);
		});
		ee.emit(EVENT_NAME, EMIT_DATA);
	});
	it('ee.register 注册已存在事件', () => {
		const EVENT_NAME = 'test';
		ee.register.bind(null, EVENT_NAME);
		expect(ee.register.bind(null, EVENT_NAME)).to.Throw(Error);
	});
	it('ee.emit 触发事件必须是string,否则会报错', () => {
		const EVENT_NAME = 2;
		const EMIT_DATA = 'test-emit-data';
		ee.register(EVENT_NAME, (data) => {
		});
		expect(ee.emit.bind(null, EVENT_NAME, EMIT_DATA)).to.Throw(TypeError);
	});

	it('ee.register 注册联合事件,联合事件没有全部emit 就不执行', () => {
		const EVENT_NAME_1 = 'test1';
		const EVENT_NAME_2 = 'test2';
		const EMIT_DATA_1 = 'test-emit-data1';
		// const EMIT_DATA_2 = 'test-emit-data2';
		ee.register([EVENT_NAME_1, EVENT_NAME_2], (...data) => {
			expect(data).to.be.equal(null);
		});
		ee.emit(EVENT_NAME_1, EMIT_DATA_1);
	});
	it('ee.register 注册联合事件,联合事件全部emit 才不执行', () => {
		const EVENT_NAME_1 = 'test1';
		const EVENT_NAME_2 = 'test2';
		const EMIT_DATA_1 = 'test-emit-data1';
		const EMIT_DATA_2 = 'test-emit-data2';
		ee.register([EVENT_NAME_1, EVENT_NAME_2], (...data) => {
			expect(data).to.be.equal([EMIT_DATA_1, EMIT_DATA_2]);
		});
		ee.emit(EVENT_NAME_1, EMIT_DATA_1);
		ee.emit(EVENT_NAME_1, EMIT_DATA_2);
	});
	it('ee.once 注册单个 单次执行事件,emit一次之后,就自动卸载', () => {
		let count = 0;
		const EVENT_NAME = 'test';
		ee.once(EVENT_NAME, () => {
			count++;
		});
		ee.emit(EVENT_NAME);
		expect(count).to.be.equal(1);
		ee.emit(EVENT_NAME);
		expect(count).to.be.equal(1);
		ee.emit(EVENT_NAME);
		expect(count).to.be.equal(1);
	});
	it('ee.once 注册联合 单次执行事件,emit一次之后,就自动卸载', () => {
		let count = 0;
		const EVENT_NAME_1 = 'test1';
		const EVENT_NAME_2 = 'test2';
		ee.once([EVENT_NAME_1, EVENT_NAME_2], () => {
			count++;
		});
		ee.emit(EVENT_NAME_1);
		expect(count).to.be.equal(0);
		ee.emit(EVENT_NAME_2);
		expect(count).to.be.equal(1);
		ee.emit(EVENT_NAME_1);
		expect(count).to.be.equal(1);
		ee.emit(EVENT_NAME_2);
		expect(count).to.be.equal(1);
	});
	it('ee.bindNTimes time次数<=0', () => {
		const EVENT_NAME = 2;
		const EMIT_DATA = 'test-emit-data';
		ee.register(EVENT_NAME, (data) => {
		});
		expect(ee.bindNTimes.bind(null, EVENT_NAME, 0, EMIT_DATA)).to.Throw(Error);
	});
	it('ee.bindNTimes 注册单个 执行time次之后自动卸载 事件', () => {
		let count = 0;
		const EVENT_NAME = 'test';
		ee.bindNTimes(EVENT_NAME, 2, () => {
			count++;
		});
		ee.emit(EVENT_NAME);
		expect(count).to.be.equal(1);
		ee.emit(EVENT_NAME);
		expect(count).to.be.equal(2);
		ee.emit(EVENT_NAME);
		expect(count).to.be.equal(2);
		ee.emit(EVENT_NAME);
		expect(count).to.be.equal(2);
	});
	it('ee.bindNTimes 注册联合 执行time次之后自动卸载 事件', () => {
		let count = 0;
		const EVENT_NAME_1 = 'test1';
		const EVENT_NAME_2 = 'test2';
		ee.bindNTimes([EVENT_NAME_1, EVENT_NAME_2], 2, () => {
			count++;
		});
		ee.emit(EVENT_NAME_1);
		expect(count).to.be.equal(0);
		ee.emit(EVENT_NAME_2);
		expect(count).to.be.equal(1);
		ee.emit(EVENT_NAME_1);
		expect(count).to.be.equal(1);
		ee.emit(EVENT_NAME_2);
		expect(count).to.be.equal(2);
		ee.emit(EVENT_NAME_1);
		expect(count).to.be.equal(2);
		ee.emit(EVENT_NAME_2);
		expect(count).to.be.equal(2);
	});
	it('ee.wait time次数<=0', () => {
		const EVENT_NAME = 2;
		const EMIT_DATA = 'test-emit-data';
		ee.register(EVENT_NAME, (data) => {
		});
		expect(ee.wait.bind(null, EVENT_NAME, 0, EMIT_DATA)).to.Throw(Error);
	});
	it('ee.wait 注册单个 等待time次emit后才执行的事件', () => {
		let count = 0;
		const EVENT_NAME = 'test';
		const EMIT_DATA_1 = 'test-emit-data1';
		const EMIT_DATA_2 = 'test-emit-data2';
		ee.wait(EVENT_NAME, 2, (...data) => {
			count++;
			expect(data).to.be.deep.equal([EMIT_DATA_1, EMIT_DATA_2]);
		});
		ee.emit(EVENT_NAME, EMIT_DATA_1);
		expect(count).to.be.equal(0);
		ee.emit(EVENT_NAME, EMIT_DATA_2);
		expect(count).to.be.equal(1);

		ee.emit(EVENT_NAME, EMIT_DATA_1);
		expect(count).to.be.equal(1);
		ee.emit(EVENT_NAME, EMIT_DATA_2);
		expect(count).to.be.equal(2);
	});
	it('ee.wait 注册联合 等待time次emit后才执行的事件', () => {
		let count = 0;
		const EVENT_NAME_1 = 'test1';
		const EVENT_NAME_2 = 'test2';
		const EMIT_DATA_1 = 'test-emit-data1';
		const EMIT_DATA_2 = 'test-emit-data2';
		ee.wait([EVENT_NAME_1, EVENT_NAME_2], 2, (...data) => {
			count++;
			expect(data).to.be.deep.equal([EMIT_DATA_1, EMIT_DATA_2, EMIT_DATA_1, EMIT_DATA_2]);
		});
		ee.emit(EVENT_NAME_1, EMIT_DATA_1);
		expect(count).to.be.equal(0);
		ee.emit(EVENT_NAME_2, EMIT_DATA_2);
		expect(count).to.be.equal(0);
		ee.emit(EVENT_NAME_1, EMIT_DATA_1);
		expect(count).to.be.equal(0);
		ee.emit(EVENT_NAME_2, EMIT_DATA_2);
		expect(count).to.be.equal(1);

		ee.emit(EVENT_NAME_1, EMIT_DATA_1);
		expect(count).to.be.equal(1);
		ee.emit(EVENT_NAME_2, EMIT_DATA_2);
		expect(count).to.be.equal(1);
		ee.emit(EVENT_NAME_1, EMIT_DATA_1);
		expect(count).to.be.equal(1);
		ee.emit(EVENT_NAME_2, EMIT_DATA_2);
		expect(count).to.be.equal(2);
	});
	it('ee.remove 不传fn,删除当前key events', () => {
		let count = 0;
		const EVENT_NAME = 'test-remove';
		const EMIT_DATA = 'test-emit-data';
		ee.register(EVENT_NAME, (data) => {
			count++;
		});
		ee.emit(EVENT_NAME, EMIT_DATA);
		expect(count).to.be.equal(1);
		ee.remove(EVENT_NAME);
		expect(count).to.be.equal(1);
	});
	it('ee.emit emit一个不存在的事件,会return', () => {
		let count = 0;
		const EVENT_NAME = 'test-emit';
		const EVENT_NAME_1 = 'test-emit1';
		const EMIT_DATA = 'test-emit-data';
		ee.register(EVENT_NAME, () => {
			count++;
		});
		ee.emit(EVENT_NAME_1, EMIT_DATA);
		expect(count).to.be.equal(0);
	});
});
