import { JOIN_STRING } from './constant';

export const isString = data => Object.prototype.toString.call(data) === '[object String]';
export const isArray = data => Object.prototype.toString.call(data) === '[object Array]';

export const joinArrayKey = data => `${isString(data) ? data : data.join(JOIN_STRING)}`;
export const isEmpty = (list, key) => list[key] || list[key].length;