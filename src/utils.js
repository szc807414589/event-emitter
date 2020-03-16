import { JOIN_STRING } from './constant';

export const isString = data => Object.prototype.toString.call(data) === '[object String]';
export const isArray = data => Object.prototype.toString.call(data) === '[object Array]';

export const joinArrayKey = data => `${ isString(data) ? data : data.join(JOIN_STRING) }`;
export const isEmpty = (list, key) => list[key] || list[key].length;

//获取list 中key的数组,遍历每个key,用JOIN_STRING切割 再include
// return register时生成的key值
export const isKeyInList = (list, key) => {
	let temp;
	if (list[key]) {
		temp = list[key].events && list[key].events.length > 0 ? key : false;
	} else {
		Object.keys(list).forEach(listKey => {
			temp = listKey.split(JOIN_STRING).includes(key) ? listKey : false;
		});
	}
	return temp;
};

//此方法用来判断 parentArr是否包含childrenArr
export const isArrayIncludes = (parentArr, childrenArr) => {
	return childrenArr.every(val => parentArr.includes(val));
};
//此方法用来删除parent数组中,child中每个元素第一次出现
export const deleteChild = (parent, child) => {
	child.forEach(v => {
		let deleteIndex = parent.findIndex(p => p === v);
		parent.splice(deleteIndex, 1);
	});
	return parent;
};
//从payload获取数据
export const getPayload = (payload, arr, wait) => {
	//从payload中获取对应key的参数,取前wait位
	const data = [];
	arr.forEach((v, i) => {
		// console.log('--------------------- in getPayload ---------------------');
		// console.log(payload[v]);
		// console.log('--------------------- in getPayload ---------------------');
		data.push(payload[v].slice(0, wait));
	});
	return data;
};

