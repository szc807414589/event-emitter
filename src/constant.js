export const JOIN_STRING = '__EVENT_EMITTER_SPLIT_BY_SZC__';
//事件缓存列表设计
const list = {
	'Test2': [//传入一个字符串 触发一次
		{
			'callback': 'fn2',
			'eventArr': ['Test2'],
			'executed': [],
			'payload': {}//为了缓存,传入数组,需要记录返回data,如果传入string 不用处理
		}
	],
	//传入一个数组 触发一次 数组为 [Test3,Test4]
	'Test3_join_Test4': [{
		'callback': 'fn3'//回调

	}],
	'Test4_join_Test5': {
		'events': [],//注册的所有回调函数,达到条件了就遍历执行
		'eventKeyArr': ['Test3', 'Test4'],//传入的参数,如果是单个string,就split成数组
		'emitted': [],//已经 emit 的key 如果和 events 相等,就执行回调 返回payload
		'payload': {// 需要记录返回data
			'Test3': ['data', 'data1', 'data2']
		}
	}
};
