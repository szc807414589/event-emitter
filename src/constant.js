export const JOIN_STRING = '__EVENT_EMITTER_SPLIT_BY_SZC__';
//事件缓存列表设计
const list = {
	'Test2': [//传入一个字符串 触发一次
		{
			'callback': 'fn2',
			'wait': 1,
			'eventArr': ['Test2'],
			'payload': {},//为了缓存,传入数组,需要记录返回data,如果传入string 不用处理
		}
	],
	//传入一个数组 触发一次 数组为 [Test3,Test4]
	'Test3': {
		'callback': 'fn3',//回调
		'wait': 1,//等待次数
		'events': ['Test3', 'Test4'],//传入的参数,如果是单个string,就concat成数组
		'payload': {//为了缓存,传入数组,需要记录返回data
			'Test3': ['data'],
		}
	},
	'Test4': {
		'callback': 'fn4',
		'wait': 1,
		'events': ['Test3', 'Test4'],
		'payload': {//为了缓存,传入数组,需要记录返回data
			'Test3': [],
			'Test4': [],
		}
	},
};